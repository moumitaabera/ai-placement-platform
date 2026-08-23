// "use client";

// import { useEffect, useState } from "react";
// import { useParams } from "next/navigation";
// import { getMyResumes } from "@/services/resume.service";
// import { applyJob } from "@/services/application.service";
// import { useRouter } from "next/navigation";

// interface Resume {
//   id: string;
//   title: string;
//   fileUrl: string;
// }

// export default function ApplyJobPage() {
//   const params = useParams();
//   const router = useRouter();

//   const [resumes, setResumes] = useState<Resume[]>([]);
//   const [selectedResume, setSelectedResume] =
//     useState("");

//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchResumes = async () => {
//       try {
//         const response = await getMyResumes();

//         setResumes(response.data);
//       } catch (error) {
//         console.error(error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchResumes();
//   }, []);

//   const handleApply = async () => {
//   if (!selectedResume) {
//     alert("Please select a resume");
//     return;
//   }

//   try {
//     await applyJob({
//       jobId: params.id as string,
//       resumeId: selectedResume,
//     });

//     alert("Application submitted successfully!");

//     router.push("/dashboard/jobs");
//   } catch (error: unknown) {
//   console.error(error);

//   let message = "Application failed";

//   if (
//     typeof error === "object" &&
//     error !== null &&
//     "response" in error
//   ) {
//     const axiosError = error as {
//       response?: {
//         data?: {
//           message?: string;
//         };
//       };
//     };

//     message =
//       axiosError.response?.data?.message ??
//       message;
//   }

//   alert(message);
// }
// };

//   if (loading) {
//     return (
//       <div className="p-8">
//         Loading...
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-3xl mx-auto p-8">

//       <h1 className="text-3xl font-bold mb-8">
//         Apply Job
//       </h1>

//       <div className="border rounded-lg p-6 space-y-6">

//         <div>
//           <label className="block font-semibold mb-2">
//             Job ID
//           </label>

//           <code className="bg-gray-100 px-3 py-2 rounded">
//             {params.id}
//           </code>
//         </div>

//         <div>
//           <label className="block font-semibold mb-2">
//             Select Resume
//           </label>

//           <select
//             value={selectedResume}
//             onChange={(e) =>
//               setSelectedResume(e.target.value)
//             }
//             className="border rounded w-full p-2"
//           >
//             <option value="">
//               Select Resume
//             </option>

//             {resumes.map((resume) => (
//               <option
//                 key={resume.id}
//                 value={resume.id}
//               >
//                 {resume.title}
//               </option>
//             ))}
//           </select>
//         </div>

//         <button
//   onClick={handleApply}
//   disabled={!selectedResume}
//   className="bg-blue-600 text-white px-5 py-2 rounded disabled:bg-gray-400"
// >
//   Apply Now
// </button>

//       </div>

//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { getMyResumes } from "@/services/resume.service";
import { applyJob } from "@/services/application.service";

interface Resume {
  id: string;
  title: string;
  fileUrl: string;
}

export default function ApplyJobPage() {
  const params = useParams();
  const router = useRouter();

  const [resumes, setResumes] = useState<Resume[]>([]);
  const [selectedResume, setSelectedResume] = useState("");
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const response = await getMyResumes();
        setResumes(response.data);
      } catch (error) {
        console.error("Failed to load resumes:", error);
        alert("Failed to load resumes");
      } finally {
        setLoading(false);
      }
    };

    fetchResumes();
  }, []);

  const handleApply = async () => {
    if (!selectedResume) {
      alert("Please select a resume");
      return;
    }

    if (!params.id) {
      alert("Invalid job");
      return;
    }

    setApplying(true);

    try {
      await applyJob({
        jobId: params.id as string,
        resumeId: selectedResume,
      });

      alert("Application submitted successfully!");

      router.push("/dashboard/applications");
    } catch (error: unknown) {
      console.error("Application error:", error);

      let message = "Application failed";

      if (
        typeof error === "object" &&
        error !== null &&
        "response" in error
      ) {
        const axiosError = error as {
          response?: {
            data?: {
              message?: string;
            };
          };
        };

        message =
          axiosError.response?.data?.message ??
          message;
      }

      alert(message);
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto p-8">
        Loading resumes...
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">
        Apply for Job
      </h1>

      <div className="border rounded-lg p-6 space-y-6 shadow-sm">
        <div>
          <label className="block font-semibold mb-2">
            Select Resume
          </label>

          {resumes.length === 0 ? (
            <div className="space-y-3">
              <p className="text-gray-600">
                You dont have any resumes yet.
              </p>

              <button
                type="button"
                onClick={() =>
                  router.push("/dashboard/resume")
                }
                className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
              >
                Upload Resume
              </button>
            </div>
          ) : (
            <select
              value={selectedResume}
              onChange={(e) =>
                setSelectedResume(e.target.value)
              }
              className="border rounded w-full p-2"
              disabled={applying}
            >
              <option value="">
                Select Resume
              </option>

              {resumes.map((resume) => (
                <option
                  key={resume.id}
                  value={resume.id}
                >
                  {resume.title}
                </option>
              ))}
            </select>
          )}
        </div>

        {resumes.length > 0 && (
          <button
            type="button"
            onClick={handleApply}
            disabled={!selectedResume || applying}
            className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {applying
              ? "Submitting..."
              : "Apply Now"}
          </button>
        )}
      </div>
    </div>
  );
}