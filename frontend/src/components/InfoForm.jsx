import { useState } from "react";

export default function InfoForm({ onNext }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    contact: "",
    hometown: "",
    gender: "",
    campus: "",
    branch: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    contact: "",
  });

  // simple email and phone validators
  const emailIsValid = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  const phoneIsValid = (v) => /^\d{10}$/.test(v);

  const handleChange = (k, v) => {
    setForm((s) => ({ ...s, [k]: v }));

    // live-validate only email and contact fields
    if (k === "email") {
      setErrors((e) => ({
        ...e,
        email: v === "" ? "" : emailIsValid(v) ? "" : "Email is invalid",
      }));
    }
    if (k === "contact") {
      setErrors((e) => ({
        ...e,
        contact:
          v === "" ? "" : phoneIsValid(v) ? "" : "Phone must be 10 digits",
      }));
    }
  };

  const handleSubmit = (ev) => {
    ev?.preventDefault();
    // final validation
    const e = {};
    if (!emailIsValid(form.email)) e.email = "Email is invalid";
    if (!phoneIsValid(form.contact)) e.contact = "Phone must be 10 digits";

    setErrors((prev) => ({ ...prev, ...e }));

    if (Object.keys(e).length > 0) {
      // focus first invalid is optional
      return;
    }

    // pass form to parent
    onNext(form);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow"
    >
      <div className="mb-4">
        <label className="block text-sm text-gray-700 mb-1">Name</label>
        <input
          value={form.name}
          onChange={(e) => handleChange("name", e.target.value)}
          className="w-full p-3 border rounded"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm text-gray-700 mb-1">Email</label>
        <input
          type="email"
          value={form.email}
          onChange={(e) => handleChange("email", e.target.value)}
          className={`w-full p-3 border rounded ${
            errors.email ? "border-red-400" : ""
          }`}
          placeholder="you@example.com"
        />
        {errors.email ? (
          <div className="text-red-600 text-sm mt-1">{errors.email}</div>
        ) : null}
      </div>

      <div className="mb-4">
        <label className="block text-sm text-gray-700 mb-1">
          Contact (10 digits)
        </label>
        <input
          value={form.contact}
          onChange={(e) =>
            handleChange("contact", e.target.value.replace(/\D/g, ""))
          }
          maxLength={10}
          className={`w-full p-3 border rounded ${
            errors.contact ? "border-red-400" : ""
          }`}
          placeholder="9876543210"
        />
        {errors.contact ? (
          <div className="text-red-600 text-sm mt-1">{errors.contact}</div>
        ) : null}
      </div>

      <div className="mb-4">
        <label className="block text-sm text-gray-700 mb-1">Home Town</label>
        <input
          name="hometown"
          value={form.hometown}
          onChange={(e) => handleChange("hometown", e.target.value)}
          placeholder="City"
          className="mt-1 w-full p-3 border rounded-md"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Gender
          </label>
          <select
            name="gender"
            value={form.gender}
            onChange={(e) => handleChange("gender", e.target.value)}
            className="mt-1 w-full p-2 border rounded-md"
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Which campus are you in?
          </label>
          <select
            name="campus"
            value={form.campus}
            onChange={(e) => handleChange("campus", e.target.value)}
            className="mt-1 w-full p-2 border rounded-md"
          >
            <option value="">Select Campus</option>
            <option value="Bibwewadi">Bibwewadi</option>
            <option value="Kondwa">Kondwa</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Branch
          </label>
          <select
            name="branch"
            value={form.branch}
            onChange={(e) => handleChange("branch", e.target.value)}
            className="mt-1 w-full p-2 border rounded-md"
          >
            <option value="">Select Branch</option>
            <option>Computer Engineering</option>
            <option>Information Technology</option>
            <option>Electronics and Telecommunication Engineering</option>
            <option>
              Computer Science and Engineering (Artificial Intelligence and
              Machine Learning)
            </option>
            <option>
              Computer Science and Engineering (Artificial Intelligence)
            </option>
            <option>Artificial Intelligence and Data Science</option>
            <option>Mechanical Engineering</option>
            <option>Chemical Engineering</option>
            <option>Instrumentation and Control Engineering</option>
            <option>Other</option>
          </select>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="px-4 py-2 rounded border"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 rounded bg-indigo-600 text-white"
        >
          Start Quiz
        </button>
      </div>
    </form>
  );
}
