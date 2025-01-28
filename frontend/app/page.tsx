'use client';

import { useEffect, useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import QuestionList from './components/QuestionList';
import ProgressTracker from './components/ProgressTracker';
import { fetchData } from './services/api';

interface BackendData {
  data: string;
}

export default function Home() {
  const [data, setData] = useState<BackendData | null>(null);
  const [questions, setQuestions] = useState<string[]>([]);
  const [correctAnswers, setCorrectAnswers] = useState<number>(0);
  const [totalQuestions, setTotalQuestions] = useState<number>(0);
  const [selectedTopic, setSelectedTopic] = useState<string>('property valuation');
  const [revealedAnswers, setRevealedAnswers] = useState<{ [key: number]: boolean }>({});
  const [error, setError] = useState<string | null>(null);

  // Fetch questions from the backend
  const fetchQuestions = async () => {
    try {
      const response = await fetchData(`/api/questions?topic=${encodeURIComponent(selectedTopic)}`);
      setQuestions(response.questions);
      setRevealedAnswers({}); // Reset revealed answers when new questions are fetched
    } catch (err) {
      console.error(err);
      setError('Failed to fetch questions.');
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [selectedTopic]);

  // Handle user answers
  const handleAnswer = (questionIndex: number, selectedOption: string) => {
    setTotalQuestions((prev) => prev + 1); // Increment total questions

    const questionLines = questions[questionIndex]?.split("\n") || [];
    const correctAnswerLine = questionLines.find((line) => line.startsWith("Answer:"));

    if (!correctAnswerLine) {
      console.error(`Could not extract the correct answer for question ${questionIndex + 1}`);
      return;
    }

    const correctAnswerMatch = correctAnswerLine.match(/^Answer:\s([A-D])/); // Extract the letter (A, B, C, D)
    if (!correctAnswerMatch) {
      console.error(`Correct answer format is invalid for question ${questionIndex + 1}`);
      return;
    }

    const correctAnswer = correctAnswerMatch[1]; // Extracted correct answer (e.g., "C")

    // Update correct answers only if the selected answer matches
    if (selectedOption === correctAnswer) {
      setCorrectAnswers((prev) => prev + 1);
    } else {
      // Reveal the correct answer if the user gets it wrong
      setRevealedAnswers((prev) => ({ ...prev, [questionIndex]: true }));
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow p-4">
        <h1 className="text-2xl font-bold mb-4">Welcome to the Real Estate Exam AI!</h1>

        <div className="mb-4">
          <label htmlFor="topic" className="block text-lg font-semibold mb-2">
            Select Topic:
          </label>
          <select
            id="topic"
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e.target.value)}
            className="p-2 border border-gray-300 rounded-lg"
          >
            <option value="property valuation">Property Valuation</option>
            <option value="real estate contracts">Real Estate Contracts</option>
            <option value="agency relationships">Agency Relationships</option>
            <option value="land use controls">Land Use Controls</option>
          </select>
        </div>

        <ProgressTracker correct={correctAnswers} total={totalQuestions} />

        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4">
            <p>{error}</p>
          </div>
        )}

        <QuestionList
          questions={questions}
          onAnswer={handleAnswer}
          revealedAnswers={revealedAnswers}
        />
      </main>
      <Footer />
    </div>
  );
}
