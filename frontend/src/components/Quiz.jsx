import { useState, useMemo } from "react";
import questions from "../data/questions";

const groups = [
  { name: "MBTI", size: 10 },
  { name: "Technical", size: 7 },
  { name: "Wisdom", size: 8 },
  { name: "Cultural", size: 3 },
  { name: "Integrative", size: 2 },
  { name: "IQ", size: 5 },
];

export default function Quiz({ onSubmit, onBack }) {
  // build pages as slices
  const pages = [];
  let idx = 0;
  for (const g of groups) {
    pages.push(questions.slice(idx, idx + g.size));
    idx += g.size;
  }

  const [pageIndex, setPageIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // key: questionId -> answer string

  const handleSelect = (qid, opt) => {
    setAnswers((prev) => ({ ...prev, [qid]: opt }));
  };

  const submitAll = () => {
    // transform answers into array
    const answersArray = questions.map((q, i) => ({
      questionId: q.id,
      category: q.category,
      questionIndex: i + 1,
      answer: answers[q.id] || null,
    }));
    onSubmit(answersArray);
  };

  const page = pages[pageIndex];
  const totalPages = pages.length;

  // progress percent
  const percent = Math.round(((pageIndex + 1) / totalPages) * 100);

  // compute whether current page is fully answered
  const pageComplete = useMemo(() => {
    // every question on this page must have a non-empty answer
    return page.every((q) => {
      const a = answers[q.id];
      return typeof a === "string" && a.length > 0;
    });
  }, [page, answers]);

  // compute start index for numbering
  const startIndex = useMemo(() => {
    let s = 0;
    for (let i = 0; i < pageIndex; i++) s += pages[i].length;
    return s;
  }, [pageIndex, pages]);

  const handleNextClick = () => {
    // block if not complete
    if (!pageComplete) return;
    if (pageIndex < totalPages - 1) {
      setPageIndex((p) => p + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      submitAll();
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="mb-4 flex items-center justify-between">
        <button onClick={onBack} className="text-sm text-gray-600">
          Back to Info
        </button>
        <div className="text-sm font-medium text-gray-700">
          Page {pageIndex + 1} of {totalPages}
        </div>
      </div>

      <div className="w-full bg-gray-200 h-2 rounded-full mb-4 overflow-hidden">
        <div
          className="h-2 bg-gradient-to-r from-indigo-500 to-sky-400"
          style={{ width: `${percent}%` }}
        />
      </div>

      <div className="space-y-4">
        {page.map((q, qi) => (
          <div key={q.id} className="p-4 bg-white rounded-lg shadow-sm">
            <div className="flex items-start justify-between">
              <div className="font-semibold text-gray-800">
                {startIndex + qi + 1}. {q.text}
              </div>
            </div>

            <div className="mt-3 grid gap-2 grid-cols-1 sm:grid-cols-2">
              {q.options.map((opt) => (
                <label
                  key={opt}
                  className={`flex items-center p-3 border rounded-md cursor-pointer hover:shadow ${
                    answers[q.id] === opt
                      ? "bg-indigo-50 border-indigo-400"
                      : "bg-white"
                  }`}
                >
                  <input
                    type="radio"
                    name={q.id}
                    checked={answers[q.id] === opt}
                    onChange={() => handleSelect(q.id, opt)}
                    className="mr-3"
                  />
                  <span className="text-sm">{opt}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* validation hint */}
      <div className="mt-3 text-sm">
        {!pageComplete ? (
          <div className="text-red-600">
            Please answer all questions on this page to continue.
          </div>
        ) : (
          <div className="text-green-600">
            All questions on this page answered.
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
