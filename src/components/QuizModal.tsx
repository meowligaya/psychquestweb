import { useState } from "react";
import { Button } from "@/components/ui/button";

interface QuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  quizType: string;
  questGroup: string;
}

interface Question {
  question: string;
  options: string[];
  correctIndex: number;
}

const questions: Question[] = [
  {
    question: "Which of the following is a common symptom of stress?",
    options: [
      "Increased energy and alertness",
      "Difficulty sleeping",
      "Improved concentration",
      "Feeling relaxed"
    ],
    correctIndex: 1,
  },
  {
    question: "What is a healthy way to manage stress?",
    options: [
      "Ignoring your feelings",
      "Regular exercise",
      "Overworking yourself",
      "Avoiding social contact"
    ],
    correctIndex: 1,
  },
  {
    question: "Which breathing technique can help reduce anxiety?",
    options: [
      "Rapid shallow breathing",
      "Holding your breath",
      "4-4-4-4 breathing (inhale-hold-exhale-hold)",
      "Breathing only through your mouth"
    ],
    correctIndex: 2,
  }
];

export default function QuizModal({ isOpen, onClose, quizType, questGroup }: QuizModalProps) {
  if (!isOpen) return null;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const currentQuestion = questions[currentIndex];

  const handleSubmit = () => {
    if (selected === null) return;

    if (selected === currentQuestion.correctIndex) {
      setScore(score + 1);
    }
    setSubmitted(true);
  };

  const handleNext = () => {
    setSubmitted(false);
    setSelected(null);
    setCurrentIndex(currentIndex + 1);
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setSelected(null);
    setSubmitted(false);
    setScore(0);
  };

  const isLastQuestion = currentIndex === questions.length - 1;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40" 
        onClick={onClose} // close modal when clicking outside content
      />
      {/* Modal Content */}
      <div className="fixed inset-0 flex items-center justify-center p-4 z-50 pointer-events-none">
        <div 
          className="bg-white rounded-lg p-6 max-w-md w-full shadow-lg pointer-events-auto"
          onClick={e => e.stopPropagation()} // prevent closing when clicking inside modal
        >
          <h2 className="text-xl font-bold mb-4">{quizType}</h2>
          <p className="mb-4 font-semibold">
            Question {currentIndex + 1} of {questions.length}
          </p>
          <p className="mb-4 font-semibold">{currentQuestion.question}</p>

          <div className="space-y-2 mb-4">
            {currentQuestion.options.map((option, idx) => {
              const isSelected = selected === idx;
              const isCorrect = submitted && idx === currentQuestion.correctIndex;
              const isWrong = submitted && isSelected && idx !== currentQuestion.correctIndex;

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => !submitted && setSelected(idx)}
                  className={`
                    w-full text-left px-4 py-2 rounded border 
                    ${isSelected ? "border-blue-600 bg-blue-100" : "border-gray-300 bg-white"}
                    ${isCorrect ? "border-green-600 bg-green-100" : ""}
                    ${isWrong ? "border-red-600 bg-red-100" : ""}
                    focus:outline-none
                    hover:bg-gray-100
                    transition
                  `}
                  disabled={submitted}
                >
                  {option}
                </button>
              );
            })}
          </div>

          {!submitted ? (
            <Button 
              onClick={handleSubmit} 
              disabled={selected === null}
              className="w-full"
            >
              Submit
            </Button>
          ) : !isLastQuestion ? (
            <Button onClick={handleNext} className="w-full">
              Next Question
            </Button>
          ) : (
            <>
              <p className="mb-4 text-lg font-semibold">
                Mission Complete! Your score: {score} / {questions.length}
              </p>
              <div className="flex justify-between">
                <Button onClick={handleReset} variant="outline">Retry Mission</Button>
                <Button onClick={onClose}>Close</Button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
