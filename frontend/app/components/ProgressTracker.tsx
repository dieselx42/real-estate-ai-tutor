"use client";

import React from "react";

interface ProgressTrackerProps {
  correct: number;
  total: number;
}

const ProgressTracker: React.FC<ProgressTrackerProps> = ({ correct, total }) => {
  const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;

  return (
    <div className="p-4 border rounded-lg shadow-md bg-white dark:bg-gray-900">
      <h2 className="text-lg font-bold mb-2 text-black dark:text-white">Progress</h2>

      <p className="text-md font-medium text-black dark:text-gray-300">
        <strong>Correct Answers:</strong> {correct}
      </p>
      <p className="text-md font-medium text-black dark:text-gray-300">
        <strong>Total Questions:</strong> {total}
      </p>
      <p className="text-md font-medium text-black dark:text-gray-300">
        <strong>Accuracy:</strong> {accuracy}%
      </p>
    </div>
  );
};

export default ProgressTracker;
