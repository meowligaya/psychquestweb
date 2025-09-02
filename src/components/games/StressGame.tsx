import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

/**
 * Fun Stress Relief Game: "Emoji Memory Match"
 * Players see a sequence of emojis and must repeat the sequence by clicking/tapping the correct buttons.
 * Each round adds an emoji. If the player gets it wrong, the game ends and shows their score.
 */

const EMOJIS = ["😄", "😌", "🌈", "🦋", "🍀", "🍉", "🌟", "🎈"];
const TOTAL_ROUNDS = 8;

function getRandomEmojiSequence(length: number) {
  const seq = [];
  for (let i = 0; i < length; i++) {
    seq.push(EMOJIS[Math.floor(Math.random() * EMOJIS.length)]);
  }
  return seq;
}

export default function StressGame() {
  const [gameState, setGameState] = useState<"idle" | "showing" | "guessing" | "done" | "fail">("idle");
  const [round, setRound] = useState(1);
  const [sequence, setSequence] = useState<string[]>([]);
  const [userInput, setUserInput] = useState<string[]>([]);
  const [showIndex, setShowIndex] = useState(0);

  // Start a new game
  const startGame = () => {
    setRound(1);
    setSequence(getRandomEmojiSequence(1));
    setUserInput([]);
    setShowIndex(0);
    setGameState("showing");
    setTimeout(() => showSequence(0, 1), 800);
  };

  // Show the sequence one by one
  const showSequence = (index: number, length: number) => {
    if (index < length) {
      setShowIndex(index);
      setTimeout(() => showSequence(index + 1, length), 850);
    } else {
      setGameState("guessing");
      setShowIndex(-1);
      setUserInput([]);
    }
  };

  // Player clicks an emoji
  const handleEmojiClick = (emoji: string) => {
    if (gameState !== "guessing") return;
    const nextInput = [...userInput, emoji];
    setUserInput(nextInput);

    if (nextInput[nextInput.length - 1] !== sequence[nextInput.length - 1]) {
      setGameState("fail");
      toast.error("Oops! That's not the correct sequence. Try again!");
      return;
    }

    if (nextInput.length === sequence.length) {
      if (round < TOTAL_ROUNDS) {
        setRound(round + 1);
        const newSeq = [...sequence, EMOJIS[Math.floor(Math.random() * EMOJIS.length)]];
        setSequence(newSeq);
        setUserInput([]);
        setGameState("showing");
        setTimeout(() => showSequence(0, newSeq.length), 900);
      } else {
        setGameState("done");
        toast.success("Amazing! You completed all rounds! 🏆");
      }
    }
  };

  const resetGame = () => {
    setGameState("idle");
    setRound(1);
    setSequence([]);
    setUserInput([]);
    setShowIndex(0);
  };

  return (
    <Card className="island-card p-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold mb-4 font-nunito">Stress Buster: Emoji Memory Match</h3>
        {gameState === "idle" && (
          <div>
            <p className="text-muted-foreground mb-4">
              Boost your mood and focus with a fun memory game! Watch the emoji sequence, then repeat it by tapping the emojis in order.
              Each round gets harder. Can you complete all {TOTAL_ROUNDS} rounds?
            </p>
            <div className="text-6xl mb-4">🧠✨</div>
            <Button onClick={startGame} className="ocean-button">
              Start Game
            </Button>
          </div>
        )}

        {gameState === "showing" && (
          <div>
            <Badge variant="secondary" className="mb-4">
              Round: {round} / {TOTAL_ROUNDS}
            </Badge>
            <div className="mb-6 h-32 flex items-center justify-center">
              <span className="text-6xl">{sequence[showIndex]}</span>
            </div>
            <Progress value={(round / TOTAL_ROUNDS) * 100} className="mb-4" />
            <p className="text-muted-foreground mb-4">Memorize the emoji sequence...</p>
            <Button variant="outline" onClick={resetGame}>
              Quit Game
            </Button>
          </div>
        )}

        {gameState === "guessing" && (
          <div>
            <Badge variant="secondary" className="mb-4">
              Round: {round} / {TOTAL_ROUNDS}
            </Badge>
            <div className="mb-2 text-lg font-semibold">Repeat the sequence:</div>
            <div className="flex justify-center gap-2 mb-6 flex-wrap">
              {EMOJIS.map((emoji) => (
                <Button
                  key={emoji}
                  size="lg"
                  className="bg-gradient-to-br from-pink-400 to-purple-400 text-white text-2xl px-6 py-4 font-bold"
                  onClick={() => handleEmojiClick(emoji)}
                  disabled={userInput.length >= sequence.length}
                >
                  {emoji}
                </Button>
              ))}
            </div>
            <div className="flex justify-center gap-1 mb-4">
              {userInput.map((emoji, idx) => (
                <span key={idx} className="text-3xl">{emoji}</span>
              ))}
            </div>
            <Progress value={(round / TOTAL_ROUNDS) * 100} className="mb-4" />
            <Button variant="outline" onClick={resetGame}>
              Quit Game
            </Button>
          </div>
        )}

        {gameState === "done" && (
          <div>
            <div className="text-6xl mb-4">🏆</div>
            <h4 className="text-xl font-bold mb-2 text-green-700">Champion!</h4>
            <p className="mb-2">
              You completed all {TOTAL_ROUNDS} rounds of Emoji Memory Match!
            </p>
            <Button onClick={startGame} className="ocean-button mr-2">
              Play Again
            </Button>
            <Button variant="outline" onClick={resetGame}>
              Back
            </Button>
          </div>
        )}

        {gameState === "fail" && (
          <div>
            <div className="text-6xl mb-4">😅</div>
            <h4 className="text-xl font-bold mb-2 text-red-700">Good Try!</h4>
            <p className="mb-2">
              You reached Round {round}. Try again and beat your score!
            </p>
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