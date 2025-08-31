import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { X } from "lucide-react"; // Make sure you have lucide-react or use any other icon

const breathingPhases = [
  { phase: "Breathe In", duration: 4, color: "from-blue-400 to-blue-600" },
  { phase: "Hold", duration: 4, color: "from-purple-400 to-purple-600" },
  { phase: "Breathe Out", duration: 4, color: "from-green-400 to-green-600" },
  { phase: "Hold", duration: 4, color: "from-yellow-400 to-yellow-600" }
];

interface BreathingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BreathingModal({ isOpen, onClose }: BreathingModalProps) {
  const [isActive, setIsActive] = useState(false);
  const [currentPhase, setCurrentPhase] = useState(0);
  const [timer, setTimer] = useState(0);
  const [cycles, setCycles] = useState(0);

  useEffect(() => {
    if (!isOpen) return;
    setIsActive(false);
    setCurrentPhase(0);
    setTimer(0);
    setCycles(0);
  }, [isOpen]);

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    if (!isActive || !isOpen) return;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((t) => t - 1);
      }, 1000);
    } else if (timer === 0 && isActive) {
      // Move to next phase or next cycle
      if (currentPhase < breathingPhases.length - 1) {
        setCurrentPhase((p) => p + 1);
        setTimer(breathingPhases[currentPhase + 1].duration);
      } else {
        // Complete cycle
        if (cycles < 2) {
          setCurrentPhase(0);
          setTimer(breathingPhases[0].duration);
          setCycles((c) => c + 1);
        } else {
          setIsActive(false);
        }
      }
    }
    return () => clearInterval(interval);
  }, [timer, isActive, currentPhase, cycles, isOpen]);

  const handleStart = () => {
    setIsActive(true);
    setCurrentPhase(0);
    setTimer(breathingPhases[0].duration);
    setCycles(0);
  };
  const handleStop = () => {
    setIsActive(false);
    setCurrentPhase(0);
    setTimer(0);
    setCycles(0);
    onClose();
  };

  const progress =
    isActive && timer > 0
      ? ((breathingPhases[currentPhase].duration - timer) /
          breathingPhases[currentPhase].duration) *
        100
      : 0;

  if (!isOpen) return null;

  return (
    <div
    className="fixed inset-0 bg-black/30 z-[9999] flex items-center justify-center"
    onClick={onClose}
  >
    <Card
      className="relative p-3 max-w-[400px] w-full text-center rounded-xl shadow-2xl bg-white z-[10000]"
      onClick={e => e.stopPropagation()}
      style={{ maxHeight: "280px" }}
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        aria-label="Close"
        className="absolute top-2 right-2 p-1 rounded hover:bg-gray-200 transition"
        type="button"
      >
        <X className="w-5 h-5" />
      </button>
      <h2 className="text-lg font-bold mb-1">Breathing Exercise</h2>
      <p className="mb-1 text-muted-foreground text-xs">
        4-4-4-4 breathing technique.
      </p>
      <div className="flex flex-col items-center justify-center mb-2">
        <Badge variant="secondary" className="mb-1 text-[10px] px-2 py-0.5">
          Cycle: {Math.min(cycles + (isActive ? 1 : 0), 3)} / 3
        </Badge>


          <div
            className={`w-16 h-16 flex items-center justify-center rounded-full bg-gradient-to-br ${breathingPhases[currentPhase].color} transition-all duration-700 ${
              isActive && timer > 2 ? "scale-110" : "scale-100"
            } mb-1`}
          >
            <span className="text-white drop-shadow-lg text-2xl font-bold font-mono select-none">
              {isActive ? timer : "🧘‍♀️"}
            </span>
          </div>
          <h4 className="text-xs font-semibold mb-0">
            {isActive ? breathingPhases[currentPhase].phase : "Ready?"}
          </h4>
        </div>


        <Progress value={progress} className="mb-2 h-1" />
        <div className="mb-2 text-xs min-h-4 text-muted-foreground">
          {isActive ? (
            <>
              {currentPhase === 0 && "Breathe in..."}
              {currentPhase === 1 && "Hold..."}
              {currentPhase === 2 && "Breathe out..."}
              {currentPhase === 3 && "Hold..."}
            </>
          ) : cycles >= 3 ? (
            <span className="text-green-600 font-bold">Great job! 🎉</span>
          ) : (
            "Click Start to begin."
          )}
        </div>
        <div className="flex justify-center gap-2">
          {!isActive && cycles < 3 && (
            <Button onClick={handleStart} className="px-3 py-1 text-xs">
              Start
            </Button>
          )}
          {(isActive || cycles >= 3) && (
            <Button variant="outline" onClick={handleStop} className="px-3 py-1 text-xs">
              {cycles >= 3 ? "Close" : "Stop"}
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}