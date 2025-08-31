import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import EmotionGame from "./games/EmotionGame";
import StressGame from "./games/StressGame";
import TimeGame from "./games/TimeGame";
import MindfulnessGame from "./games/MindfulnessGame";

interface GameModalProps {
  isOpen: boolean;
  onClose: () => void;
  gameType: string;
  ageGroup: string;
}

export default function GameModal({ isOpen, onClose, gameType, ageGroup }: GameModalProps) {
  const getGameComponent = () => {
    if (ageGroup === 'child' && gameType.includes('Happy Face')) {
      return <EmotionGame />;
    }
    if (ageGroup === 'teen' && gameType.includes('Stress')) {
      return <StressGame />;
    }
    if (ageGroup === 'young-adult' && gameType.includes('Time')) {
      return <TimeGame />;
    }
    if (ageGroup === 'adult' && gameType.includes('Mindful')) {
      return <MindfulnessGame />;
    }
    
    // Default fallback games based on age group
    switch (ageGroup) {
      case 'child':
        return <EmotionGame />;
      case 'teen':
        return <StressGame />;
      case 'young-adult':
        return <TimeGame />;
      case 'adult':
        return <MindfulnessGame />;
      default:
        return <EmotionGame />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-nunito text-2xl">
            {gameType}
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          {getGameComponent()}
        </div>
      </DialogContent>
    </Dialog>
  );
}