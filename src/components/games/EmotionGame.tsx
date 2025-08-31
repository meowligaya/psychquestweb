import { useState } from "react";
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

export default function EmotionGame() {
  const [currentEmotion, setCurrentEmotion] = useState(emotions[0]);
  const [score, setScore] = useState(0);
  const [gameActive, setGameActive] = useState(false);

  const startGame = () => {
    setGameActive(true);
    setScore(0);
    nextEmotion();
  };

  const nextEmotion = () => {
    const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
    setCurrentEmotion(randomEmotion);
  };

  const handleEmotionClick = (selectedEmotion: typeof emotions[0]) => {
    if (selectedEmotion.name === currentEmotion.name) {
      setScore(score + 1);
      toast.success("Correct! Well done! 🎉");
      nextEmotion();
    } else {
      toast.error("Try again! Think about the feeling 🤗");
    }
  };

  return (
    <Card className="island-card p-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold mb-4 font-nunito">Emotion Matching Game</h3>
        
        {!gameActive ? (
          <div>
            <p className="text-muted-foreground mb-4">
              Match the emotion with its name! Help children learn about feelings.
            </p>
            <Button onClick={startGame} className="ocean-button">
              Start Game
            </Button>
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <Badge variant="secondary" className="mb-4">
                Score: {score}
              </Badge>
              <div className="text-8xl mb-4">{currentEmotion.emoji}</div>
              <p className="text-lg font-medium mb-6">
                What emotion is this?
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {emotions.map((emotion) => (
                <Button
                  key={emotion.name}
                  variant="outline"
                  className="p-4 h-auto"
                  onClick={() => handleEmotionClick(emotion)}
                >
                  <span className="text-2xl mr-2">{emotion.emoji}</span>
                  {emotion.name}
                </Button>
              ))}
            </div>
            
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => setGameActive(false)}
            >
              End Game
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}