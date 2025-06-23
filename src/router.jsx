import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import JobTracker from "./pages/JobTracker";
import ResumeAnalyzer from "./pages/ResumeAnalyzer";
import JDMatcher from "./pages/JDMatcher";
import ResumeMatcher from "./pages/ResumeMatcher";
import AuthForm from "./pages/AuthForm";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase";

export default function AppRoutes() {
  const [user, loading] = useAuthState(auth);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      {!user && <Route path="/auth" element={<AuthForm />} />}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/tracker"
        element={
          <ProtectedRoute>
            <JobTracker />
          </ProtectedRoute>
        }
      />
      <Route
        path="/analyzer"
        element={
          <ProtectedRoute>
            <ResumeAnalyzer />
          </ProtectedRoute>
        }
      />
      <Route
        path="/matcher"
        element={
          <ProtectedRoute>
            <JDMatcher />
          </ProtectedRoute>
        }
      />
      <Route
        path="/resume-match"
        element={
          <ProtectedRoute>
            <ResumeMatcher />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
