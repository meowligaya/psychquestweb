import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

// Add this CSS in your global styles or module
const flashcardStyles = `
.flashcard-container {
  perspective: 1200px;
  width: 100%;
  max-width: 480px;
  margin: 0 auto;
}
.flashcard {
  width: 100%;
  height: 320px;
  position: relative;
  transition: transform 0.5s cubic-bezier(.4,2,.3,1);
  transform-style: preserve-3d;
}
.flashcard.flipped {
  transform: rotateY(180deg);
}
.flashcard-face {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: 1rem;
  box-shadow: 0 4px 18px rgba(0,0,0,0.08);
  background: #f8fafc;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.flashcard-face.back {
  transform: rotateY(180deg);
  background: #e0f7fa;
}
`;

const CONDITIONS = [
  {
    name: "Anxiety",
    description: "Persistent worries, restlessness, racing thoughts, and physical signs like a rapid heartbeat.",
    fact: "Anxiety is one of the most common mental health conditions worldwide."
  },
  {
    name: "Depression",
    description: "Loss of interest or pleasure, persistent sadness, fatigue, and changes in sleep or appetite.",
    fact: "Depression can affect anyone, but it is treatable with support and care."
  },
  {
    name: "ADHD",
    description: "Difficulty paying attention, impulsiveness, fidgeting, and trouble with organization.",
    fact: "ADHD affects both children and adults, and is not caused by poor parenting."
  },
  {
    name: "PTSD",
    description: "Flashbacks, nightmares, avoidance of reminders, and feeling tense after traumatic events.",
    fact: "PTSD can develop after experiencing or witnessing a traumatic event."
  },
  {
    name: "Bipolar Disorder",
    description: "Alternating periods of elevated mood and energy (mania) and low mood (depression).",
    fact: "With proper treatment, many people with bipolar disorder lead fulfilling lives."
  },
  {
    name: "OCD",
    description: "Repeated unwanted thoughts (obsessions) and behaviors (compulsions) to reduce anxiety.",
    fact: "OCD is not simply about liking things neat—it's a real condition that can be distressing."
  },
];

const TOTAL_ROUNDS = 6;

function getRandomFlashcardIndices(length: number, total: number): number[] {
  const arr = Array.from({ length }, (_, i) => i);
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.slice(0, total);
}

export default function MemojiMatchFlashcards() {
  const [gameState, setGameState] = useState<"idle" | "playing" | "done">("idle");
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [flashcardOrder, setFlashcardOrder] = useState<number[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [flipped, setFlipped] = useState(false);

  // Inject styles (only once if not using CSS modules)
  if (typeof document !== "undefined" && !document.getElementById("flashcardStyles")) {
    const style = document.createElement("style");
    style.id = "flashcardStyles";
    style.innerHTML = flashcardStyles;
    document.head.appendChild(style);
  }

  const startGame = () => {
    const order = getRandomFlashcardIndices(CONDITIONS.length, TOTAL_ROUNDS);
    setFlashcardOrder(order);
    setRound(1);
    setScore(0);
    setCurrentIdx(0);
    setSelected(null);
    setIsCorrect(null);
    setFlipped(false);
    setGameState("playing");
  };

  const handleSelect = (conditionName: string) => {
    if (gameState !== "playing" || selected) return;
    setSelected(conditionName);

    const correctAnswer = CONDITIONS[flashcardOrder[currentIdx]].name;
    const correct = correctAnswer === conditionName;
    setIsCorrect(correct);

    if (correct) {
      toast.success("Correct! 🎉");
      setScore(s => s + 1);
    } else {
      toast.error("Oops! That's not correct.");
    }
    setTimeout(() => setFlipped(true), 300); // Flip with a slight delay
  };

  const handleNextRound = () => {
    setFlipped(false);
    setSelected(null);
    setIsCorrect(null);
    if (round < TOTAL_ROUNDS) {
      setRound(r => r + 1);
      setCurrentIdx(idx => idx + 1);
    } else {
      setGameState("done");
    }
  };

  const resetGame = () => {
    setGameState("idle");
    setRound(1);
    setScore(0);
    setFlashcardOrder([]);
    setCurrentIdx(0);
    setSelected(null);
    setIsCorrect(null);
    setFlipped(false);
  };

  const correctAnswer = CONDITIONS[flashcardOrder[currentIdx]]?.name;
  const currentFact = CONDITIONS[flashcardOrder[currentIdx]]?.fact;

  return (
    <Card className="island-card p-6" style={{ maxWidth: 540, margin: "0 auto" }}>
      <div className="text-center">
        <h3 className="text-2xl font-bold mb-4 font-nunito">Memoji Match</h3>
        {gameState === "idle" && (
          <div>
            <p className="text-muted-foreground mb-4">
              Flip the flashcard to learn about different mental health conditions. Match the description, then turn the card to see the answer and a fact!
            </p>
            <div className="text-6xl mb-4">🧠✨</div>
            <Button onClick={startGame} className="ocean-button">
              Start Game
            </Button>
          </div>
        )}

        {gameState === "playing" && (
          <div>
            <Badge variant="secondary" className="mb-4">
              Round: {round} / {TOTAL_ROUNDS}
            </Badge>
            <div className="flashcard-container mb-6">
              <div className={`flashcard${flipped ? " flipped" : ""}`}>
                {/* Front of flashcard */}
                <div className="flashcard-face front">
                  <div className="mb-3 text-lg font-semibold">Which condition matches this description?</div>
                  <div className="mb-3 text-base italic">
                    {CONDITIONS[flashcardOrder[currentIdx]].description}
                  </div>
                  <div className="flex flex-wrap justify-center gap-2">
                    {CONDITIONS.map((cond) => (
                      <Button
                        key={cond.name}
                        size="lg"
                        className={`text-base px-4 py-2 font-bold ${
                          selected === cond.name
                            ? cond.name === CONDITIONS[flashcardOrder[currentIdx]].name
                              ? "bg-green-400 text-white"
                              : "bg-red-400 text-white"
                            : "bg-gradient-to-br from-blue-400 to-purple-400 text-white"
                        }`}
                        onClick={() => handleSelect(cond.name)}
                        disabled={!!selected}
                      >
                        {cond.name}
                      </Button>
                    ))}
                  </div>
                </div>
                {/* Back of flashcard */}
                <div className="flashcard-face back">
                  <div className="mb-2 text-lg font-semibold">Answer</div>
                  <div className="mb-2 text-base">
                    <span className="font-bold">
                      {correctAnswer}
                    </span>
                    {!isCorrect && (
                      <span className="block text-red-600 mt-1">
                        Your guess: <b>{selected}</b>
                      </span>
                    )}
                  </div>
                  <div className="mt-4 text-base text-green-700 font-medium">
                    <strong>Fact:</strong> {currentFact}
                  </div>
                  <Button className="ocean-button mt-6" onClick={handleNextRound}>
                    {round < TOTAL_ROUNDS ? "Next Card" : "See Results"}
                  </Button>
                </div>
              </div>
            </div>
            <Progress value={(round / TOTAL_ROUNDS) * 100} className="mb-4" />
            <Button variant="outline" onClick={resetGame}>
              Quit Game
            </Button>
          </div>
        )}

        {gameState === "done" && (
          <div>
            <div className="text-6xl mb-4">🎉</div>
            <h4 className="text-xl font-bold mb-2 text-green-700">Well Done!</h4>
            <p className="mb-2">
              Your score: <span className="font-bold">{score} / {TOTAL_ROUNDS}</span>
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