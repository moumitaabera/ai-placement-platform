"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

import { startInterview } from "@/services/interview.service";
import { getJobs } from "@/services/job.service";
import { getResumes } from "@/services/resume.service";

interface Job {
  id: string;
  title: string;
  description: string;
  location?: string;
  employmentType?: string;
  experienceLevel?: string;
  skills: string[];
}

interface Resume {
  id: string;
  title: string;
  fileUrl?: string;
}

type Difficulty = "EASY" | "MEDIUM" | "HARD";

export default function StartInterviewPage() {
  const router = useRouter();

  const [jobs, setJobs] = useState<Job[]>([]);
  const [resumes, setResumes] = useState<Resume[]>([]);

  const [selectedJobId, setSelectedJobId] =
    useState("");

  const [selectedResumeId, setSelectedResumeId] =
    useState("");

  const [difficulty, setDifficulty] =
    useState<Difficulty>("MEDIUM");

  const [loading, setLoading] =
    useState(true);

  const [starting, setStarting] =
    useState(false);

  const [error, setError] =
    useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError("");

        const [jobsResponse, resumesResponse] =
          await Promise.all([
            getJobs(),
            getResumes(),
          ]);

        console.log(
          "Jobs response:",
          jobsResponse
        );

        console.log(
          "Resumes response:",
          resumesResponse
        );

        /*
         * Backend response may be:
         *
         * {
         *   success: true,
         *   data: [...]
         * }
         *
         * or directly:
         *
         * [...]
         *
         * So we handle both.
         */

        const jobsData =
          Array.isArray(jobsResponse)
            ? jobsResponse
            : Array.isArray(jobsResponse?.data)
              ? jobsResponse.data
              : [];

        const resumesData =
          Array.isArray(resumesResponse)
            ? resumesResponse
            : Array.isArray(resumesResponse?.data)
              ? resumesResponse.data
              : [];

        setJobs(jobsData);
        setResumes(resumesData);

        /*
         * Automatically select the first available
         * job and resume.
         *
         * User can still change them.
         */

        if (jobsData.length > 0) {
          setSelectedJobId(jobsData[0].id);
        }

        if (resumesData.length > 0) {
          setSelectedResumeId(
            resumesData[0].id
          );
        }
      }  catch (err: unknown) {
  console.error(
    "Failed to load interview data:",
    err
  );

  if (axios.isAxiosError(err)) {
    setError(
      err.response?.data?.message ||
        "Failed to load jobs and resumes."
    );
  } else if (err instanceof Error) {
    setError(err.message);
  } else {
    setError(
      "Failed to load jobs and resumes."
    );
  }
}
      finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleStartInterview = async () => {
    setError("");

    if (!selectedJobId) {
      setError("Please select a job.");
      return;
    }

    if (!selectedResumeId) {
      setError("Please select a resume.");
      return;
    }

    try {
      setStarting(true);

      console.log(
        "Starting interview with:",
        {
          jobId: selectedJobId,
          resumeId: selectedResumeId,
          difficulty,
        }
      );

      const response =
        await startInterview({
          jobId: selectedJobId,
          resumeId: selectedResumeId,
          difficulty,
        });

      console.log(
        "Start interview response:",
        response
      );

      /*
       * Expected backend response:
       *
       * {
       *   success: true,
       *   message: "Interview started successfully",
       *   data: {
       *     session: {...},
       *     questions: [...]
       *   }
       * }
       */

      const session =
        response?.data?.session;

      const sessionId =
        session?.id;

      if (!sessionId) {
        console.error(
          "Session ID missing:",
          response
        );

        throw new Error(
          "Interview session was not created."
        );
      }

      console.log(
        "Interview session created:",
        sessionId
      );

      /*
       * IMPORTANT:
       *
       * Only redirect AFTER backend successfully
       * creates the InterviewSession.
       */

      router.push(
        `/dashboard/interview/${sessionId}`
      );
    }  catch (err: unknown) {
  console.error(
    "Start interview error:",
    err
  );

  if (axios.isAxiosError(err)) {
    setError(
      err.response?.data?.message ||
        "Failed to start interview."
    );
  } else if (err instanceof Error) {
    setError(err.message);
  } else {
    setError(
      "Failed to start interview."
    );
  }
}
    
    finally {
      setStarting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">
          Loading interview setup...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}

        <div className="mb-8">
          <button
            type="button"
            onClick={() =>
              router.push("/dashboard")
            }
            className="text-sm text-gray-600 hover:text-black mb-4"
          >
            ← Back to Dashboard
          </button>

          <h1 className="text-3xl font-bold">
            Start AI Mock Interview
          </h1>

          <p className="text-gray-600 mt-2">
            Choose a job, your resume, and interview
            difficulty before starting.
          </p>
        </div>

        {/* Main Card */}

        <div className="bg-white border rounded-2xl shadow-sm p-6 space-y-6">
          {/* Job */}

          <div>
            <label
              htmlFor="job"
              className="block text-sm font-semibold mb-2"
            >
              Select Job
            </label>

            {jobs.length === 0 ? (
              <div className="border rounded-xl p-4 bg-gray-50">
                <p className="text-gray-600">
                  No jobs available.
                </p>

                <button
                  type="button"
                  onClick={() =>
                    router.push(
                      "/dashboard/jobs"
                    )
                  }
                  className="mt-2 text-sm font-semibold underline"
                >
                  Browse Jobs
                </button>
              </div>
            ) : (
              <select
                id="job"
                value={selectedJobId}
                onChange={(e) =>
                  setSelectedJobId(
                    e.target.value
                  )
                }
                className="w-full border rounded-xl px-4 py-3 bg-white outline-none focus:ring-2 focus:ring-black"
              >
                <option value="">
                  Select a job
                </option>

                {jobs.map((job) => (
                  <option
                    key={job.id}
                    value={job.id}
                  >
                    {job.title}
                    {job.location
                      ? ` — ${job.location}`
                      : ""}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Selected Job Preview */}

          {selectedJobId && (
            <div className="rounded-xl bg-gray-50 border p-4">
              {(() => {
                const selectedJob =
                  jobs.find(
                    (job) =>
                      job.id ===
                      selectedJobId
                  );

                if (!selectedJob) {
                  return null;
                }

                return (
                  <>
                    <h3 className="font-semibold">
                      {selectedJob.title}
                    </h3>

                    {selectedJob.description && (
                      <p className="text-sm text-gray-600 mt-2 line-clamp-3">
                        {selectedJob.description}
                      </p>
                    )}

                    {selectedJob.skills?.length >
                      0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {selectedJob.skills.map(
                          (skill) => (
                            <span
                              key={skill}
                              className="text-xs px-2 py-1 rounded-full bg-white border"
                            >
                              {skill}
                            </span>
                          )
                        )}
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
          )}

          {/* Resume */}

          <div>
            <label
              htmlFor="resume"
              className="block text-sm font-semibold mb-2"
            >
              Select Resume
            </label>

            {resumes.length === 0 ? (
              <div className="border rounded-xl p-4 bg-gray-50">
                <p className="text-gray-600">
                 You don&apos;t have any uploaded
                   resume.
                       </p>

                <button
                  type="button"
                  onClick={() =>
                    router.push(
                      "/dashboard/resume"
                    )
                  }
                  className="mt-2 text-sm font-semibold underline"
                >
                  Upload Resume
                </button>
              </div>
            ) : (
              <select
                id="resume"
                value={selectedResumeId}
                onChange={(e) =>
                  setSelectedResumeId(
                    e.target.value
                  )
                }
                className="w-full border rounded-xl px-4 py-3 bg-white outline-none focus:ring-2 focus:ring-black"
              >
                <option value="">
                  Select a resume
                </option>

                 {resumes.map((resume) => (
    <option
      key={resume.id}
      value={resume.id}
    >
      {resume.title}
    </option>
  ))}
              </select>
            )}
          </div>

          {/* Difficulty */}

          <div>
            <p className="block text-sm font-semibold mb-3">
              Interview Difficulty
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Easy */}

              <button
                type="button"
                onClick={() =>
                  setDifficulty("EASY")
                }
                className={`border rounded-xl p-4 text-left transition ${
                  difficulty === "EASY"
                    ? "border-black bg-gray-100"
                    : "hover:bg-gray-50"
                }`}
              >
                <div className="font-semibold">
                  Easy
                </div>

                <p className="text-sm text-gray-500 mt-1">
                  Basic questions suitable for
                  beginners.
                </p>
              </button>

              {/* Medium */}

              <button
                type="button"
                onClick={() =>
                  setDifficulty("MEDIUM")
                }
                className={`border rounded-xl p-4 text-left transition ${
                  difficulty === "MEDIUM"
                    ? "border-black bg-gray-100"
                    : "hover:bg-gray-50"
                }`}
              >
                <div className="font-semibold">
                  Medium
                </div>

                <p className="text-sm text-gray-500 mt-1">
                  Balanced technical and
                  behavioral questions.
                </p>
              </button>

              {/* Hard */}

              <button
                type="button"
                onClick={() =>
                  setDifficulty("HARD")
                }
                className={`border rounded-xl p-4 text-left transition ${
                  difficulty === "HARD"
                    ? "border-black bg-gray-100"
                    : "hover:bg-gray-50"
                }`}
              >
                <div className="font-semibold">
                  Hard
                </div>

                <p className="text-sm text-gray-500 mt-1">
                  Advanced technical and
                  problem-solving questions.
                </p>
              </button>
            </div>
          </div>

          {/* Error */}

          {error && (
            <div className="border border-red-200 bg-red-50 text-red-700 rounded-xl p-4">
              {error}
            </div>
          )}

          {/* Start Button */}

          <button
            type="button"
            onClick={handleStartInterview}
            disabled={
              starting ||
              !selectedJobId ||
              !selectedResumeId ||
              jobs.length === 0 ||
              resumes.length === 0
            }
            className="w-full rounded-xl bg-black text-white px-6 py-3 font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition"
          >
            {starting
              ? "Starting Interview..."
              : "Start Mock Interview"}
          </button>
        </div>
      </div>
    </div>
  );
}