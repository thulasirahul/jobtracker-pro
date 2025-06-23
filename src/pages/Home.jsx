import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="relative overflow-hidden min-h-screen flex flex-col items-center justify-center text-white bg-gradient-to-br from-zinc-900 to-black px-6">
      <div className="blob bg-blue-500 w-96 h-96 top-10 left-[-100px]"></div>
      <div className="blob bg-purple-500 w-72 h-72 bottom-20 right-[-80px]"></div>
      <div className="blob bg-pink-500 w-80 h-80 top-1/3 right-[-100px]"></div>
      <div className="z-10 text-center max-w-xl">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4">Welcome to JobTracker Pro</h1>
        <p className="text-gray-300 text-lg mb-8">
          Track your job applications, optimize resumes, and land your dream job — all in one place.
        </p>
        <Link
          to="/auth"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded text-lg transition"
        >
          Start Now
        </Link>
      </div>
    </div>
  );
}
