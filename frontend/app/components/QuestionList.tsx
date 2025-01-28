interface QuestionListProps {
  questions: string[];
  onAnswer: (questionIndex: number, selectedOption: string) => void;
  revealedAnswers: { [key: number]: boolean };
}

export default function QuestionList({ questions, onAnswer, revealedAnswers }: QuestionListProps) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Real Estate Questions:</h2>
      {questions.length > 0 ? (
        <ul className="list-disc list-inside">
          {questions.map((questionText, index) => {
            const lines = questionText.split("\n");
            const mainQuestion = lines[0];
            const options = lines.slice(1, 5); // Assume options are always on lines 1-4
            const correctAnswerLine = lines.find((line) => line.startsWith("Answer:"));
            const correctAnswer = correctAnswerLine?.match(/^Answer:\s([A-D])/)?.[1];

            return (
              <li key={index} className="mb-4">
                <p>{mainQuestion}</p>
                <ul>
                  {options.map((option, optIndex) => (
                    <li key={optIndex}>
                      <button
                        className="bg-blue-500 text-white px-4 py-2 rounded mt-2 hover:bg-blue-600"
                        onClick={() => onAnswer(index, option.trim()[0])} // Pass the letter (A, B, C, D)
                      >
                        {option}
                      </button>
                    </li>
                  ))}
                </ul>
                {revealedAnswers[index] && correctAnswer && (
                  <p className="mt-2 text-green-600 font-semibold">
                    Correct Answer: {correctAnswer}
                  </p>
                )}
              </li>
            );
          })}
        </ul>
      ) : (
        <p>No questions available.</p>
      )}
    </div>
  );
}
