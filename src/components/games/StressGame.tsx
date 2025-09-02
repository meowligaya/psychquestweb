import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

/**
 * Simple Stress Relief Game: "Catch the Calm"
 * The player must tap/click the "Calm" button as quickly as possible when it appears.
 * This mini-game helps shift focus away from stress and encourages quick, mindful reactions.
 */

const TOTAL_ROUNDS = 5;

export default function StressGame() {
  const [gameState, setGameState] = useState<"idle" | "waiting" | "active" | "done">("idle");
  const [round, setRound] = useState(0);
  const [timer, setTimer] = useState(0); // Time taken to react in ms
  const [record, setRecord] = useState<number[]>([]);
  const [showButton, setShowButton] = useState(false);

  // Start a new game
  const startGame = () => {
    setRound(1);
    setRecord([]);
    setGameState("waiting");
    setShowButton(false);
    nextRound(1);
  };

  // Setup next round with random delay
  const nextRound = (nextRoundNum: number) => {
    setGameState("waiting");
    setShowButton(false);

    const delay = Math.random() * 1200 + 800; // 800ms to 2s
    setTimeout(() => {
      setShowButton(true);
      setGameState("active");
      setTimer(Date.now());
    }, delay);
  };

  // Player taps the button
  const handleClick = () => {
    if (gameState !== "active") return;

    const reactionTime = Date.now() - timer;
    setRecord([...record, reactionTime]);
    setShowButton(false);

    if (round < TOTAL_ROUNDS) {
      setRound(round + 1);
      nextRound(round + 1);
    } else {
      setGameState("done");
      toast.success("You completed the Stress Buster Game! 🎉");
    }
  };

  const resetGame = () => {
    setGameState("idle");
    setRound(0);
    setRecord([]);
    setShowButton(false);
  };

  // Average reaction time
  const avgTime =
    record.length > 0
      ? Math.round(record.reduce((a, b) => a + b, 0) / record.length)
      : 0;

  return (
    <Card className="island-card p-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold mb-4 font-nunito">Stress Buster: Catch the Calm</h3>
        {gameState === "idle" && (
          <div>
            <p className="text-muted-foreground mb-4">
              Play a quick game to shift your focus and bust stress! Tap the <strong>Calm</strong> button as soon as you see it appear. Try to react as quickly as possible!
            </p>
            <div className="text-6xl mb-4">😌</div>
            <Button onClick={startGame} className="ocean-button">
              Start Stress Game
            </Button>
          </div>
        )}

        {(gameState === "waiting" || gameState === "active") && (
          <div>
            <Badge variant="secondary" className="mb-4">
              Round: {round} / {TOTAL_ROUNDS}
            </Badge>
            <div className="mb-6 h-32 flex items-center justify-center">
              {showButton ? (
                <Button
                  size="lg"
                  className="bg-gradient-to-br from-green-400 to-blue-400 text-white text-xl px-10 py-6 font-bold animate-pulse"
                  onClick={handleClick}
                  autoFocus
                >
                  Calm
                </Button>
              ) : (
                <span className="text-muted-foreground text-lg">Get ready...</span>
              )}
            </div>
            <Progress value={(round / TOTAL_ROUNDS) * 100} className="mb-4" />
            <p className="text-muted-foreground mb-4">
              {showButton
                ? "Tap now! Catch the calm!"
                : "Wait for the Calm button to appear..."}
            </p>
            <Button variant="outline" onClick={resetGame}>
              Quit Game
            </Button>
          </div>
        )}

        {gameState === "done" && (
          <div>
            <div className="text-6xl mb-4">🎉</div>
            <h4 className="text-xl font-bold mb-2 text-green-700">Great job!</h4>
            <p className="mb-2">
              Your average reaction time: <strong>{avgTime} ms</strong>
            </p>
            <ul className="mb-4 text-sm text-muted-foreground">
              {record.map((time, idx) => (
                <li key={idx}>Round {idx + 1}: {time} ms</li>
              ))}
            </ul>
            <Button onClick={startGame} className="ocean-button mr-2">
              Play Again
            </Button>
            <Button variant="outline" onClick={resetGame}>
              Back
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}