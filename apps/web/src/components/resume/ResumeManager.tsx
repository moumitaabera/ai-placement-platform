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

  const [loading, setLoading] = useState(false);

  const [resumes, setResumes] = useState<Resume[]>([]);

  const [analysis, setAnalysis] =
    useState<ResumeAnalysis | null>(null);

  const [analyzingId, setAnalyzingId] =
    useState<string | null>(null);

  const loadResumes = async () => {
  try {
    const response = await getResumes();

    const resumeList = response.data;

    setResumes(resumeList);

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
        // Analysis may not exist yet
        continue;
      }
    }
  } catch (error) {
    console.error(error);
  }
};

  useEffect(() => {
  let cancelled = false;

  const fetchResumeData = async () => {
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
          // This resume may not have an analysis yet.
        }
      }
    } catch (error) {
      if (!cancelled) {
        console.error(error);
      }
    }
  };

  fetchResumeData();

  return () => {
    cancelled = true;
  };
}, []);

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a PDF first.");
      return;
    }

    try {
      setLoading(true);

      await uploadResume(file);

      await loadResumes();

      alert("Resume uploaded successfully!");

      setFile(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        alert(
          error.response?.data?.message ??
            "Upload failed."
        );
      } else {
        alert("Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this resume?"
    );

    if (!confirmDelete) return;

    try {
      await deleteResume(id);

      alert("Resume deleted successfully!");

      await loadResumes();

      if (analysis) {
        setAnalysis(null);
      }
    } catch (error) {
      console.error(error);

      alert("Failed to delete resume.");
    }
  };

  const handleView = async (fileUrl: string) => {
  try {
    // Open a new tab immediately to avoid popup blocking
    const newWindow = window.open("", "_blank");

    if (!newWindow) {
      alert("Please allow pop-ups for this site.");
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
          <p style="padding:20px;font-family:Arial;">
            Loading resume...
          </p>
        </body>
      </html>
    `);

    const response = await fetch(fileUrl);

    if (!response.ok) {
      throw new Error("Failed to load resume");
    }

    const blob = await response.blob();

    // Force browser to treat it as PDF
    const pdfBlob = new Blob([blob], {
      type: "application/pdf",
    });

    const pdfUrl = URL.createObjectURL(pdfBlob);

    newWindow.location.href = pdfUrl;

    // Cleanup later
    setTimeout(() => {
      URL.revokeObjectURL(pdfUrl);
    }, 60000);
  } catch (error) {
    console.error("Resume view error:", error);

    alert("Unable to open resume.");
  }
};

  const handleAnalyze = async (resumeId: string) => {
  try {
    setAnalyzingId(resumeId);

    const response = await analyzeResume(resumeId);

    console.log("AI ANALYSIS RESPONSE:", response);

    setAnalysis(response.data);

    alert("Resume analyzed successfully!");
  } catch (error) {
    console.error(error);
    alert("Analysis failed.");
  } finally {
    setAnalyzingId(null);
  }
};

  return (
  <div className="space-y-6">

    {/* Upload Section */}

    <div className="border rounded-lg p-6">

      <h2 className="text-xl font-semibold">
        Upload Resume
      </h2>

      <p className="text-gray-500 mt-2">
        Only PDF files are allowed.
      </p>

      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf"
        className="hidden"
        onChange={(e) => {
          if (e.target.files?.length) {
            setFile(e.target.files[0]);
          }
        }}
      />

      <button
        onClick={() => fileInputRef.current?.click()}
        className="mt-5 bg-blue-600 text-white px-5 py-2 rounded"
      >
        Choose Resume
      </button>

      {file && (
        <p className="mt-4 text-green-600">
          Selected: {file.name}
        </p>
      )}

      <button
        onClick={handleUpload}
        disabled={loading}
        className="mt-3 ml-3 bg-green-600 text-white px-5 py-2 rounded disabled:opacity-50"
      >
        {loading ? "Uploading..." : "Upload"}
      </button>

    </div>

    {/* Resume List */}

    <div className="border rounded-lg p-6">

      <h2 className="text-xl font-semibold mb-4">
        Uploaded Resumes
      </h2>

      {resumes.length === 0 ? (
        <p className="text-gray-500">
          No resume uploaded yet.
        </p>
      ) : (
        <div className="space-y-4">

          {resumes.map((resume) => (
            <div
              key={resume.id}
              className="border rounded-lg p-4 flex justify-between items-center"
            >

              <div>

                <h3 className="font-medium">
                  {resume.title}
                </h3>

                <p className="text-sm text-gray-500">
                  Uploaded{" "}
                  {new Date(
                    resume.createdAt
                  ).toLocaleDateString()}
                </p>

              </div>

              <div className="flex gap-2">

                <button
  onClick={() => handleView(resume.fileUrl)}
  className="bg-blue-600 text-white px-4 py-2 rounded"
>
  View
</button>

                <button
                  onClick={() => handleAnalyze(resume.id)}
                  disabled={analyzingId === resume.id}
                  className="bg-purple-600 text-white px-4 py-2 rounded disabled:opacity-50"
                >
                  {analyzingId === resume.id
                    ? "Analyzing..."
                    : "Analyze AI"}
                </button>

                <button
                  onClick={() => handleDelete(resume.id)}
                  className="bg-red-600 text-white px-4 py-2 rounded"
                >
                  Delete
                </button>

              </div>

            </div>
          ))}

        </div>
      )}

    </div>

    {/* AI Analysis */}

    {analysis && (
      <div className="border rounded-lg p-6">

        <h2 className="text-2xl font-bold mb-6">
          AI Resume Analysis
        </h2>

        <div className="mb-8">

          <p className="text-gray-500">
            Resume Score
          </p>

          <h1 className="text-5xl font-bold text-blue-600">
            {analysis.score}/100
          </h1>

        </div>

        <div className="grid md:grid-cols-2 gap-6">

          <div>

            <h3 className="font-semibold text-green-600 mb-2">
              ✅ Strengths
            </h3>

            <ul className="list-disc pl-5 space-y-2">

              {analysis.strengths.map((item, index) => (
                <li key={index}>
                  {item}
                </li>
              ))}

            </ul>

          </div>

          <div>

            <h3 className="font-semibold text-red-600 mb-2">
              ❌ Weaknesses
            </h3>

            <ul className="list-disc pl-5 space-y-2">

              {analysis.weaknesses.map((item, index) => (
                <li key={index}>
                  {item}
                </li>
              ))}

            </ul>

          </div>

        </div>

        <div className="mt-8">

          <h3 className="font-semibold text-blue-600 mb-2">
            💡 Suggestions
          </h3>

          <ul className="list-disc pl-5 space-y-2">

            {analysis.suggestions.map((item, index) => (
              <li key={index}>
                {item}
              </li>
            ))}

          </ul>

        </div>

      </div>
    )}

  </div>
);
}