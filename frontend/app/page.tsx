'use client';

import { useEffect, useState } from 'react';
import GeneratedQuestion from './components/GeneratedQuestion';
import QuestionList from './components/QuestionList';
import Header from './components/Header';
import Footer from './components/Footer';
import ProgressTracker from './components/ProgressTracker';
import { fetchData } from './services/api';

interface BackendData {
  data: string;
}

export default function Home() {
  const [data, setData] = useState<BackendData | null>(null);
  const [questions, setQuestions] = useState<string[]>([]);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [correctAnswers, setCorrectAnswers] = useState<number>(0);
  const [totalQuestions, setTotalQuestions] = useState<number>(0);

  const fetchInitialData = async () => {
    try {
      const backendData = await fetchData('/api/data');
      setData(backendData);

      const questionData = await fetchData('/api/questions?topic=general');
      setQuestions(questionData.questions);

      // Reset progress
      setCorrectAnswers(0);
      setTotalQuestions(0);
      setUserAnswers(new Array(questionData.questions.length).fill(''));
    } catch (error) {
      console.error('Error loading initial data:', error);
    }
  };

  const handleAnswer = (questionIndex: number, selectedOption: string) => {
    if (!questions || !questions[questionIndex]) {
      console.error(`Question at index ${questionIndex} is not valid.`);
      return;
    }

    const questionText = questions[questionIndex];
    const correctAnswerLine = questionText
      .split('\n')
      .find((line) => line.startsWith('Answer:'));

    if (!correctAnswerLine) {
      console.error(`Could not find the correct answer for question ${questionIndex + 1}`);
      return;
    }

    const correctAnswer = correctAnswerLine.replace('Answer:', '').trim().toLowerCase();
    const isCorrect = selectedOption.trim().toLowerCase() === correctAnswer;

    setTotalQuestions((prev) => prev + 1);
    if (isCorrect) {
      setCorrectAnswers((prev) => prev + 1);
    }

    setUserAnswers((prev) => {
      const updated = [...prev];
      updated[questionIndex] = selectedOption.trim();
      return updated;
    });
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow p-4">
        <h1 className="text-2xl font-bold mb-4">Welcome to the Real Estate Exam AI!</h1>

        <ProgressTracker correct={correctAnswers} total={totalQuestions} />

        <QuestionList
          questions={questions}
          onAnswer={handleAnswer}
          userAnswers={userAnswers}
        />
      </main>
      <Footer />
    </div>
  );
}
