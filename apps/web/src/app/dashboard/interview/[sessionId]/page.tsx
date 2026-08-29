


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

  const [error, setError] =
    useState("");

  // --------------------------------------------------
  // LOAD INTERVIEW SESSION
  // --------------------------------------------------

  useEffect(() => {
    if (!sessionId) return;

    const loadSession = async () => {
      try {
        setLoading(true);
        setError("");

        const response =
          await getInterviewSession(sessionId);

        const data = response.data;

        const questions: Question[] =
          Array.isArray(data.questions)
            ? data.questions
            : [];

        setSession({
          ...data,
          questions,
        });

        setAnswers(
          questions.map((question) => ({
            question: question.question,
            answer: "",
          }))
        );
      } catch (error) {
        console.error(
          "Failed to load interview session:",
          error
        );

        setError(
          "Failed to load interview session. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    loadSession();
  }, [sessionId]);

  // --------------------------------------------------
  // ANSWER CHANGE
  // --------------------------------------------------

  const handleAnswerChange = (
    value: string
  ) => {
    setAnswers((previousAnswers) => {
      const updatedAnswers = [
        ...previousAnswers,
      ];

      updatedAnswers[currentIndex] = {
        ...updatedAnswers[currentIndex],
        answer: value,
      };

      return updatedAnswers;
    });
  };

  // --------------------------------------------------
  // QUESTION STATUS
  // --------------------------------------------------

  const isQuestionAnswered = (
    index: number
  ) => {
    return (
      answers[index]?.answer?.trim().length > 0
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
      setError(
        "This interview session does not contain any questions."
      );
      return;
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
      setError("");

      const response =
        await submitInterview({
          sessionId: session.id,
          answers,
        });

      console.log(
        "Interview submission response:",
        response
      );

      /*
       * Interview evaluation is completed
       * by the backend.
       *
       * Now redirect to the dedicated
       * result page.
       */

      router.push(
  `/dashboard/interview/result/${session.id}`
);
    } catch (error) {
      console.error(
        "Interview submission failed:",
        error
      );

      setError(
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
            {error ||
              "This interview session could not be found. Please return to your dashboard and start a new interview."}
          </p>

          <button
            type="button"
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
  // EMPTY QUESTIONS
  // --------------------------------------------------

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
            This interview session does not contain
            any questions. Please start a new mock
            interview.
          </p>

          <button
            type="button"
            onClick={() =>
              router.push(
                "/dashboard/interview/start"
              )
            }
            className="mt-6 px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
          >
            Start New Interview
          </button>
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

        {/* ------------------------------------------------ */}
        {/* HEADER */}
        {/* ------------------------------------------------ */}

        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm mb-6">

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
                {answeredCount}/
                {totalQuestions} Answered
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

        {/* ------------------------------------------------ */}
        {/* ERROR */}
        {/* ------------------------------------------------ */}

        {error && (
          <div className="mb-6 border border-red-200 bg-red-50 text-red-700 rounded-xl p-4">
            {error}
          </div>
        )}

        {/* ------------------------------------------------ */}
        {/* MAIN LAYOUT */}
        {/* ------------------------------------------------ */}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

          {/* ------------------------------------------------ */}
          {/* QUESTION SIDEBAR */}
          {/* ------------------------------------------------ */}

          <div className="lg:col-span-1">

            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm lg:sticky lg:top-6">

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
                        type="button"
                        key={`${index}-${question.question}`}
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
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
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

          {/* ------------------------------------------------ */}
          {/* CURRENT QUESTION */}
          {/* ------------------------------------------------ */}

          <div className="lg:col-span-3">

            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">

              {/* Question Header */}

              <div className="p-6 border-b border-gray-200">

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

                  <label
                    htmlFor="interview-answer"
                    className="font-semibold text-gray-800"
                  >
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
                  id="interview-answer"
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

                <p className="text-xs text-gray-500 mt-2">
                  Tip: Explain your reasoning clearly
                  and use examples when possible.
                </p>

              </div>

              {/* ------------------------------------------------ */}
              {/* NAVIGATION */}
              {/* ------------------------------------------------ */}

              <div className="p-6 border-t border-gray-200 bg-gray-50">

                <div className="flex items-center justify-between gap-4">

                  <button
                    type="button"
                    disabled={
                      currentIndex === 0 ||
                      submitting
                    }
                    onClick={() =>
                      setCurrentIndex(
                        (previous) =>
                          previous - 1
                      )
                    }
                    className="px-5 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-700 font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition"
                  >
                    ← Previous
                  </button>

                  {currentIndex <
                  totalQuestions - 1 ? (

                    <button
                      type="button"
                      disabled={submitting}
                      onClick={() =>
                        setCurrentIndex(
                          (previous) =>
                            previous + 1
                        )
                      }
                      className="px-6 py-2.5 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                      Save & Next →
                    </button>

                  ) : (

                    <button
                      type="button"
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