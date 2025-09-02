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

const INITIAL_TOTAL_EMOJIS = 12; // start with 12 emojis
const MAX_TOTAL_EMOJIS = 100; // allow game to get very hard
const ROUND_TIME = 60; // 1 minute in seconds
const WRONG_PENALTY = 3; // Lose 3 seconds on wrong answer

// Set a fixed column count for wider screens, but allow responsiveness
const COLUMN_COUNT = 4;

function getEmojiSize(totalEmojis: number) {
  // Emoji size shrinks as totalEmojis increases (min 1.6rem, max 2.5rem)
  if (totalEmojis <= 16) return "text-4xl"; // 2.25rem
  if (totalEmojis <= 24) return "text-3xl"; // 1.875rem
  if (totalEmojis <= 36) return "text-2xl"; // 1.5rem
  return "text-xl"; // 1.25rem (fallback for many emojis)
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
      // e.g. every 2 points, add 4 emojis, up to MAX_TOTAL_EMOJIS
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

  // Pad the emoji array so the grid is always full rows (optional but looks better)
  const getPaddedEmojiArray = () => {
    const remainder = totalEmojis % COLUMN_COUNT;
    const padCount = remainder === 0 ? 0 : COLUMN_COUNT - remainder;
    return [
      ...Array.from({ length: totalEmojis }),
      ...Array.from({ length: padCount }),
    ];
  };

  // Responsive grid columns for mobile
  const gridColumns = `
    grid-cols-2 
    sm:grid-cols-3 
    md:grid-cols-4 
    lg:grid-cols-${COLUMN_COUNT}
  `;

  // Responsive max widths for mobile/desktop
  const gridMaxWidth = "max-w-[98vw] sm:max-w-[400px]";

  return (
    <Card className="island-card p-4 sm:p-6">
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
              className={`grid gap-2 sm:gap-3 overflow-x-auto overflow-y-auto mx-auto ${gridColumns} ${gridMaxWidth}`}
              style={{
                maxHeight: "60vh", // makes grid scrollable on mobile when too many
                minHeight: "120px",
              }}
            >
              {getPaddedEmojiArray().map((_, i) => {
                // Only real emojis (not padding) are clickable and displayed
                if (i < totalEmojis) {
                  return (
                    <Button
                      key={i}
                      variant="outline"
                      className={`!h-12 !w-12 sm:!h-16 sm:!w-16 p-0 flex items-center justify-center ${getEmojiSize(totalEmojis)}`}
                      style={{
                        minWidth: "2.5rem",
                        minHeight: "2.5rem",
                        fontSize:
                          totalEmojis > 36
                            ? "1.5rem"
                            : totalEmojis > 24
                            ? "2rem"
                            : "",
                        touchAction: "manipulation",
                      }}
                      onClick={() => handleEmojiClick(i)}
                    >
                      {i === targetIndex ? targetEmotion.emoji : commonEmotion.emoji}
                    </Button>
                  );
                } else {
                  // Invisible padding cell for alignment
                  return (
                    <span key={`pad-${i}`} className="invisible" />
                  );
                }
              })}
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