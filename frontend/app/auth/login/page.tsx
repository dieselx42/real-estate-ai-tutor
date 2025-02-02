"use client";

import { useState } from "react";
import { login } from "../../../utils/auth";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await login(email, password);

    if (result.error) {
      setError(result.error);
    } else {
      router.push("/dashboard"); // Redirect after successful login
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold">Login</h1>
      {error && <p className="text-red-600">{error}</p>}
      <form onSubmit={handleLogin} className="space-y-4">
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}
          className="border p-2 rounded-md w-full" required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}
          className="border p-2 rounded-md w-full" required />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md w-full">Login</button>
      </form>
      <p className="mt-2">Don't have an account? <a href="/auth/signup" className="text-blue-500">Sign Up</a></p>
    </div>
  );
}
