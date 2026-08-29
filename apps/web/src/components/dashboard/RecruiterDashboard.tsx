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
      {/* JOB OVERVIEW */}
      {/* ============================= */}

      <section>
        <div className="mb-5">
          <h2 className="text-2xl font-bold text-gray-900">
            Job Overview
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Overview of your job postings and their current status.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

          {/* Total Jobs */}

          <button
            type="button"
            onClick={() =>
              router.push("/dashboard/recruiter/jobs")
            }
            className="group text-left border border-gray-200 rounded-2xl p-6 bg-white shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Total Jobs
                </p>

                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats.totalJobs}
                </p>
              </div>

              <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center text-xl">
                💼
              </div>
            </div>

            <p className="text-xs text-gray-400 mt-4 group-hover:text-gray-500">
              View all jobs →
            </p>
          </button>

          {/* Active Jobs */}

          <button
            type="button"
            onClick={() =>
              router.push("/dashboard/recruiter/jobs")
            }
            className="group text-left border border-gray-200 rounded-2xl p-6 bg-white shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Active Jobs
                </p>

                <p className="text-3xl font-bold text-green-600 mt-2">
                  {stats.activeJobs}
                </p>
              </div>

              <div className="w-11 h-11 rounded-xl bg-green-50 flex items-center justify-center text-xl">
                🟢
              </div>
            </div>

            <p className="text-xs text-gray-400 mt-4 group-hover:text-gray-500">
              View active jobs →
            </p>
          </button>

          {/* Closed Jobs */}

          <button
            type="button"
            onClick={() =>
              router.push("/dashboard/recruiter/jobs")
            }
            className="group text-left border border-gray-200 rounded-2xl p-6 bg-white shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Closed Jobs
                </p>

                <p className="text-3xl font-bold text-gray-600 mt-2">
                  {stats.closedJobs}
                </p>
              </div>

              <div className="w-11 h-11 rounded-xl bg-gray-100 flex items-center justify-center text-xl">
                📁
              </div>
            </div>

            <p className="text-xs text-gray-400 mt-4 group-hover:text-gray-500">
              View closed jobs →
            </p>
          </button>

          {/* Draft Jobs */}

          <button
            type="button"
            onClick={() =>
              router.push("/dashboard/recruiter/jobs")
            }
            className="group text-left border border-gray-200 rounded-2xl p-6 bg-white shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Draft Jobs
                </p>

                <p className="text-3xl font-bold text-orange-500 mt-2">
                  {stats.draftJobs}
                </p>
              </div>

              <div className="w-11 h-11 rounded-xl bg-orange-50 flex items-center justify-center text-xl">
                📝
              </div>
            </div>

            <p className="text-xs text-gray-400 mt-4 group-hover:text-gray-500">
              View draft jobs →
            </p>
          </button>

        </div>
      </section>

      {/* ============================= */}
      {/* APPLICATION OVERVIEW */}
      {/* ============================= */}

      <section>
        <div className="mb-5">
          <h2 className="text-2xl font-bold text-gray-900">
            Application Overview
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Track candidate activity across your job postings.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">

          {/* Applications */}

          <div className="border border-gray-200 rounded-2xl p-5 bg-white shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              Applications
            </p>

            <p className="text-3xl font-bold text-gray-900 mt-2">
              {stats.totalApplications}
            </p>

            <p className="text-xs text-gray-400 mt-3">
              Total candidates
            </p>
          </div>

          {/* Shortlisted */}

          <div className="border border-gray-200 rounded-2xl p-5 bg-white shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              Shortlisted
            </p>

            <p className="text-3xl font-bold text-blue-600 mt-2">
              {stats.shortlisted}
            </p>

            <p className="text-xs text-gray-400 mt-3">
              Candidates shortlisted
            </p>
          </div>

          {/* Interviews */}

          <div className="border border-gray-200 rounded-2xl p-5 bg-white shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              Interviews
            </p>

            <p className="text-3xl font-bold text-purple-600 mt-2">
              {stats.interviews}
            </p>

            <p className="text-xs text-gray-400 mt-3">
              Interviews scheduled
            </p>
          </div>

          {/* Hired */}

          <div className="border border-gray-200 rounded-2xl p-5 bg-white shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              Hired
            </p>

            <p className="text-3xl font-bold text-green-600 mt-2">
              {stats.hired}
            </p>

            <p className="text-xs text-gray-400 mt-3">
              Candidates hired
            </p>
          </div>

          {/* Rejected */}

          <div className="border border-gray-200 rounded-2xl p-5 bg-white shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              Rejected
            </p>

            <p className="text-3xl font-bold text-red-600 mt-2">
              {stats.rejected}
            </p>

            <p className="text-xs text-gray-400 mt-3">
              Applications rejected
            </p>
          </div>

        </div>
      </section>

      {/* ============================= */}
      {/* QUICK ACTIONS */}
      {/* ============================= */}

      <section>
        <div className="mb-5">
          <h2 className="text-2xl font-bold text-gray-900">
            Quick Actions
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Quickly access your most important recruitment tools.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

          {/* Manage Jobs */}

          <button
            type="button"
            onClick={() =>
              router.push("/dashboard/recruiter/jobs")
            }
            className="group text-left border border-gray-200 rounded-2xl p-6 bg-white shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
          >
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-2xl">
              💼
            </div>

            <h3 className="font-bold text-lg text-gray-900 mt-4">
              Manage Jobs
            </h3>

            <p className="text-sm text-gray-500 mt-2 leading-6">
              View, edit and manage all your job postings.
            </p>

            <p className="text-xs font-semibold text-gray-400 mt-4 group-hover:text-gray-600">
              Open →
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
            className="group text-left border border-gray-200 rounded-2xl p-6 bg-white shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
          >
            <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-2xl">
              ➕
            </div>

            <h3 className="font-bold text-lg text-gray-900 mt-4">
              Create Job
            </h3>

            <p className="text-sm text-gray-500 mt-2 leading-6">
              Create and publish a new job opportunity.
            </p>

            <p className="text-xs font-semibold text-gray-400 mt-4 group-hover:text-gray-600">
              Create →
            </p>
          </button>

          {/* Applicants */}

          <button
            type="button"
            onClick={() =>
              router.push("/dashboard/recruiter/jobs")
            }
            className="group text-left border border-gray-200 rounded-2xl p-6 bg-white shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
          >
            <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-2xl">
              👥
            </div>

            <h3 className="font-bold text-lg text-gray-900 mt-4">
              View Applicants
            </h3>

            <p className="text-sm text-gray-500 mt-2 leading-6">
              Select a job to view and manage its applicants.
            </p>

            <p className="text-xs font-semibold text-gray-400 mt-4 group-hover:text-gray-600">
              View →
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
            className="group text-left border border-gray-200 rounded-2xl p-6 bg-white shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
          >
            <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center text-2xl">
              🔔
            </div>

            <h3 className="font-bold text-lg text-gray-900 mt-4">
              Notifications
            </h3>

            <p className="text-sm text-gray-500 mt-2 leading-6">
              Check your latest recruitment updates.
            </p>

            <p className="text-xs font-semibold text-gray-400 mt-4 group-hover:text-gray-600">
              View →
            </p>
          </button>

        </div>
      </section>

      {/* ============================= */}
      {/* RECRUITMENT WORKFLOW */}
      {/* READ-ONLY / NON-CLICKABLE */}
      {/* ============================= */}

      <section>
        <div className="border border-gray-200 rounded-2xl p-6 bg-white shadow-sm">

          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Recruitment Workflow
              </h2>

              <p className="text-gray-500 text-sm mt-2">
                Track your recruitment journey from job creation to successful hiring.
              </p>
            </div>

            <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-gray-100 text-gray-600 w-fit">
              Recruitment Progress
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mt-6">

            {/* Step 1 */}

            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5 hover:bg-white transition">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-400">
                  STEP 01
                </span>

                <span className="text-xl">
                  💼
                </span>
              </div>

              <p className="text-sm font-semibold text-gray-900 mt-4">
                Create Job
              </p>

              <p className="text-3xl font-bold text-gray-900 mt-2">
                {stats.totalJobs}
              </p>

              <p className="text-xs text-gray-500 mt-1">
                Jobs Created
              </p>
            </div>

            {/* Step 2 */}

            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5 hover:bg-white transition">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-400">
                  STEP 02
                </span>

                <span className="text-xl">
                  👥
                </span>
              </div>

              <p className="text-sm font-semibold text-gray-900 mt-4">
                Review Applicants
              </p>

              <p className="text-3xl font-bold text-gray-900 mt-2">
                {stats.totalApplications}
              </p>

              <p className="text-xs text-gray-500 mt-1">
                Applicants
              </p>
            </div>

            {/* Step 3 */}

            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5 hover:bg-white transition">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-400">
                  STEP 03
                </span>

                <span className="text-xl">
                  ⭐
                </span>
              </div>

              <p className="text-sm font-semibold text-gray-900 mt-4">
                Shortlist
              </p>

              <p className="text-3xl font-bold text-gray-900 mt-2">
                {stats.shortlisted}
              </p>

              <p className="text-xs text-gray-500 mt-1">
                Candidates Shortlisted
              </p>
            </div>

            {/* Step 4 */}

            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5 hover:bg-white transition">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-400">
                  STEP 04
                </span>

                <span className="text-xl">
                  🎤
                </span>
              </div>

              <p className="text-sm font-semibold text-gray-900 mt-4">
                Interview
              </p>

              <p className="text-3xl font-bold text-gray-900 mt-2">
                {stats.interviews}
              </p>

              <p className="text-xs text-gray-500 mt-1">
                Interviews Scheduled
              </p>
            </div>

            {/* Step 5 */}

            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5 hover:bg-white transition">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-400">
                  STEP 05
                </span>

                <span className="text-xl">
                  🎉
                </span>
              </div>

              <p className="text-sm font-semibold text-gray-900 mt-4">
                Hire
              </p>

              <p className="text-3xl font-bold text-gray-900 mt-2">
                {stats.hired}
              </p>

              <p className="text-xs text-gray-500 mt-1">
                Candidates Hired
              </p>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}