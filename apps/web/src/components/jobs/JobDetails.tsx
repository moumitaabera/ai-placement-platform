// "use client";

// import { useEffect, useState } from "react";
// import { getJob } from "@/services/job.service";
// import { useRouter } from "next/navigation";

// interface JobDetailsProps {
//   id: string;
// }

// interface Job {
//   id: string;
//   title: string;
//   description: string;
//   location?: string;
//   salary?: string;
//   employmentType: string;
//   experienceLevel: string;
//   skills: string[];
//   deadline?: string;
//   status: string;
// }

// export default function JobDetails({
//   id,
// }: JobDetailsProps) {
//   const [job, setJob] = useState<Job | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [now, setNow] = useState<number | null>(null);

//   const router = useRouter();

//   /*
//    * =========================
//    * Load Job
//    * =========================
//    */

//   useEffect(() => {
//     const loadJob = async () => {
//       try {
//         const response = await getJob(id);

//         setJob(response.data);
//       } catch (error) {
//         console.error("Failed to load job:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadJob();
//   }, [id]);

//   /*
//    * =========================
//    * Current Time
//    * =========================
//    *
//    * Keeps the current time updated every minute.
//    * This allows the Apply button to automatically
//    * close when the deadline passes.
//    */

//   useEffect(() => {
//     const updateTime = () => {
//       setNow(Date.now());
//     };

//     updateTime();

//     const timer = setInterval(
//       updateTime,
//       60 * 1000
//     );

//     return () => {
//       clearInterval(timer);
//     };
//   }, []);

//   /*
//    * =========================
//    * Loading
//    * =========================
//    */

//   if (loading) {
//     return (
//       <div className="p-6">
//         Loading...
//       </div>
//     );
//   }

//   /*
//    * =========================
//    * Job Not Found
//    * =========================
//    */

//   if (!job) {
//     return (
//       <div className="p-6">
//         Job not found.
//       </div>
//     );
//   }

//   /*
//    * =========================
//    * Deadline
//    * =========================
//    */

//   const deadlineTime = job.deadline
//     ? new Date(job.deadline).getTime()
//     : null;

//   const isDeadlinePassed =
//     deadlineTime !== null &&
//     now !== null &&
//     deadlineTime <= now;

//   /*
//    * =========================
//    * Render
//    * =========================
//    */

//   return (
//     <div className="border rounded-lg shadow p-6 space-y-4">

//       {/* ========================= */}
//       {/* Title */}
//       {/* ========================= */}

//       <h2 className="text-3xl font-bold">
//         {job.title}
//       </h2>

//       {/* ========================= */}
//       {/* Description */}
//       {/* ========================= */}

//       <div>
//         <h3 className="font-semibold">
//           Description
//         </h3>

//         <p className="mt-1 text-gray-700">
//           {job.description}
//         </p>
//       </div>

//       {/* ========================= */}
//       {/* Location */}
//       {/* ========================= */}

//       <p>
//         <strong>Location:</strong>{" "}
//         {job.location || "N/A"}
//       </p>

//       {/* ========================= */}
//       {/* Salary */}
//       {/* ========================= */}

//       <p>
//         <strong>Salary:</strong>{" "}
//         {job.salary || "N/A"}
//       </p>

//       {/* ========================= */}
//       {/* Employment Type */}
//       {/* ========================= */}

//       <p>
//         <strong>Employment Type:</strong>{" "}
//         {job.employmentType}
//       </p>

//       {/* ========================= */}
//       {/* Experience */}
//       {/* ========================= */}

//       <p>
//         <strong>Experience:</strong>{" "}
//         {job.experienceLevel}
//       </p>

//       {/* ========================= */}
//       {/* Status */}
//       {/* ========================= */}

//       <p>
//         <strong>Status:</strong>{" "}
//         {job.status}
//       </p>

//       {/* ========================= */}
//       {/* Deadline */}
//       {/* ========================= */}

//       <p>
//         <strong>Deadline:</strong>{" "}

//         {job.deadline
//           ? new Date(
//               job.deadline
//             ).toLocaleDateString()
//           : "N/A"}
//       </p>

//       {/* ========================= */}
//       {/* Skills */}
//       {/* ========================= */}

//       <div>
//         <h3 className="font-semibold mb-2">
//           Skills
//         </h3>

//         <div className="flex flex-wrap gap-2">
//           {job.skills.map((skill) => (
//             <span
//               key={skill}
//               className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
//             >
//               {skill}
//             </span>
//           ))}
//         </div>
//       </div>

//       {/* ========================= */}
//       {/* Apply Button */}
//       {/* ========================= */}

//       {isDeadlinePassed ? (
//         <div className="space-y-2">

//           <p className="text-red-600 font-semibold">
//             Application deadline has passed.
//           </p>

//           <button
//             type="button"
//             disabled
//             className="bg-gray-400 text-white px-5 py-2 rounded cursor-not-allowed"
//           >
//             Applications Closed
//           </button>

//         </div>
//       ) : (
//         <button
//           type="button"
//           onClick={() =>
//             router.push(
//               `/dashboard/jobs/${job.id}/apply`
//             )
//           }
//           className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded"
//         >
//           Apply Now
//         </button>
//       )}

//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { getJob } from "@/services/job.service";
import { getMe } from "@/services/auth.service";
import { useRouter } from "next/navigation";

interface JobDetailsProps {
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
  status: string;
}

interface User {
  role: string;
}

export default function JobDetails({
  id,
}: JobDetailsProps) {
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [now, setNow] = useState<number | null>(null);
  const [user, setUser] = useState<User | null>(null);

  const router = useRouter();

  /*
   * =========================
   * Load Job
   * =========================
   */

  useEffect(() => {
    const loadJob = async () => {
      try {
        const response = await getJob(id);

        setJob(response.data);
      } catch (error) {
        console.error("Failed to load job:", error);
      } finally {
        setLoading(false);
      }
    };

    loadJob();
  }, [id]);

  /*
   * =========================
   * Load Current User
   * =========================
   */

  useEffect(() => {
    const loadUser = async () => {
      try {
        const response = await getMe();

        setUser(response.data);
      } catch (error) {
        console.error("Failed to load user:", error);
      }
    };

    loadUser();
  }, []);

  /*
   * =========================
   * Current Time
   * =========================
   *
   * Keeps the current time updated every minute.
   * This allows the Apply button to automatically
   * close when the deadline passes.
   */

  useEffect(() => {
    const updateTime = () => {
      setNow(Date.now());
    };

    updateTime();

    const timer = setInterval(
      updateTime,
      60 * 1000
    );

    return () => {
      clearInterval(timer);
    };
  }, []);

  /*
   * =========================
   * Loading
   * =========================
   */

  if (loading) {
    return (
      <div className="p-6">
        Loading...
      </div>
    );
  }

  /*
   * =========================
   * Job Not Found
   * =========================
   */

  if (!job) {
    return (
      <div className="p-6">
        Job not found.
      </div>
    );
  }

  /*
   * =========================
   * Deadline
   * =========================
   */

  const deadlineTime = job.deadline
    ? new Date(job.deadline).getTime()
    : null;

  const isDeadlinePassed =
    deadlineTime !== null &&
    now !== null &&
    deadlineTime <= now;

  /*
   * =========================
   * Render
   * =========================
   */

  return (
    <div className="border rounded-lg shadow p-6 space-y-4">

      {/* ========================= */}
      {/* Title */}
      {/* ========================= */}

      <h2 className="text-3xl font-bold">
        {job.title}
      </h2>

      {/* ========================= */}
      {/* Description */}
      {/* ========================= */}

      <div>
        <h3 className="font-semibold">
          Description
        </h3>

        <p className="mt-1 text-gray-700">
          {job.description}
        </p>
      </div>

      {/* ========================= */}
      {/* Location */}
      {/* ========================= */}

      <p>
        <strong>Location:</strong>{" "}
        {job.location || "N/A"}
      </p>

      {/* ========================= */}
      {/* Salary */}
      {/* ========================= */}

      <p>
        <strong>Salary:</strong>{" "}
        {job.salary || "N/A"}
      </p>

      {/* ========================= */}
      {/* Employment Type */}
      {/* ========================= */}

      <p>
        <strong>Employment Type:</strong>{" "}
        {job.employmentType}
      </p>

      {/* ========================= */}
      {/* Experience */}
      {/* ========================= */}

      <p>
        <strong>Experience:</strong>{" "}
        {job.experienceLevel}
      </p>

      {/* ========================= */}
      {/* Status */}
      {/* ========================= */}

      <p>
        <strong>Status:</strong>{" "}
        {job.status}
      </p>

      {/* ========================= */}
      {/* Deadline */}
      {/* ========================= */}

      <p>
        <strong>Deadline:</strong>{" "}

        {job.deadline
  ? job.deadline.split("T")[0]
  : "N/A"}
      </p>

      {/* ========================= */}
      {/* Skills */}
      {/* ========================= */}

      <div>
        <h3 className="font-semibold mb-2">
          Skills
        </h3>

        <div className="flex flex-wrap gap-2">
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

      {/* Recruiter Actions */}
{user?.role === "RECRUITER" && (
  <div className="flex gap-3 pt-4 border-t">
    <button
      type="button"
      onClick={() =>
        router.push(
          `/dashboard/recruiter/jobs/${job.id}/applicants`
        )
      }
      className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded"
    >
      View Applicants
    </button>
  </div>
)}

      {/* ========================= */}
      {/* Student Apply Button */}
      {/* ========================= */}

      {user?.role === "STUDENT" && (
        <>
          {isDeadlinePassed ? (
            <div className="space-y-2">

              <p className="text-red-600 font-semibold">
                Application deadline has passed.
              </p>

              <button
                type="button"
                disabled
                className="bg-gray-400 text-white px-5 py-2 rounded cursor-not-allowed"
              >
                Applications Closed
              </button>

            </div>
          ) : (
            <button
              type="button"
              onClick={() =>
                router.push(
                  `/dashboard/jobs/${job.id}/apply`
                )
              }
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded"
            >
              Apply Now
            </button>
          )}
        </>
      )}

    </div>
  );
}