interface ProgressTrackerProps {
  correct: number;
  total: number;
}

export default function ProgressTracker({ correct, total }: ProgressTrackerProps) {
  const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;

  return (
    <div className="mt-4 p-4 bg-gray-100 rounded-lg">
      <h2 className="text-lg font-bold text-black">Progress</h2>
      <p className="text-black">Correct Answers: {correct}</p>
      <p className="text-black">Total Questions: {total}</p>
      <p className="text-black">Accuracy: {accuracy}%</p>
    </div>
  );
}
