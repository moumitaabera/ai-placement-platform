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
        setApplications(response.data ?? []);
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

      setApplications(response.data ?? []);
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

  /*
   * =============================
   * STATUS STYLE
   * =============================
   */

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "APPLIED":
        return "bg-blue-50 text-blue-700 border-blue-200";

      case "REVIEWING":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";

      case "SHORTLISTED":
        return "bg-purple-50 text-purple-700 border-purple-200";

      case "INTERVIEW":
        return "bg-indigo-50 text-indigo-700 border-indigo-200";

      case "HIRED":
        return "bg-green-50 text-green-700 border-green-200";

      case "REJECTED":
        return "bg-red-50 text-red-700 border-red-200";

      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  /*
   * =============================
   * LOADING
   * =============================
   */

  if (loading) {
    return (
      <div className="border border-gray-200 rounded-2xl bg-white p-10 text-center shadow-sm">
        <div className="w-10 h-10 border-4 border-gray-200 border-t-black rounded-full animate-spin mx-auto" />

        <p className="text-sm text-gray-500 mt-4">
          Loading applicants...
        </p>
      </div>
    );
  }

  /*
   * =============================
   * EMPTY STATE
   * =============================
   */

  if (applications.length === 0) {
    return (
      <div className="border border-gray-200 rounded-2xl bg-white p-10 md:p-14 text-center shadow-sm">

        <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center text-3xl mx-auto">
          👥
        </div>

        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mt-5">
          No applicants yet
        </h2>

        <p className="text-gray-500 mt-2">
          Applications for this job will appear here.
        </p>

      </div>
    );
  }

  return (
    <div className="space-y-5">

      {/* ============================= */}
      {/* APPLICANT COUNT */}
      {/* ============================= */}

      <div className="flex items-center justify-between">

        <div>
          <p className="text-sm text-gray-500">
            Total Applicants
          </p>

          <p className="text-2xl font-bold text-gray-900 mt-1">
            {applications.length}
          </p>
        </div>

        <div className="w-11 h-11 rounded-xl bg-purple-50 flex items-center justify-center text-xl">
          👥
        </div>

      </div>

      {/* ============================= */}
      {/* APPLICANT LIST */}
      {/* ============================= */}

      {applications.map((application, index) => (

        <div
          key={application.id}
          className="border border-gray-200 rounded-2xl bg-white p-6 shadow-sm hover:shadow-md hover:border-gray-300 transition-all duration-200"
        >

          {/* ============================= */}
          {/* APPLICANT HEADER */}
          {/* ============================= */}

          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">

            <div className="flex items-start gap-4">

              <div className="w-12 h-12 shrink-0 rounded-xl bg-gray-100 flex items-center justify-center text-xl">
                👤
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Applicant {index + 1}
                </p>

                <h2 className="text-lg md:text-xl font-bold text-gray-900 mt-1">
                  Candidate Application
                </h2>

                <p className="text-xs text-gray-400 mt-1 break-all">
                  Application ID: {application.id}
                </p>
              </div>

            </div>

            {/* CURRENT STATUS */}

            <span
              className={`inline-flex w-fit items-center px-3 py-1.5 rounded-full border text-xs font-bold ${getStatusStyle(
                application.status
              )}`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-current mr-2" />

              {application.status}
            </span>

          </div>

          {/* ============================= */}
          {/* APPLICATION DETAILS */}
          {/* ============================= */}

          <div className="border-t border-gray-100 my-6" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* APPLIED DATE */}

            <div className="rounded-xl bg-gray-50 border border-gray-100 p-4">

              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                Applied On
              </p>

              <p className="text-sm font-semibold text-gray-800 mt-1">
                {new Date(
                  application.appliedAt
                ).toLocaleDateString()}
              </p>

            </div>

            {/* RESUME */}

            <div className="rounded-xl bg-gray-50 border border-gray-100 p-4">

              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                Resume
              </p>

              <p className="text-sm font-semibold text-gray-800 mt-1 truncate">
                {application.resume.title}
              </p>

            </div>

          </div>

          {/* ============================= */}
          {/* STATUS MANAGEMENT */}
          {/* ============================= */}

          <div className="mt-6">

            <p className="text-sm font-semibold text-gray-700 mb-2">
              Update Application Status
            </p>

            <div className="flex flex-col sm:flex-row gap-3">

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
                className="w-full sm:w-auto min-w-47.5 border border-gray-300 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-gray-200"
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
                type="button"
                onClick={() =>
                  handleUpdateStatus(
                    application.id
                  )
                }
                className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition"
              >
                Update Status
              </button>

            </div>

          </div>

          {/* ============================= */}
          {/* RESUME ACTION */}
          {/* ============================= */}

          <div className="border-t border-gray-100 mt-6 pt-6">

            <button
              type="button"
              onClick={() =>
                handleViewResume(
                  application.resume.id,
                  application.id
                )
              }
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-green-600 text-white text-sm font-semibold hover:bg-green-700 transition"
            >
              <span>📄</span>
              View Resume
            </button>

          </div>

        </div>

      ))}

    </div>
  );
}