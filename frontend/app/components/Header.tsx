import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-blue-600 text-white p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">Real Estate Exam AI</h1>
        <nav>
          <Link href="/" className="mr-4 hover:underline">
            Home
          </Link>
          <Link href="/profile" className="hover:underline">
            Profile
          </Link>
        </nav>
      </div>
    </header>
  );
}
