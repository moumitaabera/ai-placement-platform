"use client";

import { useEffect, useState } from "react";
import {
  getApplicants,
  updateApplicationStatus,
  viewResume,
} from "@/services/application.service";

interface ApplicantsListProps {
  jobId: string;
}

interface Applicant {
  id: string;
  status: string;
  appliedAt: string;
  student: {
    id: string;
    userId: string;
  };
  resume: {
    id: string;
    title: string;
    fileUrl: string;
  };
}

export default function ApplicantsList({
  jobId,
}: ApplicantsListProps) {
  const [applications, setApplications] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] =
    useState<Record<string, string>>({});

  useEffect(() => {
    const loadApplicants = async () => {
      try {
        const response = await getApplicants(jobId);
        setApplications(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadApplicants();
  }, [jobId]);

  const handleUpdateStatus = async (
    applicationId: string
  ) => {
    try {
      const status =
        selectedStatus[applicationId];

      if (!status) {
        alert("Please select a status.");
        return;
      }

      await updateApplicationStatus(
        applicationId,
        status
      );

      alert("Status updated successfully.");

      const response = await getApplicants(jobId);

      setApplications(response.data);
    } catch (error) {
      console.error(error);
      alert("Failed to update status.");
    }
  };

  const handleViewResume = async (
    resumeId: string,
    applicationId: string
  ) => {
    try {
      const blob = await viewResume(
        resumeId,
        applicationId
      );

      const url = window.URL.createObjectURL(
        new Blob([blob], {
          type: "application/pdf",
        })
      );

      window.open(url, "_blank");
    } catch (error) {
      console.error(
        "VIEW RESUME ERROR:",
        error
      );

      alert("Failed to open resume.");
    }
  };

  if (loading) {
    return <p>Loading applicants...</p>;
  }

  if (applications.length === 0) {
    return <p>No applicants yet.</p>;
  }

  return (
    <div className="space-y-4">
      {applications.map((application) => (
        <div
          key={application.id}
          className="border rounded-lg p-5 shadow"
        >
          <p>
            <strong>Status:</strong>{" "}
            {application.status}
          </p>

          <select
            value={
              selectedStatus[application.id] ??
              application.status
            }
            onChange={(e) =>
              setSelectedStatus((prev) => ({
                ...prev,
                [application.id]:
                  e.target.value,
              }))
            }
            className="border rounded px-3 py-2 mt-3"
          >
            <option value="APPLIED">
              APPLIED
            </option>

            <option value="REVIEWING">
              REVIEWING
            </option>

            <option value="SHORTLISTED">
              SHORTLISTED
            </option>

            <option value="INTERVIEW">
              INTERVIEW
            </option>

            <option value="HIRED">
              HIRED
            </option>

            <option value="REJECTED">
              REJECTED
            </option>
          </select>

          <button
            onClick={() =>
              handleUpdateStatus(
                application.id
              )
            }
            className="ml-3 bg-blue-600 text-white px-4 py-2 rounded"
          >
            Update Status
          </button>

          <p className="mt-3">
            <strong>Applied:</strong>{" "}
            {new Date(
              application.appliedAt
            ).toLocaleDateString()}
          </p>

          <p>
            <strong>Resume:</strong>{" "}
            {application.resume.title}
          </p>

          <button
            onClick={() =>
              handleViewResume(
                application.resume.id,
                application.id
              )
            }
            className="mt-3 bg-green-600 text-white px-4 py-2 rounded"
          >
            View Resume
          </button>
        </div>
      ))}
    </div>
  );
}