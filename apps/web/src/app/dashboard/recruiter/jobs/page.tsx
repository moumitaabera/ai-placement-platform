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

  const selectedStatus =
    searchParams.get("status");

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

  const filteredJobs =
    selectedStatus
      ? jobs.filter(
          (job) =>
            job.status === selectedStatus
        )
      : jobs;

  /*
   * =============================
   * PAGE TITLE
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
   * LOADING
   * =============================
   */

  if (loading) {
    return (
      <div className="p-6">
        <h2 className="text-gray-600">
          Loading jobs...
        </h2>
      </div>
    );
  }

  return (
    <div className="p-6">

      {/* ============================= */}
      {/* HEADER */}
      {/* ============================= */}

      <div className="mb-8">

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

          <div>
            <h1 className="text-3xl font-bold">
              {pageTitle}
            </h1>

            <p className="text-gray-500 mt-2">
              {pageDescription}
            </p>
          </div>

          {/* CREATE JOB */}

          <Link
            href="/dashboard/recruiter/jobs/create"
            className="inline-flex items-center justify-center bg-black text-white px-5 py-3 rounded-lg font-semibold hover:bg-gray-800 transition"
          >
            + Create Job
          </Link>

        </div>

        {/* ============================= */}
        {/* FILTER NAVIGATION */}
        {/* ============================= */}

        <div className="flex flex-wrap gap-2 mt-6">

          <Link
            href="/dashboard/recruiter/jobs"
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              !selectedStatus
                ? "bg-black text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            All Jobs
          </Link>

          <Link
            href="/dashboard/recruiter/jobs?status=ACTIVE"
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              selectedStatus === "ACTIVE"
                ? "bg-green-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Active
          </Link>

          <Link
            href="/dashboard/recruiter/jobs?status=CLOSED"
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              selectedStatus === "CLOSED"
                ? "bg-gray-700 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Closed
          </Link>

          <Link
            href="/dashboard/recruiter/jobs?status=DRAFT"
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              selectedStatus === "DRAFT"
                ? "bg-orange-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Draft
          </Link>

        </div>

      </div>

      {/* ============================= */}
      {/* JOB COUNT */}
      {/* ============================= */}

      <div className="mb-5">

        <p className="text-sm text-gray-500">
          Showing{" "}
          <span className="font-semibold text-gray-900">
            {filteredJobs.length}
          </span>{" "}
          {filteredJobs.length === 1
            ? "job"
            : "jobs"}
        </p>

      </div>

      {/* ============================= */}
      {/* NO JOBS */}
      {/* ============================= */}

      {filteredJobs.length === 0 ? (

        <div className="border rounded-2xl bg-white p-10 text-center shadow-sm">

          <div className="text-4xl mb-4">
            💼
          </div>

          <h2 className="text-xl font-bold">
            No jobs found
          </h2>

          <p className="text-gray-500 mt-2">
            {selectedStatus
              ? `You don't have any ${
                  selectedStatus.toLowerCase()
                } jobs yet.`
              : "You haven't created any jobs yet."}
          </p>

          {!selectedStatus && (
            <Link
              href="/dashboard/recruiter/jobs/create"
              className="inline-block mt-5 bg-black text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-gray-800 transition"
            >
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
              className="border rounded-2xl shadow-sm p-6 bg-white hover:shadow-md transition"
            >

              {/* ============================= */}
              {/* JOB HEADER */}
              {/* ============================= */}

              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">

                <div>

                  <h2 className="text-2xl font-semibold">
                    {job.title}
                  </h2>

                  <p className="text-gray-500 mt-1">
                    {job.location || "Location not specified"}
                  </p>

                </div>

                {/* STATUS */}

                <span
                  className={`inline-flex w-fit px-3 py-1 rounded-full text-xs font-semibold ${
                    job.status === "ACTIVE"
                      ? "bg-green-100 text-green-700"
                      : job.status === "CLOSED"
                        ? "bg-gray-100 text-gray-700"
                        : job.status === "DRAFT"
                          ? "bg-orange-100 text-orange-700"
                          : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {job.status}
                </span>

              </div>

              {/* ============================= */}
              {/* JOB DETAILS */}
              {/* ============================= */}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5 text-sm">

                <p>
                  <strong>Employment Type:</strong>{" "}
                  {job.employmentType}
                </p>

                <p>
                  <strong>Experience:</strong>{" "}
                  {job.experienceLevel}
                </p>

              </div>

              {/* ============================= */}
              {/* ACTIONS */}
              {/* ============================= */}

              <div className="flex flex-wrap gap-3 mt-6">

                {/* VIEW */}

                <Link
                  href={`/dashboard/recruiter/jobs/view/${job.id}`}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                >
                  View
                </Link>

                {/* EDIT */}

                <Link
                  href={`/dashboard/recruiter/jobs/edit/${job.id}`}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Edit
                </Link>

                {/* APPLICANTS */}

                <Link
                  href={`/dashboard/recruiter/jobs/${job.id}/applicants`}
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
                >
                  Applicants
                </Link>

                {/* DELETE */}

                <button
                  type="button"
                  onClick={() =>
                    handleDelete(job.id)
                  }
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
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