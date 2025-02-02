"use client";

import React from "react";

interface Question {
  question: string;
  options: string[];
  answer: string;
}

interface QuestionListProps {
  questions: Question[];
  onAnswer: (index: number, selectedOption: string) => void;
  userAnswers: string[];
  correctAnswers: { [key: number]: string };
}

const QuestionList: React.FC<QuestionListProps> = ({
  questions,
  onAnswer,
  userAnswers,
  correctAnswers,
}) => {
  return (
    <div className="space-y-6">
      {questions.map((q, index) => {
        if (!q || typeof q !== "object" || !q.question || !q.options) {
          console.error(`❌ Invalid question format at index ${index}:`, q);
          return null;
        }

        return (
          <div key={index} className="p-4 border rounded-lg shadow-md bg-white dark:bg-gray-900">
            <h2 className="text-lg font-bold mb-2 text-foreground">{q.question}</h2>
            <div className="space-y-2">
              {q.options.map((option, optionIndex) => {
                const optionLetter = option.charAt(0).toUpperCase(); // Extract A, B, C, D
                const userAnswer = userAnswers[index]; // What the user selected
                const correctAnswer = correctAnswers[index]; // The correct answer letter

                const isSelected = userAnswer === option; // User selected this option
                const isCorrect = correctAnswer === optionLetter; // This option is correct
                const isWrongSelection = isSelected && !isCorrect; // User picked wrong

                const isAnswered = userAnswer !== ""; // If user answered

                return (
                  <button
                    key={optionIndex}
                    className={`answer-button 
                      ${isAnswered && isCorrect ? "answer-correct" : ""} 
                      ${isAnswered && isWrongSelection ? "answer-incorrect" : ""} 
                      ${!isAnswered ? "answer-neutral" : ""}`}
                    onClick={() => onAnswer(index, option)}
                    disabled={isAnswered}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default QuestionList;
