import React, { useState, useEffect } from 'react';

interface QuestionListProps {
  questions: string[];
  onAnswer: (questionIndex: number, selectedOption: string) => void;
  userAnswers: string[];
}

export default function QuestionList({ questions, onAnswer, userAnswers }: QuestionListProps) {
  const [revealedAnswers, setRevealedAnswers] = useState<boolean[]>([]);

  useEffect(() => {
    setRevealedAnswers(new Array(questions.length).fill(false));
  }, [questions]);

  const handleAnswer = (questionIndex: number, selectedOption: string) => {
    const questionText = questions[questionIndex];
    const correctAnswerLine = questionText
      .split('\n')
      .find((line) => line.startsWith('Answer:'));

    if (!correctAnswerLine) {
      console.error(`Could not extract the correct answer for question ${questionIndex + 1}`);
      return;
    }

    const correctAnswer = correctAnswerLine.replace('Answer:', '').trim().toLowerCase();
    const selectedAnswer = selectedOption.trim().toLowerCase();
    const isCorrect = selectedAnswer === correctAnswer;

    setRevealedAnswers((prev) => {
      const updated = [...prev];
      updated[questionIndex] = true;
      return updated;
    });

    onAnswer(questionIndex, selectedOption.trim());
  };

  return (
    <div>
      <ul className="space-y-4">
        {questions.map((question, index) => {
          const [mainQuestion, ...options] = question.split('\n').filter((line) => !line.startsWith('Answer:'));
          const correctAnswerLine = question.split('\n').find((line) => line.startsWith('Answer:'));
          const correctAnswer = correctAnswerLine ? correctAnswerLine.replace('Answer:', '').trim().toLowerCase() : null;
          const userAnswer = userAnswers[index]?.trim().toLowerCase();

          return (
            <li key={index} className={`p-4 border rounded-lg ${revealedAnswers[index] ? (userAnswer === correctAnswer ? 'bg-green-100' : 'bg-red-100') : 'bg-gray-50'}`}>
              <p className="font-medium mb-2 text-black">{mainQuestion}</p>
              <ul className="mt-2 space-y-2">
                {options.map((option, optionIndex) => (
                  <li key={optionIndex}>
                    <button
                      onClick={() => handleAnswer(index, option.trim())}
                      className={`text-left block w-full p-2 rounded-md border ${
                        revealedAnswers[index] ? 'bg-gray-200' : 'bg-white'
                      } text-black hover:bg-blue-100`}
                      disabled={revealedAnswers[index]}
                    >
                      {option.trim()}
                    </button>
                  </li>
                ))}
              </ul>
              {revealedAnswers[index] && (
                <>
                  <p className="mt-2 text-black">
                    You selected: {userAnswers[index] || 'No answer selected'}
                  </p>
                  <p className={`mt-2 font-semibold ${userAnswer === correctAnswer ? 'text-green-600' : 'text-red-600'}`}>
                    {userAnswer === correctAnswer
                      ? `✅ Correct Answer: ${correctAnswer}`
                      : `❌ Correct Answer: ${correctAnswer}`}
                  </p>
                </>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
