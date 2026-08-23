"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

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
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  

  const fetchJobs = async () => {
    try {
      const response = await getMyJobs();
      setJobs(response.data);
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

  if (loading) {
    return (
      <div className="p-6">
        <h2>Loading...</h2>
      </div>
    );
  }

  return (
    <div className="p-6">

      <h1 className="text-3xl font-bold mb-6">
        My Jobs
      </h1>

      {jobs.length === 0 ? (
        <p>No jobs found.</p>
      ) : (
        <div className="space-y-5">

          {jobs.map((job) => (

            <div
              key={job.id}
              className="border rounded-lg shadow p-5"
            >

              <h2 className="text-2xl font-semibold">
                {job.title}
              </h2>

              <p className="mt-2">
                <strong>Location:</strong>{" "}
                {job.location || "N/A"}
              </p>

              <p>
                <strong>Employment Type:</strong>{" "}
                {job.employmentType}
              </p>

              <p>
                <strong>Experience:</strong>{" "}
                {job.experienceLevel}
              </p>

              <p>
                <strong>Status:</strong>{" "}
                {job.status}
              </p>

              <div className="flex gap-3 mt-5">

  <Link
    href={`/dashboard/recruiter/jobs/view/${job.id}`}
    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
  >
    View
  </Link>

  <Link
    href={`/dashboard/recruiter/jobs/edit/${job.id}`}
    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
  >
    Edit
  </Link>

  <Link
  href={`/dashboard/recruiter/jobs/${job.id}/applicants`}
  className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
>
  Applicants
</Link>

  <button
    onClick={() => handleDelete(job.id)}
    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
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