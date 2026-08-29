"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

import { getInterviewHistory } from "@/services/interview.service";

interface InterviewHistoryItem {
  id: string;
  jobTitle: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  status: string;
  score: number | null;
  technical: number | null;
  communication: number | null;
  confidence: number | null;
  createdAt?: string;
  startedAt?: string;
  completedAt?: string | null;
}

export default function InterviewHistoryPage() {
  const router = useRouter();

  const [interviews, setInterviews] = useState<
    InterviewHistoryItem[]
  >([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // --------------------------------------------------
  // LOAD INTERVIEW HISTORY
  // --------------------------------------------------

  useEffect(() => {
    const loadHistory = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getInterviewHistory();

        console.log(
          "Interview history response:",
          response
        );

        setInterviews(response?.data ?? []);
      } catch (err: unknown) {
        console.error(
          "Failed to load interview history:",
          err
        );

        if (axios.isAxiosError(err)) {
          setError(
            err.response?.data?.message ||
              "Failed to load interview history."
          );
        } else if (err instanceof Error) {
          setError(err.message);
        } else {
          setError(
            "Failed to load interview history."
          );
        }
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, []);

  // --------------------------------------------------
  // DATE FORMAT
  // --------------------------------------------------

  const formatDate = (
    date?: string | null
  ) => {
    if (!date) {
      return "N/A";
    }

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  // --------------------------------------------------
  // LOADING
  // --------------------------------------------------

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-gray-200 border-t-black rounded-full animate-spin mx-auto" />

          <p className="mt-4 text-gray-600">
            Loading interview history...
          </p>
        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // ERROR
  // --------------------------------------------------

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white border rounded-2xl shadow-sm p-8 max-w-md w-full text-center">
          <div className="text-4xl mb-4">
            ⚠️
          </div>

          <h1 className="text-xl font-bold text-gray-900">
            Unable to load interview history
          </h1>

          <p className="text-gray-600 mt-3">
            {error}
          </p>

          <div className="flex flex-col gap-3 mt-6">
            <button
              type="button"
              onClick={() =>
                window.location.reload()
              }
              className="w-full rounded-xl bg-black text-white px-5 py-3 font-semibold hover:opacity-90 transition"
            >
              Try Again
            </button>

            <button
              type="button"
              onClick={() =>
                router.push("/dashboard")
              }
              className="w-full rounded-xl border bg-white px-5 py-3 font-semibold hover:bg-gray-50 transition"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // MAIN PAGE
  // --------------------------------------------------

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">

        {/* HEADER */}

        <div className="mb-8">
          <button
            type="button"
            onClick={() =>
              router.push("/dashboard")
            }
            className="text-sm text-gray-600 hover:text-black transition"
          >
            ← Back to Dashboard
          </button>

          <div className="mt-5">
            <p className="text-sm text-gray-500">
              AI Mock Interview
            </p>

            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-1">
              Interview History
            </h1>

            <p className="text-gray-600 mt-2">
              Review your previous mock interviews
              and performance.
            </p>
          </div>
        </div>

        {/* EMPTY STATE */}

        {interviews.length === 0 ? (
          <div className="bg-white border rounded-2xl shadow-sm p-10 text-center">
            <div className="text-5xl mb-5">
              🎤
            </div>

            <h2 className="text-2xl font-bold text-gray-900">
              No interviews yet
            </h2>

            <p className="text-gray-600 mt-3">
              Start your first AI mock interview
              to see your interview history here.
            </p>

            <button
              type="button"
              onClick={() =>
                router.push(
                  "/dashboard/interview/start"
                )
              }
              className="mt-6 rounded-xl bg-black text-white px-6 py-3 font-semibold hover:opacity-90 transition"
            >
              Start New Interview
            </button>
          </div>
        ) : (
          <>
            {/* SUMMARY */}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">

              <div className="bg-white border rounded-2xl p-5 shadow-sm">
                <p className="text-sm text-gray-500">
                  Total Interviews
                </p>

                <p className="text-3xl font-bold mt-2">
                  {interviews.length}
                </p>
              </div>

              <div className="bg-white border rounded-2xl p-5 shadow-sm">
                <p className="text-sm text-gray-500">
                  Completed
                </p>

                <p className="text-3xl font-bold mt-2">
                  {
                    interviews.filter(
                      (item) =>
                        item.status ===
                        "Completed"
                    ).length
                  }
                </p>
              </div>

              <div className="bg-white border rounded-2xl p-5 shadow-sm">
                <p className="text-sm text-gray-500">
                  Average Score
                </p>

                <p className="text-3xl font-bold mt-2">
                  {(() => {
                    const completed =
                      interviews.filter(
                        (item) =>
                          item.status ===
                            "Completed" &&
                          item.score !== null
                      );

                    if (
                      completed.length === 0
                    ) {
                      return "—";
                    }

                    const average =
                      completed.reduce(
                        (sum, item) =>
                          sum +
                          (item.score ?? 0),
                        0
                      ) /
                      completed.length;

                    return Math.round(
                      average
                    );
                  })()}
                  {interviews.some(
                    (item) =>
                      item.status ===
                        "Completed" &&
                      item.score !== null
                  ) && (
                    <span className="text-base text-gray-500 ml-1">
                      /100
                    </span>
                  )}
                </p>
              </div>

            </div>

            {/* INTERVIEW LIST */}

            <div className="space-y-5">

              {interviews.map(
                (interview) => (
                  <div
                    key={interview.id}
                    className="bg-white border rounded-2xl shadow-sm p-6"
                  >

                    {/* TOP */}

                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-5">

                      <div>
                        <p className="text-sm text-gray-500">
                          Mock Interview
                        </p>

                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">
                          {interview.jobTitle ||
                            "General Interview"}
                        </h2>

                        <div className="flex flex-wrap gap-2 mt-3">

                          <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-sm font-semibold">
                            {
                              interview.difficulty
                            }
                          </span>

                          <span
                            className={`px-3 py-1 rounded-full text-sm font-semibold ${
                              interview.status ===
                              "Completed"
                                ? "bg-green-100 text-green-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {
                              interview.status
                            }
                          </span>

                        </div>
                      </div>

                      {/* SCORE */}

                      {interview.score !==
                        null && (
                        <div className="text-left md:text-right">

                          <p className="text-sm text-gray-500">
                            Overall Score
                          </p>

                          <p className="text-3xl font-bold text-gray-900">
                            {Math.round(
                              interview.score
                            )}
                            <span className="text-base text-gray-500">
                              /100
                            </span>
                          </p>

                        </div>
                      )}

                    </div>

                    {/* PERFORMANCE */}

                    {interview.status ===
                      "Completed" && (
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">

                        <div className="rounded-xl bg-gray-50 p-4">
                          <p className="text-xs text-gray-500">
                            Technical
                          </p>

                          <p className="text-xl font-bold mt-1">
                            {interview.technical ??
                              "—"}
                            {interview.technical !==
                              null && (
                              <span className="text-sm text-gray-500">
                                /100
                              </span>
                            )}
                          </p>
                        </div>

                        <div className="rounded-xl bg-gray-50 p-4">
                          <p className="text-xs text-gray-500">
                            Communication
                          </p>

                          <p className="text-xl font-bold mt-1">
                            {interview.communication ??
                              "—"}
                            {interview.communication !==
                              null && (
                              <span className="text-sm text-gray-500">
                                /100
                              </span>
                            )}
                          </p>
                        </div>

                        <div className="rounded-xl bg-gray-50 p-4">
                          <p className="text-xs text-gray-500">
                            Confidence
                          </p>

                          <p className="text-xl font-bold mt-1">
                            {interview.confidence ??
                              "—"}
                            {interview.confidence !==
                              null && (
                              <span className="text-sm text-gray-500">
                                /100
                              </span>
                            )}
                          </p>
                        </div>

                      </div>
                    )}

                    {/* DATE */}

                    <div className="mt-5 text-sm text-gray-500">
                      {interview.completedAt
                        ? `Completed ${formatDate(
                            interview.completedAt
                          )}`
                        : interview.startedAt
                        ? `Started ${formatDate(
                            interview.startedAt
                          )}`
                        : interview.createdAt
                        ? formatDate(
                            interview.createdAt
                          )
                        : ""}
                    </div>

                    {/* ACTION */}

                    <div className="mt-5">

                      {interview.status ===
                      "Completed" ? (
                        <button
                          type="button"
                          onClick={() =>
                            router.push(
                              `/dashboard/interview/result/${interview.id}`
                            )
                          }
                          className="w-full rounded-xl border border-gray-300 px-5 py-3 font-semibold text-gray-900 hover:bg-gray-50 transition"
                        >
                          View Result →
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() =>
                            router.push(
                              `/dashboard/interview/${interview.id}`
                            )
                          }
                          className="w-full rounded-xl border border-gray-300 px-5 py-3 font-semibold text-gray-900 hover:bg-gray-50 transition"
                        >
                          Continue Interview →
                        </button>
                      )}

                    </div>

                  </div>
                )
              )}

            </div>

            {/* START NEW */}

            <div className="mt-8 pb-8 text-center">
              <button
                type="button"
                onClick={() =>
                  router.push(
                    "/dashboard/interview/start"
                  )
                }
                className="rounded-xl bg-black text-white px-6 py-3 font-semibold hover:opacity-90 transition"
              >
                + Start New Interview
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}