"use client";

import React, { useState, useCallback } from "react";
import type { Response } from "@/lib/supabase";

const COLUMN_LABELS: Record<keyof Omit<Response, "id" | "created_at">, string> = {
  first_name: "First Name",
  last_name: "Last Name",
  task1_completed: "T1 Completed",
  task1_ease: "T1 Ease (1-5)",
  task1_feedback: "T1 Feedback",
  task2_completed: "T2 Completed",
  task2_ease: "T2 Ease (1-5)",
  task2_feedback: "T2 Feedback",
  task3_completed: "T3 Completed",
  task3_ease: "T3 Ease (1-5)",
  task3_feedback: "T3 Feedback",
  task4_completed: "T4 Completed",
  task4_ease: "T4 Ease (1-5)",
  task4_feedback: "T4 Feedback",
  overall_navigation: "Overall Navigation (1-5)",
  overall_most_useful: "Most Useful",
  overall_missing: "Missing",
  overall_exchange_likelihood: "Exchange Likelihood (1-5)",
  overall_encouragement: "Encouragement",
  overall_change: "Change",
};

const DATA_COLUMNS = Object.keys(COLUMN_LABELS) as (keyof Omit<Response, "id" | "created_at">)[];

function avg(responses: Response[], key: keyof Response): string {
  const nums = responses
    .map((r) => Number(r[key]))
    .filter((n) => !isNaN(n) && n > 0);
  if (nums.length === 0) return "—";
  return (nums.reduce((a, b) => a + b, 0) / nums.length).toFixed(1);
}

function completionRate(responses: Response[], key: keyof Response): string {
  if (responses.length === 0) return "—";
  const yes = responses.filter((r) =>
    String(r[key]).startsWith("Yes")
  ).length;
  return `${Math.round((yes / responses.length) * 100)}%`;
}

function downloadCSV(responses: Response[]) {
  const headers = ["ID", "Submitted At", ...Object.values(COLUMN_LABELS)];
  const rows = responses.map((r) => [
    r.id,
    new Date(r.created_at).toLocaleString(),
    ...DATA_COLUMNS.map((k) => `"${String(r[k] ?? "").replace(/"/g, '""')}"`),
  ]);
  const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `questionnaire-responses-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [responses, setResponses] = useState<Response[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const fetchResponses = useCallback(
    async (pw?: string) => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("/api/responses", {
          headers: { "x-admin-password": pw ?? password },
        });
        if (res.status === 401) {
          setError("Incorrect password. Please try again.");
          return;
        }
        if (!res.ok) throw new Error("Failed to fetch responses");
        const data = await res.json();
        setResponses(data.data ?? []);
        setAuthenticated(true);
      } catch {
        setError("Something went wrong. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    [password]
  );

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    await fetchResponses(password);
  }

  if (!authenticated) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-10 max-w-sm w-full">
          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-blue-900 rounded-xl flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-lg font-bold text-slate-900">Admin Access</h1>
            <p className="text-slate-500 text-sm mt-1">Enter your admin password to view responses</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              placeholder="Admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
              autoFocus
            />
            {error && (
              <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
            )}
            <button
              type="submit"
              disabled={loading || !password}
              className="w-full bg-blue-900 hover:bg-blue-800 disabled:bg-blue-300 text-white font-semibold py-3 rounded-xl transition-all text-sm"
            >
              {loading ? "Verifying…" : "Sign In"}
            </button>
          </form>
        </div>
      </main>
    );
  }

  const tasks = [
    { label: "Forum Information", completedKey: "task1_completed" as keyof Response, easeKey: "task1_ease" as keyof Response },
    { label: "Member Directory", completedKey: "task2_completed" as keyof Response, easeKey: "task2_ease" as keyof Response },
    { label: "Member Exchange", completedKey: "task3_completed" as keyof Response, easeKey: "task3_ease" as keyof Response },
    { label: "Member Profile", completedKey: "task4_completed" as keyof Response, easeKey: "task4_ease" as keyof Response },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-10 px-4">
      <div className="max-w-full mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Questionnaire Results</h1>
            <p className="text-sm text-slate-500 mt-0.5">{responses.length} response{responses.length !== 1 ? "s" : ""} collected</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => fetchResponses()}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 text-sm font-medium rounded-xl hover:bg-slate-50 transition-all shadow-sm"
            >
              <svg className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
            <button
              onClick={() => downloadCSV(responses)}
              disabled={responses.length === 0}
              className="flex items-center gap-2 px-4 py-2 bg-blue-900 text-white text-sm font-medium rounded-xl hover:bg-blue-800 disabled:bg-blue-300 transition-all shadow-sm"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download CSV
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        {responses.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 lg:grid-cols-6">
            {tasks.map((t) => (
              <div key={t.label} className="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
                <p className="text-slate-800 text-xs font-semibold truncate">{t.label}</p>
                <div className="mt-2 pt-2 border-t border-slate-100 flex justify-between text-xs">
                  <span className="text-slate-400">Completed</span>
                  <span className="font-bold text-slate-800">{completionRate(responses, t.completedKey)}</span>
                </div>
                <div className="flex justify-between text-xs mt-1">
                  <span className="text-slate-400">Avg ease</span>
                  <span className="font-bold text-blue-700">{avg(responses, t.easeKey)}</span>
                </div>
              </div>
            ))}
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
              <p className="text-slate-800 text-xs font-semibold">Overall Navigation</p>
              <div className="mt-2 pt-2 border-t border-slate-100 flex justify-between text-xs">
                <span className="text-slate-400">Avg score</span>
                <span className="font-bold text-blue-700">{avg(responses, "overall_navigation")}</span>
              </div>
            </div>
          </div>
        )}

        {/* Empty state */}
        {responses.length === 0 && !loading && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-12 text-center">
            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-slate-600 font-medium">No responses yet</p>
            <p className="text-slate-400 text-sm mt-1">Share the questionnaire link to start collecting data.</p>
          </div>
        )}

        {/* Responses Table */}
        {responses.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100">
              <h2 className="text-sm font-semibold text-slate-700">Individual Responses</h2>
              <p className="text-xs text-slate-400 mt-0.5">Click a row to expand full details</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="px-3 py-3 text-left font-semibold text-slate-500 whitespace-nowrap">#</th>
                    <th className="px-3 py-3 text-left font-semibold text-slate-500 whitespace-nowrap">Name</th>
                    <th className="px-3 py-3 text-left font-semibold text-slate-500 whitespace-nowrap">Submitted</th>
                    <th className="px-3 py-3 text-left font-semibold text-slate-500 whitespace-nowrap">Forum ✓</th>
                    <th className="px-3 py-3 text-center font-semibold text-slate-500 whitespace-nowrap">Forum Ease</th>
                    <th className="px-3 py-3 text-left font-semibold text-slate-500 whitespace-nowrap">Directory ✓</th>
                    <th className="px-3 py-3 text-center font-semibold text-slate-500 whitespace-nowrap">Dir. Ease</th>
                    <th className="px-3 py-3 text-left font-semibold text-slate-500 whitespace-nowrap">Exchange ✓</th>
                    <th className="px-3 py-3 text-center font-semibold text-slate-500 whitespace-nowrap">Exch. Ease</th>
                    <th className="px-3 py-3 text-left font-semibold text-slate-500 whitespace-nowrap">Profile ✓</th>
                    <th className="px-3 py-3 text-center font-semibold text-slate-500 whitespace-nowrap">Profile Ease</th>
                    <th className="px-3 py-3 text-center font-semibold text-slate-500 whitespace-nowrap">Overall Nav</th>
                    <th className="px-3 py-3 text-center font-semibold text-slate-500 whitespace-nowrap">Exch. Likelihood</th>
                  </tr>
                </thead>
                <tbody>
                  {responses.map((r, i) => (
                    <React.Fragment key={r.id}>
                      <tr
                        onClick={() => setExpandedRow(expandedRow === r.id ? null : r.id)}
                        className="border-b border-slate-50 hover:bg-blue-50/40 cursor-pointer transition-colors"
                      >
                        <td className="px-3 py-3 text-slate-400">{responses.length - i}</td>
                        <td className="px-3 py-3 text-slate-700 whitespace-nowrap font-medium">
                          {r.first_name} {r.last_name}
                        </td>
                        <td className="px-3 py-3 text-slate-600 whitespace-nowrap">
                          {new Date(r.created_at).toLocaleString("en-GB", {
                            day: "2-digit", month: "short", year: "numeric",
                            hour: "2-digit", minute: "2-digit"
                          })}
                        </td>
                        {[
                          { completed: r.task1_completed, ease: r.task1_ease },
                          { completed: r.task2_completed, ease: r.task2_ease },
                          { completed: r.task3_completed, ease: r.task3_ease },
                          { completed: r.task4_completed, ease: r.task4_ease },
                        ].map((t, ti) => (
                          <>
                            <td key={`c${ti}`} className="px-3 py-3">
                              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap
                                ${t.completed?.startsWith("Yes, without") ? "bg-green-100 text-green-700" :
                                  t.completed?.startsWith("Yes, but") ? "bg-yellow-100 text-yellow-700" :
                                  "bg-red-100 text-red-700"}`}>
                                {t.completed?.startsWith("Yes, without") ? "✓ Easy" :
                                  t.completed?.startsWith("Yes, but") ? "~ Difficult" :
                                  "✗ No"}
                              </span>
                            </td>
                            <td key={`e${ti}`} className="px-3 py-3 text-center font-semibold text-slate-700">{t.ease}</td>
                          </>
                        ))}
                        <td className="px-3 py-3 text-center font-semibold text-blue-700">{r.overall_navigation}</td>
                        <td className="px-3 py-3 text-center font-semibold text-blue-700">{r.overall_exchange_likelihood}</td>
                      </tr>
                      {expandedRow === r.id && (
                        <tr className="bg-blue-50/30">
                          <td colSpan={12} className="px-6 py-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                              {[
                                { key: "task1_feedback", label: "Forum Information" },
                                { key: "task2_feedback", label: "Member Directory" },
                                { key: "task3_feedback", label: "Member Exchange" },
                                { key: "task4_feedback", label: "Member Profile" },
                              ].map(({ key, label }) => (
                                <div key={key} className="bg-white rounded-xl border border-slate-100 p-3">
                                  <p className="font-semibold text-slate-600 mb-1">{label} — Feedback</p>
                                  <p className="text-slate-500">{(r[key as keyof Response] as string) || <em className="text-slate-300">No comment</em>}</p>
                                </div>
                              ))}
                              <div className="bg-white rounded-xl border border-slate-100 p-3">
                                <p className="font-semibold text-slate-600 mb-1">Most Useful</p>
                                <p className="text-slate-500">{r.overall_most_useful || <em className="text-slate-300">No comment</em>}</p>
                              </div>
                              <div className="bg-white rounded-xl border border-slate-100 p-3">
                                <p className="font-semibold text-slate-600 mb-1">Missing / Expected</p>
                                <p className="text-slate-500">{r.overall_missing || <em className="text-slate-300">No comment</em>}</p>
                              </div>
                              <div className="bg-white rounded-xl border border-slate-100 p-3">
                                <p className="font-semibold text-slate-600 mb-1">What Would Encourage More Use</p>
                                <p className="text-slate-500">{r.overall_encouragement || <em className="text-slate-300">No comment</em>}</p>
                              </div>
                              <div className="bg-white rounded-xl border border-slate-100 p-3">
                                <p className="font-semibold text-slate-600 mb-1">One Change</p>
                                <p className="text-slate-500">{r.overall_change || <em className="text-slate-300">No comment</em>}</p>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
