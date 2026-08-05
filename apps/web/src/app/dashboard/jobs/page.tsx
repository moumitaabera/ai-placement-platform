"use client";

import { useEffect, useState } from "react";
import { getJobs } from "@/services/job.service";
import { Job } from "@/types/job";

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    const fetchJobs = async () => {
      try {
        const response = await getJobs();

        if (!ignore) {
          setJobs(response.data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    fetchJobs();

    return () => {
      ignore = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="p-8">
        Loading jobs...
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">
        Available Jobs
      </h1>

      {jobs.length === 0 ? (
        <p>No jobs available.</p>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="border rounded-lg p-5 shadow-sm"
            >
              <h2 className="text-xl font-semibold">
                {job.title}
              </h2>

              <p className="text-gray-600 mt-2">
                {job.description}
              </p>

              <div className="mt-3 text-sm text-gray-500 space-y-1">
                <p>📍 {job.location || "Remote"}</p>
                <p>💼 {job.employmentType}</p>
                <p>🎯 {job.experienceLevel}</p>
                <p>💰 {job.salary || "Not disclosed"}</p>
              </div>

              <div className="flex flex-wrap gap-2 mt-4">
                {job.skills.map((skill) => (
                  <span
                    key={skill}
                    className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}