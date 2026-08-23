"use client";

import { useParams } from "next/navigation";
import ApplicantsList from "@/components/jobs/ApplicantsList";

export default function ApplicantsPage() {
  const params = useParams();

  const jobId = params.id as string;

  return (
    <div className="max-w-5xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">
        Applicants
      </h1>

      <ApplicantsList jobId={jobId} />
    </div>
  );
}