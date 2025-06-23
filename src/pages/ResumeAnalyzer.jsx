import React, { useState } from "react";
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";
import { db, auth } from "../firebase";
import { collection, addDoc } from "firebase/firestore";

GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.js",
  import.meta.url
).toString();

export default function ResumeAnalyzer() {
  const [file, setFile] = useState(null);
  const [summary, setSummary] = useState(null);
  const [contact, setContact] = useState({});
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setSummary(null);
    setContact({});
  };

  const extractTextFromPDF = async (pdfFile) => {
    const buffer = await pdfFile.arrayBuffer();
    const pdf = await getDocument({ data: buffer }).promise;
    let text = "";

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const pageText = content.items.map((item) => item.str).join(" ");
      text += pageText + "\n";
    }

    return text;
  };

  const extractSummaryPoints = (text) => {
    const lines = text.split(/\n|\.|\u2022|\*/).map((l) => l.trim()).filter(Boolean);

    const skills = lines.filter((l) => /python|java|c\+\+|react|node|sql|html|css|javascript/i.test(l)).slice(0, 2);
    const projects = lines.filter((l) => /project|built|developed|accuracy|model/i.test(l)).slice(0, 2);
    const education = lines.find((l) => /b\.e|btech|cgpa|degree|college/i.test(l));
    const experience = lines.find((l) => /intern|experience|worked|cyber/i.test(l));

    const summaryLines = [
      ...skills.map((s) => `✔️ ${s}`),
      ...projects.map((p) => `🚀 ${p}`),
      education && `🎓 ${education}`,
      experience && `💼 ${experience}`,
    ].filter(Boolean).slice(0, 6);

    return summaryLines;
  };

  const extractContactInfo = (text) => {
    return {
      email: text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)?.[0] || "Not Found",
      phone: text.match(/\+?\d[\d\s()-]{8,}/)?.[0] || "Not Found",
      linkedin: text.match(/(https?:\/\/)?(www\.)?linkedin\.com\/in\/[^\s)]+/)?.[0] || "Not Found",
      github: text.match(/(https?:\/\/)?(www\.)?github\.com\/[^\s)]+/)?.[0] || "Not Found",
    };
  };

  const handleAnalyze = async () => {
    if (!file || !auth.currentUser) return alert("Please upload a resume PDF.");

    try {
      setLoading(true);
      const text = await extractTextFromPDF(file);
      const summaryPoints = extractSummaryPoints(text);
      const contactInfo = extractContactInfo(text);

      setSummary(summaryPoints);
      setContact(contactInfo);

      await addDoc(collection(db, "resumes"), {
        userId: auth.currentUser.uid,
        summary: summaryPoints,
        contact: contactInfo,
        uploadedAt: new Date(),
      });

    } catch (err) {
      console.error("PDF analysis failed:", err);
      alert("❌ Failed to analyze the PDF.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 text-white min-h-screen flex flex-col items-center justify-center bg-transparent">
      <h2 className="text-3xl font-bold mb-6 text-blue-300">📄 Resume Analyzer</h2>
      <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
        <label className="w-full sm:w-auto flex items-center justify-center px-4 py-2 bg-zinc-800 text-white rounded-lg border border-zinc-600 cursor-pointer hover:bg-zinc-700 transition">
          <span>Choose File</span>
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>

        <button
          onClick={handleAnalyze}
          className="bg-blue-600 px-6 py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
          disabled={!file || loading}
        >
          {loading ? "Analyzing..." : "Analyze Resume"}
        </button>
      </div>
      {Object.keys(contact).length > 0 && (
        <div className="mt-6 w-full bg-blue-100 dark:bg-blue-900/30 text-black dark:text-white p-4 rounded-xl shadow-lg border border-blue-300/40">
          <h3 className="text-xl font-semibold mb-2">📇 Contact Info</h3>
          <p><strong>Email:</strong> {contact.email}</p>
          <p><strong>Phone:</strong> {contact.phone}</p>
          <p><strong>LinkedIn:</strong> {contact.linkedin}</p>
          <p><strong>GitHub:</strong> {contact.github}</p>
        </div>
      )}

      {summary && (
        <div className="mt-6 w-full bg-blue-100 dark:bg-blue-900/30 text-black dark:text-white p-6 rounded-xl shadow-lg border border-blue-300/40">
          <h3 className="text-2xl font-semibold mb-4">📌 Summary</h3>
          <ul className="list-disc list-inside space-y-2">
            {summary.map((point, i) => (
              <li key={i}>{point}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
