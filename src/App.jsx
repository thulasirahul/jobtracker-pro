import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AppRoutes from "./router";
import "./index.css";

export default function App() {
  return (
    <Router>
      <div className="relative min-h-screen overflow-hidden">
        <div className="subtle-bg" />
        <Navbar />
        <AppRoutes />
        <Footer />
      </div>
    </Router>
  );
}
