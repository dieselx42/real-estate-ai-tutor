interface QuestionListProps {
  questions: string[];
}

export default function QuestionList({ questions = [] }: QuestionListProps) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Real Estate Questions:</h2>
      {questions && questions.length > 0 ? (
        <ul className="list-disc list-inside">
          {questions.map((question, index) => {
            const [mainQuestion, ...options] = question.split("\n");
            return (
              <li key={index} className="mb-4">
                <p className="font-semibold">{mainQuestion}</p>
                <ul className="list-none ml-4">
                  {options.map((option, idx) => (
                    <li key={idx} className="ml-2">{option}</li>
                  ))}
                </ul>
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