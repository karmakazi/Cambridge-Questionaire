"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type FormData = {
  first_name: string;
  last_name: string;
  task1_completed: string;
  task1_ease: string;
  task1_feedback: string;
  task2_completed: string;
  task2_ease: string;
  task2_feedback: string;
  task3_completed: string;
  task3_ease: string;
  task3_feedback: string;
  task4_completed: string;
  task4_ease: string;
  task4_feedback: string;
  overall_navigation: string;
  overall_most_useful: string;
  overall_missing: string;
  overall_exchange_likelihood: string;
  overall_encouragement: string;
  overall_change: string;
};

const initialForm: FormData = {
  first_name: "",
  last_name: "",
  task1_completed: "",
  task1_ease: "",
  task1_feedback: "",
  task2_completed: "",
  task2_ease: "",
  task2_feedback: "",
  task3_completed: "",
  task3_ease: "",
  task3_feedback: "",
  task4_completed: "",
  task4_ease: "",
  task4_feedback: "",
  overall_navigation: "",
  overall_most_useful: "",
  overall_missing: "",
  overall_exchange_likelihood: "",
  overall_encouragement: "",
  overall_change: "",
};

const completionOptions = [
  "Yes, without difficulty",
  "Yes, but with some difficulty",
  "No, I couldn't complete it",
];

function RatingScale({
  name,
  value,
  onChange,
  lowLabel = "Very Difficult",
  highLabel = "Very Easy",
}: {
  name: string;
  value: string;
  onChange: (v: string) => void;
  lowLabel?: string;
  highLabel?: string;
}) {
  return (
    <div>
      <div className="flex justify-between text-xs text-slate-500 mb-2 px-1">
        <span>1 — {lowLabel}</span>
        <span>5 — {highLabel}</span>
      </div>
      <div className="flex gap-3">
        {[1, 2, 3, 4, 5].map((n) => (
          <label key={n} className="flex-1">
            <input
              type="radio"
              name={name}
              value={String(n)}
              checked={value === String(n)}
              onChange={() => onChange(String(n))}
              className="sr-only"
            />
            <span
              className={`flex items-center justify-center h-11 rounded-lg border-2 cursor-pointer text-sm font-semibold transition-all
                ${
                  value === String(n)
                    ? "border-blue-600 bg-blue-600 text-white shadow-md"
                    : "border-slate-200 bg-white text-slate-600 hover:border-blue-400 hover:bg-blue-50"
                }`}
            >
              {n}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}

function TaskSection({
  taskNumber,
  title,
  scenario,
  completedKey,
  easeKey,
  feedbackKey,
  form,
  onChange,
}: {
  taskNumber: number;
  title: string;
  scenario: string;
  completedKey: keyof FormData;
  easeKey: keyof FormData;
  feedbackKey: keyof FormData;
  form: FormData;
  onChange: (key: keyof FormData, value: string) => void;
}) {
  return (
    <section className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-900 to-blue-800 px-6 py-4">
        <div className="flex items-center gap-3">
          <span className="bg-white/20 text-white text-xs font-bold px-2.5 py-1 rounded-full">
            TASK {taskNumber}
          </span>
          <h2 className="text-white font-semibold text-base">{title}</h2>
        </div>
        <div className="mt-3 bg-white/10 rounded-lg px-4 py-3">
          <p className="text-blue-100 text-sm leading-relaxed">
            <span className="font-semibold text-white">Scenario: </span>
            {scenario}
          </p>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Q1 */}
        <div>
          <p className="text-sm font-semibold text-slate-700 mb-3">
            1. Were you able to complete the task?
          </p>
          <div className="space-y-2">
            {completionOptions.map((opt) => (
              <label
                key={opt}
                className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all
                  ${
                    form[completedKey] === opt
                      ? "border-blue-600 bg-blue-50"
                      : "border-slate-100 bg-slate-50 hover:border-blue-300 hover:bg-blue-50/50"
                  }`}
              >
                <input
                  type="radio"
                  name={completedKey}
                  value={opt}
                  checked={form[completedKey] === opt}
                  onChange={() => onChange(completedKey, opt)}
                  className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500"
                />
                <span className="text-sm text-slate-700">{opt}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Q2 */}
        <div>
          <p className="text-sm font-semibold text-slate-700 mb-3">
            2. How easy or difficult was the task?
          </p>
          <RatingScale
            name={easeKey}
            value={form[easeKey]}
            onChange={(v) => onChange(easeKey, v)}
          />
        </div>

        {/* Q3 */}
        <div>
          <p className="text-sm font-semibold text-slate-700 mb-2">
            3. Was anything confusing or difficult to find?
          </p>
          <textarea
            rows={3}
            placeholder="Share any difficulties you encountered…"
            value={form[feedbackKey]}
            onChange={(e) => onChange(feedbackKey, e.target.value)}
            className="w-full px-4 py-3 text-sm text-slate-700 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none placeholder-slate-400"
          />
        </div>
      </div>
    </section>
  );
}

export default function QuestionnairePage() {
  const router = useRouter();
  const [form, setForm] = useState<FormData>(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  function handleChange(key: keyof FormData, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    // Basic validation
    const required: (keyof FormData)[] = [
      "first_name", "last_name",
      "task1_completed", "task1_ease",
      "task2_completed", "task2_ease",
      "task3_completed", "task3_ease",
      "task4_completed", "task4_ease",
      "overall_navigation", "overall_exchange_likelihood",
    ];
    for (const key of required) {
      if (!form[key]) {
        setError("Please answer all required questions before submitting.");
        return;
      }
    }

    setSubmitting(true);
    try {
      const payload = {
        ...form,
        task1_ease: Number(form.task1_ease),
        task2_ease: Number(form.task2_ease),
        task3_ease: Number(form.task3_ease),
        task4_ease: Number(form.task4_ease),
        overall_navigation: Number(form.overall_navigation),
        overall_exchange_likelihood: Number(form.overall_exchange_likelihood),
      };

      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Submission failed");
      }

      router.push("/thank-you");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-10 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-900">
            Platform Usability Questionnaire
          </h1>
          <p className="text-slate-500 text-sm mt-2 max-w-sm mx-auto">
            Please complete each scenario below and answer the follow-up questions. Your responses help us improve the platform.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name fields */}
          <section className="bg-white rounded-2xl shadow-sm border border-slate-100 px-6 py-6">
            <h2 className="text-sm font-semibold text-slate-700 mb-4">Your Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">
                  First name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Jane"
                  value={form.first_name}
                  onChange={(e) => handleChange("first_name", e.target.value)}
                  className="w-full px-4 py-3 text-sm text-slate-700 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-slate-400"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">
                  Last name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Smith"
                  value={form.last_name}
                  onChange={(e) => handleChange("last_name", e.target.value)}
                  className="w-full px-4 py-3 text-sm text-slate-700 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-slate-400"
                />
              </div>
            </div>
          </section>

          <TaskSection
            taskNumber={1}
            title="Forum Information"
            scenario="Find your upcoming Forum and locate its agenda and reading materials."
            completedKey="task1_completed"
            easeKey="task1_ease"
            feedbackKey="task1_feedback"
            form={form}
            onChange={handleChange}
          />

          <TaskSection
            taskNumber={2}
            title="Member Directory"
            scenario="Find a member whose area of expertise is restructuring and determine how you would contact them."
            completedKey="task2_completed"
            easeKey="task2_ease"
            feedbackKey="task2_feedback"
            form={form}
            onChange={handleChange}
          />

          <TaskSection
            taskNumber={3}
            title="Member Exchange"
            scenario="Find a discussion on AI generated evidence and locate where you would reply. Try replying."
            completedKey="task3_completed"
            easeKey="task3_ease"
            feedbackKey="task3_feedback"
            form={form}
            onChange={handleChange}
          />

          <TaskSection
            taskNumber={4}
            title="Member Profile"
            scenario="Find where you would update your professional information and manage who can see your contact details."
            completedKey="task4_completed"
            easeKey="task4_ease"
            feedbackKey="task4_feedback"
            form={form}
            onChange={handleChange}
          />

          {/* Overall Feedback */}
          <section className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-6 py-4">
              <div className="flex items-center gap-3">
                <span className="bg-white/20 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                  OVERALL
                </span>
                <h2 className="text-white font-semibold text-base">Overall Feedback</h2>
              </div>
            </div>

            <div className="px-6 py-6 space-y-6">
              {/* Q1 */}
              <div>
                <p className="text-sm font-semibold text-slate-700 mb-3">
                  1. Overall, how easy was the platform to navigate? <span className="text-red-500">*</span>
                </p>
                <RatingScale
                  name="overall_navigation"
                  value={form.overall_navigation}
                  onChange={(v) => handleChange("overall_navigation", v)}
                />
              </div>

              {/* Q2 */}
              <div>
                <p className="text-sm font-semibold text-slate-700 mb-2">
                  2. Which part of the platform did you find most useful?
                </p>
                <textarea
                  rows={2}
                  placeholder="e.g. Member Directory, Member Exchange, Forum pages…"
                  value={form.overall_most_useful}
                  onChange={(e) => handleChange("overall_most_useful", e.target.value)}
                  className="w-full px-4 py-3 text-sm text-slate-700 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none placeholder-slate-400"
                />
              </div>

              {/* Q3 */}
              <div>
                <p className="text-sm font-semibold text-slate-700 mb-2">
                  3. Was there anything you expected to find but couldn&apos;t?
                </p>
                <textarea
                  rows={2}
                  placeholder="Describe anything that was missing or hard to locate…"
                  value={form.overall_missing}
                  onChange={(e) => handleChange("overall_missing", e.target.value)}
                  className="w-full px-4 py-3 text-sm text-slate-700 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none placeholder-slate-400"
                />
              </div>

              {/* Q4 */}
              <div>
                <p className="text-sm font-semibold text-slate-700 mb-3">
                  4. How likely would you be to use the Member Exchange between Forums? <span className="text-red-500">*</span>
                </p>
                <RatingScale
                  name="overall_exchange_likelihood"
                  value={form.overall_exchange_likelihood}
                  onChange={(v) => handleChange("overall_exchange_likelihood", v)}
                  lowLabel="Very Unlikely"
                  highLabel="Very Likely"
                />
              </div>

              {/* Q5 */}
              <div>
                <p className="text-sm font-semibold text-slate-700 mb-2">
                  5. What would encourage you to use the platform more frequently?
                </p>
                <textarea
                  rows={2}
                  placeholder="e.g. more content, notifications, peer activity…"
                  value={form.overall_encouragement}
                  onChange={(e) => handleChange("overall_encouragement", e.target.value)}
                  className="w-full px-4 py-3 text-sm text-slate-700 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none placeholder-slate-400"
                />
              </div>

              {/* Q6 */}
              <div>
                <p className="text-sm font-semibold text-slate-700 mb-2">
                  6. If you could change one thing about the platform, what would it be?
                </p>
                <textarea
                  rows={2}
                  placeholder="Your most important suggestion…"
                  value={form.overall_change}
                  onChange={(e) => handleChange("overall_change", e.target.value)}
                  className="w-full px-4 py-3 text-sm text-slate-700 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none placeholder-slate-400"
                />
              </div>
            </div>
          </section>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-blue-900 hover:bg-blue-800 disabled:bg-blue-300 text-white font-semibold py-4 rounded-2xl transition-all shadow-sm text-sm tracking-wide"
          >
            {submitting ? "Submitting…" : "Submit Responses"}
          </button>

        </form>
      </div>
    </main>
  );
}
