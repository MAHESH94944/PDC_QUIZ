import { useEffect, useMemo, useState } from "react";
import questions from "../data/questions";
import API_BASE from "../api"; // ensure API base is used for fetches

export default function Admin() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(
    () => localStorage.getItem("admin_authed") === "1"
  );
  const [students, setStudents] = useState([]); // shallow list from /api/students
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);
  const [campusFilter, setCampusFilter] = useState("");

  const [allDetails, setAllDetails] = useState(null); // array of full student objects
  const [questionStats, setQuestionStats] = useState(null); // computed stats per question
  const [loadingStats, setLoadingStats] = useState(false);
  const [showStats, setShowStats] = useState(false);

  const ADMIN_PASSWORD = "admin@123"; // frontend-only as requested

  useEffect(() => {
    if (!authed) return;
    loadList();
    setSelected(null);
  }, [authed]);

  // use API_BASE prefix for fetch calls
  const prefix = API_BASE || "";

  // load list (uses campus now returned by backend)
  const loadList = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${prefix}/api/students`);
      const data = await res.json();
      setStudents(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e) => {
    e?.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setAuthed(true);
      localStorage.setItem("admin_authed", "1"); // persist across refresh
      setPassword("");
    } else {
      alert("Invalid password");
    }
  };

  const logout = () => {
    setAuthed(false);
    localStorage.removeItem("admin_authed");
    setSelected(null);
    window.location.href = "/"; // go back to student UI
  };

  const loadStudent = async (id) => {
    setLoading(true);
    try {
      const res = await fetch(`${prefix}/api/students/${id}`);
      const data = await res.json();
      if (data && data.answers)
        data.answers.sort(
          (a, b) => (a.questionIndex || 0) - (b.questionIndex || 0)
        );
      setSelected(data);
    } catch (err) {
      console.error(err);
      setSelected(null);
    } finally {
      setLoading(false);
    }
  };

  // derived campus options
  const campuses = useMemo(() => {
    const s = new Set(students.map((x) => x.campus).filter(Boolean));
    return Array.from(s);
  }, [students]);

  // filter by campus only, show all users (no pagination)
  const filtered = useMemo(() => {
    if (!campusFilter) return students.slice();
    return students.filter((s) => s.campus === campusFilter);
  }, [students, campusFilter]);

  // CSV helpers (same approach as before)
  const download = (filename, content, mime = "text/csv") => {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  // CSV builder: use full questions[] for headers (Q1 - question text)
  const makeCSV = (fullStudents) => {
    // use questions array length for consistent columns
    const qCount = questions.length;
    const qHeaders = questions.map((q, i) => `${i + 1} - ${q.text}`);
    const headers = [
      "id",
      "name",
      "email",
      "contact",
      "hometown",
      "gender",
      "campus",
      "branch",
      "createdAt",
      ...qHeaders,
    ];
    const headerLine = headers.map((h) => JSON.stringify(h)).join(",");
    const rows = fullStudents.map((s) => {
      const qmap = {};
      (s.answers || []).forEach((a) => {
        // place by questionIndex (preferred) or match by questionId -> find index
        let idx = null;
        if (a.questionIndex) idx = a.questionIndex - 1;
        else {
          const qi = questions.findIndex((qq) => qq.id === a.questionId);
          if (qi >= 0) idx = qi;
        }
        if (idx === null || idx === undefined || idx < 0 || idx >= qCount) {
          // skip or map to next available (but keep it simple)
        } else {
          qmap[idx] = a.answer || "";
        }
      });

      const qcols = Array.from({ length: qCount }, (_, i) =>
        JSON.stringify(qmap[i] || "")
      );
      return [
        JSON.stringify(s._id || ""),
        JSON.stringify(s.name || ""),
        JSON.stringify(s.email || ""),
        JSON.stringify(s.contact || ""),
        JSON.stringify(s.hometown || ""),
        JSON.stringify(s.gender || ""),
        JSON.stringify(s.campus || ""),
        JSON.stringify(s.branch || ""),
        JSON.stringify(s.createdAt || ""),
        ...qcols,
      ].join(",");
    });

    return [headerLine, ...rows].join("\n");
  };

  const exportAllCSV = async () => {
    if (
      !confirm(
        "Export full data for all students? This will fetch details for each student."
      )
    )
      return;
    setLoading(true);
    try {
      const details = await loadAllDetails();
      const csv = makeCSV(details);
      download(`students_all_${new Date().toISOString()}.csv`, csv);
    } catch (err) {
      console.error(err);
      alert("Export failed");
    } finally {
      setLoading(false);
    }
  };

  // NEW: export only the selected campus (use campusFilter)
  const exportPerCampusCSVs = async () => {
    if (!campusFilter) {
      alert("Please select a campus from the left filter before exporting.");
      return;
    }
    if (
      !confirm(
        `Export CSV for campus "${campusFilter}"? This will fetch full student details.`
      )
    )
      return;

    setLoading(true);
    try {
      const details = await loadAllDetails();
      const studentsForCampus = details.filter(
        (s) => (s.campus || "") === campusFilter
      );
      if (!studentsForCampus.length) {
        alert("No students found for the selected campus.");
        return;
      }
      const csv = makeCSV(studentsForCampus);
      const safeName =
        campusFilter.replace(/[^a-z0-9_\-]/gi, "_").slice(0, 50) || "campus";
      download(`students_${safeName}_${new Date().toISOString()}.csv`, csv);
    } catch (err) {
      console.error(err);
      alert("Export failed");
    } finally {
      setLoading(false);
    }
  };

  const avatarColor = (name) => {
    const colors = [
      "bg-indigo-500",
      "bg-rose-500",
      "bg-emerald-500",
      "bg-sky-500",
      "bg-violet-500",
    ];
    const n = (name || "").length;
    return colors[n % colors.length];
  };

  const selectedStats = useMemo(() => {
    if (!selected || !selected.answers) return null;
    const byCat = {};
    selected.answers.forEach((a) => {
      const cat = a.category || "Other";
      byCat[cat] = byCat[cat] || { total: 0, answered: 0 };
      byCat[cat].total += 1;
      if (a.answer) byCat[cat].answered += 1;
    });
    return byCat;
  }, [selected]);

  // fetch full details for all students and cache them
  const loadAllDetails = async () => {
    if (allDetails && Array.isArray(allDetails) && allDetails.length)
      return allDetails;
    setLoadingStats(true);
    try {
      const details = await Promise.all(
        students.map((s) =>
          fetch(`${prefix}/api/students/${s._id}`)
            .then((r) => r.json())
            .catch(() => null)
        )
      );
      const valid = details.filter(Boolean);
      setAllDetails(valid);
      return valid;
    } catch (err) {
      console.error(err);
      return [];
    } finally {
      setLoadingStats(false);
    }
  };

  // compute per-question counts using questions[] definitions
  const computeQuestionStats = (fullStudents) => {
    const stats = questions.map((q) => {
      const counts = {};
      q.options.forEach((opt) => (counts[opt] = 0));
      let unanswered = 0;

      fullStudents.forEach((stu) => {
        const ans = (stu.answers || []).find((a) => a.questionId === q.id);
        if (
          !ans ||
          ans.answer === null ||
          ans.answer === undefined ||
          ans.answer === ""
        ) {
          unanswered += 1;
        } else {
          const val = ans.answer;
          if (counts.hasOwnProperty(val)) counts[val] += 1;
          else {
            // if answer text doesn't match options, count under "Other"
            counts["Other"] = (counts["Other"] || 0) + 1;
          }
        }
      });

      return {
        id: q.id,
        category: q.category,
        text: q.text,
        options: q.options,
        counts,
        unanswered,
      };
    });

    setQuestionStats(stats);
    return stats;
  };

  // handler to prepare and show stats
  const handleShowStats = async () => {
    setShowStats(true);
    const full = await loadAllDetails();
    computeQuestionStats(full);
  };

  // helper to get question text by id
  const getQuestionText = (questionId, fallbackIndex) => {
    const q = questions.find((qq) => qq.id === questionId);
    if (q) return q.text;
    return `Question ${fallbackIndex || "?"}`;
  };

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-100 to-white p-6">
        <div className="w-full max-w-sm bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-2 text-indigo-700">
            Admin Login
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            Enter the admin password to view submissions.
          </p>
          <form onSubmit={handleLogin} className="space-y-3">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-200"
            />
            <div className="flex justify-between items-center">
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white rounded-md shadow"
              >
                Open Dashboard
              </button>
              <button
                type="button"
                onClick={() => (window.location.href = "/")}
                className="text-sm text-gray-500"
              >
                Back to quiz
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // main dashboard: simplified to campus filter, full list, CSV export
  return (
    <div className="min-h-screen p-4 bg-gradient-to-b from-sky-50 to-white">
      <div className="max-w-6xl mx-auto">
        <header className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-indigo-700">
              Admin Dashboard
            </h1>
            <p className="text-sm text-gray-600">
              View and export all student submissions.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={exportAllCSV}
              className="px-3 py-1 rounded bg-emerald-600 text-white text-sm shadow"
            >
              Export ALL CSV
            </button>
            <button
              onClick={exportPerCampusCSVs}
              className="px-3 py-1 rounded bg-emerald-500 text-white text-sm shadow"
            >
              Export per-campus CSVs
            </button>
            <button
              onClick={handleShowStats}
              className="px-3 py-1 rounded bg-indigo-600 text-white text-sm shadow"
            >
              {loadingStats ? "Loading..." : "Show Question Stats"}
            </button>
            <button
              onClick={logout}
              className="px-3 py-1 rounded border bg-white text-sm"
            >
              Logout
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white p-4 rounded-lg shadow">
              <label className="block text-sm text-gray-600 mb-2">
                Filter by campus
              </label>
              <select
                value={campusFilter}
                onChange={(e) => setCampusFilter(e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                <option value="">All campuses</option>
                {campuses.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="bg-white rounded-lg shadow p-2 max-h-[70vh] overflow-auto">
              <div className="px-3 py-2 border-b">
                <div className="text-sm font-semibold">
                  Students ({filtered.length})
                </div>
              </div>

              {loading && (
                <div className="p-4 text-sm text-gray-500">Loading...</div>
              )}

              <ul className="space-y-2 p-2">
                {filtered.map((s) => (
                  <li
                    key={s._id}
                    className="flex items-center gap-3 p-2 rounded hover:bg-indigo-50"
                  >
                    <div
                      className={`h-10 w-10 rounded-full flex items-center justify-center text-white ${avatarColor(
                        s.name
                      )}`}
                    >
                      <span className="font-semibold">
                        {(s.name || "U").slice(0, 1).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <button
                        onClick={() => loadStudent(s._id)}
                        className="text-left w-full"
                      >
                        <div className="font-medium truncate">
                          {s.name || "—"}
                        </div>
                        <div className="text-xs text-gray-500 truncate">
                          {s.email || "—"}
                        </div>
                        <div className="text-xs text-gray-400">
                          {s.campus ? `${s.campus} • ${s.branch || "-"}` : ""}
                        </div>
                      </button>
                    </div>
                    <div className="text-xs text-gray-400">
                      {new Date(s.createdAt).toLocaleDateString()}
                    </div>
                  </li>
                ))}

                {!loading && filtered.length === 0 && (
                  <div className="p-4 text-sm text-gray-500">
                    No students found
                  </div>
                )}
              </ul>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow p-4 min-h-[60vh]">
              {!selected && (
                <div className="h-full flex flex-col items-center justify-center text-center text-gray-500">
                  <svg
                    className="w-12 h-12 mb-3 text-indigo-200"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5zm0 2c-3.86 0-7 2.686-7 6v1h14v-1c0-3.314-3.14-6-7-6z" />
                  </svg>
                  <div className="text-lg font-semibold">
                    Select a student to view details
                  </div>
                  <div className="text-sm mt-2">
                    Use "Export ALL CSV" to download full results.
                  </div>
                </div>
              )}

              {selected && (
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-2xl font-bold">{selected.name}</div>
                      <div className="text-sm text-gray-600">
                        {selected.email} • {selected.contact || "-"}
                      </div>
                      <div className="text-xs text-gray-400">
                        Campus: {selected.campus || "—"} — Branch:{" "}
                        {selected.branch || "—"}
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <div className="text-xs text-gray-500">
                        Submitted:{" "}
                        {new Date(selected.createdAt).toLocaleString()}
                      </div>
                      <div>
                        <button
                          onClick={() =>
                            download(
                              `student_${selected._id}.json`,
                              JSON.stringify(selected, null, 2),
                              "application/json"
                            )
                          }
                          className="px-3 py-1 bg-sky-600 text-white rounded text-sm mr-2"
                        >
                          Download JSON
                        </button>
                        <button
                          onClick={() => {
                            const csv = makeCSV([selected]);
                            download(`student_${selected._id}.csv`, csv);
                          }}
                          className="px-3 py-1 bg-emerald-600 text-white rounded text-sm"
                        >
                          Download CSV
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                      <h4 className="font-semibold mb-2">Answers</h4>
                      <div className="space-y-2">
                        {selected.answers && selected.answers.length ? (
                          selected.answers.map((a, i) => {
                            const qText = getQuestionText(a.questionId, i + 1);
                            return (
                              <div
                                key={i}
                                className={`p-3 rounded-md border ${
                                  a.answer
                                    ? "bg-white"
                                    : "bg-red-50 border-red-100"
                                }`}
                              >
                                <div className="flex items-start justify-between">
                                  <div>
                                    <div className="text-xs text-indigo-600 font-medium">
                                      {a.category} • Q{a.questionIndex || i + 1}
                                    </div>
                                    <div className="mt-1 font-medium text-gray-800">
                                      {qText}
                                    </div>
                                  </div>
                                  <div className="text-xs text-gray-400">
                                    #{i + 1}
                                  </div>
                                </div>
                                <div className="mt-2 text-sm">
                                  <strong>Answer:</strong>{" "}
                                  {a.answer ? (
                                    <span className="text-gray-700">
                                      {a.answer}
                                    </span>
                                  ) : (
                                    <em className="text-red-500">No answer</em>
                                  )}
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <div className="text-sm text-gray-500">
                            No answers recorded for this student.
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Stats</h4>
                      <div className="space-y-2">
                        <div className="p-3 bg-gray-50 rounded-md">
                          <div className="text-sm text-gray-600">
                            Total questions answered
                          </div>
                          <div className="text-xl font-bold">
                            {
                              (selected.answers || []).filter((a) => a.answer)
                                .length
                            }{" "}
                            / {(selected.answers || []).length}
                          </div>
                        </div>

                        {selectedStats
                          ? Object.entries(selectedStats).map(([cat, st]) => (
                              <div key={cat} className="p-2 border rounded-md">
                                <div className="text-sm font-medium text-indigo-600">
                                  {cat}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {st.answered} answered of {st.total}
                                </div>
                                <div className="w-full bg-gray-200 h-2 rounded-full mt-2 overflow-hidden">
                                  <div
                                    className="h-2 bg-indigo-500"
                                    style={{
                                      width: `${Math.round(
                                        (st.answered / Math.max(1, st.total)) *
                                          100
                                      )}%`,
                                    }}
                                  />
                                </div>
                              </div>
                            ))
                          : null}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {showStats && questionStats && (
          <div className="mt-6 bg-white rounded-lg shadow p-4">
            <h3 className="text-lg font-semibold mb-3">
              Overall question statistics
            </h3>
            <div className="space-y-4">
              {questionStats.map((q) => (
                <div key={q.id} className="p-3 border rounded-md">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-sm text-indigo-600 font-medium">
                        {q.category}
                      </div>
                      <div className="font-medium">{q.text}</div>
                    </div>
                    <div className="text-xs text-gray-500">
                      Unanswered: {q.unanswered}
                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {q.options.map((opt) => (
                      <div
                        key={opt}
                        className="flex items-center justify-between p-2 bg-gray-50 rounded"
                      >
                        <div className="text-sm">{opt}</div>
                        <div className="text-sm font-semibold">
                          {q.counts[opt] || 0}
                        </div>
                      </div>
                    ))}
                    {q.counts["Other"] ? (
                      <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div className="text-sm">Other</div>
                        <div className="text-sm font-semibold">
                          {q.counts["Other"]}
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 text-center text-xs text-gray-400">
          Admin access uses the provided password and is persisted in this
          browser until you logout. For production, implement server-side auth.
        </div>
      </div>
    </div>
  );
}
