'use client';

import { useEffect, useState } from "react";
import GeneratedQuestion from "./components/GeneratedQuestion";
import QuestionList from "./components/QuestionList";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { fetchData } from "./services/api";

const topics = ["general real estate", "property valuation", "contracts", "financing"];

export default function Home() {
  const [data, setData] = useState(null);
  const [questions, setQuestions] = useState<string[]>([]);
  const [selectedTopic, setSelectedTopic] = useState("general real estate");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetchData(`/api/questions?topic=${encodeURIComponent(selectedTopic)}`);
        setQuestions(response.questions);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch questions.");
      }
    };

    fetchQuestions();
  }, [selectedTopic]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow p-4">
        <h1 className="text-2xl font-bold mb-4">Welcome to the Real Estate AI Tutor!</h1>

        <div className="mb-4">
          <label htmlFor="topic" className="block text-sm font-medium mb-2">Select Topic:</label>
          <select
            id="topic"
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e.target.value)}
            className="p-2 border rounded-md bg-white text-gray-800"
          >
            <option value="" disabled className="text-gray-400">Choose a topic...</option>
            {topics.map((topic) => (
              <option key={topic} value={topic}>
                {topic}
              </option>
            ))}
          </select>
        </div>

        {error ? (
          <div className="text-red-500">{error}</div>
        ) : (
          <QuestionList questions={questions} />
        )}
      </main>
      <Footer />
    </div>
  );
}
