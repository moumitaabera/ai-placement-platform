



"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";

import { getInterviewResult } from "@/services/interview.service";

interface InterviewResult {
  id: string;

  score: number;
  technical: number;
  communication: number;
  confidence: number;

  feedback: string;

  strengths: string[];
  improvements: string[];
  recommendations: string[];

  difficulty: "EASY" | "MEDIUM" | "HARD";

  questionCount: number;

  startedAt: string;
  completedAt: string | null;

  job: {
    id: string;
    title: string;
  } | null;
}

export default function InterviewResultPage() {
  const router = useRouter();
  const params = useParams();

  const sessionId =
    params?.sessionId as string;

  const [result, setResult] =
    useState<InterviewResult | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  /* =====================================================
     Load Interview Result
  ===================================================== */

  useEffect(() => {
    const loadResult = async () => {
      try {
        setLoading(true);
        setError("");

        if (!sessionId) {
          throw new Error(
            "Interview session ID is missing."
          );
        }

        const response =
          await getInterviewResult(sessionId);

        console.log(
          "Interview result response:",
          response
        );

        /*
         * Expected backend response:
         *
         * {
         *   success: true,
         *   data: {
         *      id,
         *      score,
         *      technical,
         *      communication,
         *      confidence,
         *      feedback,
         *      strengths,
         *      improvements,
         *      recommendations,
         *      difficulty,
         *      questionCount,
         *      startedAt,
         *      completedAt,
         *      job
         *   }
         * }
         */

        const resultData =
          response?.data ?? response;

        if (!resultData) {
          throw new Error(
            "Interview result not found."
          );
        }

        setResult(resultData);
      } catch (err: unknown) {
        console.error(
          "Failed to load interview result:",
          err
        );

        if (axios.isAxiosError(err)) {
          setError(
            err.response?.data?.message ||
              "Failed to load interview result."
          );
        } else if (err instanceof Error) {
          setError(err.message);
        } else {
          setError(
            "Failed to load interview result."
          );
        }
      } finally {
        setLoading(false);
      }
    };

    loadResult();
  }, [sessionId]);

  /* =====================================================
     Loading State
  ===================================================== */

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-gray-200 border-t-black rounded-full animate-spin mx-auto" />

          <p className="mt-4 text-gray-600">
            Analyzing your interview result...
          </p>
        </div>
      </div>
    );
  }

  /* =====================================================
     Error State
  ===================================================== */

  if (!result) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white border rounded-2xl shadow-sm p-8 max-w-md w-full text-center">
          <div className="text-4xl mb-4">
            ⚠️
          </div>

          <h1 className="text-xl font-bold">
            Result unavailable
          </h1>

          <p className="text-gray-600 mt-2">
            {error ||
              "We couldn't load your interview result."}
          </p>

          <div className="flex flex-col gap-3 mt-6">
            <button
              type="button"
              onClick={() =>
                router.push(
                  "/dashboard/interview/start"
                )
              }
              className="w-full rounded-xl bg-black text-white px-5 py-3 font-semibold hover:opacity-90 transition"
            >
              Start New Interview
            </button>

            <button
              type="button"
              onClick={() =>
                router.push("/dashboard")
              }
              className="w-full rounded-xl border px-5 py-3 font-semibold hover:bg-gray-50 transition"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* =====================================================
     Helpers
  ===================================================== */

  const getScoreLabel = (
    score: number
  ) => {
    if (score >= 85) {
      return "Excellent";
    }

    if (score >= 70) {
      return "Good";
    }

    if (score >= 50) {
      return "Needs Improvement";
    }

    return "Needs More Practice";
  };

  const getScoreMessage = (
    score: number
  ) => {
    if (score >= 85) {
      return "Great performance! You demonstrated strong interview readiness.";
    }

    if (score >= 70) {
      return "Good performance! A little more practice can make your answers stronger.";
    }

    if (score >= 50) {
      return "You have a good foundation, but there are some areas that need improvement.";
    }

    return "Keep practicing. Focus on the improvement areas identified below.";
  };

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

  const formatDateTime = (
    date?: string | null
  ) => {
    if (!date) {
      return "N/A";
    }

    return new Date(date).toLocaleString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  /* =====================================================
     Main UI
  ===================================================== */

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-5xl mx-auto">

        {/* =================================================
            Header
        ================================================= */}

        <div className="mb-6">

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

            <h1 className="text-3xl sm:text-4xl font-bold mt-1">
              Interview Result
            </h1>

            <p className="text-gray-600 mt-2">
              Heres your AI-powered interview
              performance analysis.
            </p>
          </div>
        </div>

        {/* =================================================
            Interview Information
        ================================================= */}

        <div className="bg-white border rounded-2xl shadow-sm p-5 mb-5">

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

            {/* Job */}

            <div>
              <p className="text-xs uppercase tracking-wide text-gray-500">
                Job
              </p>

              <p className="font-semibold mt-1">
                {result.job?.title ||
                  "General Interview"}
              </p>
            </div>

            {/* Difficulty */}

            <div>
              <p className="text-xs uppercase tracking-wide text-gray-500">
                Difficulty
              </p>

              <p className="font-semibold mt-1">
                {result.difficulty}
              </p>
            </div>

            {/* Questions */}

            <div>
              <p className="text-xs uppercase tracking-wide text-gray-500">
                Questions
              </p>

              <p className="font-semibold mt-1">
                {result.questionCount}
              </p>
            </div>

            {/* Date */}

            <div>
              <p className="text-xs uppercase tracking-wide text-gray-500">
                Completed
              </p>

              <p className="font-semibold mt-1">
                {formatDate(
                  result.completedAt
                )}
              </p>
            </div>

          </div>
        </div>

        {/* =================================================
            Overall Score
        ================================================= */}

        <div className="bg-white border rounded-2xl shadow-sm p-6 sm:p-8 mb-5">

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">

            {/* Score Circle */}

            <div className="flex justify-center">

              <div className="w-44 h-44 rounded-full border-12 border-gray-100 flex flex-col items-center justify-center">

                <span className="text-5xl font-bold">
                  {Math.round(
                    result.score
                  )}
                </span>

                <span className="text-gray-500 text-sm mt-1">
                  / 100
                </span>

              </div>

            </div>

            {/* Score Summary */}

            <div className="md:col-span-2">

              <p className="text-sm text-gray-500">
                Overall Performance
              </p>

              <h2 className="text-2xl font-bold mt-1">
                {getScoreLabel(
                  result.score
                )}
              </h2>

              <p className="text-gray-600 mt-3 leading-relaxed">
                {getScoreMessage(
                  result.score
                )}
              </p>

              <div className="mt-5">

                <div className="flex justify-between text-sm mb-2">
                  <span>
                    Overall Score
                  </span>

                  <span className="font-semibold">
                    {Math.round(
                      result.score
                    )}
                    %
                  </span>
                </div>

                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">

                  <div
                    className="h-full bg-black rounded-full transition-all"
                    style={{
                      width: `${Math.min(
                        Math.max(
                          result.score,
                          0
                        ),
                        100
                      )}%`,
                    }}
                  />

                </div>

              </div>
            </div>

          </div>
        </div>

        {/* =================================================
            Performance Breakdown
        ================================================= */}

        <div className="mb-5">

          <h2 className="text-xl font-bold mb-4">
            Performance Breakdown
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            {/* Technical */}

            <div className="bg-white border rounded-2xl shadow-sm p-5">

              <p className="text-sm text-gray-500">
                Technical Knowledge
              </p>

              <div className="flex items-end justify-between mt-3">

                <span className="text-3xl font-bold">
                  {Math.round(
                    result.technical
                  )}
                </span>

                <span className="text-sm text-gray-500">
                  / 100
                </span>

              </div>

              <div className="h-2 bg-gray-100 rounded-full mt-4 overflow-hidden">

                <div
                  className="h-full bg-black rounded-full"
                  style={{
                    width: `${Math.min(
                      Math.max(
                        result.technical,
                        0
                      ),
                      100
                    )}%`,
                  }}
                />

              </div>

            </div>

            {/* Communication */}

            <div className="bg-white border rounded-2xl shadow-sm p-5">

              <p className="text-sm text-gray-500">
                Communication
              </p>

              <div className="flex items-end justify-between mt-3">

                <span className="text-3xl font-bold">
                  {Math.round(
                    result.communication
                  )}
                </span>

                <span className="text-sm text-gray-500">
                  / 100
                </span>

              </div>

              <div className="h-2 bg-gray-100 rounded-full mt-4 overflow-hidden">

                <div
                  className="h-full bg-black rounded-full"
                  style={{
                    width: `${Math.min(
                      Math.max(
                        result.communication,
                        0
                      ),
                      100
                    )}%`,
                  }}
                />

              </div>

            </div>

            {/* Confidence */}

            <div className="bg-white border rounded-2xl shadow-sm p-5">

              <p className="text-sm text-gray-500">
                Confidence
              </p>

              <div className="flex items-end justify-between mt-3">

                <span className="text-3xl font-bold">
                  {Math.round(
                    result.confidence
                  )}
                </span>

                <span className="text-sm text-gray-500">
                  / 100
                </span>

              </div>

              <div className="h-2 bg-gray-100 rounded-full mt-4 overflow-hidden">

                <div
                  className="h-full bg-black rounded-full"
                  style={{
                    width: `${Math.min(
                      Math.max(
                        result.confidence,
                        0
                      ),
                      100
                    )}%`,
                  }}
                />

              </div>

            </div>

          </div>
        </div>

        {/* =================================================
            Overall AI Feedback
        ================================================= */}

        <div className="bg-white border rounded-2xl shadow-sm p-6 mb-5">

          <h2 className="text-xl font-bold">
            AI Feedback
          </h2>

          <p className="text-gray-600 leading-7 mt-4 whitespace-pre-line">
            {result.feedback}
          </p>

        </div>

        {/* =================================================
            Strengths
        ================================================= */}

        <div className="bg-white border rounded-2xl shadow-sm p-6 mb-5">

          <div className="flex items-center gap-3">

            <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
              ✓
            </div>

            <h2 className="text-xl font-bold">
              Your Strengths
            </h2>

          </div>

          {result.strengths?.length > 0 ? (
            <div className="mt-5 space-y-3">

              {result.strengths.map(
                (strength, index) => (
                  <div
                    key={index}
                    className="flex gap-3 items-start"
                  >
                    <span className="mt-1 text-sm font-bold">
                      {index + 1}.
                    </span>

                    <p className="text-gray-700 leading-6">
                      {strength}
                    </p>
                  </div>
                )
              )}

            </div>
          ) : (
            <p className="text-gray-500 mt-4">
              No strengths were provided.
            </p>
          )}

        </div>

        {/* =================================================
            Improvements
        ================================================= */}

        <div className="bg-white border rounded-2xl shadow-sm p-6 mb-5">

          <div className="flex items-center gap-3">

            <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
              ↑
            </div>

            <h2 className="text-xl font-bold">
              Areas for Improvement
            </h2>

          </div>

          {result.improvements?.length > 0 ? (
            <div className="mt-5 space-y-3">

              {result.improvements.map(
                (improvement, index) => (
                  <div
                    key={index}
                    className="flex gap-3 items-start"
                  >
                    <span className="mt-1 text-sm font-bold">
                      {index + 1}.
                    </span>

                    <p className="text-gray-700 leading-6">
                      {improvement}
                    </p>
                  </div>
                )
              )}

            </div>
          ) : (
            <p className="text-gray-500 mt-4">
              No improvement areas were provided.
            </p>
          )}

        </div>

        {/* =================================================
            Recommendations
        ================================================= */}

        <div className="bg-white border rounded-2xl shadow-sm p-6 mb-5">

          <div className="flex items-center gap-3">

            <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
              ★
            </div>

            <h2 className="text-xl font-bold">
              Recommendations
            </h2>

          </div>

          {result.recommendations?.length > 0 ? (
            <div className="mt-5 space-y-3">

              {result.recommendations.map(
                (
                  recommendation,
                  index
                ) => (
                  <div
                    key={index}
                    className="flex gap-3 items-start"
                  >
                    <span className="mt-1 text-sm font-bold">
                      {index + 1}.
                    </span>

                    <p className="text-gray-700 leading-6">
                      {recommendation}
                    </p>
                  </div>
                )
              )}

            </div>
          ) : (
            <p className="text-gray-500 mt-4">
              No recommendations were provided.
            </p>
          )}

        </div>

        {/* =================================================
            Interview Details
        ================================================= */}

        <div className="bg-white border rounded-2xl shadow-sm p-6 mb-6">

          <h2 className="text-xl font-bold">
            Interview Details
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5">

            <div>
              <p className="text-xs uppercase tracking-wide text-gray-500">
                Started
              </p>

              <p className="font-medium mt-1">
                {formatDateTime(
                  result.startedAt
                )}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wide text-gray-500">
                Completed
              </p>

              <p className="font-medium mt-1">
                {formatDateTime(
                  result.completedAt
                )}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wide text-gray-500">
                Difficulty
              </p>

              <p className="font-medium mt-1">
                {result.difficulty}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wide text-gray-500">
                Total Questions
              </p>

              <p className="font-medium mt-1">
                {result.questionCount}
              </p>
            </div>

          </div>

        </div>

        {/* =================================================
            Bottom Actions
        ================================================= */}

        <div className="flex flex-col sm:flex-row gap-3 pb-8">

          <button
            type="button"
            onClick={() =>
              router.push(
                "/dashboard/interview/start"
              )
            }
            className="flex-1 rounded-xl bg-black text-white px-6 py-3 font-semibold hover:opacity-90 transition"
          >
            Start New Interview
          </button>

          <button
            type="button"
            onClick={() =>
              router.push(
                "/dashboard/interview/history"
              )
            }
            className="flex-1 rounded-xl border bg-white px-6 py-3 font-semibold hover:bg-gray-50 transition"
          >
            View Interview History
          </button>

          <button
            type="button"
            onClick={() =>
              router.push("/dashboard")
            }
            className="flex-1 rounded-xl border bg-white px-6 py-3 font-semibold hover:bg-gray-50 transition"
          >
            Dashboard
          </button>

        </div>

      </div>
    </div>
  );
}