"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getInterviewResult } from "@/services/interview.service";

interface InterviewResult {
  id: string;
  score: number;
  technical: number | null;
  communication: number | null;
  confidence: number | null;
  feedback: string | null;

  difficulty: "EASY" | "MEDIUM" | "HARD";
  startedAt: string;
  completedAt: string | null;
  questionCount: number;

  job?: {
    id?: string;
    title: string;
  } | null;
}

interface InterviewResultResponse {
  success: boolean;
  data: InterviewResult;
  message?: string;
}

export default function ResultPage() {
  const params = useParams();
  const router = useRouter();

  const sessionId = params.sessionId as string;

  const [result, setResult] = useState<InterviewResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!sessionId) {
      return;
    }

    const loadResult = async () => {
      try {
        setLoading(true);
        setError("");

        const response =
          (await getInterviewResult(
            sessionId
          )) as InterviewResultResponse;

        if (!response.success) {
          throw new Error(
            response.message ||
              "Failed to load interview result"
          );
        }

        setResult(response.data);
      } catch (error: unknown) {
        console.error(
          "Interview result loading error:",
          error
        );

        const message =
          error instanceof Error
            ? error.message
            : "Failed to load interview result";

        setError(message);
      } finally {
        setLoading(false);
      }
    };

    loadResult();
  }, [sessionId]);

  /* ---------------------------------------------
     Loading
  --------------------------------------------- */

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-black" />

          <p className="mt-4 text-gray-600">
            Loading interview result...
          </p>
        </div>
      </div>
    );
  }

  /* ---------------------------------------------
     Error
  --------------------------------------------- */

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
        <div className="w-full max-w-md rounded-2xl border bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-2xl">
            !
          </div>

          <h1 className="mt-5 text-2xl font-bold">
            Failed to load result
          </h1>

          <p className="mt-3 text-gray-600">
            {error}
          </p>

          <button
            type="button"
            onClick={() => router.back()}
            className="mt-6 rounded-xl bg-black px-5 py-3 font-semibold text-white transition hover:opacity-90"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  /* ---------------------------------------------
     No Result
  --------------------------------------------- */

  if (!result) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
        <div className="w-full max-w-md rounded-2xl border bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-bold">
            No interview result found
          </h1>

          <p className="mt-3 text-gray-600">
            We could not find the result for this
            interview session.
          </p>

          <button
            type="button"
            onClick={() => router.back()}
            className="mt-6 rounded-xl bg-black px-5 py-3 font-semibold text-white transition hover:opacity-90"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  /* ---------------------------------------------
     Performance
  --------------------------------------------- */

  const getPerformance = (score: number) => {
    if (score >= 85) {
      return {
        label: "Excellent",
        description:
          "Outstanding interview performance.",
      };
    }

    if (score >= 70) {
      return {
        label: "Good",
        description:
          "You performed well in this interview.",
      };
    }

    if (score >= 50) {
      return {
        label: "Needs Improvement",
        description:
          "You have a good foundation, but there is room to improve.",
      };
    }

    return {
      label: "Needs Significant Improvement",
      description:
        "Focus on improving your interview fundamentals.",
    };
  };

  const performance = getPerformance(result.score);

  const getScoreColor = (score: number) => {
    if (score >= 85) {
      return "text-green-600";
    }

    if (score >= 70) {
      return "text-blue-600";
    }

    if (score >= 50) {
      return "text-orange-500";
    }

    return "text-red-600";
  };

  const getProgressColor = (score: number) => {
    if (score >= 85) {
      return "bg-green-500";
    }

    if (score >= 70) {
      return "bg-blue-500";
    }

    if (score >= 50) {
      return "bg-orange-500";
    }

    return "bg-red-500";
  };

  const scoreCards = [
    {
      title: "Technical",
      score: result.technical,
      description:
        "Technical knowledge and understanding",
    },
    {
      title: "Communication",
      score: result.communication,
      description:
        "Clarity and effectiveness of communication",
    },
    {
      title: "Confidence",
      score: result.confidence,
      description:
        "Confidence while answering questions",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 md:px-8 lg:px-12">
      <div className="mx-auto max-w-5xl">
        {/* ---------------------------------------------
            Header
        --------------------------------------------- */}

        <div className="mb-8">
          <button
            type="button"
            onClick={() => router.back()}
            className="text-sm font-medium text-gray-600 transition hover:text-black"
          >
            ← Back to Dashboard
          </button>

          <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
                Interview Completed
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
                Interview Result
              </h1>

              {result.job?.title && (
                <p className="mt-2 text-gray-600">
                  {result.job.title}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* ---------------------------------------------
            Overall Score
        --------------------------------------------- */}

        <div className="rounded-3xl border bg-white p-6 shadow-sm md:p-10">
          <div className="grid items-center gap-8 md:grid-cols-[220px_1fr]">
            {/* Score Circle */}

            <div className="flex justify-center">
              <div className="flex h-48 w-48 items-center justify-center rounded-full border-12 border-gray-100">
                <div className="text-center">
                  <p
                    className={`text-5xl font-bold ${getScoreColor(
                      result.score
                    )}`}
                  >
                    {result.score}
                  </p>

                  <p className="text-sm font-medium text-gray-400">
                    / 100
                  </p>
                </div>
              </div>
            </div>

            {/* Performance */}

            <div>
              <p className="text-sm font-medium uppercase tracking-wider text-gray-500">
                Overall Performance
              </p>

              <h2
                className={`mt-2 text-3xl font-bold ${getScoreColor(
                  result.score
                )}`}
              >
                {performance.label}
              </h2>

              <p className="mt-3 max-w-xl leading-7 text-gray-600">
                {performance.description}
              </p>

              <div className="mt-6">
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="font-medium text-gray-700">
                    Overall Score
                  </span>

                  <span className="font-semibold text-gray-900">
                    {result.score}/100
                  </span>
                </div>

                <div className="h-3 overflow-hidden rounded-full bg-gray-100">
                  <div
                    className={`h-full rounded-full transition-all ${getProgressColor(
                      result.score
                    )}`}
                    style={{
                      width: `${Math.min(
                        Math.max(result.score, 0),
                        100
                      )}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ---------------------------------------------
            Category Scores
        --------------------------------------------- */}

        <div className="mt-6">
          <h2 className="mb-4 text-xl font-bold text-gray-900">
            Performance Breakdown
          </h2>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {scoreCards.map((item) => {
              const score = item.score;

              return (
                <div
                  key={item.title}
                  className="rounded-2xl border bg-white p-6 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        {item.title}
                      </p>

                      <p
                        className={`mt-2 text-3xl font-bold ${score !== null
                            ? getScoreColor(score)
                            : "text-gray-400"
                          }`}
                      >
                        {score ?? "—"}
                      </p>
                    </div>

                    <div className="rounded-xl bg-gray-100 px-3 py-2 text-xs font-semibold text-gray-500">
                      /100
                    </div>
                  </div>

                  <p className="mt-3 text-sm leading-6 text-gray-500">
                    {item.description}
                  </p>

                  {score !== null && (
                    <div className="mt-5">
                      <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                        <div
                          className={`h-full rounded-full ${getProgressColor(
                            score
                          )}`}
                          style={{
                            width: `${Math.min(
                              Math.max(score, 0),
                              100
                            )}%`,
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ---------------------------------------------
            AI Feedback
        --------------------------------------------- */}

        <div className="mt-6 rounded-2xl border bg-white p-6 shadow-sm md:p-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-100 text-xl">
              ✦
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                AI Feedback
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Personalized feedback based on your
                interview performance
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-xl bg-gray-50 p-5">
            <p className="whitespace-pre-line leading-7 text-gray-700">
              {result.feedback ||
                "No feedback available for this interview."}
            </p>
          </div>
        </div>

        {/* ---------------------------------------------
    Interview Information
--------------------------------------------- */}

<div className="mt-6 rounded-2xl border bg-white p-6 shadow-sm md:p-8">
  <div>
    <h2 className="text-xl font-bold text-gray-900">
      Interview Information
    </h2>

    <p className="mt-1 text-sm text-gray-500">
      Details about this interview session
    </p>
  </div>

  <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
    {/* Job */}
    <div className="rounded-xl bg-gray-50 p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
        Position
      </p>

      <p className="mt-2 font-semibold text-gray-900">
        {result.job?.title || "Unknown Job"}
      </p>
    </div>

    {/* Difficulty */}
    <div className="rounded-xl bg-gray-50 p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
        Difficulty
      </p>

      <p className="mt-2 font-semibold text-gray-900">
        {result.difficulty === "EASY"
          ? "Easy"
          : result.difficulty === "HARD"
            ? "Hard"
            : "Medium"}
      </p>
    </div>

    {/* Questions */}
    <div className="rounded-xl bg-gray-50 p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
        Questions
      </p>

      <p className="mt-2 font-semibold text-gray-900">
        {result.questionCount}
      </p>
    </div>

    {/* Status */}
    <div className="rounded-xl bg-green-50 p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-green-600">
        Status
      </p>

      <div className="mt-2 flex items-center gap-2">
        <span className="h-2.5 w-2.5 rounded-full bg-green-500" />

        <p className="font-semibold text-green-700">
          Completed
        </p>
      </div>
    </div>
  </div>

  {/* Dates */}

  <div className="mt-4 grid gap-4 sm:grid-cols-2">
    {/* Started */}
    <div className="rounded-xl border bg-white p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
        Started
      </p>

      <p className="mt-2 font-medium text-gray-900">
        {new Date(result.startedAt).toLocaleString()}
      </p>
    </div>

    {/* Completed */}
    <div className="rounded-xl border bg-white p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
        Completed
      </p>

      <p className="mt-2 font-medium text-gray-900">
        {result.completedAt
          ? new Date(
              result.completedAt
            ).toLocaleString()
          : "Not available"}
      </p>
    </div>
  </div>

  {/* Session ID */}

  <div className="mt-4">
    <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
      Session ID
    </p>

    <p className="mt-2 break-all rounded-xl bg-gray-50 p-4 font-mono text-sm text-gray-700">
      {result.id}
    </p>
  </div>
</div>

        {/* ---------------------------------------------
            Bottom Actions
        --------------------------------------------- */}

        <div className="mt-8 flex flex-col gap-3 pb-8 sm:flex-row">
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-xl border bg-white px-6 py-3 font-semibold text-gray-800 transition hover:bg-gray-50"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}