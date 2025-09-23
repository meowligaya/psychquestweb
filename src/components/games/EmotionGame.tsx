import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const emotions = [
  { emoji: "😊", name: "Happy", description: "Feeling joyful or pleased", fact: "Happiness can boost your immune system and heart health." },
  { emoji: "😢", name: "Sad", description: "Feeling unhappy or sorrowful", fact: "Sadness is a normal emotion and can help you process loss or disappointment." },
  { emoji: "😠", name: "Angry", description: "Feeling mad or upset", fact: "Anger can signal that something is wrong and motivate change." },
  { emoji: "😰", name: "Scared", description: "Feeling fearful or anxious", fact: "Fear helps keep us safe by warning us of danger." },
  { emoji: "😴", name: "Tired", description: "Feeling low energy or sleepy", fact: "Getting good sleep is essential for mental health." },
  { emoji: "🤔", name: "Confused", description: "Feeling uncertain or puzzled", fact: "Confusion is a sign that you may need more information or support." }
];

function shuffle<T>(arr: T[]): T[] {
  return arr
    .map((item) => ({ item, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ item }) => item);
}

const INITIAL_DIFFICULTY = 3;
const MAX_DIFFICULTY = emotions.length;
const ROUND_TIME = 30;

export default function EmotionMatchDrawable() {
  const [started, setStarted] = useState(false);
  const [difficulty, setDifficulty] = useState(INITIAL_DIFFICULTY);
  const [nameOrder, setNameOrder] = useState<string[]>([]);
  const [emojiOrder, setEmojiOrder] = useState<string[]>([]);
  const [matches, setMatches] = useState<{[name: string]: string}>({});
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [roundFact, setRoundFact] = useState("");
  const [timeLeft, setTimeLeft] = useState(ROUND_TIME);
  const [currentRound, setCurrentRound] = useState(1);

  // For drawing lines
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const leftRefs = useRef<(HTMLDivElement | null)[]>([]);
  const rightRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [dragging, setDragging] = useState<{from: number|null, toPoint?: {x: number, y: number}}>(
    {from: null, toPoint: undefined}
  );
  const [lines, setLines] = useState<{from: number, to: number, correct: boolean}[]>([]);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Start/restart game
  const startGame = () => {
    setStarted(true);
    setShowResult(false);
    setScore(0);
    setMatches({});
    setDifficulty(INITIAL_DIFFICULTY);
    setCurrentRound(1);
    setTimeLeft(ROUND_TIME);
    setupRound(INITIAL_DIFFICULTY);
    setLines([]);
  };

  // Setup a new round with random names/emojis
  const setupRound = (num: number) => {
    const selected = shuffle(emotions).slice(0, num);
    setNameOrder(shuffle(selected.map(e => e.name)));
    setEmojiOrder(shuffle(selected.map(e => e.emoji)));
    setMatches({});
    setTimeLeft(ROUND_TIME);
    setRoundFact("");
    setLines([]);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          setShowResult(true);
          setRoundFact("⏰ Time's up! Try to be faster next round.");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Handle match selection (when drag ends over emoji)
  const handleMatch = (fromIdx: number, toIdx: number) => {
    if (showResult) return;
    const name = nameOrder[fromIdx];
    const emoji = emojiOrder[toIdx];
    if (matches[name]) return; // Already matched
    setMatches(prev => {
      const newMatches = { ...prev, [name]: emoji };
      // Visual lines
      const emotion = emotions.find(e => e.name === name);
      const correct = (emotion && emotion.emoji === emoji);
      setLines(ls => [...ls, {from: fromIdx, to: toIdx, correct}]);
      // Feedback
      if (correct) {
        toast.success("Correct! 🎉");
      } else {
        toast.error("Oops, that's not the right emoji!");
        setTimeLeft(t => Math.max(t - 5, 0));
      }
      // If all matched, end round
      if (Object.keys(newMatches).length === difficulty) {
        clearInterval(timerRef.current!);
        // Calculate score for this round
        let correctCount = 0;
        const selectedEmotions = emotions.filter(e => nameOrder.includes(e.name));
        selectedEmotions.forEach(e => {
          if (newMatches[e.name] === e.emoji) correctCount++;
        });
        setScore(s => s + correctCount);
        setShowResult(true);
        setRoundFact(selectedEmotions[Math.floor(Math.random() * selectedEmotions.length)].fact);
      }
      return newMatches;
    });
  };

  // Drawing logic
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw matched lines
    lines.forEach(({from, to, correct}) => {
      const leftEl = leftRefs.current[from];
      const rightEl = rightRefs.current[to];
      if (!leftEl || !rightEl) return;
      const leftRect = leftEl.getBoundingClientRect();
      const rightRect = rightEl.getBoundingClientRect();
      const canvasRect = canvas.getBoundingClientRect();
      const startX = leftRect.right - canvasRect.left;
      const startY = leftRect.top + leftRect.height / 2 - canvasRect.top;
      const endX = rightRect.left - canvasRect.left;
      const endY = rightRect.top + rightRect.height / 2 - canvasRect.top;
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.strokeStyle = correct ? "#4ade80" : "#f87171";
      ctx.lineWidth = 3;
      ctx.stroke();
    });

    // Draw preview line while dragging
    if (dragging.from !== null && dragging.toPoint) {
      const leftEl = leftRefs.current[dragging.from];
      if (!leftEl) return;
      const leftRect = leftEl.getBoundingClientRect();
      const canvasRect = canvas.getBoundingClientRect();
      const startX = leftRect.right - canvasRect.left;
      const startY = leftRect.top + leftRect.height / 2 - canvasRect.top;
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(dragging.toPoint.x - canvasRect.left, dragging.toPoint.y - canvasRect.top);
      ctx.strokeStyle = "#3b82f6";
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 6]);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  }, [lines, dragging, difficulty, nameOrder, emojiOrder, started]);

  // Next round
  const nextRound = () => {
    if (difficulty < MAX_DIFFICULTY) {
      setDifficulty(difficulty + 1);
      setCurrentRound(currentRound + 1);
      setupRound(difficulty + 1);
      setShowResult(false);
    } else {
      setStarted(false);
      toast.success("🎉 Game complete! Final score: " + score);
    }
  };

  // Reset
  const resetGame = () => {
    setStarted(false);
    setShowResult(false);
    setMatches({});
    setScore(0);
    setDifficulty(INITIAL_DIFFICULTY);
    setCurrentRound(1);
    setRoundFact("");
    setTimeLeft(ROUND_TIME);
    setLines([]);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Mouse/touch events for drawing
  const handleStart = (event: React.MouseEvent | React.TouchEvent, idx: number) => {
    event.preventDefault();
    setDragging({from: idx, toPoint: undefined});
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("touchmove", handleTouchMove, {passive: false});
  };
  const handleMove = (event: MouseEvent) => {
    setDragging(drag => drag.from !== null
      ? {...drag, toPoint: {x: event.clientX, y: event.clientY}}
      : drag
    );
  };
  const handleTouchMove = (event: TouchEvent) => {
    if (event.touches.length > 0) {
      setDragging(drag => drag.from !== null
        ? {...drag, toPoint: {x: event.touches[0].clientX, y: event.touches[0].clientY}}
        : drag
      );
    }
  };

  // The magic: emoji drop zone handler
  const handleDropOnEmoji = (toIdx: number) => {
    if (
      dragging.from !== null &&
      !Object.values(matches).includes(emojiOrder[toIdx]) &&
      !showResult
    ) {
      handleMatch(dragging.from, toIdx);
      setDragging({from: null, toPoint: undefined});
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("touchmove", handleTouchMove);
    }
  };

  // End drag if mouseup/touchend anywhere else
  const handleEndGlobal = () => {
    setDragging({from: null, toPoint: undefined});
    window.removeEventListener("mousemove", handleMove);
    window.removeEventListener("touchmove", handleTouchMove);
  };

  useEffect(() => {
  function resizeCanvas() {
    const canvas = canvasRef.current;
    if (canvas && canvas.parentElement) {
      const rect = canvas.parentElement.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    }
  }
  resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [started, nameOrder, emojiOrder]);

  // UI
  const gapY = 56;
  const canvasHeight = Math.max(nameOrder.length, emojiOrder.length) * gapY + 64;

  return (
    <Card
      className="island-card p-4"
      style={{
        minHeight: 400,
        maxWidth: 700,
        margin: "0 auto",
        position: "relative"
      }}
    >
      <canvas
        ref={canvasRef}
        width={700}
        height={canvasHeight}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          pointerEvents: "none",
          zIndex: 10
        }}
      />
      <div className="text-center relative z-10">
        <h3 className="text-2xl font-bold mb-4 font-nunito">Emotion Match Challenge (Draw lines to match!)</h3>
        {!started ? (
          <div>
            <p className="mb-4 text-muted-foreground">
              Match each emotion name to the correct emoji by drawing a line.<br />
              Difficulty increases each round. Wrong matches lose time.<br />
              Each round teaches a mental health fact!
            </p>
            <Button onClick={startGame} className="ocean-button">
              Start Challenge
            </Button>
          </div>
        ) : (
          <>
            <div className="flex justify-between mb-2">
              <Badge variant="secondary">Round: {currentRound}</Badge>
              <Badge variant="secondary">Score: {score}</Badge>
              <Badge variant="secondary">Time Left: {timeLeft}s</Badge>
            </div>
            <div className="flex flex-row items-start justify-between mt-8" style={{position: "relative"}}>
              {/* Left: Emotion Names */}
              <div style={{width: 180}}>
                <h4 className="font-semibold mb-2">Emotion Names</h4>
                {nameOrder.map((name, i) => (
                  <div
                    key={name}
                    ref={el => leftRefs.current[i] = el}
                    style={{
                      height: gapY,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "flex-end",
                      cursor: matches[name] || showResult ? "not-allowed" : "grab"
                    }}
                    onMouseDown={event => !matches[name] && !showResult && handleStart(event, i)}
                    onTouchStart={event => !matches[name] && !showResult && handleStart(event, i)}
                  >
                    <Button
                      variant="outline"
                      disabled={!!matches[name] || showResult}
                      className="w-full"
                    >
                      {name}
                    </Button>
                  </div>
                ))}
              </div>
              {/* Spacer for canvas */}
              <div style={{width: 120}} />
              {/* Right: Emojis */}
              <div style={{width: 180}}>
                <h4 className="font-semibold mb-2">Emojis</h4>
                {emojiOrder.map((emoji, i) => (
                  <div
                    key={emoji}
                    ref={el => rightRefs.current[i] = el}
                    style={{
                      height: gapY,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "flex-start",
                      cursor: Object.values(matches).includes(emoji) || showResult ? "not-allowed" : "pointer"
                    }}
                    // Desktop
                    onMouseUp={() => handleDropOnEmoji(i)}
                    // Mobile
                    onTouchEnd={() => handleDropOnEmoji(i)}
                  >
                    <Button
                      variant="outline"
                      className="w-full text-2xl"
                      disabled={Object.values(matches).includes(emoji) || showResult}
                    >
                      {emoji}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
            {/* Show what was matched */}
            <div className="my-2">
              {Object.entries(matches).map(([name, emoji]) => (
                <Badge key={name} variant="secondary" className="mr-2 mb-2">
                  {name} matched with {emoji}
                </Badge>
              ))}
            </div>
            {/* Result / Fact */}
            {showResult && (
              <div className="my-4">
                <p className="mb-2 text-lg font-semibold">Round Complete!</p>
                <p className="mb-2 text-muted-foreground">{roundFact}</p>
                {difficulty < MAX_DIFFICULTY ? (
                  <Button onClick={nextRound} className="ocean-button">Next Round</Button>
                ) : (
                  <Button onClick={resetGame} className="ocean-button">Restart Challenge</Button>
                )}
              </div>
            )}
            {/* End game button */}
            {!showResult && (
              <Button
                variant="outline"
                className="mt-4"
                onClick={resetGame}
              >
                End Challenge
              </Button>
            )}
          </>
        )}
      </div>
    </Card>
  );
}