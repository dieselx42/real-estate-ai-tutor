"use client";

import "../app/globals.css"; // ✅ Make sure this path is correct
import { useEffect, useState } from "react";
import GeneratedQuestion from "./components/GeneratedQuestion";
import QuestionList from "./components/QuestionList";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ProgressTracker from "./components/ProgressTracker";
import { fetchData, fetchQuestions } from "../utils/api";

interface BackendData {
  data: string;
}

interface Question {
  question: string;
  options: string[];
  answer: string;
}

export default function Home() {
  const [data, setData] = useState<BackendData | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [correctAnswers, setCorrectAnswers] = useState<number>(0);
  const [totalQuestions, setTotalQuestions] = useState<number>(0);
  const [correctAnswerKeys, setCorrectAnswerKeys] = useState<{ [key: number]: string }>({});

  const fetchInitialData = async () => {
    try {
      console.log("Clearing cached user answers...");
      localStorage.removeItem("userAnswers");

      console.log("Fetching initial data...");
      const backendData = await fetchData("/data");
      setData(backendData);

      const questionData = await fetchQuestions("general");
      console.log("Fetched Questions:", questionData);

      if (questionData.questions && questionData.questions.length > 0) {
        // ✅ Ensure the API returns structured question objects
        const structuredQuestions: Question[] = questionData.questions.map((q: any, index: number) => {
          if (q.question && Array.isArray(q.options) && q.answer) {
            return q; // Return as-is if structured properly
          } else {
            console.error(`❌ Unexpected question format at index ${index}:`, q);
            return null; // Prevents invalid questions from breaking rendering
          }
        }).filter(Boolean); // Remove null values

        setQuestions(structuredQuestions);
        setUserAnswers(new Array(structuredQuestions.length).fill(""));

        // ✅ Extract correct answers
        const extractedAnswers: { [key: number]: string } = {};
        structuredQuestions.forEach((q, index) => {
          extractedAnswers[index] = q.answer;
        });

        setCorrectAnswerKeys(extractedAnswers);
      } else {
        setQuestions([]);
        setUserAnswers([]);
      }

      setCorrectAnswers(0);
      setTotalQuestions(0);
    } catch (error) {
      console.error("Error loading initial data:", error);
    }
  };

  // ✅ Updated `handleAnswer` to match new question format
const handleAnswer = (questionIndex: number, selectedOption: string) => {
  console.log("🟢 Answer Clicked:", selectedOption);

  if (!questions || !questions[questionIndex]) {
    console.error(`❌ Question at index ${questionIndex} is not valid.`);
    return;
  }

  const correctAnswer = questions[questionIndex].answer;

  // ✅ Extract only the answer letter (A, B, C, D) from both selected and correct answers
  const extractAnswerLetter = (answer: string) => {
    const match = answer.match(/^[A-D]/); // Match the first letter (A, B, C, D)
    return match ? match[0] : ""; // Return the matched letter or empty string
  };

  const selectedAnswerLetter = extractAnswerLetter(selectedOption);
  const correctAnswerLetter = extractAnswerLetter(correctAnswer);

  const isCorrect = selectedAnswerLetter === correctAnswerLetter;

  console.log(`🟢 User Selected: '${selectedOption}', Correct Answer: '${correctAnswer}', Match: ${isCorrect}`);

  setUserAnswers((prev) => {
    const updated = [...prev];
    updated[questionIndex] = selectedOption;
    return updated;
  });

  if (isCorrect) {
    setCorrectAnswers((prev) => prev + 1);
  }

  setTotalQuestions((prev) => prev + 1);
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
          correctAnswers={correctAnswerKeys} // ✅ Pass structured answers
        />
      </main>
      <Footer />
    </div>
  );
}
