"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import {
  getMyJobs,
  deleteJob,
} from "@/services/job.service";

interface Job {
  id: string;
  title: string;
  location?: string;
  employmentType: string;
  experienceLevel: string;
  status: string;
}

export default function RecruiterJobsPage() {
  const searchParams = useSearchParams();

  const selectedStatus = searchParams.get("status");

  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchJobs = async () => {
    try {
      setLoading(true);

      const response = await getMyJobs();

      setJobs(response.data ?? []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadJobs = async () => {
      await fetchJobs();
    };

    loadJobs();
  }, []);

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this job?"
    );

    if (!confirmDelete) return;

    try {
      await deleteJob(id);

      setJobs((prev) =>
        prev.filter((job) => job.id !== id)
      );

      alert("Job deleted successfully.");
    } catch (error) {
      console.error(error);

      alert("Failed to delete job.");
    }
  };

  /*
   * =============================
   * FILTER JOBS
   * =============================
   */

  const filteredJobs = selectedStatus
    ? jobs.filter(
        (job) => job.status === selectedStatus
      )
    : jobs;

  /*
   * =============================
   * PAGE CONTENT
   * =============================
   */

  const pageTitle =
    selectedStatus === "ACTIVE"
      ? "Active Jobs"
      : selectedStatus === "CLOSED"
        ? "Closed Jobs"
        : selectedStatus === "DRAFT"
          ? "Draft Jobs"
          : "My Jobs";

  const pageDescription =
    selectedStatus === "ACTIVE"
      ? "View all your currently active job postings."
      : selectedStatus === "CLOSED"
        ? "View all your closed job postings."
        : selectedStatus === "DRAFT"
          ? "View all your draft job postings."
          : "View and manage all your job postings.";

  /*
   * =============================
   * STATUS STYLE
   * =============================
   */

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-50 text-green-700 border-green-200";

      case "CLOSED":
        return "bg-gray-100 text-gray-700 border-gray-200";

      case "DRAFT":
        return "bg-orange-50 text-orange-700 border-orange-200";

      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  /*
   * =============================
   * LOADING
   * =============================
   */

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-gray-200 border-t-black rounded-full animate-spin mx-auto" />

          <p className="text-sm text-gray-500 mt-4">
            Loading your jobs...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-8">

      {/* ============================= */}
      {/* HEADER */}
      {/* ============================= */}

      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">

        <div>
          <p className="text-sm font-semibold text-gray-500 mb-2">
            Recruiter Workspace
          </p>

          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900">
            {pageTitle}
          </h1>

          <p className="text-gray-500 mt-2 max-w-2xl">
            {pageDescription}
          </p>
        </div>

        <Link
          href="/dashboard/recruiter/jobs/create"
          className="inline-flex items-center justify-center gap-2 bg-black text-white px-5 py-3 rounded-xl font-semibold hover:bg-gray-800 transition shadow-sm"
        >
          <span className="text-lg leading-none">+</span>
          Create Job
        </Link>

      </div>

      {/* ============================= */}
      {/* FILTER NAVIGATION */}
      {/* ============================= */}

      <div className="mt-8 border-b border-gray-200">

        <div className="flex flex-wrap gap-2 pb-3">

          <Link
            href="/dashboard/recruiter/jobs"
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
              !selectedStatus
                ? "bg-black text-white shadow-sm"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            All Jobs
          </Link>

          <Link
            href="/dashboard/recruiter/jobs?status=ACTIVE"
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
              selectedStatus === "ACTIVE"
                ? "bg-green-600 text-white shadow-sm"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            Active
          </Link>

          <Link
            href="/dashboard/recruiter/jobs?status=CLOSED"
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
              selectedStatus === "CLOSED"
                ? "bg-gray-700 text-white shadow-sm"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            Closed
          </Link>

          <Link
            href="/dashboard/recruiter/jobs?status=DRAFT"
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
              selectedStatus === "DRAFT"
                ? "bg-orange-500 text-white shadow-sm"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            Draft
          </Link>

        </div>

      </div>

      {/* ============================= */}
      {/* JOB COUNT */}
      {/* ============================= */}

      <div className="flex items-center justify-between mt-8 mb-5">

        <div>
          <p className="text-sm text-gray-500">
            Showing{" "}
            <span className="font-bold text-gray-900">
              {filteredJobs.length}
            </span>{" "}
            {filteredJobs.length === 1
              ? "job"
              : "jobs"}
          </p>
        </div>

      </div>

      {/* ============================= */}
      {/* EMPTY STATE */}
      {/* ============================= */}

      {filteredJobs.length === 0 ? (

        <div className="border border-gray-200 rounded-2xl bg-white p-10 md:p-14 text-center shadow-sm">

          <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center text-3xl mx-auto">
            💼
          </div>

          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mt-5">
            No jobs found
          </h2>

          <p className="text-gray-500 mt-2 max-w-md mx-auto">
            {selectedStatus
              ? `You don't have any ${selectedStatus.toLowerCase()} jobs yet.`
              : "You haven't created any jobs yet."}
          </p>

          {!selectedStatus && (
            <Link
              href="/dashboard/recruiter/jobs/create"
              className="inline-flex items-center gap-2 mt-6 bg-black text-white px-5 py-3 rounded-xl font-semibold hover:bg-gray-800 transition"
            >
              <span className="text-lg">+</span>
              Create Your First Job
            </Link>
          )}

        </div>

      ) : (

        /* ============================= */
        /* JOB LIST */
        /* ============================= */

        <div className="space-y-5">

          {filteredJobs.map((job) => (

            <div
              key={job.id}
              className="group border border-gray-200 rounded-2xl bg-white p-6 md:p-7 shadow-sm hover:shadow-md hover:border-gray-300 transition-all duration-200"
            >

              {/* ============================= */}
              {/* JOB HEADER */}
              {/* ============================= */}

              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-5">

                <div className="min-w-0">

                  <div className="flex items-start gap-4">

                    <div className="hidden sm:flex shrink-0 w-12 h-12 rounded-xl bg-gray-100 items-center justify-center text-xl">
                      💼
                    </div>

                    <div>
                      <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                        {job.title}
                      </h2>

                      <div className="flex flex-wrap items-center gap-2 mt-2">

                        <span className="text-sm text-gray-500">
                          📍 {job.location || "Location not specified"}
                        </span>

                      </div>
                    </div>

                  </div>

                </div>

                {/* STATUS */}

                <span
                  className={`inline-flex w-fit items-center px-3 py-1.5 rounded-full border text-xs font-bold tracking-wide ${getStatusStyle(
                    job.status
                  )}`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-current mr-2" />
                  {job.status}
                </span>

              </div>

              {/* ============================= */}
              {/* DIVIDER */}
              {/* ============================= */}

              <div className="border-t border-gray-100 my-6" />

              {/* ============================= */}
              {/* JOB DETAILS */}
              {/* ============================= */}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <div className="rounded-xl bg-gray-50 border border-gray-100 p-4">

                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Employment Type
                  </p>

                  <p className="text-sm font-semibold text-gray-800 mt-1">
                    {job.employmentType}
                  </p>

                </div>

                <div className="rounded-xl bg-gray-50 border border-gray-100 p-4">

                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Experience Level
                  </p>

                  <p className="text-sm font-semibold text-gray-800 mt-1">
                    {job.experienceLevel}
                  </p>

                </div>

              </div>

              {/* ============================= */}
              {/* ACTIONS */}
              {/* ============================= */}

              <div className="flex flex-wrap gap-3 mt-6">

                <Link
                  href={`/dashboard/recruiter/jobs/view/${job.id}`}
                  className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-green-600 text-white text-sm font-semibold hover:bg-green-700 transition"
                >
                  View
                </Link>

                <Link
                  href={`/dashboard/recruiter/jobs/edit/${job.id}`}
                  className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition"
                >
                  Edit
                </Link>

                <Link
                  href={`/dashboard/recruiter/jobs/${job.id}/applicants`}
                  className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-purple-600 text-white text-sm font-semibold hover:bg-purple-700 transition"
                >
                  Applicants
                </Link>

                <button
                  type="button"
                  onClick={() =>
                    handleDelete(job.id)
                  }
                  className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition"
                >
                  Delete
                </button>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}