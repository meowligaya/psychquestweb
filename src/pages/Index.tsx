import { useState } from "react";
import AgeSelector from "../components/AgeSelector";
import IslandDashboard from "../components/IslandDashboard";
import ChatBot from "../components/ChatBot";

const Index = () => {
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<string | null>(null);

  const handleAgeSelect = (ageGroup: string) => {
    setSelectedAgeGroup(ageGroup);
  };

  return (
    <div className="min-h-screen">
      {!selectedAgeGroup ? (
        <AgeSelector onAgeSelect={handleAgeSelect} />
      ) : (
        <>
          <IslandDashboard ageGroup={selectedAgeGroup} />
          <ChatBot />
        </>
      )}
    </div>
  );
};

export default Index;