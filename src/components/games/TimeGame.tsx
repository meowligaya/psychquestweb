import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { TimerReset, CheckCircle, XCircle } from "lucide-react";

const tasks = [
  { name: "Write Report", duration: 25 },
  { name: "Read Article", duration: 10 },
  { name: "Brainstorm Ideas", duration: 15 },
  { name: "Code Feature", duration: 30 },
  { name: "Take Break", duration: 5 },
  { name: "Review Notes", duration: 10 }
];

const POMODORO_LENGTH = 25; // minutes per focus session
const BREAK_LENGTH = 5;     // minutes per break
const TOTAL_TIME = 60;      // total minutes for the game

type Session = {
  type: "focus" | "break";
  task?: typeof tasks[0];
  duration: number;
  completed: boolean;
};

export default function PomodoroRushGame() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [currentSession, setCurrentSession] = useState<Session | null>(null);
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [gameActive, setGameActive] = useState(false);
  const [score, setScore] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (gameActive && currentSession && currentSession.duration > 0) {
      timerRef.current = setInterval(() => {
        setCurrentSession((prev) =>
          prev
            ? { ...prev, duration: prev.duration - 1 }
            : null
        );
      }, 1000 * 0.1); // fast-forward: each "minute" is 100ms for game speed
    }
    return () => clearInterval(timerRef.current as any);
  }, [gameActive, currentSession]);

  useEffect(() => {
    if (!currentSession || !gameActive) return;
    if (currentSession.duration <= 0) {
      if (currentSession.type === "focus") {
        toast.success(`Focus session complete! +20 points`);
        setScore((s) => s + 20);
        startNextSession("break");
      } else {
        toast.info(`Break over! +5 points`);
        setScore((s) => s + 5);
        startNextSession("focus");
      }
    }
  }, [currentSession, gameActive]);

  const startGame = () => {
    setGameActive(true);
    setScore(0);
    setTimeLeft(TOTAL_TIME);
    setSessions([]);
    setCurrentSession({
      type: "focus",
      task: getRandomTask(),
      duration: POMODORO_LENGTH,
      completed: false
    });
  };

  const endGame = () => {
    setGameActive(false);
    setCurrentSession(null);
    toast.success(`Game over! You scored ${score} points.`);
  };

  const skipSession = () => {
    if (!currentSession) return;
    toast.error("Session skipped! -5 points");
    setScore((s) => Math.max(0, s - 5));
    startNextSession(currentSession.type === "focus" ? "break" : "focus");
  };

  const startNextSession = (type: "focus" | "break") => {
    const remaining = timeLeft - (currentSession?.type === "focus" ? POMODORO_LENGTH : BREAK_LENGTH);
    setTimeLeft(remaining);
    setSessions((s) =>
      currentSession ? [...s, { ...currentSession, completed: true }] : s
    );
    if (remaining <= 0) {
      endGame();
      return;
    }
    if (type === "focus") {
      setCurrentSession({
        type: "focus",
        task: getRandomTask(),
        duration: Math.min(POMODORO_LENGTH, remaining),
        completed: false
      });
    } else {
      setCurrentSession({
        type: "break",
        duration: Math.min(BREAK_LENGTH, remaining),
        completed: false
      });
    }
  };

  function getRandomTask() {
    return tasks[Math.floor(Math.random() * tasks.length)];
  }

  const sessionProgress =
    currentSession && currentSession.type === "focus"
      ? ((POMODORO_LENGTH - currentSession.duration) / POMODORO_LENGTH) * 100
      : currentSession && currentSession.type === "break"
      ? ((BREAK_LENGTH - currentSession.duration) / BREAK_LENGTH) * 100
      : 0;

  return (
    <Card className="island-card p-6">
      <h3 className="text-2xl font-bold mb-4 font-nunito">Pomodoro Rush</h3>
      {!gameActive ? (
        <div className="text-center">
          <div className="text-6xl mb-4">🍅</div>
          <p className="text-muted-foreground mb-4">
            Complete as many Pomodoro sessions as you can in 1 hour!<br />
            Each focus session is 25 minutes, breaks are 5 minutes. <br />
            Score points by finishing focus and break sessions. Skipping costs points!
          </p>
          <Button onClick={startGame} className="ocean-button">
            Start Game
          </Button>
        </div>
      ) : (
        <div>
          <div className="flex justify-between items-center mb-4">
            <Badge variant="secondary">Score: {score}</Badge>
            <Badge variant="outline">
              <TimerReset className="w-3 h-3 mr-1" />
              {Math.floor(timeLeft / 60)}h {timeLeft % 60}m left
            </Badge>
          </div>
          <Progress value={sessionProgress} className="mb-6" />
          <div className="flex flex-col items-center mb-4">
            {currentSession && currentSession.type === "focus" && (
              <>
                <div className="text-xl mb-2">
                  Focus: <span className="font-bold">{currentSession.task?.name}</span>
                </div>
                <div className="mb-2">Time left: {currentSession.duration} min</div>
                <Button onClick={skipSession} variant="outline" className="mb-2">
                  <XCircle className="w-4 h-4 mr-1" /> Skip Session (-5 pts)
                </Button>
              </>
            )}
            {currentSession && currentSession.type === "break" && (
              <>
                <div className="text-xl mb-2">Break Time!</div>
                <div className="mb-2">Time left: {currentSession.duration} min</div>
                <Button onClick={skipSession} variant="outline" className="mb-2">
                  <XCircle className="w-4 h-4 mr-1" /> Skip Break (-5 pts)
                </Button>
              </>
            )}
          </div>
          <div className="text-center">
            <Button onClick={endGame} variant="destructive" className="mt-2">
              End Game
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}