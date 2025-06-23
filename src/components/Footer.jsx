import React from "react";
import { FaGithub, FaLinkedin, FaEnvelope, FaPhone } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-zinc-900 text-white py-6 mt-10 border-t border-zinc-800">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-center md:text-left">
          <p className="text-lg font-semibold">⚙️ Built using React, Firebase, Tailwind CSS by Thulasi Rahul J</p>
          <p className="text-sm text-zinc-400">© {new Date().getFullYear()} All rights reserved.</p>
        </div>

        <div className="flex gap-6 items-center text-blue-400 text-xl">
          <a
            href="mailto:chotumandela@gmail.com"
            className="hover:text-blue-500 transition"
            title="Email"
          >
            <FaEnvelope />
          </a>
          <a
            href="tel:+917010510975"
            className="hover:text-blue-500 transition"
            title="Phone"
          >
            <FaPhone />
          </a>
          <a
            href="https://github.com/thulasirahul"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-500 transition"
            title="GitHub"
          >
            <FaGithub />
          </a>
          <a
            href="https://www.linkedin.com/in/thulasirahulj/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-500 transition"
            title="LinkedIn"
          >
            <FaLinkedin />
          </a>
        </div>
      </div>
    </footer>
  );
}
