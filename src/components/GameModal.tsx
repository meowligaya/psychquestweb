import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import EmotionGame from "./games/EmotionGame";
import StressGame from "./games/StressGame";
import TimeGame from "./games/TimeGame";
import MindfulnessGame from "./games/MindfulnessGame";

interface GameModalProps {
  isOpen: boolean;
  onClose: () => void;
  gameType: string;
  questGroup: string;
}

export default function GameModal({ isOpen, onClose, gameType, questGroup }: GameModalProps) {
  const getGameComponent = () => {
    if (questGroup === 'emotionExplorer' && gameType.includes('Happy Face')) {
      return <EmotionGame />;
    }
    if (questGroup === 'mindMaster' && gameType.includes('Stress')) {
      return <StressGame />;
    }
    if (questGroup === 'timeTactician' && gameType.includes('Time')) {
      return <TimeGame />;
    }
    if (questGroup === 'mindfulSage' && gameType.includes('Mindful')) {
      return <MindfulnessGame />;
    }
    
    // Default fallback games based on quest group
    switch (questGroup) {
      case 'emotionExplorer':
        return <EmotionGame />;
      case 'mindMaster':
        return <StressGame />;
      case 'timeTactician':
        return <TimeGame />;
      case 'mindfulSage':
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