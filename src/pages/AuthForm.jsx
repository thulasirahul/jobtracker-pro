import React, { useState } from "react";
import { auth } from "../firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function AuthForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    try {
      if (isSignup) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      navigate("/");
    } catch (err) {
      console.error(err);
      if (err.code === "auth/invalid-email") {
        setErrorMsg("Invalid email address.");
      } else if (err.code === "auth/user-not-found" || err.code === "auth/wrong-password") {
        setErrorMsg("Email or password is incorrect.");
      } else if (err.code === "auth/email-already-in-use") {
        setErrorMsg("Email is already registered.");
      } else if (err.code === "auth/weak-password") {
        setErrorMsg("Password should be at least 6 characters.");
      } else {
        setErrorMsg("An unexpected error occurred.");
      }
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-20 bg-zinc-900 p-6 rounded-lg shadow-md text-white">
      <h2 className="text-2xl font-bold mb-6 text-center">
        {isSignup ? "Sign Up" : "Login"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 rounded bg-zinc-800 border border-zinc-600"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 rounded bg-zinc-800 border border-zinc-600"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded font-semibold"
        >
          {isSignup ? "Create Account" : "Login"}
        </button>

        {errorMsg && (
          <p className="text-red-500 text-sm mt-2 text-center">{errorMsg}</p>
        )}

        <p className="text-sm text-center mt-4">
          {isSignup ? "Already have an account?" : "New user?"}{" "}
          <button
            type="button"
            onClick={() => {
              setIsSignup(!isSignup);
              setErrorMsg("");
            }}
            className="text-blue-400 underline"
          >
            {isSignup ? "Login" : "Sign Up"}
          </button>
        </p>
      </form>
    </div>
  );
}
