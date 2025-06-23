import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { signOut } from "firebase/auth";

const navLinks = [
  { name: "Dashboard", path: "/dashboard" },
  { name: "Job Tracker", path: "/tracker" },
  { name: "Resume Analyzer", path: "/analyzer" },
  { name: "Keyword Finder", path: "/matcher" },
  { name: "Resume Matcher", path: "/resume-match" },
];

export default function Navbar() {
  const location = useLocation();
  const [user] = useAuthState(auth);
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleLogout = async () => {
    await signOut(auth);
    setShowConfirm(false);
    navigate("/");
  };

  return (
    <nav className="bg-zinc-900 text-white px-6 py-4 shadow-md sticky top-0 z-50">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="text-2xl font-bold text-blue-400">JobTracker Pro</div>

        {user ? (
          <div className="flex gap-6 items-center relative">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`hover:text-blue-400 transition duration-200 ${
                  location.pathname === link.path
                    ? "text-blue-500 underline underline-offset-4"
                    : ""
                }`}
              >
                {link.name}
              </Link>
            ))}
            <div className="relative">
              <button
                onClick={() => setShowConfirm(!showConfirm)}
                className="text-sm px-3 py-1 bg-red-500 rounded hover:bg-red-600"
              >
                Logout
              </button>

              {showConfirm && (
                <div className="absolute right-0 mt-2 bg-zinc-800 border border-zinc-700 rounded shadow-md z-50 w-48">
                  <p className="px-4 py-2 text-sm text-center">
                    Are you sure?
                  </p>
                  <div className="flex justify-around pb-2">
                    <button
                      onClick={handleLogout}
                      className="text-green-400 hover:underline"
                    >
                      Yes
                    </button>
                    <button
                      onClick={() => setShowConfirm(false)}
                      className="text-red-400 hover:underline"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <Link
            to="/auth"
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white text-sm"
          >
            Start Now
          </Link>
        )}
      </div>
    </nav>
  );
}
