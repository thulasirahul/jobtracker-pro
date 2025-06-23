import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import {
  collection,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";

export default function JobTracker() {
  const [jobs, setJobs] = useState([]);
  const [newJob, setNewJob] = useState({
    company: "",
    role: "",
    status: "Applied",
    notes: "",
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    if (!auth.currentUser) return;

    const q = query(
      collection(db, "applications"),
      where("userId", "==", auth.currentUser.uid)
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const jobList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setJobs(jobList);
    });

    return () => unsub();
  }, []);

  const handleChange = (e) => {
    setNewJob({ ...newJob, [e.target.name]: e.target.value });
  };

  const handleAddJob = async () => {
    if (!newJob.company || !newJob.role) {
      alert("Company and Role are required.");
      return;
    }

    await addDoc(collection(db, "applications"), {
      ...newJob,
      userId: auth.currentUser.uid,
    });

    setNewJob({ company: "", role: "", status: "Applied", notes: "" });
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "applications", id));
  };

  const handleEdit = (job) => {
    setNewJob(job);
    setEditingId(job.id);
  };

  const handleUpdate = async () => {
    await updateDoc(doc(db, "applications", editingId), newJob);
    setEditingId(null);
    setNewJob({ company: "", role: "", status: "Applied", notes: "" });
  };

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6 text-white min-h-screen flex flex-col">
      <h2 className="text-4xl font-bold mb-6 text-blue-400">📁 Job Tracker</h2>

      <div className="bg-blue-950 bg-opacity-30 p-6 rounded-lg shadow-md mb-8">
        <div className="grid md:grid-cols-4 gap-4 mb-4">
          <input
            name="company"
            value={newJob.company}
            onChange={handleChange}
            placeholder="Company"
            className="p-2 rounded border border-zinc-600 bg-zinc-800 text-white"
          />
          <input
            name="role"
            value={newJob.role}
            onChange={handleChange}
            placeholder="Role"
            className="p-2 rounded border border-zinc-600 bg-zinc-800 text-white"
          />
          <select
            name="status"
            value={newJob.status}
            onChange={handleChange}
            className="p-2 rounded border border-zinc-600 bg-zinc-800 text-white"
          >
            <option value="Applied">Applied</option>
            <option value="Interview">Interview</option>
            <option value="Offer">Offer</option>
            <option value="Rejected">Rejected</option>
          </select>
          <button
            onClick={editingId ? handleUpdate : handleAddJob}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {editingId ? "Update Job" : "Add Job"}
          </button>
        </div>

        <textarea
          name="notes"
          value={newJob.notes}
          onChange={handleChange}
          placeholder="Notes..."
          className="w-full p-2 rounded border border-zinc-600 bg-zinc-800 text-white resize-none"
          rows={3}
        />
      </div>

      {jobs.length === 0 ? (
        <p className="text-gray-400 text-center">No jobs tracked yet.</p>
      ) : (
        <div className="grid gap-4">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="bg-zinc-800 p-4 rounded-lg shadow-md flex justify-between items-start hover:scale-[1.02] transition"
            >
              <div>
                <h3 className="text-xl font-bold text-blue-300">{job.company}</h3>
                <p className="text-sm text-gray-400">{job.role}</p>
                <p className="mt-2 text-sm"><strong>Status:</strong> {job.status}</p>
                <p className="mt-1 text-sm text-gray-300">{job.notes}</p>
              </div>
              <div className="space-x-2">
                <button
                  onClick={() => handleEdit(job)}
                  className="text-sm px-3 py-1 bg-yellow-400 text-black rounded hover:bg-yellow-500"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(job.id)}
                  className="text-sm px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
