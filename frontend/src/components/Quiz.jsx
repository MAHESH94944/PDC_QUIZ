import { useEffect, useMemo, useState } from "react";
import questions from "../data/questions";

const groups = [
  { name: "MBTI", size: 10 },
  { name: "Technical", size: 7 },
  { name: "Wisdom", size: 8 },
  { name: "Cultural", size: 3 },
  { name: "Integrative", size: 2 },
  { name: "IQ", size: 5 },
];

const LS_KEY_ANSWERS = "pdc_quiz_answers_v1";
const LS_KEY_PAGE = "pdc_quiz_page_v1";

export default function Quiz({ onSubmit, onBack }) {
  // build pages as slices
  const pages = [];
  let idx = 0;
  for (const g of groups) {
    pages.push(questions.slice(idx, idx + g.size));
    idx += g.size;
  }

  const totalQuestions = questions.length;
  const totalPages = pages.length;

  // restore from localStorage if available
  const [pageIndex, setPageIndex] = useState(() => {
    const p = parseInt(localStorage.getItem(LS_KEY_PAGE), 10);
    return Number.isFinite(p) && !isNaN(p)
      ? Math.min(Math.max(p, 0), totalPages - 1)
      : 0;
  });
  const [answers, setAnswers] = useState(() => {
    try {
      const raw = localStorage.getItem(LS_KEY_ANSWERS);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });

  // answered counts
  const answeredCount = useMemo(
    () => Object.keys(answers).filter((k) => answers[k]).length,
    [answers]
  );

  useEffect(() => {
    // persist answers and page
    localStorage.setItem(LS_KEY_ANSWERS, JSON.stringify(answers));
    localStorage.setItem(LS_KEY_PAGE, String(pageIndex));
  }, [answers, pageIndex]);

  useEffect(() => {
    // warn before leaving if quiz not finished
    const onBeforeUnload = (e) => {
      // only warn if not fully submitted (answers less than total)
      if (answeredCount < totalQuestions) {
        e.preventDefault();
        e.returnValue = "";
        return "";
      }
      return undefined;
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [answeredCount, totalQuestions]);

  const handleSelect = (qid, opt) => {
    setAnswers((prev) => {
      const next = { ...prev, [qid]: opt };
      return next;
    });
  };

  const submitAll = () => {
    const answersArray = questions.map((q, i) => ({
      questionId: q.id,
      category: q.category,
      questionIndex: i + 1,
      answer: answers[q.id] || null,
    }));
    // clear saved state only after submit success (parent will handle response)
    onSubmit(answersArray);
    // do not clear localStorage here — parent will navigate and you can clear after confirming
  };

  const page = pages[pageIndex];

  // compute whether current page is fully answered
  const pageComplete = useMemo(() => {
    return page.every((q) => {
      const a = answers[q.id];
      return typeof a === "string" && a.length > 0;
    });
  }, [page, answers]);

  // start index for numbering
  const startIndex = useMemo(() => {
    let s = 0;
    for (let i = 0; i < pageIndex; i++) s += pages[i].length;
    return s;
  }, [pageIndex, pages]);

  const percent = Math.round((answeredCount / totalQuestions) * 100);
  const remainingOnPage = page.filter(
    (q) => !(answers[q.id] && answers[q.id].length)
  ).length;

  const handleNextClick = () => {
    if (!pageComplete) return;
    if (pageIndex < totalPages - 1) {
      setPageIndex((p) => p + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      submitAll();
      // clear localStorage after submission to avoid stale resume
      localStorage.removeItem(LS_KEY_ANSWERS);
      localStorage.removeItem(LS_KEY_PAGE);
    }
  };

  const handleSaveAndExit = () => {
    // explicit save already happens via effect; show a quick confirmation and return to root
    alert("Progress saved. You can resume later on this browser.");
    window.location.href = "/";
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      {/* sticky header */}
      <div className="sticky top-4 z-20 bg-gradient-to-r from-white/80 to-white/60 backdrop-blur-sm p-3 rounded-md shadow-sm mb-4 border">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-sm text-gray-600">Progress</div>
            <div className="flex items-center gap-3">
              <div className="font-semibold text-gray-800">{percent}%</div>
              <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                <div
                  className="h-2 bg-gradient-to-r from-indigo-500 to-sky-400"
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Answered {answeredCount}/{totalQuestions} — Page {pageIndex + 1}/
              {totalPages}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSaveAndExit}
              className="px-3 py-1 text-sm rounded bg-gray-100 hover:bg-gray-200"
            >
              Save & Exit
            </button>
            <button
              onClick={onBack}
              className="px-3 py-1 text-sm rounded bg-white border"
            >
              Back
            </button>
          </div>
        </div>
      </div>

      {/* encouragement */}
      <div className="mb-4 p-3 rounded-md bg-indigo-50 border-l-4 border-indigo-200 text-sm text-indigo-700">
        You're doing great — answer all questions on each page to continue. Only{" "}
        {totalQuestions - answeredCount} questions left.
      </div>

      <div className="space-y-4">
        {page.map((q, qi) => (
          <div
            key={q.id}
            className="p-4 bg-white rounded-xl shadow-md transition transform hover:-translate-y-0.5"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="text-sm text-indigo-600 font-medium">
                  {q.category}
                </div>
                <div className="mt-1 font-semibold text-gray-800">
                  {startIndex + qi + 1}. {q.text}
                </div>
              </div>
              <div className="text-xs text-gray-400">
                {remainingOnPage > 0 &&
                  `Remaining on this page: ${remainingOnPage}`}
              </div>
            </div>

            <div className="mt-3 grid gap-3 grid-cols-1 sm:grid-cols-2">
              {q.options.map((opt) => {
                const selected = answers[q.id] === opt;
                return (
                  <label
                    key={opt}
                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-shadow border ${
                      selected
                        ? "bg-indigo-50 border-indigo-300 shadow-inner"
                        : "bg-white hover:shadow-md"
                    }`}
                    aria-pressed={selected}
                  >
                    <input
                      type="radio"
                      name={q.id}
                      checked={selected}
                      onChange={() => handleSelect(q.id, opt)}
                      className="w-5 h-5 accent-indigo-600"
                    />
                    <div className="flex-1">
                      <div className="text-sm font-medium">{opt}</div>
                    </div>
                    {selected && (
                      <div className="text-xs text-indigo-600 font-semibold">
                        Selected
                      </div>
                    )}
                  </label>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* hint */}
      <div className="mt-3 text-sm">
        {!pageComplete ? (
          <div className="text-orange-600">
            Please answer all questions on this page to continue.
          </div>
        ) : (
          <div className="text-green-600">
            All questions on this page answered — you can continue.
          </div>
        )}
      </div>

      <div className="flex justify-between mt-6">
        <div>
          {pageIndex > 0 && (
            <button
              onClick={() => setPageIndex((p) => p - 1)}
              className="px-4 py-2 border rounded-md bg-white"
            >
              Prev
            </button>
          )}
        </div>

        <div>
          {pageIndex < totalPages - 1 ? (
            <button
              onClick={handleNextClick}
              className={`px-4 py-2 rounded-md ${
                pageComplete
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-300 text-gray-600 cursor-not-allowed"
              }`}
              aria-disabled={!pageComplete}
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleNextClick}
              className={`px-4 py-2 rounded-md ${
                pageComplete
                  ? "bg-green-600 text-white"
                  : "bg-gray-300 text-gray-600 cursor-not-allowed"
              }`}
              aria-disabled={!pageComplete}
            >
              Submit
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
