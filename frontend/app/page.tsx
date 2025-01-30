"use client";

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

export default function Home() {
  const [data, setData] = useState<BackendData | null>(null);
  const [questions, setQuestions] = useState<string[]>([]);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [correctAnswers, setCorrectAnswers] = useState<number>(0);
  const [totalQuestions, setTotalQuestions] = useState<number>(0);

  const fetchInitialData = async () => {
    try {
      console.log("Clearing cached user answers...");
      localStorage.removeItem("userAnswers"); // Clears stored selections to prevent cache issues

      console.log("Fetching initial data...");
      const backendData = await fetchData("/data");
      setData(backendData);

      const questionData = await fetchQuestions("general");
      console.log("Fetched Questions:", questionData);

      if (questionData.questions && questionData.questions.length > 0) {
        setQuestions(questionData.questions);
        setUserAnswers(new Array(questionData.questions.length).fill(""));
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

const handleAnswer = (questionIndex: number, selectedOption: string) => {
  if (!questions || !questions[questionIndex]) {
    console.error(`❌ Question at index ${questionIndex} is not valid.`);
    return;
  }

  const questionText = questions[questionIndex];

  // Find the correct answer line
  const correctAnswerLine = questionText
    .split("\n")
    .find((line) => line.toLowerCase().startsWith("answer:"));

  if (!correctAnswerLine) {
    console.error(`❌ Could not find the correct answer for question ${questionIndex + 1}`);
    return;
  }

  // ✅ Extract only the first letter (A, B, C, D)
  const correctAnswerMatch = correctAnswerLine.replace(/answer:\s*/i, "").trim().match(/^([A-D])/i);
  const correctAnswer = correctAnswerMatch ? correctAnswerMatch[1].toUpperCase() : "";

  // ✅ Extract only the letter from the user's selected answer (A, B, C, D)
  const userAnswerMatch = selectedOption.match(/^([A-D])/i);
  const userAnswer = userAnswerMatch ? userAnswerMatch[1].toUpperCase() : "";

  console.log(`🟢 User Selected: '${userAnswer}', Extracted Correct Answer: '${correctAnswer}'`);

  const isCorrect = userAnswer === correctAnswer;

  // ✅ Force React to update the state immediately
  setUserAnswers((prev) => {
    const updated = [...prev];
    updated[questionIndex] = userAnswer;
    return updated;
  });

  setTotalQuestions((prev) => prev + 1);
  if (isCorrect) {
    setCorrectAnswers((prev) => prev + 1);
  }

  // ✅ Force a re-render by setting state again to confirm update
  setTimeout(() => {
    setUserAnswers((prev) => [...prev]);
  }, 10);
};



  useEffect(() => {
    fetchInitialData();
  }, []); // ✅ Properly placed useEffect()

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
