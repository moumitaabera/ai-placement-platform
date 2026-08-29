"use client";

import { useEffect, useState } from "react";
import {
  getJob,
  updateJob,
} from "@/services/job.service";

import { useRouter } from "next/navigation";

interface EditJobFormProps {
  id: string;
}

interface Job {
  id: string;
  title: string;
  description: string;
  location?: string;
  salary?: string;
  employmentType: string;
  experienceLevel: string;
  skills: string[];
  deadline?: string;
}

export default function EditJobForm({
  id,
}: EditJobFormProps) {
  const router = useRouter();

  const [job, setJob] = useState<Job | null>(null);

  useEffect(() => {
    const loadJob = async () => {
      try {
        const response = await getJob(id);

        setJob(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    if (id) {
      loadJob();
    }
  }, [id]);

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!job) return;

    try {
      await updateJob(id, {
        title: job.title,
        description: job.description,
        location: job.location,
        salary: job.salary,
        employmentType: job.employmentType,
        experienceLevel: job.experienceLevel,
        skills: job.skills,
        deadline: job.deadline
          ? `${job.deadline}T23:59:59.000Z`
          : undefined,
      });

      alert("Job updated successfully");

      router.push(
        "/dashboard/recruiter/jobs"
      );
    } catch (error) {
      console.error(error);

      alert("Update failed");
    }
  };

  if (!job) {
    return (
      <div className="w-full max-w-5xl rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex min-h-60 items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600" />

            <p className="text-sm font-medium text-slate-700">
              Loading job details...
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Please wait while we fetch the job information.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-5xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
    >
      {/* Header */}
      <div className="mb-8 border-b border-slate-200 pb-6">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          Edit Job
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Update the details of this job posting.
        </p>
      </div>

      {/* Job Details */}
      <div className="space-y-6">
        <div>
          <h3 className="text-base font-semibold text-slate-900">
            Job Details
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Keep the job information accurate and up to date.
          </p>
        </div>

        {/* Job Title + Location */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div>
            <label
              htmlFor="title"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Job Title
            </label>

            <input
              id="title"
              className="h-11 w-full rounded-lg border border-slate-300 bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              value={job.title}
              onChange={(e) =>
                setJob({
                  ...job,
                  title: e.target.value,
                })
              }
            />
          </div>

          <div>
            <label
              htmlFor="location"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Location
            </label>

            <input
              id="location"
              className="h-11 w-full rounded-lg border border-slate-300 bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              value={job.location || ""}
              onChange={(e) =>
                setJob({
                  ...job,
                  location: e.target.value,
                })
              }
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="description"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Job Description
          </label>

          <textarea
            id="description"
            rows={7}
            className="w-full resize-y rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            value={job.description}
            onChange={(e) =>
              setJob({
                ...job,
                description: e.target.value,
              })
            }
          />

          <p className="mt-2 text-xs text-slate-500">
            Clearly describe the responsibilities and expectations of the role.
          </p>
        </div>

        {/* Salary + Employment Type */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div>
            <label
              htmlFor="salary"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Salary
            </label>

            <input
              id="salary"
              className="h-11 w-full rounded-lg border border-slate-300 bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              value={job.salary || ""}
              onChange={(e) =>
                setJob({
                  ...job,
                  salary: e.target.value,
                })
              }
            />
          </div>

          <div>
            <label
              htmlFor="employmentType"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Employment Type
            </label>

            <input
              id="employmentType"
              className="h-11 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              value={job.employmentType}
              onChange={(e) =>
                setJob({
                  ...job,
                  employmentType: e.target.value,
                })
              }
            />
          </div>
        </div>

        {/* Experience + Deadline */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div>
            <label
              htmlFor="experienceLevel"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Experience Level
            </label>

            <input
              id="experienceLevel"
              className="h-11 w-full rounded-lg border border-slate-300 bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              value={job.experienceLevel}
              onChange={(e) =>
                setJob({
                  ...job,
                  experienceLevel: e.target.value,
                })
              }
            />
          </div>

          <div>
            <label
              htmlFor="deadline"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Application Deadline
            </label>

            <input
              id="deadline"
              type="date"
              value={
  job.deadline
    ? job.deadline.split("T")[0]
    : ""
}
              onChange={(e) =>
                setJob({
                  ...job,
                  deadline: e.target.value,
                })
              }
              className="h-11 w-full rounded-lg border border-slate-300 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>

        {/* Skills */}
        <div>
          <label
            htmlFor="skills"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Required Skills
          </label>

          <input
            id="skills"
            className="h-11 w-full rounded-lg border border-slate-300 bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            value={job.skills.join(", ")}
            onChange={(e) =>
              setJob({
                ...job,
                skills: e.target.value
                  .split(",")
                  .map((skill) => skill.trim())
                  .filter(Boolean),
              })
            }
          />

          <p className="mt-2 text-xs text-slate-500">
            Separate multiple skills with commas.
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-8 flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:justify-end">
        <button
          type="submit"
          className="inline-flex h-11 items-center justify-center rounded-lg bg-blue-600 px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Update Job
        </button>
      </div>
    </form>
  );
}