// "use client";

// import { useEffect, useRef, useState } from "react";
// import axios from "axios";

// import {
//   uploadResume,
//   getResumes,
//   deleteResume,
//   analyzeResume,
//   getResumeAnalysis,
// } from "@/services/resume.service";

// interface Resume {
//   id: string;
//   title: string;
//   fileUrl: string;
//   createdAt: string;
// }

// interface ResumeAnalysis {
//   score: number;
//   strengths: string[];
//   weaknesses: string[];
//   suggestions: string[];
// }

// export default function ResumeManager() {
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   const [file, setFile] = useState<File | null>(null);

//   const [loading, setLoading] = useState(false);

//   const [resumes, setResumes] = useState<Resume[]>([]);

//   const [analysis, setAnalysis] =
//     useState<ResumeAnalysis | null>(null);

//   const [analyzingId, setAnalyzingId] =
//     useState<string | null>(null);

//   const loadResumes = async () => {
//   try {
//     const response = await getResumes();

//     const resumeList = response.data;

//     setResumes(resumeList);

//     // Load existing AI analysis
//     for (const resume of resumeList) {
//       try {
//         const analysisResponse =
//           await getResumeAnalysis(resume.id);

//         if (analysisResponse?.data) {
//           setAnalysis(analysisResponse.data);
//           break;
//         }
//       } catch {
//         // Analysis may not exist yet
//         continue;
//       }
//     }
//   } catch (error) {
//     console.error(error);
//   }
// };

//   useEffect(() => {
//   let cancelled = false;

//   const fetchResumeData = async () => {
//     try {
//       const response = await getResumes();

//       if (cancelled) return;

//       const resumeList = response.data;

//       setResumes(resumeList);

//       for (const resume of resumeList) {
//         if (cancelled) return;

//         try {
//           const analysisResponse =
//             await getResumeAnalysis(resume.id);

//           if (
//             !cancelled &&
//             analysisResponse?.data
//           ) {
//             setAnalysis(analysisResponse.data);
//             break;
//           }
//         } catch {
//           // This resume may not have an analysis yet.
//         }
//       }
//     } catch (error) {
//       if (!cancelled) {
//         console.error(error);
//       }
//     }
//   };

//   fetchResumeData();

//   return () => {
//     cancelled = true;
//   };
// }, []);

//   const handleUpload = async () => {
//     if (!file) {
//       alert("Please select a PDF first.");
//       return;
//     }

//     try {
//       setLoading(true);

//       await uploadResume(file);

//       await loadResumes();

//       alert("Resume uploaded successfully!");

//       setFile(null);

//       if (fileInputRef.current) {
//         fileInputRef.current.value = "";
//       }
//     } catch (error) {
//       if (axios.isAxiosError(error)) {
//         alert(
//           error.response?.data?.message ??
//             "Upload failed."
//         );
//       } else {
//         alert("Something went wrong.");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDelete = async (id: string) => {
//     const confirmDelete = window.confirm(
//       "Are you sure you want to delete this resume?"
//     );

//     if (!confirmDelete) return;

//     try {
//       await deleteResume(id);

//       alert("Resume deleted successfully!");

//       await loadResumes();

//       if (analysis) {
//         setAnalysis(null);
//       }
//     } catch (error) {
//       console.error(error);

//       alert("Failed to delete resume.");
//     }
//   };

//   const handleView = async (fileUrl: string) => {
//   try {
//     // Open a new tab immediately to avoid popup blocking
//     const newWindow = window.open("", "_blank");

//     if (!newWindow) {
//       alert("Please allow pop-ups for this site.");
//       return;
//     }

//     newWindow.document.write(`
//       <html>
//         <head>
//           <title>Resume</title>
//           <style>
//             body {
//               margin: 0;
//               padding: 0;
//               overflow: hidden;
//             }

//             iframe {
//               width: 100vw;
//               height: 100vh;
//               border: none;
//             }
//           </style>
//         </head>
//         <body>
//           <p style="padding:20px;font-family:Arial;">
//             Loading resume...
//           </p>
//         </body>
//       </html>
//     `);

//     const response = await fetch(fileUrl);

//     if (!response.ok) {
//       throw new Error("Failed to load resume");
//     }

//     const blob = await response.blob();

//     // Force browser to treat it as PDF
//     const pdfBlob = new Blob([blob], {
//       type: "application/pdf",
//     });

//     const pdfUrl = URL.createObjectURL(pdfBlob);

//     newWindow.location.href = pdfUrl;

//     // Cleanup later
//     setTimeout(() => {
//       URL.revokeObjectURL(pdfUrl);
//     }, 60000);
//   } catch (error) {
//     console.error("Resume view error:", error);

//     alert("Unable to open resume.");
//   }
// };

//   const handleAnalyze = async (resumeId: string) => {
//   try {
//     setAnalyzingId(resumeId);

//     const response = await analyzeResume(resumeId);

//     console.log("AI ANALYSIS RESPONSE:", response);

//     setAnalysis(response.data);

//     alert("Resume analyzed successfully!");
//   } catch (error) {
//     console.error(error);
//     alert("Analysis failed.");
//   } finally {
//     setAnalyzingId(null);
//   }
// };

//   return (
//   <div className="space-y-6">

//     {/* Upload Section */}

//     <div className="border rounded-lg p-6">

//       <h2 className="text-xl font-semibold">
//         Upload Resume
//       </h2>

//       <p className="text-gray-500 mt-2">
//         Only PDF files are allowed.
//       </p>

//       <input
//         ref={fileInputRef}
//         type="file"
//         accept=".pdf"
//         className="hidden"
//         onChange={(e) => {
//           if (e.target.files?.length) {
//             setFile(e.target.files[0]);
//           }
//         }}
//       />

//       <button
//         onClick={() => fileInputRef.current?.click()}
//         className="mt-5 bg-blue-600 text-white px-5 py-2 rounded"
//       >
//         Choose Resume
//       </button>

//       {file && (
//         <p className="mt-4 text-green-600">
//           Selected: {file.name}
//         </p>
//       )}

//       <button
//         onClick={handleUpload}
//         disabled={loading}
//         className="mt-3 ml-3 bg-green-600 text-white px-5 py-2 rounded disabled:opacity-50"
//       >
//         {loading ? "Uploading..." : "Upload"}
//       </button>

//     </div>

//     {/* Resume List */}

//     <div className="border rounded-lg p-6">

//       <h2 className="text-xl font-semibold mb-4">
//         Uploaded Resumes
//       </h2>

//       {resumes.length === 0 ? (
//         <p className="text-gray-500">
//           No resume uploaded yet.
//         </p>
//       ) : (
//         <div className="space-y-4">

//           {resumes.map((resume) => (
//             <div
//               key={resume.id}
//               className="border rounded-lg p-4 flex justify-between items-center"
//             >

//               <div>

//                 <h3 className="font-medium">
//                   {resume.title}
//                 </h3>

//                 <p className="text-sm text-gray-500">
//                   Uploaded{" "}
//                   {new Date(
//                     resume.createdAt
//                   ).toLocaleDateString()}
//                 </p>

//               </div>

//               <div className="flex gap-2">

//                 <button
//   onClick={() => handleView(resume.fileUrl)}
//   className="bg-blue-600 text-white px-4 py-2 rounded"
// >
//   View
// </button>

//                 <button
//                   onClick={() => handleAnalyze(resume.id)}
//                   disabled={analyzingId === resume.id}
//                   className="bg-purple-600 text-white px-4 py-2 rounded disabled:opacity-50"
//                 >
//                   {analyzingId === resume.id
//                     ? "Analyzing..."
//                     : "Analyze AI"}
//                 </button>

//                 <button
//                   onClick={() => handleDelete(resume.id)}
//                   className="bg-red-600 text-white px-4 py-2 rounded"
//                 >
//                   Delete
//                 </button>

//               </div>

//             </div>
//           ))}

//         </div>
//       )}

//     </div>

//     {/* AI Analysis */}

//     {analysis && (
//       <div className="border rounded-lg p-6">

//         <h2 className="text-2xl font-bold mb-6">
//           AI Resume Analysis
//         </h2>

//         <div className="mb-8">

//           <p className="text-gray-500">
//             Resume Score
//           </p>

//           <h1 className="text-5xl font-bold text-blue-600">
//             {analysis.score}/100
//           </h1>

//         </div>

//         <div className="grid md:grid-cols-2 gap-6">

//           <div>

//             <h3 className="font-semibold text-green-600 mb-2">
//               ✅ Strengths
//             </h3>

//             <ul className="list-disc pl-5 space-y-2">

//               {analysis.strengths.map((item, index) => (
//                 <li key={index}>
//                   {item}
//                 </li>
//               ))}

//             </ul>

//           </div>

//           <div>

//             <h3 className="font-semibold text-red-600 mb-2">
//               ❌ Weaknesses
//             </h3>

//             <ul className="list-disc pl-5 space-y-2">

//               {analysis.weaknesses.map((item, index) => (
//                 <li key={index}>
//                   {item}
//                 </li>
//               ))}

//             </ul>

//           </div>

//         </div>

//         <div className="mt-8">

//           <h3 className="font-semibold text-blue-600 mb-2">
//             💡 Suggestions
//           </h3>

//           <ul className="list-disc pl-5 space-y-2">

//             {analysis.suggestions.map((item, index) => (
//               <li key={index}>
//                 {item}
//               </li>
//             ))}

//           </ul>

//         </div>

//       </div>
//     )}

//   </div>
// );
// }


"use client";

import { useEffect, useRef, useState } from "react";
import axios from "axios";

import {
  uploadResume,
  getResumes,
  deleteResume,
  analyzeResume,
  getResumeAnalysis,
} from "@/services/resume.service";

interface Resume {
  id: string;
  title: string;
  fileUrl: string;
  createdAt: string;
}

interface ResumeAnalysis {
  score: number;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
}

export default function ResumeManager() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const [resumes, setResumes] = useState<Resume[]>([]);
  const [analysis, setAnalysis] =
    useState<ResumeAnalysis | null>(null);

  const [analyzingId, setAnalyzingId] =
    useState<string | null>(null);

  /*
   * =========================
   * Load Resumes
   * =========================
   */

  const loadResumes = async () => {
    try {
      setLoading(true);

      const response = await getResumes();
      const resumeList = response.data;

      setResumes(resumeList);

      setAnalysis(null);

      // Load existing AI analysis
      for (const resume of resumeList) {
        try {
          const analysisResponse =
            await getResumeAnalysis(resume.id);

          if (analysisResponse?.data) {
            setAnalysis(analysisResponse.data);
            break;
          }
        } catch {
          // Analysis may not exist yet.
        }
      }
    } catch (error) {
      console.error("Failed to load resumes:", error);
    } finally {
      setLoading(false);
    }
  };

  /*
   * =========================
   * Initial Load
   * =========================
   */

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      try {
        const response = await getResumes();

        if (cancelled) return;

        const resumeList = response.data;

        setResumes(resumeList);

        for (const resume of resumeList) {
          if (cancelled) return;

          try {
            const analysisResponse =
              await getResumeAnalysis(resume.id);

            if (
              !cancelled &&
              analysisResponse?.data
            ) {
              setAnalysis(analysisResponse.data);
              break;
            }
          } catch {
            // No analysis for this resume.
          }
        }
      } catch (error) {
        if (!cancelled) {
          console.error(
            "Failed to load resumes:",
            error
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      cancelled = true;
    };
  }, []);

  /*
   * =========================
   * File Selection
   * =========================
   */

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFile = e.target.files?.[0];

    if (!selectedFile) return;

    if (selectedFile.type !== "application/pdf") {
      alert("Please select a PDF file only.");

      e.target.value = "";
      return;
    }

    setFile(selectedFile);
  };

  /*
   * =========================
   * Upload Resume
   * =========================
   */

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a PDF first.");
      return;
    }

    try {
      setUploading(true);

      await uploadResume(file);

      await loadResumes();

      setFile(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      alert("Resume uploaded successfully!");
    } catch (error) {
      console.error(error);

      if (axios.isAxiosError(error)) {
        alert(
          error.response?.data?.message ??
            "Upload failed."
        );
      } else {
        alert("Something went wrong.");
      }
    } finally {
      setUploading(false);
    }
  };

  /*
   * =========================
   * View Resume
   * =========================
   */

  const handleView = async (fileUrl: string) => {
    try {
      const newWindow = window.open(
        "",
        "_blank"
      );

      if (!newWindow) {
        alert(
          "Please allow pop-ups for this site."
        );
        return;
      }

      newWindow.document.write(`
        <html>
          <head>
            <title>Resume</title>
            <style>
              body {
                margin: 0;
                padding: 0;
                overflow: hidden;
              }

              iframe {
                width: 100vw;
                height: 100vh;
                border: none;
              }
            </style>
          </head>

          <body>
            <p style="
              padding:20px;
              font-family:Arial;
            ">
              Loading resume...
            </p>
          </body>
        </html>
      `);

      const response = await fetch(fileUrl);

      if (!response.ok) {
        throw new Error(
          "Failed to load resume"
        );
      }

      const blob = await response.blob();

      const pdfBlob = new Blob([blob], {
        type: "application/pdf",
      });

      const pdfUrl =
        URL.createObjectURL(pdfBlob);

      newWindow.location.href = pdfUrl;

      setTimeout(() => {
        URL.revokeObjectURL(pdfUrl);
      }, 60000);
    } catch (error) {
      console.error(
        "Resume view error:",
        error
      );

      alert("Unable to open resume.");
    }
  };

  /*
   * =========================
   * Delete Resume
   * =========================
   */

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this resume?"
    );

    if (!confirmed) return;

    try {
      await deleteResume(id);

      setAnalysis(null);

      await loadResumes();

      alert(
        "Resume deleted successfully!"
      );
    } catch (error) {
      console.error(error);

      alert("Failed to delete resume.");
    }
  };

  /*
   * =========================
   * AI Analysis
   * =========================
   */

  const handleAnalyze = async (
    resumeId: string
  ) => {
    try {
      setAnalyzingId(resumeId);

      const response =
        await analyzeResume(resumeId);

      setAnalysis(response.data);

      alert(
        "Resume analyzed successfully!"
      );
    } catch (error) {
      console.error(error);

      if (axios.isAxiosError(error)) {
        alert(
          error.response?.data?.message ??
            "Analysis failed."
        );
      } else {
        alert("Analysis failed.");
      }
    } finally {
      setAnalyzingId(null);
    }
  };

  /*
   * =========================
   * Loading State
   * =========================
   */

  if (loading) {
    return (
      <div className="w-full rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex min-h-55 items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-4 h-9 w-9 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600" />

            <p className="text-sm font-semibold text-slate-700">
              Loading resumes...
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Please wait while we load your resume information.
            </p>
          </div>
        </div>
      </div>
    );
  }

  /*
   * =========================
   * Render
   * =========================
   */

  return (
    <div className="space-y-6">

      {/* ========================= */}
      {/* Page Header */}
      {/* ========================= */}

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Resume
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Upload, manage and analyze your resume with AI.
        </p>
      </div>

      {/* ========================= */}
      {/* Upload Resume */}
      {/* ========================= */}

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

        <div className="border-b border-slate-200 bg-slate-50/70 px-6 py-6 sm:px-8">
          <div className="flex items-center gap-4">

            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-xl">
              📄
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Upload Resume
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Upload your latest resume in PDF format.
              </p>
            </div>

          </div>
        </div>

        <div className="p-6 sm:p-8">

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,application/pdf"
            className="hidden"
            onChange={handleFileChange}
          />

          {!file ? (
            <button
              type="button"
              onClick={() =>
                fileInputRef.current?.click()
              }
              className="flex w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center transition hover:border-blue-400 hover:bg-blue-50/40"
            >
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-xl">
                ↑
              </div>

              <p className="text-sm font-semibold text-slate-800">
                Choose your resume
              </p>

              <p className="mt-1 text-xs text-slate-500">
                PDF files only
              </p>
            </button>
          ) : (
            <div className="rounded-xl border border-blue-200 bg-blue-50/60 p-4">

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                <div className="flex min-w-0 items-center gap-3">

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-white text-lg shadow-sm">
                    📄
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-900">
                      {file.name}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>

                </div>

                <button
                  type="button"
                  onClick={() => {
                    setFile(null);

                    if (fileInputRef.current) {
                      fileInputRef.current.value = "";
                    }
                  }}
                  className="text-sm font-medium text-slate-600 hover:text-red-600"
                >
                  Remove
                </button>

              </div>

            </div>
          )}

          <div className="mt-5 flex flex-col gap-3 sm:flex-row">

            <button
              type="button"
              onClick={() =>
                fileInputRef.current?.click()
              }
              className="inline-flex h-11 items-center justify-center rounded-lg border border-slate-300 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              {file
                ? "Change File"
                : "Choose PDF"}
            </button>

            <button
              type="button"
              onClick={handleUpload}
              disabled={
                uploading || !file
              }
              className="inline-flex h-11 items-center justify-center rounded-lg bg-blue-600 px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {uploading
                ? "Uploading..."
                : "Upload Resume"}
            </button>

          </div>

        </div>
      </section>

      {/* ========================= */}
      {/* Uploaded Resumes */}
      {/* ========================= */}

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

        <div className="border-b border-slate-200 bg-slate-50/70 px-6 py-6 sm:px-8">

          <div className="flex items-center justify-between gap-4">

            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Uploaded Resumes
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Manage your uploaded resume files.
              </p>
            </div>

            <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-700">
              {resumes.length}{" "}
              {resumes.length === 1
                ? "Resume"
                : "Resumes"}
            </span>

          </div>

        </div>

        <div className="p-6 sm:p-8">

          {resumes.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">

              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-200 text-xl">
                📄
              </div>

              <p className="text-sm font-semibold text-slate-800">
                No resume uploaded yet
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Upload your resume to get started.
              </p>

            </div>
          ) : (
            <div className="space-y-4">

              {resumes.map((resume) => (
                <div
                  key={resume.id}
                  className="rounded-xl border border-slate-200 bg-white p-4 transition hover:border-slate-300 hover:shadow-sm sm:p-5"
                >

                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                    <div className="flex min-w-0 items-center gap-4">

                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-xl">
                        📄
                      </div>

                      <div className="min-w-0">
                        <h3 className="truncate text-sm font-semibold text-slate-900 sm:text-base">
                          {resume.title}
                        </h3>

                        <p className="mt-1 text-xs text-slate-500">
                          Uploaded{" "}
                          {new Date(
                            resume.createdAt
                          ).toLocaleDateString()}
                        </p>
                      </div>

                    </div>

                    <div className="flex flex-wrap gap-2">

                      <button
                        type="button"
                        onClick={() =>
                          handleView(
                            resume.fileUrl
                          )
                        }
                        className="inline-flex h-9 items-center justify-center rounded-lg border border-slate-300 bg-white px-4 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                      >
                        View
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleAnalyze(
                            resume.id
                          )
                        }
                        disabled={
                          analyzingId ===
                          resume.id
                        }
                        className="inline-flex h-9 items-center justify-center rounded-lg bg-purple-600 px-4 text-xs font-semibold text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {analyzingId ===
                        resume.id
                          ? "Analyzing..."
                          : "Analyze AI"}
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(
                            resume.id
                          )
                        }
                        className="inline-flex h-9 items-center justify-center rounded-lg border border-red-200 bg-red-50 px-4 text-xs font-semibold text-red-600 transition hover:bg-red-100"
                      >
                        Delete
                      </button>

                    </div>

                  </div>

                </div>
              ))}

            </div>
          )}

        </div>
      </section>

      {/* ========================= */}
      {/* AI Analysis */}
      {/* ========================= */}

      {analysis && (
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="border-b border-slate-200 bg-slate-50/70 px-6 py-6 sm:px-8">

            <div className="flex items-center gap-4">

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-purple-100 text-xl">
                ✨
              </div>

              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  AI Resume Analysis
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  AI-powered feedback to improve your resume.
                </p>
              </div>

            </div>

          </div>

          <div className="p-6 sm:p-8">

            {/* Score */}

            <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-6">

              <p className="text-sm font-medium text-slate-500">
                Resume Score
              </p>

              <div className="mt-2 flex items-end gap-2">

                <span className="text-5xl font-bold tracking-tight text-blue-600">
                  {analysis.score}
                </span>

                <span className="pb-1 text-lg font-medium text-slate-500">
                  / 100
                </span>

              </div>

            </div>

            {/* Strengths & Weaknesses */}

            <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-2">

              {/* Strengths */}

              <div className="rounded-xl border border-emerald-200 bg-emerald-50/40 p-5">

                <h3 className="text-sm font-bold text-emerald-700">
                  ✓ Strengths
                </h3>

                <ul className="mt-4 space-y-3">

                  {analysis.strengths.map(
                    (item, index) => (
                      <li
                        key={index}
                        className="flex gap-3 text-sm leading-6 text-slate-700"
                      >
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />

                        <span>{item}</span>
                      </li>
                    )
                  )}

                </ul>

              </div>

              {/* Weaknesses */}

              <div className="rounded-xl border border-red-200 bg-red-50/40 p-5">

                <h3 className="text-sm font-bold text-red-700">
                  ! Weaknesses
                </h3>

                <ul className="mt-4 space-y-3">

                  {analysis.weaknesses.map(
                    (item, index) => (
                      <li
                        key={index}
                        className="flex gap-3 text-sm leading-6 text-slate-700"
                      >
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-red-500" />

                        <span>{item}</span>
                      </li>
                    )
                  )}

                </ul>

              </div>

            </div>

            {/* Suggestions */}

            <div className="mt-6 rounded-xl border border-blue-200 bg-blue-50/40 p-5">

              <h3 className="text-sm font-bold text-blue-700">
                💡 Suggestions
              </h3>

              <ul className="mt-4 space-y-3">

                {analysis.suggestions.map(
                  (item, index) => (
                    <li
                      key={index}
                      className="flex gap-3 text-sm leading-6 text-slate-700"
                    >
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />

                      <span>{item}</span>
                    </li>
                  )
                )}

              </ul>

            </div>

          </div>
        </section>
      )}

    </div>
  );
}