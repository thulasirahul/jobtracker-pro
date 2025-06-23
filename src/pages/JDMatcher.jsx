import React, { useState } from "react";
import { db, auth } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
const stopwords = new Set([
  "the", "and", "with", "for", "you", "that", "are", "will", "this", "your",
  "our", "have", "has", "from", "not", "all", "any", "but", "can", "should",
  "been", "more", "than", "per", "each", "their", "who", "able", "must",
  "an", "of", "a", "to", "in", "on", "by", "as", "is", "or", "be", "at", "we"
]);

export default function JDMatcher() {
  const [jdText, setJdText] = useState("");
  const [keywords, setKeywords] = useState([]);
  const [loading, setLoading] = useState(false);

  const extractKeywords = (text) => {
    const words = text
      .toLowerCase()
      .replace(/[^a-zA-Z0-9\s]/g, "")
      .split(/\s+/)
      .filter(word => word.length > 2 && !stopwords.has(word));

    const freq = {};
    words.forEach(word => {
      freq[word] = (freq[word] || 0) + 1;
    });

    return Object.entries(freq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 15)
      .map(entry => entry[0]);
  };

  const handleExtract = async () => {
    if (!jdText.trim()) {
      alert("Please paste a job description.");
      return;
    }

    if (!auth.currentUser) {
      alert("Please login to extract keywords.");
      return;
    }

    setLoading(true);
    const extracted = extractKeywords(jdText);
    setKeywords(extracted);

    try {
      await addDoc(collection(db, "jd_keywords"), {
        userId: auth.currentUser.uid,
        jobText: jdText,
        keywords: extracted,
        createdAt: new Date(),
      });
    } catch (err) {
      console.error("Error saving keywords:", err);
      alert("Failed to save keywords to database.");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 min-h-screen flex flex-col justify-center items-center text-white">
      <div className="w-full bg-blue-950 bg-opacity-20 p-6 rounded-xl shadow-xl">
        <h2 className="text-3xl font-bold mb-4 text-blue-400">🧠 JD Keyword Extractor</h2>

        <textarea
          rows={8}
          value={jdText}
          onChange={(e) => setJdText(e.target.value)}
          placeholder="Paste Job Description here..."
          className="w-full p-3 border border-zinc-700 rounded mb-4 bg-zinc-900 text-white resize-none"
        />

        <button
          onClick={handleExtract}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Extracting..." : "Extract Keywords"}
        </button>

        {keywords.length > 0 && (
          <div className="mt-6 bg-zinc-900 bg-opacity-70 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2 text-blue-300">🔑 Extracted Keywords:</h3>
            <ul className="list-disc list-inside text-blue-200">
              {keywords.map((kw, idx) => (
                <li key={idx}>{kw}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
