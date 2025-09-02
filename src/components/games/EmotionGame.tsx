import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const emotions = [
  { emoji: "😊", name: "Happy", color: "bg-yellow-100" },
  { emoji: "😢", name: "Sad", color: "bg-blue-100" },
  { emoji: "😠", name: "Angry", color: "bg-red-100" },
  { emoji: "😰", name: "Scared", color: "bg-purple-100" },
  { emoji: "😴", name: "Tired", color: "bg-gray-100" },
  { emoji: "🤔", name: "Confused", color: "bg-green-100" }
];

const INITIAL_TOTAL_EMOJIS = 12;
const MAX_TOTAL_EMOJIS = 100;
const ROUND_TIME = 60;
const WRONG_PENALTY = 3;

// Dynamically determine the number of columns by squaring for a square-like grid
function getColumns(totalEmojis: number) {
  return Math.max(2, Math.ceil(Math.sqrt(totalEmojis)));
}

// Dynamically determine emoji/button size based on grid size
function getEmojiSize(totalEmojis: number) {
  if (totalEmojis <= 16) return "text-4xl !h-16 !w-16";
  if (totalEmojis <= 25) return "text-3xl !h-14 !w-14";
  if (totalEmojis <= 36) return "text-2xl !h-12 !w-12";
  if (totalEmojis <= 49) return "text-xl !h-10 !w-10";
  if (totalEmojis <= 64) return "text-lg !h-8 !w-8";
  return "text-base !h-7 !w-7";
}

export default function FindTheEmojiGame() {
  const [gameActive, setGameActive] = useState(false);
  const [score, setScore] = useState(0);
  const [commonEmotion, setCommonEmotion] = useState(emotions[0]);
  const [targetEmotion, setTargetEmotion] = useState(emotions[1]);
  const [targetIndex, setTargetIndex] = useState(0);
  const [totalEmojis, setTotalEmojis] = useState(INITIAL_TOTAL_EMOJIS);
  const [gameOver, setGameOver] = useState(false);
  const [timeLeft, setTimeLeft] = useState(ROUND_TIME);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Start or reset game
  const startGame = () => {
    setScore(0);
    setTotalEmojis(INITIAL_TOTAL_EMOJIS);
    setGameOver(false);
    setGameActive(true);
    setTimeLeft(ROUND_TIME);
    setupRound(INITIAL_TOTAL_EMOJIS);
  };

  // Setup a new round with random common and target emotions and target position
  const setupRound = (numEmojis: number) => {
    let common, target;
    do {
      common = emotions[Math.floor(Math.random() * emotions.length)];
      target = emotions[Math.floor(Math.random() * emotions.length)];
    } while (common === target);

    setCommonEmotion(common);
    setTargetEmotion(target);
    setTargetIndex(Math.floor(Math.random() * numEmojis));
    setTotalEmojis(numEmojis);
  };

  // Handle emoji click
  const handleEmojiClick = (index: number) => {
    if (!gameActive || gameOver) return;

    if (index === targetIndex) {
      const newScore = score + 1;
      setScore(newScore);
      toast.success("Correct! 🎉");

      // Increase difficulty as score increases
      const nextTotal = Math.min(
        INITIAL_TOTAL_EMOJIS + Math.floor(newScore / 2) * 4,
        MAX_TOTAL_EMOJIS
      );
      setupRound(nextTotal);
    } else {
      toast.error(`Oops! -${WRONG_PENALTY}s 👀`);
      setTimeLeft((prev) => {
        const updated = prev - WRONG_PENALTY;
        if (updated <= 0) {
          setGameOver(true);
          setGameActive(false);
          toast.error(`Time's up! Your final score is ${score}.`);
          clearTimer();
          return 0;
        }
        return updated;
      });
    }
  };

  // Clear timer on unmount or game end
  const clearTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  // Timer effect
  useEffect(() => {
    if (gameActive && !gameOver) {
      timerRef.current = setInterval(() => {
        setTimeLeft((time) => {
          if (time <= 1) {
            clearTimer();
            setGameOver(true);
            setGameActive(false);
            toast.error(`Time's up! Your final score is ${score}.`);
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    }

    return () => clearTimer();
  }, [gameActive, gameOver, score]);

  // Pad the emoji array so the grid is always full rows
  const columns = getColumns(totalEmojis);
  const remainder = totalEmojis % columns;
  const padCount = remainder === 0 ? 0 : columns - remainder;
  const paddedEmojis = [
    ...Array.from({ length: totalEmojis }),
    ...Array.from({ length: padCount }),
  ];
  const emojiSizeClass = getEmojiSize(totalEmojis);

  return (
    <Card className="island-card p-2 sm:p-4">
      <div className="text-center">
        <h3 className="text-2xl font-bold mb-4 font-nunito">Find the Unique Emoji</h3>

        {!gameActive && !gameOver ? (
          <div>
            <p className="text-muted-foreground mb-4">
              Find the one emoji that is different from the others! Difficulty increases as you score. You have 1 minute to get the highest score possible. Wrong answers deduct {WRONG_PENALTY} seconds!
            </p>
            <Button onClick={startGame} className="ocean-button">
              Start Game
            </Button>
          </div>
        ) : gameOver ? (
          <div>
            <p className="text-lg font-semibold mb-6">
              🎉 Game Over! Your final score is {score}.
            </p>
            <Button onClick={startGame} className="ocean-button">
              Play Again
            </Button>
          </div>
        ) : (
          <div>
            <Badge variant="secondary" className="mb-2">
              Score: {score}
            </Badge>
            <Badge variant="secondary" className="mb-2">
              Time Left: {timeLeft}s
            </Badge>

            <p className="mb-6 text-lg font-medium">
              Find the <strong>{targetEmotion.name}</strong> emoji!
            </p>

            <div
              className="grid gap-1 sm:gap-2 justify-center mx-auto"
              style={{
                gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
                width: "100%",
                maxWidth: 400,
                margin: "0 auto"
              }}
            >
              {paddedEmojis.map((_, i) =>
                i < totalEmojis ? (
                  <Button
                    key={i}
                    variant="outline"
                    className={`flex items-center justify-center p-0 ${emojiSizeClass}`}
                    onClick={() => handleEmojiClick(i)}
                    style={{
                      minWidth: 0,
                      minHeight: 0,
                      aspectRatio: "1 / 1"
                    }}
                  >
                    {i === targetIndex ? targetEmotion.emoji : commonEmotion.emoji}
                  </Button>
                ) : (
                  <span key={`pad-${i}`} className="invisible" />
                )
              )}
            </div>

            <Button
              variant="outline"
              className="mt-6"
              onClick={() => {
                setGameActive(false);
                setGameOver(false);
                clearTimer();
              }}
            >
              End Game
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}