import { useState } from "react";
import InfoForm from "./components/InfoForm";
import Quiz from "./components/Quiz";
import Admin from "./pages/Admin";
import API_BASE from "./api"; // <-- new import

const App = () => {
  const [info, setInfo] = useState(null);
  const [submitted, setSubmitted] = useState(null);

  // NEW: submitting state for overlay
  const [submitting, setSubmitting] = useState(false);

  const handleNext = (form) => {
    setInfo(form);
  };

  const waitForHealthy = async (timeoutMs = 120000) => {
    const start = Date.now();
    let attempt = 0;
    const healthUrl = `${API_BASE}/health`;
    while (Date.now() - start < timeoutMs) {
      attempt++;
      try {
        const r = await fetch(healthUrl, { cache: "no-store" });
        if (r.ok) return true;
        // if 429 or other non-ok, fall through to wait
      } catch (e) {
        // network error — treat as not ready
      }
      // exponential backoff capped at 10s
      const delay = Math.min(2000 * attempt, 10000);
      await new Promise((res) => setTimeout(res, delay));
    }
    return false;
  };

  const handleSubmit = async (answersArray) => {
    setSubmitting(true);
    try {
      const healthy = await waitForHealthy(120000); // wait up to 2 minutes
      if (!healthy) {
        alert("Server is busy. Please try again later.");
        setSubmitting(false);
        return;
      }

      const payload = { ...info, answers: answersArray };
      const url = `${API_BASE}/api/students`;
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`Submit failed (${res.status}) ${text}`);
      }

      const data = await res.json();
      setSubmitted(data);
      setInfo(null);
    } catch (err) {
      console.error(err);
      alert("Submission failed: " + (err.message || "unknown"));
    } finally {
      setSubmitting(false);
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
        </div>
      </header>

      <main className="p-4 max-w-5xl mx-auto">
        {!info && !submitted && <InfoForm onNext={handleNext} />}
        {info && !submitted && (
          <Quiz onSubmit={handleSubmit} onBack={() => setInfo(null)} />
        )}
        {submitted && (
          <>
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
          </>
        )}
      </main>

      {/* NEW: blocking overlay while waiting / submitting */}
      {submitting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow text-center max-w-sm">
            <div className="font-semibold mb-2">Submitting — please wait</div>
            <div className="text-sm text-gray-600">
              The server is busy; we'll submit as soon as it can accept
              requests.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
