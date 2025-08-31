import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

const mindfulnessExercises = [
  {
    name: "5-4-3-2-1 Grounding",
    description: "Notice 5 things you see, 4 you can touch, 3 you hear, 2 you smell, 1 you taste",
    duration: 180,
    icon: "👁️"
  },
  {
    name: "Body Scan",
    description: "Slowly focus on each part of your body from head to toe",
    duration: 300,
    icon: "🧘"
  },
  {
    name: "Loving Kindness",
    description: "Send kind thoughts to yourself, loved ones, and even difficult people",
    duration: 240,
    icon: "💝"
  },
  {
    name: "Mindful Walking",
    description: "Focus on each step, the feeling of your feet touching the ground",
    duration: 200,
    icon: "🚶"
  }
];

export default function MindfulnessGame() {
  const [selectedExercise, setSelectedExercise] = useState<typeof mindfulnessExercises[0] | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [completedExercises, setCompletedExercises] = useState<string[]>([]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(timeRemaining - 1);
      }, 1000);
    } else if (isActive && timeRemaining === 0) {
      setIsActive(false);
      if (selectedExercise) {
        setCompletedExercises([...completedExercises, selectedExercise.name]);
        toast.success("Exercise completed! Well done on taking time for mindfulness 🧘‍♀️");
      }
    }

    return () => clearInterval(interval);
  }, [isActive, timeRemaining, selectedExercise, completedExercises]);

  const startExercise = (exercise: typeof mindfulnessExercises[0]) => {
    setSelectedExercise(exercise);
    setTimeRemaining(exercise.duration);
    setIsActive(true);
  };

  const stopExercise = () => {
    setIsActive(false);
    setTimeRemaining(0);
    setSelectedExercise(null);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = selectedExercise ? 
    ((selectedExercise.duration - timeRemaining) / selectedExercise.duration) * 100 : 0;

  return (
    <Card className="island-card p-6">
      <div>
        <h3 className="text-2xl font-bold mb-4 font-nunito">Mindful Moments</h3>
        
        {!isActive ? (
          <div>
            <div className="text-center mb-6">
              <div className="text-6xl mb-2">🧠</div>
              <p className="text-muted-foreground">
                Take a moment to practice mindfulness and find inner peace.
              </p>
              {completedExercises.length > 0 && (
                <Badge variant="secondary" className="mt-2">
                  Completed: {completedExercises.length} exercises
                </Badge>
              )}
            </div>
            
            <div className="grid gap-4">
              {mindfulnessExercises.map((exercise, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{exercise.icon}</span>
                      <div>
                        <h4 className="font-semibold">{exercise.name}</h4>
                        <p className="text-sm text-muted-foreground">{exercise.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Duration: {Math.floor(exercise.duration / 60)} minutes
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {completedExercises.includes(exercise.name) && (
                        <Badge variant="default" className="text-xs">✓</Badge>
                      )}
                      <Button 
                        size="sm"
                        onClick={() => startExercise(exercise)}
                        className="ocean-button"
                      >
                        Start
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center">
            <div className="text-6xl mb-4">{selectedExercise?.icon}</div>
            <h4 className="text-xl font-semibold mb-2">{selectedExercise?.name}</h4>
            <p className="text-muted-foreground mb-6">{selectedExercise?.description}</p>
            
            <div className="text-4xl font-bold mb-4 text-primary">
              {formatTime(timeRemaining)}
            </div>
            
            <Progress value={progress} className="mb-6" />
            
            <div className="space-y-2 text-sm text-muted-foreground mb-6">
              <p>Find a comfortable position</p>
              <p>Close your eyes or soften your gaze</p>
              <p>Breathe naturally and focus on the present moment</p>
            </div>
            
            <Button 
              variant="outline" 
              onClick={stopExercise}
            >
              End Session
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}