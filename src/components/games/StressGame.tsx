import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

const breathingPhases = [
  { phase: "Breathe In", duration: 4, color: "from-blue-400 to-blue-600" },
  { phase: "Hold", duration: 4, color: "from-purple-400 to-purple-600" },
  { phase: "Breathe Out", duration: 4, color: "from-green-400 to-green-600" },
  { phase: "Hold", duration: 4, color: "from-yellow-400 to-yellow-600" }
];

export default function StressGame() {
  const [isActive, setIsActive] = useState(false);
  const [currentPhase, setCurrentPhase] = useState(0);
  const [timer, setTimer] = useState(0);
  const [cycles, setCycles] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isActive && timer > 0) {
      interval = setInterval(() => {
        setTimer(timer - 1);
      }, 1000);
    } else if (isActive && timer === 0) {
      // Move to next phase
      if (currentPhase < breathingPhases.length - 1) {
        setCurrentPhase(currentPhase + 1);
        setTimer(breathingPhases[currentPhase + 1].duration);
      } else {
        // Complete cycle
        setCurrentPhase(0);
        setTimer(breathingPhases[0].duration);
        setCycles(cycles + 1);
        
        if (cycles >= 2) {
          setIsActive(false);
          toast.success("Great job! You completed the breathing exercise! 🧘‍♀️");
        }
      }
    }

    return () => clearInterval(interval);
  }, [isActive, timer, currentPhase, cycles]);

  const startExercise = () => {
    setIsActive(true);
    setCurrentPhase(0);
    setTimer(breathingPhases[0].duration);
    setCycles(0);
  };

  const stopExercise = () => {
    setIsActive(false);
    setTimer(0);
    setCycles(0);
  };

  const progress = ((breathingPhases[currentPhase].duration - timer) / breathingPhases[currentPhase].duration) * 100;

  return (
    <Card className="island-card p-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold mb-4 font-nunito">Stress Buster: Breathing Exercise</h3>
        
        {!isActive ? (
          <div>
            <p className="text-muted-foreground mb-4">
              Practice the 4-4-4-4 breathing technique to reduce stress and anxiety.
            </p>
            <div className="text-6xl mb-4">🧘‍♀️</div>
            <Button onClick={startExercise} className="ocean-button">
              Start Breathing Exercise
            </Button>
          </div>
        ) : (
          <div>
            <Badge variant="secondary" className="mb-4">
              Cycle: {cycles + 1} / 3
            </Badge>
            
            <div className={`w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br ${breathingPhases[currentPhase].color} flex items-center justify-center transition-all duration-1000 ${timer > 2 ? 'scale-110' : 'scale-100'}`}>
              <span className="text-white text-4xl font-bold">{timer}</span>
            </div>
            
            <h4 className="text-2xl font-semibold mb-2">
              {breathingPhases[currentPhase].phase}
            </h4>
            
            <Progress value={progress} className="mb-4" />
            
            <p className="text-muted-foreground mb-4">
              {currentPhase === 0 && "Slowly breathe in through your nose..."}
              {currentPhase === 1 && "Hold your breath gently..."}
              {currentPhase === 2 && "Slowly breathe out through your mouth..."}
              {currentPhase === 3 && "Hold and prepare for the next breath..."}
            </p>
            
            <Button 
              variant="outline" 
              onClick={stopExercise}
            >
              Stop Exercise
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}