import React, { useEffect, useState } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db, auth } from "../firebase";

export default function Dashboard() {
  const [counts, setCounts] = useState({
    total: 0,
    interview: 0,
    offer: 0
  });

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const q = query(collection(db, "applications"), where("userId", "==", user.uid));

    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => doc.data());
      setCounts({
        total: data.length,
        interview: data.filter(app => app.status === "Interview").length,
        offer: data.filter(app => app.status === "Offer").length
      });
    });

    return () => unsub();
  }, []);

  return (
    <div className="p-6 text-white min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-8 text-blue-400">📊 Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
        <div className="bg-blue-950 bg-opacity-30 p-6 rounded-xl shadow-md hover:scale-105 transition-transform">
          <h2 className="text-lg font-semibold text-blue-300">Total Applications</h2>
          <p className="text-3xl font-bold mt-2">{counts.total}</p>
        </div>

        <div className="bg-blue-950 bg-opacity-30 p-6 rounded-xl shadow-md hover:scale-105 transition-transform">
          <h2 className="text-lg font-semibold text-blue-300">Interviews Scheduled</h2>
          <p className="text-3xl font-bold mt-2">{counts.interview}</p>
        </div>

        <div className="bg-blue-950 bg-opacity-30 p-6 rounded-xl shadow-md hover:scale-105 transition-transform">
          <h2 className="text-lg font-semibold text-blue-300">Offers Received</h2>
          <p className="text-3xl font-bold mt-2">{counts.offer}</p>
        </div>
      </div>

      <div className="mt-10 w-full max-w-5xl bg-zinc-900 bg-opacity-50 p-6 rounded-xl shadow-md">
        <h3 className="text-2xl font-semibold mb-2 text-blue-400">📈 Insights</h3>
        <p className="text-gray-400">Charts and analytics will appear here soon.</p>
      </div>
    </div>
  );
}
