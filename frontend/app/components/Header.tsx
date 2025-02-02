"use client";

import { logout } from "../../utils/auth"; // ✅ Correct import path
import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/auth/login"); // ✅ Redirects to login page
  };

  return (
    <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
      {/* ✅ App Title */}
      <h1 className="text-xl font-bold cursor-pointer" onClick={() => router.push("/")}>
        Real Estate AI Tutor
      </h1>

      {/* ✅ Navigation Buttons */}
      <nav className="flex space-x-4">
        <button className="menu-button" onClick={() => router.push("/dashboard")}>
          Dashboard
        </button>
        <button className="menu-button" onClick={() => router.push("/exams")}>
          Exams
        </button>
        <button className="menu-button" onClick={() => router.push("/leaderboard")}>
          Leaderboard
        </button>
      </nav>

      {/* ✅ Logout Button */}
      <button onClick={handleLogout} className="logout-button">
        Logout
      </button>
    </header>
  );
}
