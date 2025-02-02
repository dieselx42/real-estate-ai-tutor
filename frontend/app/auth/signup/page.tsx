"use client";

import { useState } from "react";
import { signup } from "../../../utils/auth"; // Ensure this path is correct
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await signup(email, password);

    if (result.error) {
      setError(result.error);
    } else {
      router.push("/dashboard"); // ✅ Redirect after successful signup
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold">Sign Up</h1>
      {error && <p className="text-red-600">{error}</p>}
      <form onSubmit={handleSignup} className="space-y-4 w-80">
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}
          className="border p-2 rounded-md w-full" required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}
          className="border p-2 rounded-md w-full" required />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md w-full">Sign Up</button>
      </form>
      <p className="mt-2">Already have an account? <a href="/auth/login" className="text-blue-500">Login</a></p>
    </div>
  );
}
