'use client';

import { useEffect, useState } from 'react';

interface BackendData {
  data: string;
}

interface QuestionsResponse {
  questions: string[];
}

interface GeneratedQuestionResponse {
  question: string;
}

export default function Home() {
  const [data, setData] = useState<BackendData | null>(null);
  const [questions, setQuestions] = useState<string[]>([]);
  const [generatedQuestion, setGeneratedQuestion] = useState<string | null>(null);

  const fetchGeneratedQuestion = async () => {
    console.log('Fetching new question...');
    try {
      const response = await fetch('http://127.0.0.1:8000/api/generate-question');
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data: GeneratedQuestionResponse = await response.json();
      console.log('Data:', data);
      setGeneratedQuestion(data.question);
    } catch (error) {
      console.error('Error fetching generated question:', error);
    }
  };

  useEffect(() => {
    // Fetch data from the backend
    fetch('http://127.0.0.1:8000/api/data')
      .then((response) => response.json())
      .then((data: BackendData) => setData(data))
      .catch((error) => console.error('Error fetching data:', error));

    // Fetch questions from the backend
    fetch('http://127.0.0.1:8000/api/questions')
      .then((response) => response.json())
      .then((data: QuestionsResponse) => setQuestions(data.questions))
      .catch((error) => console.error('Error fetching questions:', error));

    // Fetch a generated question from the backend
    fetchGeneratedQuestion();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Welcome to the Real Estate Exam AI!</h1>
      {data ? (
        <p className="mb-4">Data from backend: {data.data}</p>
      ) : (
        <p className="mb-4">Loading...</p>
      )}

      <h2 className="text-xl font-semibold mb-2">Real Estate Questions:</h2>
      <ul className="list-disc list-inside mb-4">
        {questions.map((question, index) => (
          <li key={index} className="mb-1">{question}</li>
        ))}
      </ul>

      <h2 className="text-xl font-semibold mb-2">Generated Question:</h2>
      {generatedQuestion ? (
        <div className="bg-gray-100 p-4 rounded-lg mb-4">
          <pre className="whitespace-pre-wrap text-black">{generatedQuestion}</pre>
        </div>
      ) : (
        <p>Loading...</p>
      )}

      <button
        onClick={fetchGeneratedQuestion}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
      >
        Generate New Question
      </button>
    </div>
  );
}
