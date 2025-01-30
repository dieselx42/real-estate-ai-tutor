import React, { useEffect } from "react";

interface QuestionListProps {
  questions: string[];
  onAnswer: (index: number, selectedOption: string) => void;
  userAnswers: string[];
}

const QuestionList: React.FC<QuestionListProps> = ({ questions, onAnswer, userAnswers }) => {
  useEffect(() => {
    console.log("✅ UI Updated: Checking latest answer states", userAnswers);
  }, [userAnswers]);

  return (
    <div className="space-y-6">
      {questions.map((question, index) => {
        // Extract question text
        const questionText = question.split("\n").find((line) => line.startsWith("Question:")) || "Unknown Question";

        // Extract answer options
        const options = question
          .split("\n")
          .filter((line) => /^[A-D]\./.test(line)) // Finds lines starting with A., B., C., D.
          .map((line) => line.trim());

        // Extract correct answer
        const correctAnswerLine = question.split("\n").find((line) => line.toLowerCase().startsWith("answer:"));
        const correctAnswerMatch = correctAnswerLine?.replace(/answer:\s*/i, "").trim().match(/^([A-D])/i);
        const correctAnswer = correctAnswerMatch ? correctAnswerMatch[1].toUpperCase() : "";

        // Get user's selected answer
        const userAnswer = userAnswers[index] || "";

        return (
          <div key={index} className="border p-4 rounded-md shadow">
            <p className="font-semibold">{questionText}</p>

            <div className="mt-2 space-y-2">
              {options.map((option) => {
                const optionLetter = option.charAt(0).toUpperCase(); // Extract A, B, C, D
                return (
                  <button
                    key={option}
                    onClick={() => onAnswer(index, optionLetter)}
                    className={`block w-full text-left px-4 py-2 border rounded-md ${
                      userAnswer === optionLetter
                        ? userAnswer === correctAnswer
                          ? "bg-green-300 text-green-800 border-green-500" // ✅ Correct (Green)
                          : "bg-red-300 text-red-800 border-red-500" // ❌ Incorrect (Red)
                        : "bg-white text-black border-gray-300 hover:bg-gray-100"
                    }`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>

            {/* ✅ Correct Answer Display */}
            {userAnswer && (
              <p className={`mt-2 font-semibold ${userAnswer === correctAnswer ? "text-green-600" : "text-red-600"}`}>
                {userAnswer === correctAnswer
                  ? `✅ Correct Answer: ${correctAnswer}`
                  : `❌ Correct Answer: ${correctAnswer}`}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default QuestionList;
