"use client";

import { useEffect, useState } from "react";
import { getMyApplications } from "@/services/application.service";

interface Application {
  id: string;
  status: string;
  appliedAt: string;

  job: {
    id: string;
    title: string;
    location?: string;
    employmentType: string;
    experienceLevel: string;
  };
}

export default function MyApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await getMyApplications();

        setApplications(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  if (loading) {
    return (
      <div className="p-8">
        Loading...
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-8">

      <h1 className="text-3xl font-bold mb-8">
        My Applications
      </h1>

      {applications.length === 0 ? (
        <p>No applications found.</p>
      ) : (
        <div className="space-y-5">

          {applications.map((application) => (

            <div
              key={application.id}
              className="border rounded-lg shadow p-5"
            >

              <h2 className="text-xl font-semibold">
                {application.job.title}
              </h2>

              <p className="mt-2">
                <strong>Location:</strong>{" "}
                {application.job.location || "N/A"}
              </p>

              <p>
                <strong>Employment:</strong>{" "}
                {application.job.employmentType}
              </p>

              <p>
                <strong>Experience:</strong>{" "}
                {application.job.experienceLevel}
              </p>

              <p>
                <strong>Applied:</strong>{" "}
                {new Date(
                  application.appliedAt
                ).toLocaleDateString()}
              </p>

              <p className="mt-3">
                <strong>Status:</strong>{" "}

                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                  {application.status}
                </span>

              </p>

            </div>

          ))}

        </div>
      )}

    </div>
  );
}