import { useState } from "react";
import InfoForm from "./components/InfoForm";
import Quiz from "./components/Quiz";
import Admin from "./pages/Admin";

// determine API base for local vs hosted usage
const getApiBase = () => {
  if (typeof window === "undefined") return "";
  const host = window.location.hostname;
  if (host === "localhost" || host === "127.0.0.1")
    return "http://localhost:5000";
  if (host === "pdc-quiz.onrender.com") return "https://pdc-quiz.onrender.com";
  // fallback to same origin (empty) so relative /api/* works
  return "";
};
const API_BASE = getApiBase();

const App = () => {
  const [info, setInfo] = useState(null);
  const [submitted, setSubmitted] = useState(null);

  const handleNext = (form) => {
    setInfo(form);
  };

  const handleSubmit = async (answersArray) => {
    try {
      const payload = { ...info, answers: answersArray };
      const url = (API_BASE || "") + "/api/students";
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      setSubmitted(data);
      setInfo(null);
    } catch (err) {
      console.error(err);
      alert("Submission failed");
    }
  };

  // Basic route handling (no react-router) — student UI at "/", admin at "/admin", else 404
  const path = typeof window !== "undefined" ? window.location.pathname : "/";

  if (path === "/admin") {
    return <Admin />;
  }

  if (path !== "/") {
    // simple 404
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-red-50 to-white p-6">
        <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6 text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-2">
            404 — Page not found
          </h1>
          <p className="text-sm text-gray-600">
            This page does not exist. Open the app root (/) to take the quiz.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <header className="p-4 bg-gradient-to-r from-indigo-600 to-sky-500 text-white shadow-sm">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="text-lg font-semibold">
            Personality Assessment Test (PDC)
          </div>
          {/* intentionally no Admin button — admin must open /admin manually */}
        </div>
      </header>

      <main className="p-4 max-w-5xl mx-auto">
        {!info && !submitted && <InfoForm onNext={handleNext} />}
        {info && !submitted && (
          <Quiz onSubmit={handleSubmit} onBack={() => setInfo(null)} />
        )}
        {submitted && (
          <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow">
            <h3 className="text-lg font-bold mb-2 text-green-700">
              Thank you — submission saved.
            </h3>
            <div className="text-sm text-gray-600">
              Student ID: {submitted._id}
            </div>
            <button
              onClick={() => setSubmitted(null)}
              className="mt-4 px-3 py-1 border rounded bg-indigo-600 text-white"
            >
              New submission
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
