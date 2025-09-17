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

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  return (
    <div className="max-w-xl mx-auto p-4">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="px-6 py-4 bg-gradient-to-r from-sky-500 to-indigo-600 text-white">
          <h2 className="text-xl font-bold">Student Info</h2>
          <p className="text-sm opacity-90 mt-1">
            Fill details to start the Personality Assessment
          </p>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Full Name *
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handle}
              placeholder="First Last"
              className="mt-1 w-full p-3 border rounded-md focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email *
            </label>
            <input
              name="email"
              value={form.email}
              onChange={handle}
              placeholder="you@example.com"
              className="mt-1 w-full p-3 border rounded-md focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Contact (WhatsApp)
              </label>
              <input
                name="contact"
                value={form.contact}
                onChange={handle}
                placeholder="+91..."
                className="mt-1 w-full p-3 border rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Home Town
              </label>
              <input
                name="hometown"
                value={form.hometown}
                onChange={handle}
                placeholder="City"
                className="mt-1 w-full p-3 border rounded-md"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Gender
              </label>
              <select
                name="gender"
                value={form.gender}
                onChange={handle}
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
                onChange={handle}
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
                onChange={handle}
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

          <div className="flex justify-end">
            <button
              onClick={() => onNext(form)}
              className="inline-flex items-center px-5 py-2 bg-indigo-600 text-white rounded-md shadow hover:bg-indigo-700 disabled:opacity-50"
              disabled={!form.name || !form.email}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
