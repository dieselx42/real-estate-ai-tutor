export default function ProgressTracker({ correct, total }) {
  const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;

  return (
    <div className="bg-gray-100 p-4 rounded-md mb-4">
      <h3 className="text-lg font-semibold mb-2 text-gray-800">Progress</h3>
      <p className="text-gray-800">Correct Answers: {correct}</p>
      <p className="text-gray-800">Total Questions: {total}</p>
      <p className="text-gray-800">Accuracy: {percentage}%</p>
    </div>
  );
}