"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

interface AdminStats {
  totalStudents: number;
  totalRecruiters: number;
  totalJobs: number;
  activeJobs: number;
  totalApplications: number;
  totalInterviews: number;
  completedInterviews: number;
  totalResumes: number;
}

interface AdminStatsResponse {
  success: boolean;
  data: AdminStats;
  message?: string;
}

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "STUDENT" | "RECRUITER" | "ADMIN";
  provider: "LOCAL" | "GOOGLE";
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

interface AdminUsersResponse {
  success: boolean;
  data: AdminUser[];
  message?: string;
}

interface AdminJob {
  id: string;
  title: string;
  description?: string;
  location?: string | null;
  salary?: string | null;
  employmentType?: string;
  experienceLevel?: string;
  skills?: string[];
  deadline?: string | null;
  status: "ACTIVE" | "CLOSED" | "DRAFT";
  createdAt: string;
  updatedAt: string;

  recruiter?: {
    id: string;
    designation?: string | null;

    user?: {
      id: string;
      name: string;
      email: string;
    };
  } | null;

  company?: {
    id: string;
    name: string;
    logo?: string | null;
  } | null;

  _count?: {
    applications?: number;
    interviewSessions?: number;
  };
}

interface AdminJobsResponse {
  success: boolean;
  data: AdminJob[];
  message?: string;
}

/*
 * =========================
 * Admin Application Types
 * =========================
 */

interface AdminApplication {
  id: string;

  status:
    | "APPLIED"
    | "REVIEWING"
    | "SHORTLISTED"
    | "INTERVIEW"
    | "REJECTED"
    | "HIRED";

  appliedAt: string;

  student?: {
    user?: {
      name: string;
      email: string;
    } | null;
  } | null;

  job?: {
    title: string;
    employmentType?: string | null;
    location?: string | null;

    recruiter?: {
      user?: {
        name: string;
        email: string;
      } | null;

      company?: {
        name: string;
      } | null;
    } | null;
  } | null;

  resume?: {
    id: string;
    title: string;
    fileUrl: string;
  } | null;
}

interface AdminApplicationsResponse {
  success: boolean;
  data: AdminApplication[];
  message?: string;
}

export default function AdminDashboardPage() {
  const router = useRouter();

  const [stats, setStats] =
    useState<AdminStats | null>(null);

  const [users, setUsers] =
    useState<AdminUser[]>([]);

  const [jobs, setJobs] =
    useState<AdminJob[]>([]);

  const [applications, setApplications] =
    useState<AdminApplication[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [deletingUserId, setDeletingUserId] =
    useState<string | null>(null);

  /*
   * =========================
   * Load Admin Data
   * =========================
   */

  useEffect(() => {
    const loadAdminData = async () => {
      try {
        setLoading(true);
        setError("");

        const token =
          localStorage.getItem("accessToken") ||
          localStorage.getItem("token");
          console.log("ADMIN TOKEN:", token);

        if (!token) {
          router.push("/login");
          return;
        }

        /*
         * Load:
         *
         * 1. Admin statistics
         * 2. Admin users
         * 3. Admin jobs
         * 4. Admin applications
         */

        const [
  statsResponse,
  usersResponse,
  jobsResponse,
  applicationsResponse,
] = await Promise.all([
  api.get<AdminStatsResponse>("/admin/stats", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }),

  api.get<AdminUsersResponse>("/admin/users", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }),

  api.get<AdminJobsResponse>("/admin/jobs", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }),

  api.get<AdminApplicationsResponse>("/admin/applications", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }),
]);

        /*
         * =========================
         * Stats
         * =========================
         */

        if (!statsResponse.data.success) {
          throw new Error(
            statsResponse.data.message ||
              "Failed to load admin statistics"
          );
        }

        setStats(statsResponse.data.data);

        /*
         * =========================
         * Users
         * =========================
         */

        if (!usersResponse.data.success) {
          throw new Error(
            usersResponse.data.message ||
              "Failed to load users"
          );
        }

        setUsers(usersResponse.data.data);

        /*
         * =========================
         * Jobs
         * =========================
         */

        if (!jobsResponse.data.success) {
          throw new Error(
            jobsResponse.data.message ||
              "Failed to load jobs"
          );
        }

        setJobs(jobsResponse.data.data);

        /*
         * =========================
         * Applications
         * =========================
         */

        if (!applicationsResponse.data.success) {
          throw new Error(
            applicationsResponse.data.message ||
              "Failed to load applications"
          );
        }

        setApplications(
          applicationsResponse.data.data
        );
        } catch (err: unknown) {
  console.error(
    "Admin dashboard error:",
    err
  );

  if (err instanceof Error) {
    setError(err.message);
  } else {
    setError(
      "Failed to load admin dashboard."
    );
  }
      
      } finally {
        setLoading(false);
      }
    };

    loadAdminData();
  }, [router]);

  /*
   * =========================
   * Delete User
   * =========================
   */

  const handleDeleteUser = async (
    user: AdminUser
  ) => {
    /*
     * Prevent deleting an admin account.
     */

    if (user.role === "ADMIN") {
      alert(
        "Admin users cannot be deleted."
      );

      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete ${user.name}?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingUserId(user.id);
      setError("");

      const token =
        localStorage.getItem("accessToken") ||
        localStorage.getItem("token");

      if (!token) {
        router.push("/login");
        return;
      }

      const response = await api.delete(
  `/admin/users/${user.id}`,
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);

      if (!response.data.success) {
        throw new Error(
          response.data.message ||
            "Failed to delete user"
        );
      }

      /*
       * Remove deleted user from table
       * without reloading the page.
       */

      setUsers((currentUsers) =>
        currentUsers.filter(
          (currentUser) =>
            currentUser.id !== user.id
        )
      );

      /*
       * Update statistics immediately.
       */

      setStats((currentStats) => {
        if (!currentStats) {
          return currentStats;
        }

        if (user.role === "STUDENT") {
          return {
            ...currentStats,
            totalStudents: Math.max(
              0,
              currentStats.totalStudents - 1
            ),
          };
        }

        if (user.role === "RECRUITER") {
          return {
            ...currentStats,
            totalRecruiters: Math.max(
              0,
              currentStats.totalRecruiters - 1
            ),
          };
        }

        return currentStats;
      });

      alert(
        response.data.message ||
          "User deleted successfully"
      );
    } catch (err: unknown) {
  console.error(
    "Delete user error:",
    err
  );

  if (err instanceof Error) {
    setError(err.message);
  } else {
    setError(
      "Failed to delete user."
    );
  }

    } finally {
      setDeletingUserId(null);
    }
  };

  /*
   * =========================
   * Loading
   * =========================
   */

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">
          Loading admin dashboard...
        </p>
      </div>
    );
  }

  /*
   * =========================
   * Error
   * =========================
   */

  if (error && !stats) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="rounded-2xl border bg-white p-8 shadow-sm text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Unable to load dashboard
          </h1>

          <p className="mt-2 text-red-600">
            {error}
          </p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  /*
   * =========================
   * Statistics Cards
   * =========================
   */

  const cards = [
    {
      title: "Total Students",
      value: stats.totalStudents,
      description: "Registered students",
    },
    {
      title: "Total Recruiters",
      value: stats.totalRecruiters,
      description: "Registered recruiters",
    },
    {
      title: "Total Jobs",
      value: stats.totalJobs,
      description: "Jobs posted",
    },
    {
      title: "Active Jobs",
      value: stats.activeJobs,
      description: "Currently active",
    },
    {
      title: "Applications",
      value: stats.totalApplications,
      description: "Total applications",
    },
    {
      title: "Interviews",
      value: stats.totalInterviews,
      description: "Interview sessions",
    },
    {
      title: "Completed Interviews",
      value: stats.completedInterviews,
      description: "Successfully completed",
    },
    {
      title: "Resumes",
      value: stats.totalResumes,
      description: "Uploaded resumes",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl p-6 md:p-8">

        {/* ========================= */}
        {/* Header */}
        {/* ========================= */}

        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-gray-500">
            Administration
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
            Admin Dashboard
          </h1>

          <p className="mt-2 text-gray-600">
            Overview of your AI Placement Platform.
          </p>
        </div>

        {/* ========================= */}
        {/* Error */}
        {/* ========================= */}

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        {/* ========================= */}
        {/* Stats */}
        {/* ========================= */}

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((card) => (
            <div
              key={card.title}
              className="rounded-2xl border bg-white p-6 shadow-sm"
            >
              <p className="text-sm font-medium text-gray-500">
                {card.title}
              </p>

              <p className="mt-3 text-3xl font-bold text-gray-900">
                {card.value}
              </p>

              <p className="mt-2 text-sm text-gray-500">
                {card.description}
              </p>
            </div>
          ))}
        </div>

        {/* ========================= */}
        {/* Admin Management */}
        {/* ========================= */}

        <div className="mt-8 rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900">
            Admin Management
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Manage the platform from one place.
          </p>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">

            {/* User Management */}

            <button
              type="button"
              onClick={() =>
                document
                  .getElementById(
                    "users-section"
                  )
                  ?.scrollIntoView({
                    behavior: "smooth",
                  })
              }
              className="rounded-xl border px-4 py-3 text-left font-semibold transition hover:bg-gray-50"
            >
              User Management
            </button>

            {/* Job Management */}

            <button
              type="button"
              onClick={() =>
                document
                  .getElementById(
                    "jobs-section"
                  )
                  ?.scrollIntoView({
                    behavior: "smooth",
                  })
              }
              className="rounded-xl border px-4 py-3 text-left font-semibold transition hover:bg-gray-50"
            >
              Job Management
            </button>

            {/* Applications */}

            <button
              type="button"
              onClick={() =>
                document
                  .getElementById(
                    "applications-section"
                  )
                  ?.scrollIntoView({
                    behavior: "smooth",
                  })
              }
              className="rounded-xl border px-4 py-3 text-left font-semibold transition hover:bg-gray-50"
            >
              Applications
            </button>

            {/* Analytics */}

            <button
  type="button"
  onClick={() =>
    document
      .getElementById("analytics-section")
      ?.scrollIntoView({
        behavior: "smooth",
      })
  }
  className="rounded-xl border px-4 py-3 text-left font-semibold transition hover:bg-gray-50"
>
  Analytics
</button>

          </div>
        </div>

        {/* ========================= */}
        {/* Users Table */}
        {/* ========================= */}

        <div
          id="users-section"
          className="mt-8 rounded-2xl border bg-white shadow-sm"
        >

          {/* Table Header */}

          <div className="border-b px-6 py-5">
            <h2 className="text-xl font-bold text-gray-900">
              User Management
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              View and manage all registered users.
            </p>
          </div>

          {/* Table */}

          {users.length === 0 ? (
            <div className="p-6 text-gray-500">
              No users found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">

                <thead className="border-b bg-gray-50">
                  <tr>

                    <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                      Name
                    </th>

                    <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                      Email
                    </th>

                    <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                      Role
                    </th>

                    <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                      Provider
                    </th>

                    <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                      Verified
                    </th>

                    <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                      Created
                    </th>

                    <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                      Actions
                    </th>

                  </tr>
                </thead>

                <tbody>
                  {users.map((user) => (
                    <tr
                      key={user.id}
                      className="border-b last:border-b-0 hover:bg-gray-50"
                    >

                      {/* Name */}

                      <td className="px-6 py-4">
                        <p className="font-semibold text-gray-900">
                          {user.name}
                        </p>
                      </td>

                      {/* Email */}

                      <td className="px-6 py-4 text-sm text-gray-600">
                        {user.email}
                      </td>

                      {/* Role */}

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                            user.role === "ADMIN"
                              ? "bg-purple-100 text-purple-700"
                              : user.role ===
                                "RECRUITER"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>

                      {/* Provider */}

                      <td className="px-6 py-4 text-sm text-gray-600">
                        {user.provider}
                      </td>

                      {/* Verified */}

                      <td className="px-6 py-4">
                        <span
                          className={`text-sm font-semibold ${
                            user.isVerified
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {user.isVerified
                            ? "Verified"
                            : "Not Verified"}
                        </span>
                      </td>

                      {/* Created */}

                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(
                          user.createdAt
                        ).toLocaleDateString()}
                      </td>

                      {/* Actions */}

                      <td className="px-6 py-4">
                        {user.role ===
                        "ADMIN" ? (
                          <span className="text-xs font-medium text-gray-400">
                            Protected
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() =>
                              handleDeleteUser(
                                user
                              )
                            }
                            disabled={
                              deletingUserId ===
                              user.id
                            }
                            className="rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {deletingUserId ===
                            user.id
                              ? "Deleting..."
                              : "Delete"}
                          </button>
                        )}
                      </td>

                    </tr>
                  ))}
                </tbody>

              </table>
            </div>
          )}

        </div>

        {/* ========================= */}
        {/* Jobs Table */}
        {/* ========================= */}

        <div
          id="jobs-section"
          className="mt-8 rounded-2xl border bg-white shadow-sm"
        >

          {/* Jobs Header */}

          <div className="border-b px-6 py-5">
            <h2 className="text-xl font-bold text-gray-900">
              Job Management
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              View all jobs posted on the platform.
            </p>
          </div>

          {/* Jobs Table */}

          {jobs.length === 0 ? (
            <div className="p-6 text-gray-500">
              No jobs found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">

                <thead className="border-b bg-gray-50">
                  <tr>

                    <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                      Job
                    </th>

                    <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                      Company
                    </th>

                    <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                      Recruiter
                    </th>

                    <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                      Location
                    </th>

                    <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                      Employment
                    </th>

                    <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                      Status
                    </th>

                    <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                      Applications
                    </th>

                    <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                      Interviews
                    </th>

                    <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                      Created
                    </th>

                  </tr>
                </thead>

                <tbody>
                  {jobs.map((job) => (
                    <tr
                      key={job.id}
                      className="border-b last:border-b-0 hover:bg-gray-50"
                    >

                      {/* Job */}

                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-gray-900">
                            {job.title}
                          </p>

                          {job.experienceLevel && (
                            <p className="mt-1 text-xs text-gray-500">
                              {
                                job.experienceLevel
                              }
                            </p>
                          )}
                        </div>
                      </td>

                      {/* Company */}

                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-700">
                          {job.company?.name ||
                            "—"}
                        </span>
                      </td>

                      {/* Recruiter */}

                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-medium text-gray-800">
                            {job.recruiter?.user
                              ?.name || "—"}
                          </p>

                          {job.recruiter?.user
                            ?.email && (
                            <p className="mt-1 text-xs text-gray-500">
                              {
                                job.recruiter.user
                                  .email
                              }
                            </p>
                          )}
                        </div>
                      </td>

                      {/* Location */}

                      <td className="px-6 py-4 text-sm text-gray-600">
                        {job.location || "—"}
                      </td>

                      {/* Employment */}

                      <td className="px-6 py-4 text-sm text-gray-600">
                        {job.employmentType ||
                          "—"}
                      </td>

                      {/* Status */}

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                            job.status ===
                            "ACTIVE"
                              ? "bg-green-100 text-green-700"
                              : job.status ===
                                "CLOSED"
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {job.status}
                        </span>
                      </td>

                      {/* Applications */}

                      <td className="px-6 py-4 text-sm font-semibold text-gray-700">
                        {job._count
                          ?.applications ??
                          0}
                      </td>

                      {/* Interviews */}

                      <td className="px-6 py-4 text-sm font-semibold text-gray-700">
                        {job._count
                          ?.interviewSessions ??
                          0}
                      </td>

                      {/* Created */}

                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(
                          job.createdAt
                        ).toLocaleDateString()}
                      </td>

                    </tr>
                  ))}
                </tbody>

              </table>
            </div>
          )}

        </div>

        {/* ========================= */}
        {/* Applications Table */}
        {/* ========================= */}

        <div
          id="applications-section"
          className="mt-8 rounded-2xl border bg-white shadow-sm"
        >

          {/* Applications Header */}

          <div className="border-b px-6 py-5">
            <h2 className="text-xl font-bold text-gray-900">
              Applications Management
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              View all applications submitted by students.
            </p>
          </div>

          {/* Applications Table */}

          {applications.length === 0 ? (
            <div className="p-6 text-gray-500">
              No applications found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">

                <thead className="border-b bg-gray-50">
                  <tr>

                    <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                      Student
                    </th>

                    <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                      Job
                    </th>

                    <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                      Company
                    </th>

                    <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                      Recruiter
                    </th>

                    <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                      Location
                    </th>

                    <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                      Employment
                    </th>

                    <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                      Status
                    </th>

                    <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                      Resume
                    </th>

                    <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                      Applied
                    </th>

                  </tr>
                </thead>

                <tbody>
                  {applications.map(
                    (application) => (
                      <tr
                        key={application.id}
                        className="border-b last:border-b-0 hover:bg-gray-50"
                      >

                        {/* Student */}

                        <td className="px-6 py-4">
                          <div>
                            <p className="font-semibold text-gray-900">
                              {application.student
                                ?.user?.name ||
                                "—"}
                            </p>

                            <p className="mt-1 text-xs text-gray-500">
                              {application.student
                                ?.user?.email ||
                                "—"}
                            </p>
                          </div>
                        </td>

                        {/* Job */}

                        <td className="px-6 py-4">
                          <p className="font-semibold text-gray-900">
                            {application.job
                              ?.title || "—"}
                          </p>
                        </td>

                        {/* Company */}

                        <td className="px-6 py-4 text-sm text-gray-700">
                          {application.job
                            ?.recruiter
                            ?.company?.name ||
                            "—"}
                        </td>

                        {/* Recruiter */}

                        <td className="px-6 py-4">
                          <div>
                            <p className="text-sm font-medium text-gray-800">
                              {application.job
                                ?.recruiter?.user
                                ?.name || "—"}
                            </p>

                            {application.job
                              ?.recruiter?.user
                              ?.email && (
                              <p className="mt-1 text-xs text-gray-500">
                                {
                                  application.job
                                    .recruiter.user
                                    .email
                                }
                              </p>
                            )}
                          </div>
                        </td>

                        {/* Location */}

                        <td className="px-6 py-4 text-sm text-gray-600">
                          {application.job
                            ?.location || "—"}
                        </td>

                        {/* Employment */}

                        <td className="px-6 py-4 text-sm text-gray-600">
                          {application.job
                            ?.employmentType ||
                            "—"}
                        </td>

                        {/* Status */}

                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                              application.status ===
                              "HIRED"
                                ? "bg-green-100 text-green-700"
                                : application.status ===
                                  "REJECTED"
                                ? "bg-red-100 text-red-700"
                                : application.status ===
                                  "INTERVIEW"
                                ? "bg-purple-100 text-purple-700"
                                : application.status ===
                                  "SHORTLISTED"
                                ? "bg-blue-100 text-blue-700"
                                : application.status ===
                                  "REVIEWING"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {application.status}
                          </span>
                        </td>

                        {/* Resume */}

                        <td className="px-6 py-4">
                          {application.resume
                            ?.fileUrl ? (
                            <a
                              href={
                                application.resume
                                  .fileUrl
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm font-semibold text-blue-600 hover:underline"
                            >
                              View Resume
                            </a>
                          ) : (
                            <span className="text-sm text-gray-400">
                              —
                            </span>
                          )}
                        </td>

                        {/* Applied */}

                        <td className="px-6 py-4 text-sm text-gray-600">
                          {new Date(
                            application.appliedAt
                          ).toLocaleDateString()}
                        </td>

                      </tr>
                    )
                  )}
                </tbody>

              </table>
            </div>
          )}

        </div>
            {/* ========================= */}
    {/* Application Analytics */}
    {/* ========================= */}

    <div
      id="analytics-section"
      className="mt-8 rounded-2xl border bg-white p-6 shadow-sm"
    >
      {/* Analytics Header */}

      <div>
        <h2 className="text-xl font-bold text-gray-900">
          Application Analytics
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Overview of application activity across the platform.
        </p>
      </div>

      {/* Analytics Cards */}

      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

        {/* Total Applications */}

        <div className="rounded-xl border bg-white p-5">
          <p className="text-sm font-medium text-gray-500">
            Total Applications
          </p>

          <p className="mt-2 text-3xl font-bold text-gray-900">
            {applications.length}
          </p>

          <p className="mt-1 text-sm text-gray-500">
            All submitted applications
          </p>
        </div>

        {/* Applied */}

        <div className="rounded-xl border bg-white p-5">
          <p className="text-sm font-medium text-gray-500">
            Applied
          </p>

          <p className="mt-2 text-3xl font-bold text-gray-900">
            {
              applications.filter(
                (application) =>
                  application.status === "APPLIED"
              ).length
            }
          </p>

          <p className="mt-1 text-sm text-gray-500">
            Newly submitted
          </p>
        </div>

        {/* Shortlisted */}

        <div className="rounded-xl border bg-white p-5">
          <p className="text-sm font-medium text-gray-500">
            Shortlisted
          </p>

          <p className="mt-2 text-3xl font-bold text-gray-900">
            {
              applications.filter(
                (application) =>
                  application.status === "SHORTLISTED"
              ).length
            }
          </p>

          <p className="mt-1 text-sm text-gray-500">
            Selected for next stage
          </p>
        </div>

        {/* Hired */}

        <div className="rounded-xl border bg-white p-5">
          <p className="text-sm font-medium text-gray-500">
            Hired
          </p>

          <p className="mt-2 text-3xl font-bold text-gray-900">
            {
              applications.filter(
                (application) =>
                  application.status === "HIRED"
              ).length
            }
          </p>

          <p className="mt-1 text-sm text-gray-500">
            Successfully hired
          </p>
        </div>

      </div>

      {/* ========================= */}
      {/* Application Status */}
      {/* ========================= */}

      <div className="mt-6 rounded-xl border bg-white">

        <div className="border-b px-5 py-4">
          <h3 className="font-semibold text-gray-900">
            Application Status Overview
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            Current status of all applications.
          </p>
        </div>

        <div className="grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-3">

          {/* Applied */}

          <div className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3">
            <span className="text-sm font-medium text-gray-600">
              Applied
            </span>

            <span className="font-bold text-gray-900">
              {
                applications.filter(
                  (application) =>
                    application.status === "APPLIED"
                ).length
              }
            </span>
          </div>

          {/* Reviewing */}

          <div className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3">
            <span className="text-sm font-medium text-gray-600">
              Reviewing
            </span>

            <span className="font-bold text-gray-900">
              {
                applications.filter(
                  (application) =>
                    application.status === "REVIEWING"
                ).length
              }
            </span>
          </div>

          {/* Shortlisted */}

          <div className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3">
            <span className="text-sm font-medium text-gray-600">
              Shortlisted
            </span>

            <span className="font-bold text-gray-900">
              {
                applications.filter(
                  (application) =>
                    application.status === "SHORTLISTED"
                ).length
              }
            </span>
          </div>

          {/* Interview */}

          <div className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3">
            <span className="text-sm font-medium text-gray-600">
              Interview
            </span>

            <span className="font-bold text-gray-900">
              {
                applications.filter(
                  (application) =>
                    application.status === "INTERVIEW"
                ).length
              }
            </span>
          </div>

          {/* Rejected */}

          <div className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3">
            <span className="text-sm font-medium text-gray-600">
              Rejected
            </span>

            <span className="font-bold text-gray-900">
              {
                applications.filter(
                  (application) =>
                    application.status === "REJECTED"
                ).length
              }
            </span>
          </div>

          {/* Hired */}

          <div className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3">
            <span className="text-sm font-medium text-gray-600">
              Hired
            </span>

            <span className="font-bold text-gray-900">
              {
                applications.filter(
                  (application) =>
                    application.status === "HIRED"
                ).length
              }
            </span>
          </div>

        </div>
      </div>

      {/* ========================= */}
      {/* Application Progress */}
      {/* ========================= */}

      <div className="mt-6 rounded-xl border bg-white p-5">

        <h3 className="font-semibold text-gray-900">
          Application Progress
        </h3>

        <p className="mt-1 text-sm text-gray-500">
          Distribution of applications by current status.
        </p>

        <div className="mt-5 space-y-4">

          {/* Applied */}

          <div>
            <div className="mb-1 flex justify-between text-sm">
              <span className="font-medium text-gray-600">
                Applied
              </span>

              <span className="font-semibold text-gray-900">
                {
                  applications.filter(
                    (application) =>
                      application.status === "APPLIED"
                  ).length
                }
              </span>
            </div>

            <div className="h-2 rounded-full bg-gray-100">
              <div
                className="h-2 rounded-full bg-blue-500"
                style={{
                  width:
                    applications.length > 0
                      ? `${
                          (applications.filter(
                            (application) =>
                              application.status ===
                              "APPLIED"
                          ).length /
                            applications.length) *
                          100
                        }%`
                      : "0%",
                }}
              />
            </div>
          </div>

          {/* Reviewing */}

          <div>
            <div className="mb-1 flex justify-between text-sm">
              <span className="font-medium text-gray-600">
                Reviewing
              </span>

              <span className="font-semibold text-gray-900">
                {
                  applications.filter(
                    (application) =>
                      application.status === "REVIEWING"
                  ).length
                }
              </span>
            </div>

            <div className="h-2 rounded-full bg-gray-100">
              <div
                className="h-2 rounded-full bg-yellow-500"
                style={{
                  width:
                    applications.length > 0
                      ? `${
                          (applications.filter(
                            (application) =>
                              application.status ===
                              "REVIEWING"
                          ).length /
                            applications.length) *
                          100
                        }%`
                      : "0%",
                }}
              />
            </div>
          </div>

          {/* Shortlisted */}

          <div>
            <div className="mb-1 flex justify-between text-sm">
              <span className="font-medium text-gray-600">
                Shortlisted
              </span>

              <span className="font-semibold text-gray-900">
                {
                  applications.filter(
                    (application) =>
                      application.status ===
                      "SHORTLISTED"
                  ).length
                }
              </span>
            </div>

            <div className="h-2 rounded-full bg-gray-100">
              <div
                className="h-2 rounded-full bg-indigo-500"
                style={{
                  width:
                    applications.length > 0
                      ? `${
                          (applications.filter(
                            (application) =>
                              application.status ===
                              "SHORTLISTED"
                          ).length /
                            applications.length) *
                          100
                        }%`
                      : "0%",
                }}
              />
            </div>
          </div>

          {/* Interview */}

          <div>
            <div className="mb-1 flex justify-between text-sm">
              <span className="font-medium text-gray-600">
                Interview
              </span>

              <span className="font-semibold text-gray-900">
                {
                  applications.filter(
                    (application) =>
                      application.status === "INTERVIEW"
                  ).length
                }
              </span>
            </div>

            <div className="h-2 rounded-full bg-gray-100">
              <div
                className="h-2 rounded-full bg-purple-500"
                style={{
                  width:
                    applications.length > 0
                      ? `${
                          (applications.filter(
                            (application) =>
                              application.status ===
                              "INTERVIEW"
                          ).length /
                            applications.length) *
                          100
                        }%`
                      : "0%",
                }}
              />
            </div>
          </div>

          {/* Rejected */}

          <div>
            <div className="mb-1 flex justify-between text-sm">
              <span className="font-medium text-gray-600">
                Rejected
              </span>

              <span className="font-semibold text-gray-900">
                {
                  applications.filter(
                    (application) =>
                      application.status === "REJECTED"
                  ).length
                }
              </span>
            </div>

            <div className="h-2 rounded-full bg-gray-100">
              <div
                className="h-2 rounded-full bg-red-500"
                style={{
                  width:
                    applications.length > 0
                      ? `${
                          (applications.filter(
                            (application) =>
                              application.status ===
                              "REJECTED"
                          ).length /
                            applications.length) *
                          100
                        }%`
                      : "0%",
                }}
              />
            </div>
          </div>

          {/* Hired */}

          <div>
            <div className="mb-1 flex justify-between text-sm">
              <span className="font-medium text-gray-600">
                Hired
              </span>

              <span className="font-semibold text-gray-900">
                {
                  applications.filter(
                    (application) =>
                      application.status === "HIRED"
                  ).length
                }
              </span>
            </div>

            <div className="h-2 rounded-full bg-gray-100">
              <div
                className="h-2 rounded-full bg-green-500"
                style={{
                  width:
                    applications.length > 0
                      ? `${
                          (applications.filter(
                            (application) =>
                              application.status ===
                              "HIRED"
                          ).length /
                            applications.length) *
                          100
                        }%`
                      : "0%",
                }}
              />
            </div>
          </div>

        </div>
      </div>
    </div>

      </div>
    </div>
  );
}