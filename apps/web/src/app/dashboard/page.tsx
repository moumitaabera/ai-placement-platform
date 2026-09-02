"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { getAccessToken } from "@/lib/auth";
import { getMe } from "@/services/auth.service";
import {
  getStudentDashboard,
  getRecruiterDashboard,
} from "@/services/dashboard.service";
import { getInterviewHistory } from "@/services/interview.service";
import { getMyApplications } from "@/services/application.service";
import { getNotifications } from "@/services/notification.service";

import DashboardCard from "@/components/dashboard/DashboardCard";
import RecruiterDashboard from "@/components/dashboard/RecruiterDashboard";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface DashboardStats {
  totalApplications: number;
  applied: number;
  reviewing: number;
  shortlisted: number;
  interviews: number;
  hired: number;
  rejected: number;
}

interface RecruiterStats {
  totalJobs: number;
  activeJobs: number;
  closedJobs: number;
  draftJobs: number;
  totalApplications: number;
  shortlisted: number;
  interviews: number;
  hired: number;
  rejected: number;
}

interface InterviewHistory {
  id: string;
  jobId: string | null;
  jobTitle: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  status: "Completed" | "In Progress";
  startedAt: string;
  completedAt: string | null;
  score: number | null;
  technical: number | null;
  communication: number | null;
  confidence: number | null;
  feedback: string | null;
}

interface Application {
  id: string;
  status?: string;
  createdAt?: string;
  job?: {
    id?: string;
    title?: string;
    companyName?: string;
    company?: string;
  };
}

interface Notification {
  id: string;
  title?: string;
  message?: string;
  read?: boolean;
  isRead?: boolean;
  createdAt?: string;
}

export default function DashboardPage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);

  const [studentStats, setStudentStats] =
    useState<DashboardStats | null>(null);

  const [recruiterStats, setRecruiterStats] =
    useState<RecruiterStats | null>(null);

  const [interviewHistory, setInterviewHistory] =
    useState<InterviewHistory[]>([]);

  const [applications, setApplications] =
    useState<Application[]>([]);

  const [notifications, setNotifications] =
    useState<Notification[]>([]);

  useEffect(() => {
    const token = getAccessToken();

    if (!token) {
      router.push("/login");
      return;
    }

    const loadData = async () => {
      try {
        const userResponse = await getMe();

        const currentUser = userResponse.data;

        setUser(currentUser);

        if (currentUser.role === "STUDENT") {
          const dashboardResponse =
            await getStudentDashboard();

          setStudentStats(
            dashboardResponse.data
          );

          // =============================
          // APPLICATIONS
          // =============================

          try {
            const applicationsResponse =
              await getMyApplications();

            setApplications(
              applicationsResponse.data ?? []
            );
          } catch (error) {
            console.error(
              "Applications loading error:",
              error
            );

            setApplications([]);
          }

          // =============================
          // NOTIFICATIONS
          // =============================

          try {
            const notificationsResponse =
              await getNotifications();

            setNotifications(
              notificationsResponse.data ?? []
            );
          } catch (error) {
            console.error(
              "Notifications loading error:",
              error
            );

            setNotifications([]);
          }

          // =============================
          // INTERVIEW HISTORY
          // =============================

          try {
            const interviewResponse =
              await getInterviewHistory();

            setInterviewHistory(
              interviewResponse.data ?? []
            );
          } catch (error) {
            console.error(
              "Interview history loading error:",
              error
            );

            setInterviewHistory([]);
          }
        } else {
          const dashboardResponse =
            await getRecruiterDashboard();

          setRecruiterStats(
            dashboardResponse.data
          );
        }
      } catch (error) {
        console.error(
          "Dashboard loading error:",
          error
        );

        router.push("/login");
      }
    };

    loadData();
  }, [router]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">
          Loading...
        </p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">
        Welcome, {user.name}
      </h1>

      <p className="text-gray-600 mt-2">
        {user.email}
      </p>

      {/* ============================= */}
      {/* STUDENT DASHBOARD */}
      {/* ============================= */}

      {user.role === "STUDENT" ? (
        <>
          {/* ============================= */}
          {/* DASHBOARD STATISTICS */}
          {/* ============================= */}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
            <DashboardCard
              title="Total Applications"
              value={
                studentStats?.totalApplications ?? 0
              }
            />

            <DashboardCard
              title="Applied"
              value={
                studentStats?.applied ?? 0
              }
            />

            <DashboardCard
              title="Reviewing"
              value={
                studentStats?.reviewing ?? 0
              }
            />

            <DashboardCard
              title="Shortlisted"
              value={
                studentStats?.shortlisted ?? 0
              }
            />

            <DashboardCard
              title="Interviews"
              value={
                studentStats?.interviews ?? 0
              }
            />

            <DashboardCard
              title="Hired"
              value={
                studentStats?.hired ?? 0
              }
            />

            <DashboardCard
              title="Rejected"
              value={
                studentStats?.rejected ?? 0
              }
            />
          </div>

          {/* ============================= */}
{/* RECENT APPLICATIONS + NOTIFICATIONS */}
{/* ============================= */}

<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-10">

  {/* RECENT APPLICATIONS */}

  <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
    <div className="flex items-start justify-between gap-4 mb-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">
          Recent Applications
        </h2>

        <p className="text-sm text-gray-500 mt-1">
          Your latest job applications.
        </p>
      </div>

      <button
        type="button"
        onClick={() =>
          router.push("/dashboard/applications")
        }
        className="shrink-0 text-sm font-semibold text-gray-600 hover:text-gray-900 hover:underline transition"
      >
        View All
      </button>
    </div>

    {applications.length === 0 ? (
      <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 py-10 text-center">
        <div className="text-2xl mb-2">
          📄
        </div>

        <p className="text-sm text-gray-500">
          No applications yet.
        </p>

        <button
          type="button"
          onClick={() =>
            router.push("/dashboard/jobs")
          }
          className="mt-4 rounded-xl bg-black px-4 py-2 text-sm font-semibold text-white hover:opacity-90 transition"
        >
          Browse Jobs
        </button>
      </div>
    ) : (
      <div className="space-y-3">
        {applications
          .slice(0, 3)
          .map((application) => (
            <div
              key={application.id}
              className="group rounded-xl border border-gray-200 p-4 transition-all duration-200 hover:border-gray-300 hover:bg-gray-50"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate">
                    {application.job?.title ??
                      "Job Application"}
                  </h3>

                  <p className="text-sm text-gray-500 mt-1 truncate">
                    {application.job?.companyName ??
                      application.job?.company ??
                      "Company"}
                  </p>
                </div>

                <span className="shrink-0 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                  {application.status ?? "Applied"}
                </span>
              </div>
            </div>
          ))}
      </div>
    )}
  </div>

  {/* RECENT NOTIFICATIONS

  <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
    <div className="flex items-start justify-between gap-4 mb-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">
          Recent Notifications
        </h2>

        <p className="text-sm text-gray-500 mt-1">
          Stay updated with your activity.
        </p>
      </div>

      <button
        type="button"
        onClick={() =>
          router.push("/dashboard/notifications")
        }
        className="shrink-0 text-sm font-semibold text-gray-600 hover:text-gray-900 hover:underline transition"
      >
        View All
      </button>
    </div>

    {notifications.length === 0 ? (
      <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 py-10 text-center">
        <div className="text-2xl mb-2">
          🔔
        </div>

        <p className="text-sm text-gray-500">
          No notifications yet.
        </p>
      </div>
    ) : (
      <div className="space-y-3">
        {notifications
          .slice(0, 3)
          .map((notification) => {
            const read =
              notification.read ??
              notification.isRead ??
              false;

            return (
              <div
                key={notification.id}
                className={`rounded-xl border p-4 transition-all duration-200 ${
                  !read
                    ? "border-gray-200 bg-gray-50"
                    : "border-gray-200 bg-white"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      {!read && (
                        <span className="h-2 w-2 shrink-0 rounded-full bg-blue-500" />
                      )}

                      <h3 className="font-semibold text-gray-900 truncate">
                        {notification.title ??
                          "Notification"}
                      </h3>
                    </div>

                    <p className="text-sm text-gray-600 mt-1 leading-6">
                      {notification.message ??
                        "You have a new notification."}
                    </p>
                  </div>

                  {!read && (
                    <span className="shrink-0 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
                      New
                    </span>
                  )}
                </div>
              </div>
            );
          })}
      </div>
    )}
  </div> */}

</div>

          

            {/* RECENT NOTIFICATIONS */}

            <div className="border rounded-2xl p-6 bg-white shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-xl font-bold">
                    Recent Notifications
                  </h2>

                  <p className="text-gray-500 text-sm mt-1">
                    Stay updated with your activity.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    router.push(
                      "/dashboard/notifications"
                    )
                  }
                  className="text-sm font-semibold hover:underline"
                >
                  View All
                </button>
              </div>

              {notifications.length === 0 ? (
                <div className="py-8 text-center">
                  <p className="text-gray-500">
                    No notifications yet.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {notifications
                    .slice(0, 3)
                    .map((notification) => {
                      const read =
                        notification.read ??
                        notification.isRead ??
                        false;

                      return (
                        <div
                          key={notification.id}
                          className={`border rounded-xl p-4 ${
                            !read
                              ? "bg-gray-50"
                              : ""
                          }`}
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <h3 className="font-semibold">
                                {notification.title ??
                                  "Notification"}
                              </h3>

                              <p className="text-sm text-gray-600 mt-1">
                                {notification.message ??
                                  "You have a new notification."}
                              </p>
                            </div>

                            {!read && (
                              <span className="text-xs font-semibold">
                                New
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>

          {/* ============================= */}
          {/* QUICK ACTIONS */}
          {/* ============================= */}

          <div className="mt-10">
            <h2 className="text-2xl font-bold mb-5">
              Quick Actions
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <button
                type="button"
                onClick={() =>
                  router.push("/profile")
                }
                className="border rounded-xl p-5 text-left hover:bg-gray-50 transition"
              >
                <h3 className="font-semibold">
                  Profile
                </h3>

                <p className="text-sm text-gray-500 mt-1">
                  View and update your profile.
                </p>
              </button>

              <button
                type="button"
                onClick={() =>
                  router.push("/dashboard/resume")
                }
                className="border rounded-xl p-5 text-left hover:bg-gray-50 transition"
              >
                <h3 className="font-semibold">
                  Resume
                </h3>

                <p className="text-sm text-gray-500 mt-1">
                  Manage your resume.
                </p>
              </button>

              <button
                type="button"
                onClick={() =>
                  router.push("/dashboard/jobs")
                }
                className="border rounded-xl p-5 text-left hover:bg-gray-50 transition"
              >
                <h3 className="font-semibold">
                  Find Jobs
                </h3>

                <p className="text-sm text-gray-500 mt-1">
                  Browse available jobs.
                </p>
              </button>

              <button
                type="button"
                onClick={() =>
                  router.push(
                    "/dashboard/interview/start"
                  )
                }
                className="border rounded-xl p-5 text-left hover:bg-gray-50 transition"
              >
                <h3 className="font-semibold">
                  Mock Interview
                </h3>

                <p className="text-sm text-gray-500 mt-1">
                  Practice with AI.
                </p>
              </button>
            </div>
          </div>

          {/* ============================= */}
          {/* MOCK INTERVIEW */}
          {/* ============================= */}

          <div className="mt-10">
            <div className="border rounded-2xl p-6 bg-white shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div>
                  <h2 className="text-2xl font-bold">
                    AI Mock Interview
                  </h2>

                  <p className="text-gray-600 mt-2">
                    Practice interviews with AI-generated
                    questions based on your resume and the
                    job you are applying for.
                  </p>

                  <div className="flex flex-wrap gap-2 mt-4">
                    <span className="px-3 py-1 text-sm rounded-full bg-gray-100">
                      Resume-based
                    </span>

                    <span className="px-3 py-1 text-sm rounded-full bg-gray-100">
                      Job-specific
                    </span>

                    <span className="px-3 py-1 text-sm rounded-full bg-gray-100">
                      AI Feedback
                    </span>

                    <span className="px-3 py-1 text-sm rounded-full bg-gray-100">
                      Score
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    router.push(
                      "/dashboard/interview/start"
                    )
                  }
                  className="shrink-0 rounded-xl bg-black px-6 py-3 text-white font-semibold hover:opacity-90 transition"
                >
                  Start Mock Interview
                </button>
              </div>
            </div>
          </div>

          {/* ============================= */}
          {/* INTERVIEW HISTORY */}
          {/* ============================= */}

          <div className="mt-10">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold">
                  Interview History
                </h2>

                <p className="text-gray-600 mt-1">
                  Review your previous AI mock interviews
                  and performance.
                </p>
              </div>
            </div>

            {interviewHistory.length === 0 ? (
              <div className="border rounded-2xl p-8 bg-white shadow-sm text-center">
                <h3 className="text-lg font-semibold">
                  No interviews yet
                </h3>

                <p className="text-gray-500 mt-2">
                  Complete an AI mock interview to see
                  your results here.
                </p>

                <button
                  type="button"
                  onClick={() =>
                    router.push(
                      "/dashboard/interview/start"
                    )
                  }
                  className="mt-5 rounded-xl bg-black px-5 py-2.5 text-white font-semibold hover:opacity-90 transition"
                >
                  Start Mock Interview
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {interviewHistory.map((interview) => (
                  <div
                    key={interview.id}
                    className="border rounded-2xl p-6 bg-white shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-xl font-bold">
                          {interview.jobTitle}
                        </h3>

                        <div className="flex flex-wrap gap-2 mt-3">
                          <span className="px-3 py-1 text-sm rounded-full bg-gray-100">
                            {interview.difficulty}
                          </span>

                          <span
                            className={`px-3 py-1 text-sm rounded-full ${
                              interview.status ===
                              "Completed"
                                ? "bg-green-100 text-green-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {interview.status}
                          </span>
                        </div>
                      </div>

                      {interview.score !== null && (
                        <div className="text-right">
                          <p className="text-sm text-gray-500">
                            Score
                          </p>

                          <p className="text-2xl font-bold">
                            {interview.score}/100
                          </p>
                        </div>
                      )}
                    </div>

                    {interview.status === "Completed" && (
                      <div className="grid grid-cols-3 gap-3 mt-6">
                        <div className="rounded-xl bg-gray-50 p-3">
                          <p className="text-xs text-gray-500">
                            Technical
                          </p>

                          <p className="text-lg font-semibold mt-1">
                            {interview.technical ??
                              "—"}
                          </p>
                        </div>

                        <div className="rounded-xl bg-gray-50 p-3">
                          <p className="text-xs text-gray-500">
                            Communication
                          </p>

                          <p className="text-lg font-semibold mt-1">
                            {interview.communication ??
                              "—"}
                          </p>
                        </div>

                        <div className="rounded-xl bg-gray-50 p-3">
                          <p className="text-xs text-gray-500">
                            Confidence
                          </p>

                          <p className="text-lg font-semibold mt-1">
                            {interview.confidence ??
                              "—"}
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="mt-6">
                      {interview.status ===
                      "Completed" ? (
                        <button
                          type="button"
                          onClick={() =>
                            router.push(
                              `/dashboard/interview/result/${interview.id}`
                            )
                          }
                          className="w-full rounded-xl border px-4 py-3 font-semibold hover:bg-gray-50 transition"
                        >
                          View Result
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() =>
                            router.push(
                              `/dashboard/interview/${interview.id}`
                            )
                          }
                          className="w-full rounded-xl border px-4 py-3 font-semibold hover:bg-gray-50 transition"
                        >
                          Continue Interview
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      ) : (
        /* ============================= */
        /* RECRUITER DASHBOARD */
        /* ============================= */

        recruiterStats && (
          <RecruiterDashboard
            stats={recruiterStats}
          />
        )
      )}
    </div>
  );
}
