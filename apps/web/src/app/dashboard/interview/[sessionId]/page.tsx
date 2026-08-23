"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import {
  getInterviewSession,
  submitInterview,
} from "@/services/interview.service";

interface Question {
  type: string;
  question: string;
}

interface Feedback {
  score: number;
  communication: number;
  technical: number;
  confidence: number;
  feedback: string;
}

interface InterviewSession {
  id: string;
  difficulty: string;
  questions: Question[];
  job?: {
    title: string;
  };
}

interface Answer {
  question: string;
  answer: string;
}

export default function InterviewPage() {
  const params = useParams();
  const router = useRouter();

  const sessionId = params.sessionId as string;

  const [session, setSession] =
    useState<InterviewSession | null>(null);

  const [answers, setAnswers] =
    useState<Answer[]>([]);

  const [currentIndex, setCurrentIndex] =
    useState(0);

  const [loading, setLoading] =
    useState(true);

  const [submitting, setSubmitting] =
    useState(false);

  const [feedback, setFeedback] =
    useState<Feedback | null>(null);

  // --------------------------------------------------
  // LOAD INTERVIEW SESSION
  // --------------------------------------------------

  useEffect(() => {
    const loadSession = async () => {
      try {
        const response =
          await getInterviewSession(sessionId);

        const data = response.data;

        const questions: Question[] = Array.isArray(data.questions)
  ? data.questions
  : [];

setSession({
  ...data,
  questions,
});

setAnswers(
  questions.map((question: Question) => ({
    question: question.question,
    answer: "",
  }))
);
      } catch (error) {
        console.error(
          "Failed to load interview session:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    if (sessionId) {
      loadSession();
    }
  }, [sessionId]);

  // --------------------------------------------------
  // ANSWER CHANGE
  // --------------------------------------------------

  const handleAnswerChange = (
    value: string
  ) => {
    const updatedAnswers = [...answers];

    updatedAnswers[currentIndex] = {
      ...updatedAnswers[currentIndex],
      answer: value,
    };

    setAnswers(updatedAnswers);
  };

  // --------------------------------------------------
  // QUESTION STATUS
  // --------------------------------------------------

  const isQuestionAnswered = (
    index: number
  ) => {
    return (
      answers[index]?.answer?.trim()
        .length > 0
    );
  };

  const answeredCount = answers.filter(
    (item) =>
      item.answer.trim().length > 0
  ).length;

  const totalQuestions =
    session?.questions.length || 0;

  const progress =
    totalQuestions > 0
      ? Math.round(
          (answeredCount /
            totalQuestions) *
            100
        )
      : 0;

  // --------------------------------------------------
  // SUBMIT INTERVIEW
  // --------------------------------------------------

  const handleSubmit = async () => {
    if (!session) return;
    if (session.questions.length === 0) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white border border-gray-200 rounded-2xl p-8 text-center shadow-sm">
        <div className="w-16 h-16 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center text-3xl mx-auto">
          !
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mt-5">
          Interview Session Incomplete
        </h2>

        <p className="text-gray-500 mt-3 leading-6">
          This interview session does not contain any questions.
          Please start a new mock interview.
        </p>

        <button
          onClick={() =>
            router.push("/dashboard/interview")
          }
          className="mt-6 px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
        >
          Start New Interview
        </button>
      </div>
    </div>
  );
}

    const unansweredQuestions =
      answers.filter(
        (item) =>
          !item.answer.trim()
      ).length;

    if (unansweredQuestions > 0) {
      const confirmSubmit =
        window.confirm(
          `You have ${unansweredQuestions} unanswered question(s). Do you want to submit anyway?`
        );

      if (!confirmSubmit) {
        return;
      }
    }

    try {
      setSubmitting(true);

      const response =
        await submitInterview({
          sessionId: session.id,
          answers,
        });

      setFeedback(
        response.data.feedback
      );
    } catch (error) {
      console.error(
        "Interview submission failed:",
        error
      );

      alert(
        "Interview submission failed. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // --------------------------------------------------
  // LOADING
  // --------------------------------------------------

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-5" />

          <h2 className="text-lg font-semibold text-gray-800">
            Loading interview...
          </h2>

          <p className="text-sm text-gray-500 mt-2">
            Preparing your interview session
          </p>
        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // SESSION NOT FOUND
  // --------------------------------------------------

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white border border-gray-200 rounded-2xl p-8 text-center shadow-sm">
          <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center text-3xl mx-auto">
            !
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-5">
            Interview session not found
          </h2>

          <p className="text-gray-500 mt-3 leading-6">
            This interview session could not be found.
            Please return to your dashboard and start
            a new interview.
          </p>

          <button
            onClick={() =>
              router.push("/dashboard")
            }
            className="mt-6 px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // RESULT PAGE
  // --------------------------------------------------

  if (feedback) {
    const score = Math.max(
      0,
      Math.min(100, feedback.score)
    );

    const getScoreLabel = () => {
      if (score >= 80) {
        return {
          label: "Excellent",
          text: "You performed very well in this interview.",
        };
      }

      if (score >= 60) {
        return {
          label: "Good",
          text: "You have a solid foundation with some areas to improve.",
        };
      }

      if (score >= 40) {
        return {
          label: "Needs Improvement",
          text: "You have potential, but more preparation is recommended.",
        };
      }

      return {
        label: "Keep Practicing",
        text: "Use this feedback to strengthen your interview skills.",
      };
    };

    const scoreInfo = getScoreLabel();

    const getScoreColor = (
      value: number
    ) => {
      if (value >= 80) {
        return "text-green-600";
      }

      if (value >= 60) {
        return "text-blue-600";
      }

      if (value >= 40) {
        return "text-orange-500";
      }

      return "text-red-600";
    };

    const getProgressColor = (
      value: number
    ) => {
      if (value >= 80) {
        return "bg-green-500";
      }

      if (value >= 60) {
        return "bg-blue-500";
      }

      if (value >= 40) {
        return "bg-orange-500";
      }

      return "bg-red-500";
    };

    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-6">
        <div className="max-w-5xl mx-auto space-y-6">

          {/* ------------------------------------------------ */}
          {/* RESULT HEADER */}
          {/* ------------------------------------------------ */}

          <div className="bg-white border border-gray-200 rounded-3xl shadow-sm overflow-hidden">
            <div className="p-8 md:p-12 text-center">

              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-50 text-green-700 text-sm font-bold uppercase tracking-wide">
                <span>✓</span>
                Interview Completed
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mt-5">
                Interview Result 🎉
              </h1>

              <p className="text-gray-500 mt-2">
                {session.job?.title ||
                  "Mock Interview"}{" "}
                • {session.difficulty}
              </p>

              {/* Overall Score */}

              <div className="mt-8">
                <div
                  className={`text-7xl md:text-8xl font-bold ${getScoreColor(
                    score
                  )}`}
                >
                  {score}
                </div>

                <p className="text-gray-500 text-lg mt-1">
                  out of 100
                </p>

                <div className="mt-4">
                  <span
                    className={`inline-flex px-4 py-2 rounded-full text-sm font-bold ${
                      score >= 80
                        ? "bg-green-100 text-green-700"
                        : score >= 60
                        ? "bg-blue-100 text-blue-700"
                        : score >= 40
                        ? "bg-orange-100 text-orange-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {scoreInfo.label}
                  </span>
                </div>

                <p className="text-gray-600 mt-3 max-w-xl mx-auto">
                  {scoreInfo.text}
                </p>
              </div>

              {/* Overall Progress */}

              <div className="max-w-xl mx-auto mt-8">
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium text-gray-600">
                    Overall Performance
                  </span>

                  <span className="font-bold text-gray-900">
                    {score}%
                  </span>
                </div>

                <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      getProgressColor(score)
                    }`}
                    style={{
                      width: `${score}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ------------------------------------------------ */}
          {/* CATEGORY SCORES */}
          {/* ------------------------------------------------ */}

          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Performance Breakdown
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

              {/* Technical */}

              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">
                      Technical
                    </p>

                    <p
                      className={`text-3xl font-bold mt-2 ${getScoreColor(
                        feedback.technical
                      )}`}
                    >
                      {feedback.technical}
                    </p>
                  </div>

                  <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 text-xl">
                    💻
                  </div>
                </div>

                <div className="w-full h-2 bg-gray-100 rounded-full mt-5 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${getProgressColor(
                      feedback.technical
                    )}`}
                    style={{
                      width: `${feedback.technical}%`,
                    }}
                  />
                </div>
              </div>

              {/* Communication */}

              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">
                      Communication
                    </p>

                    <p
                      className={`text-3xl font-bold mt-2 ${getScoreColor(
                        feedback.communication
                      )}`}
                    >
                      {feedback.communication}
                    </p>
                  </div>

                  <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 text-xl">
                    💬
                  </div>
                </div>

                <div className="w-full h-2 bg-gray-100 rounded-full mt-5 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${getProgressColor(
                      feedback.communication
                    )}`}
                    style={{
                      width: `${feedback.communication}%`,
                    }}
                  />
                </div>
              </div>

              {/* Confidence */}

              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">
                      Confidence
                    </p>

                    <p
                      className={`text-3xl font-bold mt-2 ${getScoreColor(
                        feedback.confidence
                      )}`}
                    >
                      {feedback.confidence}
                    </p>
                  </div>

                  <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-green-600 text-xl">
                    🎯
                  </div>
                </div>

                <div className="w-full h-2 bg-gray-100 rounded-full mt-5 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${getProgressColor(
                      feedback.confidence
                    )}`}
                    style={{
                      width: `${feedback.confidence}%`,
                    }}
                  />
                </div>
              </div>

            </div>
          </div>

          {/* ------------------------------------------------ */}
          {/* AI FEEDBACK */}
          {/* ------------------------------------------------ */}

          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">

            <div className="p-6 md:p-7 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center text-xl">
                  🤖
                </div>

                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    AI Interview Feedback
                  </h2>

                  <p className="text-sm text-gray-500 mt-1">
                    Personalized feedback generated from your interview answers
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 md:p-7">
              <p className="text-gray-700 leading-8 whitespace-pre-line">
                {feedback.feedback}
              </p>
            </div>

          </div>

          {/* ------------------------------------------------ */}
          {/* IMPROVEMENT GUIDE */}
          {/* ------------------------------------------------ */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* Strengths */}

            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
                  💪
                </div>

                <h2 className="text-lg font-bold text-gray-900">
                  Your Focus Areas
                </h2>
              </div>

              <ul className="space-y-3 text-gray-600 text-sm leading-6">
                <li className="flex gap-2">
                  <span className="text-green-600 font-bold">
                    ✓
                  </span>
                  Review the technical topics covered in this interview.
                </li>

                <li className="flex gap-2">
                  <span className="text-green-600 font-bold">
                    ✓
                  </span>
                  Practice explaining your projects clearly and confidently.
                </li>

                <li className="flex gap-2">
                  <span className="text-green-600 font-bold">
                    ✓
                  </span>
                  Give specific examples when answering behavioral questions.
                </li>
              </ul>
            </div>

            {/* Preparation */}

            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
                  📚
                </div>

                <h2 className="text-lg font-bold text-gray-900">
                  Recommended Preparation
                </h2>
              </div>

              <ul className="space-y-3 text-gray-600 text-sm leading-6">
                <li className="flex gap-2">
                  <span className="text-purple-600 font-bold">
                    →
                  </span>
                  Practice answering technical questions without memorizing answers.
                </li>

                <li className="flex gap-2">
                  <span className="text-purple-600 font-bold">
                    →
                  </span>
                  Explain your reasoning step-by-step.
                </li>

                <li className="flex gap-2">
                  <span className="text-purple-600 font-bold">
                    →
                  </span>
                  Take another mock interview after preparation.
                </li>
              </ul>
            </div>

          </div>

          {/* ------------------------------------------------ */}
          {/* ACTION BUTTONS */}
          {/* ------------------------------------------------ */}

          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row gap-3 justify-center">

              <button
                onClick={() =>
                  router.push(
                    "/dashboard/interview/start"
                  )
                }
                className="px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
              >
                🔄 Retake Interview
              </button>

              <button
                onClick={() =>
                  router.push("/dashboard")
                }
                className="px-6 py-3 rounded-xl border border-gray-300 bg-white text-gray-700 font-semibold hover:bg-gray-50 transition"
              >
                🏠 Back to Dashboard
              </button>

            </div>
          </div>

        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // CURRENT QUESTION
  // --------------------------------------------------

  const currentQuestion =
    session.questions[currentIndex];

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">

        {/* Header */}

        <div className="bg-white border rounded-2xl p-6 shadow-sm mb-6">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

            <div>
              <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide">
                Mock Interview
              </p>

              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mt-1">
                {session.job?.title ||
                  "Interview"}
              </h1>
            </div>

            <div className="flex items-center gap-3">

              <span className="px-3 py-1.5 rounded-full bg-purple-100 text-purple-700 text-sm font-semibold">
                {session.difficulty}
              </span>

              <span className="px-3 py-1.5 rounded-full bg-gray-100 text-gray-700 text-sm font-semibold">
                {answeredCount}/{totalQuestions} Answered
              </span>

            </div>

          </div>

          {/* Progress */}

          <div className="mt-6">

            <div className="flex justify-between text-sm mb-2">

              <span className="font-medium text-gray-700">
                Interview Progress
              </span>

              <span className="font-semibold text-blue-600">
                {progress}%
              </span>

            </div>

            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 rounded-full transition-all duration-300"
                style={{
                  width: `${progress}%`,
                }}
              />
            </div>

          </div>

        </div>

        {/* Main Layout */}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

          {/* Question Sidebar */}

          <div className="lg:col-span-1">

            <div className="bg-white border rounded-2xl p-5 shadow-sm lg:sticky lg:top-6">

              <h2 className="font-bold text-gray-900 mb-4">
                Questions
              </h2>

              <div className="space-y-2">

                {session.questions.map(
                  (question, index) => {

                    const answered =
                      isQuestionAnswered(
                        index
                      );

                    const active =
                      index ===
                      currentIndex;

                    return (
                      <button
                        key={index}
                        onClick={() =>
                          setCurrentIndex(
                            index
                          )
                        }
                        className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition ${
                          active
                            ? "bg-blue-600 text-white"
                            : answered
                            ? "bg-green-50 text-green-700 border border-green-200"
                            : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                        }`}
                      >

                        <span
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                            active
                              ? "bg-white text-blue-600"
                              : answered
                              ? "bg-green-500 text-white"
                              : "bg-gray-200 text-gray-600"
                          }`}
                        >
                          {answered
                            ? "✓"
                            : index + 1}
                        </span>

                        <span className="text-sm font-medium truncate">
                          Question{" "}
                          {index + 1}
                        </span>

                      </button>
                    );
                  }
                )}

              </div>

            </div>

          </div>

          {/* Current Question */}

          <div className="lg:col-span-3">

            <div className="bg-white border rounded-2xl shadow-sm overflow-hidden">

              {/* Question Header */}

              <div className="p-6 border-b">

                <div className="flex items-center justify-between gap-4">

                  <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-semibold">
                    {currentQuestion.type}
                  </span>

                  <span className="text-sm font-medium text-gray-500">
                    Question{" "}
                    {currentIndex + 1}{" "}
                    of{" "}
                    {totalQuestions}
                  </span>

                </div>

                <h2 className="text-xl md:text-2xl font-bold text-gray-900 leading-relaxed mt-5">
                  {currentQuestion.question}
                </h2>

              </div>

              {/* Answer */}

              <div className="p-6">

                <div className="flex items-center justify-between mb-2">

                  <label className="font-semibold text-gray-800">
                    Your Answer
                  </label>

                  <span className="text-xs text-gray-500">
                    {
                      answers[
                        currentIndex
                      ]?.answer.length || 0
                    }{" "}
                    characters
                  </span>

                </div>

                <textarea
                  rows={9}
                  value={
                    answers[
                      currentIndex
                    ]?.answer || ""
                  }
                  onChange={(event) =>
                    handleAnswerChange(
                      event.target.value
                    )
                  }
                  placeholder="Write your answer here. Explain your approach clearly and provide examples where appropriate..."
                  className="w-full border border-gray-300 rounded-xl p-4 text-gray-800 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-y transition"
                />

              </div>

              {/* Navigation */}

              <div className="p-6 border-t bg-gray-50">

                <div className="flex items-center justify-between gap-4">

                  <button
                    disabled={
                      currentIndex === 0
                    }
                    onClick={() =>
                      setCurrentIndex(
                        currentIndex - 1
                      )
                    }
                    className="px-5 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-700 font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition"
                  >
                    ← Previous
                  </button>

                  {currentIndex <
                  totalQuestions - 1 ? (
                    <button
                      onClick={() =>
                        setCurrentIndex(
                          currentIndex + 1
                        )
                      }
                      className="px-6 py-2.5 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
                    >
                      Save & Next →
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmit}
                      disabled={submitting}
                      className="px-6 py-2.5 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                      {submitting
                        ? "Evaluating..."
                        : "Submit Interview ✓"}
                    </button>
                  )}

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}