import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { Timer, Coffee, CheckCircle } from "lucide-react";

const blocks = [
  { name: "Deep Work", minutes: 25, type: "focus", points: 25 },
  { name: "Short Break", minutes: 5, type: "rest", points: 5 },
  { name: "Fun Activity", minutes: 25, type: "fun", points: 10 },
  { name: "Admin Tasks", minutes: 25, type: "focus", points: 15 },
  { name: "Coffee Break", minutes: 10, type: "rest", points: 3 },
  { name: "Creative Session", minutes: 25, type: "focus", points: 20 }
];

export default function PomodoroGame() {
  const [selectedBlocks, setSelectedBlocks] = useState<typeof blocks>([]);
  const [minutesLeft, setMinutesLeft] = useState(120); // 2 hours in minutes
  const [gameStarted, setGameStarted] = useState(false);
  const [score, setScore] = useState(0);

  const startGame = () => {
    setGameStarted(true);
    setSelectedBlocks([]);
    setMinutesLeft(120);
    setScore(0);
  };

  const addBlock = (block: typeof blocks[0]) => {
    if (minutesLeft >= block.minutes) {
      setSelectedBlocks([...selectedBlocks, block]);
      setMinutesLeft(minutesLeft - block.minutes);
      setScore(score + block.points);
      toast.success(`Added ${block.name}! +${block.points} points`);
    } else {
      toast.error("Not enough minutes left for this block!");
    }
  };

  const removeBlock = (blockIndex: number) => {
    const block = selectedBlocks[blockIndex];
    setSelectedBlocks(selectedBlocks.filter((_, idx) => idx !== blockIndex));
    setMinutesLeft(minutesLeft + block.minutes);
    setScore(Math.max(0, score - block.points));
  };

  const finishSession = () => {
    const focusBlocks = selectedBlocks.filter(b => b.type === "focus").length;
    const restBlocks = selectedBlocks.filter(b => b.type === "rest").length;
    let balanceBonus = Math.abs(focusBlocks - restBlocks) <= 1 ? 20 : 0;
    let finalScore = score + balanceBonus;
    toast.success(
      `Session complete! Final score: ${finalScore} (Balance bonus: +${balanceBonus})`
    );
    setGameStarted(false);
  };

  const typeColor = (type: string) => {
    switch (type) {
      case "focus":
        return "bg-blue-100 text-blue-800";
      case "rest":
        return "bg-pink-100 text-pink-800";
      case "fun":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const progressValue = ((120 - minutesLeft) / 120) * 100;

  return (
    <Card className="island-card p-6">
      <div>
        <h3 className="text-2xl font-bold mb-4 font-nunito">
          Pomodoro Planning Game
        </h3>
        {!gameStarted ? (
          <div className="text-center">
            <div className="text-6xl mb-4">🍅</div>
            <p className="text-muted-foreground mb-4">
              Allocate your 2 hours with Pomodoro blocks. Balance focus, rest, and fun!
            </p>
            <Button onClick={startGame} className="ocean-button">
              Start Planning
            </Button>
          </div>
        ) : (
          <div>
            <div className="flex justify-between items-center mb-4">
              <Badge variant="secondary">Score: {score}</Badge>
              <Badge variant="outline">
                <Timer className="w-3 h-3 mr-1" />
                {Math.floor(minutesLeft / 60)}h {minutesLeft % 60}m left
              </Badge>
            </div>
            <Progress value={progressValue} className="mb-6" />

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Available Blocks</h4>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {blocks.map((block, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div>
                        <div className="font-medium">{block.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {block.minutes} min • {block.type}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          className={typeColor(block.type)}
                          variant="secondary"
                        >
                          {block.type}
                        </Badge>
                        <Button
                          size="sm"
                          onClick={() => addBlock(block)}
                          disabled={minutesLeft < block.minutes}
                        >
                          Add
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Your Plan</h4>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {selectedBlocks.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">
                      No blocks scheduled yet
                    </p>
                  ) : (
                    selectedBlocks.map((block, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 bg-muted rounded-lg"
                      >
                        <div className="flex items-center gap-2">
                          {block.type === "focus" ? (
                            <Timer className="w-4 h-4 text-blue-600" />
                          ) : block.type === "rest" ? (
                            <Coffee className="w-4 h-4 text-pink-600" />
                          ) : (
                            <CheckCircle className="w-4 h-4 text-yellow-500" />
                          )}
                          <div>
                            <div className="font-medium">{block.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {block.minutes} min
                            </div>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => removeBlock(idx)}
                        >
                          Remove
                        </Button>
                      </div>
                    ))
                  )}
                </div>
                {selectedBlocks.length > 0 && (
                  <Button
                    className="w-full mt-4 beach-button"
                    onClick={finishSession}
                  >
                    Finish Session
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}