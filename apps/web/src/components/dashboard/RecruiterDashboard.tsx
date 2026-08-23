"use client";

import { useRouter } from "next/navigation";

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

interface RecruiterDashboardProps {
  stats: RecruiterStats;
}

export default function RecruiterDashboard({
  stats,
}: RecruiterDashboardProps) {
  const router = useRouter();

  return (
    <div className="mt-10 space-y-10">
      {/* ============================= */}
      {/* JOB STATISTICS */}
      {/* ============================= */}

      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-5">
          Job Overview
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="border rounded-2xl p-6 bg-white shadow-sm">
            <p className="text-sm text-gray-500">Total Jobs</p>
            <p className="text-3xl font-bold mt-2">
              {stats.totalJobs}
            </p>
          </div>

          <div className="border rounded-2xl p-6 bg-white shadow-sm">
            <p className="text-sm text-gray-500">Active Jobs</p>
            <p className="text-3xl font-bold mt-2 text-green-600">
              {stats.activeJobs}
            </p>
          </div>

          <div className="border rounded-2xl p-6 bg-white shadow-sm">
            <p className="text-sm text-gray-500">Closed Jobs</p>
            <p className="text-3xl font-bold mt-2 text-gray-600">
              {stats.closedJobs}
            </p>
          </div>

          <div className="border rounded-2xl p-6 bg-white shadow-sm">
            <p className="text-sm text-gray-500">Draft Jobs</p>
            <p className="text-3xl font-bold mt-2 text-orange-500">
              {stats.draftJobs}
            </p>
          </div>
        </div>
      </section>

      {/* ============================= */}
      {/* APPLICATION STATISTICS */}
      {/* ============================= */}

      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-5">
          Application Overview
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          <div className="border rounded-2xl p-5 bg-white shadow-sm">
            <p className="text-sm text-gray-500">
              Applications
            </p>

            <p className="text-3xl font-bold mt-2">
              {stats.totalApplications}
            </p>
          </div>

          <div className="border rounded-2xl p-5 bg-white shadow-sm">
            <p className="text-sm text-gray-500">
              Shortlisted
            </p>

            <p className="text-3xl font-bold mt-2 text-blue-600">
              {stats.shortlisted}
            </p>
          </div>

          <div className="border rounded-2xl p-5 bg-white shadow-sm">
            <p className="text-sm text-gray-500">
              Interviews
            </p>

            <p className="text-3xl font-bold mt-2 text-purple-600">
              {stats.interviews}
            </p>
          </div>

          <div className="border rounded-2xl p-5 bg-white shadow-sm">
            <p className="text-sm text-gray-500">
              Hired
            </p>

            <p className="text-3xl font-bold mt-2 text-green-600">
              {stats.hired}
            </p>
          </div>

          <div className="border rounded-2xl p-5 bg-white shadow-sm">
            <p className="text-sm text-gray-500">
              Rejected
            </p>

            <p className="text-3xl font-bold mt-2 text-red-600">
              {stats.rejected}
            </p>
          </div>
        </div>
      </section>

      {/* ============================= */}
      {/* QUICK ACTIONS */}
      {/* ============================= */}

      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-5">
          Quick Actions
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Manage Jobs */}

          <button
            type="button"
            onClick={() =>
              router.push("/dashboard/recruiter/jobs")
            }
            className="text-left border rounded-2xl p-6 bg-white shadow-sm hover:shadow-md hover:bg-gray-50 transition"
          >
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-2xl">
              💼
            </div>

            <h3 className="font-bold text-lg mt-4">
              Manage Jobs
            </h3>

            <p className="text-sm text-gray-500 mt-2">
              View, edit and manage all your job postings.
            </p>
          </button>

          {/* Create Job */}

          <button
            type="button"
            onClick={() =>
              router.push(
                "/dashboard/recruiter/jobs/create"
              )
            }
            className="text-left border rounded-2xl p-6 bg-white shadow-sm hover:shadow-md hover:bg-gray-50 transition"
          >
            <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-2xl">
              ➕
            </div>

            <h3 className="font-bold text-lg mt-4">
              Create Job
            </h3>

            <p className="text-sm text-gray-500 mt-2">
              Create and publish a new job opportunity.
            </p>
          </button>

          {/* Applicants */}

          <button
            type="button"
            onClick={() =>
              router.push("/dashboard/recruiter/jobs")
            }
            className="text-left border rounded-2xl p-6 bg-white shadow-sm hover:shadow-md hover:bg-gray-50 transition"
          >
            <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-2xl">
              👥
            </div>

            <h3 className="font-bold text-lg mt-4">
              View Applicants
            </h3>

            <p className="text-sm text-gray-500 mt-2">
              Select a job to view and manage its applicants.
            </p>
          </button>

          {/* Notifications */}

          <button
            type="button"
            onClick={() =>
              router.push(
                "/dashboard/notifications"
              )
            }
            className="text-left border rounded-2xl p-6 bg-white shadow-sm hover:shadow-md hover:bg-gray-50 transition"
          >
            <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center text-2xl">
              🔔
            </div>

            <h3 className="font-bold text-lg mt-4">
              Notifications
            </h3>

            <p className="text-sm text-gray-500 mt-2">
              Check your latest recruitment updates.
            </p>
          </button>
        </div>
      </section>

      {/* ============================= */}
      {/* RECRUITER WORKFLOW */}
      {/* ============================= */}

      <section>
        <div className="border rounded-2xl p-6 bg-white shadow-sm">
          <h2 className="text-xl font-bold text-gray-900">
            Recruitment Workflow
          </h2>

          <p className="text-gray-500 text-sm mt-2">
            Manage your recruitment process from job
            creation to hiring.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-sm font-semibold">
                1. Create Job
              </p>

              <p className="text-xs text-gray-500 mt-1">
                Publish a new opportunity.
              </p>
            </div>

            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-sm font-semibold">
                2. Review Applicants
              </p>

              <p className="text-xs text-gray-500 mt-1">
                Check applications and resumes.
              </p>
            </div>

            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-sm font-semibold">
                3. Shortlist
              </p>

              <p className="text-xs text-gray-500 mt-1">
                Move suitable candidates forward.
              </p>
            </div>

            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-sm font-semibold">
                4. Hire
              </p>

              <p className="text-xs text-gray-500 mt-1">
                Update the selected candidate status.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}