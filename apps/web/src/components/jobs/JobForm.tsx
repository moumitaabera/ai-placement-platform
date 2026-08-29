// "use client";
// import axios from "axios";

// import { useState } from "react";
// import { createJob } from "@/services/job.service";
// import { useRouter } from "next/navigation";

// interface JobFormProps {
//   initialData?: {
//     title?: string;
//     description?: string;
//     location?: string;
//     salary?: string;
//     employmentType?: string;
//     experienceLevel?: string;
//     skills?: string[];
//     deadline?: string;
//   };
// }

// export default function JobForm({
//   initialData,
// }: JobFormProps) {

//   const router = useRouter();


//   const [loading, setLoading] = useState(false);

//   const [formData, setFormData] = useState({
//     title: initialData?.title || "",
//     description: initialData?.description || "",
//     location: initialData?.location || "",
//     salary: initialData?.salary || "",
//     employmentType: initialData?.employmentType || "",
//     experienceLevel: initialData?.experienceLevel || "",
//     skills: initialData?.skills?.join(", ") || "",
//     deadline: initialData?.deadline || "",
//   });


//   const handleChange = (
//     e: React.ChangeEvent<
//       HTMLInputElement | HTMLTextAreaElement
//     >
//   ) => {

//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });

//   };


//   const handleSubmit = async (e: React.FormEvent) => {
//   e.preventDefault();

//   try {
//     setLoading(true);

//     const payload = {
//       title: formData.title,
//       description: formData.description,
//       location: formData.location,
//       salary: formData.salary,
//       employmentType: formData.employmentType,
//       experienceLevel: formData.experienceLevel,

//       // Convert "React, Node, SQL" → ["React", "Node", "SQL"]
//       skills: formData.skills
//         .split(",")
//         .map((skill) => skill.trim())
//         .filter(Boolean),

//       // Convert date → ISO datetime
//       deadline: formData.deadline
//         ? new Date(`${formData.deadline}T23:59:59.000Z`).toISOString()
//         : undefined,
//     };

//     console.log("Job payload:", payload);

//     await createJob(payload);

//     alert("Job created successfully!");

//     router.push("/dashboard/recruiter/jobs");
//   } catch (error: unknown) {
//     console.error("Job creation error:", error);

//     if (axios.isAxiosError(error)) {
//       console.error("Backend response:", error.response?.data);
//       console.error("Status:", error.response?.status);

//       alert(
//         error.response?.data?.message ||
//         "Failed to create job."
//       );
//     } else {
//       alert("Failed to create job.");
//     }
//   } finally {
//     setLoading(false);
//   }
// };


//   return (

//     <form
//       onSubmit={handleSubmit}
//       className="bg-white rounded-lg shadow p-6 space-y-4"
//     >

//       <h2 className="text-2xl font-bold">
//         Create Job
//       </h2>


//       <input
//         name="title"
//         placeholder="Job Title"
//         value={formData.title}
//         onChange={handleChange}
//         className="border p-2 rounded w-full"
//       />


//       <textarea
//         name="description"
//         placeholder="Job Description"
//         value={formData.description}
//         onChange={handleChange}
//         className="border p-2 rounded w-full"
//       />


//       <input
//         name="location"
//         placeholder="Location"
//         value={formData.location}
//         onChange={handleChange}
//         className="border p-2 rounded w-full"
//       />


//       <input
//         name="salary"
//         placeholder="Salary"
//         value={formData.salary}
//         onChange={handleChange}
//         className="border p-2 rounded w-full"
//       />


//       <input
//         name="employmentType"
//         placeholder="Employment Type (Full Time/Internship)"
//         value={formData.employmentType}
//         onChange={handleChange}
//         className="border p-2 rounded w-full"
//       />


//       <input
//         name="experienceLevel"
//         placeholder="Experience Level"
//         value={formData.experienceLevel}
//         onChange={handleChange}
//         className="border p-2 rounded w-full"
//       />


//       <input
//         name="skills"
//         placeholder="Skills (React, Node, SQL)"
//         value={formData.skills}
//         onChange={handleChange}
//         className="border p-2 rounded w-full"
//       />


//       <input
//         type="date"
//         name="deadline"
//         value={formData.deadline}
//         onChange={handleChange}
//         className="border p-2 rounded w-full"
//       />


//       <button
//         type="submit"
//         disabled={loading}
//         className="bg-blue-600 text-white px-5 py-2 rounded"
//       >

//         {
//           loading
//           ? "Creating..."
//           : "Create Job"
//         }

//       </button>


//     </form>

//   );
// }

"use client";

import axios from "axios";
import { useState } from "react";
import { createJob } from "@/services/job.service";
import { useRouter } from "next/navigation";

interface JobFormProps {
  initialData?: {
    title?: string;
    description?: string;
    location?: string;
    salary?: string;
    employmentType?: string;
    experienceLevel?: string;
    skills?: string[];
    deadline?: string;
  };
}

export default function JobForm({
  initialData,
}: JobFormProps) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    location: initialData?.location || "",
    salary: initialData?.salary || "",
    employmentType: initialData?.employmentType || "",
    experienceLevel: initialData?.experienceLevel || "",
    skills: initialData?.skills?.join(", ") || "",
    deadline: initialData?.deadline || "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      const payload = {
        title: formData.title,
        description: formData.description,
        location: formData.location,
        salary: formData.salary,
        employmentType: formData.employmentType,
        experienceLevel: formData.experienceLevel,

        skills: formData.skills
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean),

        deadline: formData.deadline
          ? new Date(
              `${formData.deadline}T23:59:59.000Z`
            ).toISOString()
          : undefined,
      };

      console.log("Job payload:", payload);

      await createJob(payload);

      alert("Job created successfully!");

      router.push("/dashboard/recruiter/jobs");
    } catch (error: unknown) {
      console.error("Job creation error:", error);

      if (axios.isAxiosError(error)) {
        console.error(
          "Backend response:",
          error.response?.data
        );
        console.error(
          "Status:",
          error.response?.status
        );

        alert(
          error.response?.data?.message ||
            "Failed to create job."
        );
      } else {
        alert("Failed to create job.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-5xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
    >
      {/* Header */}
      <div className="mb-8 border-b border-slate-200 pb-6">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          Create Job
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Add the details of the job opportunity you want
          to publish.
        </p>
      </div>

      {/* Job Details */}
      <div className="space-y-6">
        <div>
          <h3 className="text-base font-semibold text-slate-900">
            Job Details
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Provide the basic information candidates need
            to know.
          </p>
        </div>

        {/* Title + Location */}
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
              name="title"
              placeholder="e.g. Frontend Developer"
              value={formData.title}
              onChange={handleChange}
              className="h-11 w-full rounded-lg border border-slate-300 bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
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
              name="location"
              placeholder="e.g. Kolkata / Remote"
              value={formData.location}
              onChange={handleChange}
              className="h-11 w-full rounded-lg border border-slate-300 bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
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
            name="description"
            placeholder="Describe the role, responsibilities and what the candidate will work on..."
            value={formData.description}
            onChange={handleChange}
            rows={7}
            className="w-full resize-y rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
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
              name="salary"
              placeholder="e.g. ₹5–8 LPA"
              value={formData.salary}
              onChange={handleChange}
              className="h-11 w-full rounded-lg border border-slate-300 bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
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
              name="employmentType"
              placeholder="e.g. Full Time / Internship"
              value={formData.employmentType}
              onChange={handleChange}
              className="h-11 w-full rounded-lg border border-slate-300 bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
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
              name="experienceLevel"
              placeholder="e.g. Entry Level / 1–3 Years"
              value={formData.experienceLevel}
              onChange={handleChange}
              className="h-11 w-full rounded-lg border border-slate-300 bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
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
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
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
            name="skills"
            placeholder="e.g. React, Node.js, PostgreSQL, Git"
            value={formData.skills}
            onChange={handleChange}
            className="h-11 w-full rounded-lg border border-slate-300 bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
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
          disabled={loading}
          className="inline-flex h-11 items-center justify-center rounded-lg bg-blue-600 px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Creating..." : "Create Job"}
        </button>
      </div>
    </form>
  );
}