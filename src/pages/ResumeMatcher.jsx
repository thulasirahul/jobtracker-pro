import React, { useState } from "react";
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";
import { db, auth } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.js",
  import.meta.url
).toString();

const stopwords = new Set([
  "the", "and", "with", "for", "you", "that", "are", "will", "this", "your",
  "our", "have", "has", "from", "not", "all", "any", "but", "can", "should",
  "been", "more", "than", "per", "each", "their", "who", "able", "must",
  "an", "of", "a", "to", "in", "on", "by", "as", "is", "or", "be", "at", "we"
]);

function tokenize(text) {
  return text
    .toLowerCase()
    .replace(/[^a-zA-Z0-9\s]/g, "")
    .split(/\s+/)
    .filter(word => word.length > 2 && !stopwords.has(word));
}

export default function ResumeMatcher() {
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [matchScore, setMatchScore] = useState(null);
  const [matchedKeywords, setMatchedKeywords] = useState([]);
  const [loading, setLoading] = useState(false);

  const extractPDFText = async (file) => {
    const buffer = await file.arrayBuffer();
    const pdf = await getDocument({ data: buffer }).promise;

    let text = "";
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      text += content.items.map((item) => item.str).join(" ") + " ";
    }

    return text;
  };

  const handleMatch = async () => {
    if (!resumeFile || !jobDescription.trim()) {
      return alert("Please upload resume and enter job description.");
    }
    if (!auth.currentUser) {
      return alert("Please login to match resume.");
    }

    try {
      setLoading(true);
      const resumeText = await extractPDFText(resumeFile);
      const resumeTokens = tokenize(resumeText);
      const jdTokens = tokenize(jobDescription);

      const jdSet = new Set(jdTokens);
      const matched = resumeTokens.filter((token) => jdSet.has(token));
      const uniqueMatches = [...new Set(matched)];

      const score = Math.min(
        100,
        Math.round((uniqueMatches.length / jdSet.size) * 180)
      );

      setMatchScore(score);
      setMatchedKeywords(uniqueMatches);

      await addDoc(collection(db, "matches"), {
        userId: auth.currentUser.uid,
        jobDescription,
        matchedKeywords: uniqueMatches,
        matchScore: score,
        createdAt: new Date(),
      });

    } catch (err) {
      console.error("Resume match failed:", err);
      alert("Failed to process PDF. Try another file.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 min-h-screen text-white flex flex-col justify-center">
      <h1 className="text-4xl font-bold text-center text-blue-400 mb-8">
        🎯 Resume Matcher
      </h1>

      <div className="bg-blue-950 bg-opacity-30 rounded-xl p-6 shadow-lg">
        <div className="space-y-4 mb-6">
          <div>
            <label className="block mb-1 text-sm font-semibold text-zinc-300">
              Upload Resume (PDF):
            </label>
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => setResumeFile(e.target.files[0])}
              className="w-full p-2 rounded border border-zinc-600 bg-zinc-800 text-white"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-semibold text-zinc-300">
              Paste Job Description:
            </label>
            <textarea
              rows={6}
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste job description here..."
              className="w-full p-3 rounded border border-zinc-600 bg-zinc-800 text-white resize-none"
            />
          </div>

          <button
            onClick={handleMatch}
            disabled={loading}
            className="w-full py-3 rounded bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition text-white font-semibold disabled:opacity-50"
          >
            {loading ? "Matching..." : "Match Resume"}
          </button>
        </div>

        {matchScore !== null && !loading && (
          <div className="mt-6 text-center">
            <h2 className="text-2xl font-bold text-green-400">
              ✅ Match Score: {matchScore}%
            </h2>

            <p className="mt-4 text-sm text-zinc-400">Matched Keywords:</p>
            <div className="flex flex-wrap justify-center gap-2 mt-2">
              {matchedKeywords.map((word, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-full bg-green-700 text-white text-xs font-medium"
                >
                  {word}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
