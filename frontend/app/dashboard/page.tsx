"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "../../utils/firebaseConfig";
import { signOut } from "firebase/auth";
import {
  fetchUserProgress,
  fetchAIRecommendations, // ✅ FIXED IMPORT
  fetchUpcomingSessions,
} from "../../utils/api"; // Ensure it's properly imported

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [progress, setProgress] = useState({
    totalQuestions: 0,
    correctAnswers: 0,
    accuracy: 0,
    lastQuizTaken: "N/A",
  });
  const [recommendations, setRecommendations] = useState([]);
  const [studySessions, setStudySessions] = useState([]);
  const [streak, setStreak] = useState(0);
  const [performanceData, setPerformanceData] = useState([]);

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      router.push("/auth/login"); // Redirect if not logged in
    } else {
      setUser(currentUser);

      // Fetch user progress, recommendations, and sessions
      fetchUserProgress().then(setProgress);
      fetchAIRecommendations().then(setRecommendations);
      fetchUpcomingSessions().then(setStudySessions);
      
      // Generate dummy performance graph data
      setPerformanceData([
        { name: "Mon", accuracy: 60 },
        { name: "Tue", accuracy: 70 },
        { name: "Wed", accuracy: 80 },
        { name: "Thu", accuracy: 75 },
        { name: "Fri", accuracy: 90 },
        { name: "Sat", accuracy: 85 },
        { name: "Sun", accuracy: 95 },
      ]);
    }
  }, [router]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/auth/login");
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* 🔹 Header Section */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">📊 Dashboard</h1>
          <button onClick={handleLogout} className="bg-red-500 px-4 py-2 rounded-md">
            Logout
          </button>
        </div>

        {/* 🔹 User Info */}
        <div className="bg-gray-800 p-6 rounded-lg mb-6 text-center">
          <h2 className="text-2xl font-semibold">
            Welcome, {user?.email || "User"}! 🎉
          </h2>
          <p className="text-gray-400 mt-2">You're on a {streak}-day study streak! 🔥</p>
        </div>

        {/* 🔹 Performance Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-xl font-semibold">Total Questions</h3>
            <p className="text-2xl font-bold">{progress.totalQuestions}</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-xl font-semibold">Correct Answers</h3>
            <p className="text-2xl font-bold">{progress.correctAnswers}</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-xl font-semibold">Accuracy</h3>
            <p className="text-2xl font-bold">{progress.accuracy}%</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-xl font-semibold">Last Quiz</h3>
            <p className="text-2xl font-bold">{progress.lastQuizTaken}</p>
          </div>
        </div>

        {/* 🔹 Performance Graph */}
        <div className="bg-gray-800 p-6 mt-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-4">📈 Accuracy Over Time</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={performanceData}>
              <XAxis dataKey="name" stroke="#ccc" />
              <YAxis stroke="#ccc" />
              <Tooltip />
              <Line type="monotone" dataKey="accuracy" stroke="#4CAF50" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* 🔹 AI-Powered Recommendations */}
        <div className="bg-gray-800 p-6 mt-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-4">🎯 Study Recommendations</h3>
          {recommendations.length > 0 ? (
            <ul className="list-disc list-inside">
              {recommendations.map((rec, index) => (
                <li key={index} className="text-gray-300">{rec}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400">No recommendations available. Keep practicing!</p>
          )}
        </div>

        {/* 🔹 Upcoming Study Sessions */}
        <div className="bg-gray-800 p-6 mt-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-4">📅 Upcoming Study Sessions</h3>
          {studySessions.length > 0 ? (
            <ul className="list-disc list-inside">
              {studySessions.map((session, index) => (
                <li key={index} className="text-gray-300">{session}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400">No upcoming sessions. Set a new study reminder!</p>
          )}
        </div>

        {/* 🔹 Call-to-Actions */}
        <div className="grid grid-cols-2 gap-4 mt-6">
          <button className="bg-blue-500 text-white px-6 py-3 rounded-lg font-bold">
            📖 Take a New Quiz
          </button>
          <button className="bg-yellow-500 text-white px-6 py-3 rounded-lg font-bold">
            📜 Review Past Results
          </button>
        </div>
      </div>
    </div>
  );
}
