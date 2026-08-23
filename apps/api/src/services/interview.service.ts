import prisma from "../lib/prisma";
import axios from "axios";
import pdfParse from "pdf-parse";
import ai from "../config/gemini";

/* =========================================================
   Helper: Safely parse JSON returned by Gemini
   ========================================================= */

const parseGeminiJSON = (text: string) => {
  if (!text || !text.trim()) {
    throw new Error("Gemini returned an empty response");
  }

  let cleaned = text.trim();

  // Remove markdown code fences if Gemini returns them
  cleaned = cleaned
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  // Sometimes Gemini adds text before/after JSON.
  // Try to extract the JSON object.
  const firstBrace = cleaned.indexOf("{");
  const lastBrace = cleaned.lastIndexOf("}");

  if (firstBrace !== -1 && lastBrace !== -1) {
    cleaned = cleaned.substring(firstBrace, lastBrace + 1);
  }

  try {
    return JSON.parse(cleaned);
  } catch (error) {
    console.error("❌ Gemini JSON parsing failed");
    console.error("Raw Gemini response:");
    console.error(text);
    console.error("Cleaned response:");
    console.error(cleaned);

    throw new Error(
      "AI returned invalid JSON. Please try submitting the interview again."
    );
  }
};

/* =========================================================
   Generate Interview Questions
   ========================================================= */

export const generateInterviewQuestions = async (
  userId: string,
  resumeId: string,
  jobId: string
) => {
  // -------------------------------------------------------
  // 1. Find student
  // -------------------------------------------------------

  const student = await prisma.studentProfile.findUnique({
    where: {
      userId,
    },
  });

  if (!student) {
    throw new Error("Student profile not found");
  }

  // -------------------------------------------------------
  // 2. Find resume
  // -------------------------------------------------------

  const resume = await prisma.resume.findFirst({
    where: {
      id: resumeId,
      studentId: student.id,
    },
  });

  if (!resume) {
    throw new Error("Resume not found");
  }

  // -------------------------------------------------------
  // 3. Find job
  // -------------------------------------------------------

  const job = await prisma.job.findUnique({
    where: {
      id: jobId,
    },
  });

  if (!job) {
    throw new Error("Job not found");
  }

  // -------------------------------------------------------
  // 4. Download resume PDF
  // -------------------------------------------------------

  console.log("📄 Downloading resume...");

  const response = await axios.get(resume.fileUrl, {
    responseType: "arraybuffer",
  });

  // -------------------------------------------------------
  // 5. Extract PDF text
  // -------------------------------------------------------

  console.log("📄 Extracting resume text...");

  const pdf = await pdfParse(response.data);

  if (!pdf.text || !pdf.text.trim()) {
    throw new Error("Could not extract text from resume");
  }

  // -------------------------------------------------------
  // 6. Create AI prompt
  // -------------------------------------------------------

  const prompt = `
You are a senior software engineering interviewer.

Using the candidate's resume and the job description,
generate exactly 10 interview questions.

Requirements:

- Return ONLY valid JSON.
- Do NOT use markdown.
- Do NOT use code fences.
- Do NOT include any explanation outside JSON.
- Mix technical, behavioral, project-based, and problem-solving questions.
- Make the questions personalized to the candidate's resume and job.
- Each question must have a type and question.

Required JSON format:

{
  "questions": [
    {
      "type": "Technical",
      "question": "..."
    }
  ]
}

Candidate Resume:

${pdf.text}

---

Job Title:

${job.title}

---

Job Description:

${job.description}

---

Required Skills:

${job.skills.join(", ")}
`;

  // -------------------------------------------------------
  // 7. Ask Gemini
  // -------------------------------------------------------

  console.log("🤖 Generating interview questions with Gemini...");

  const aiResponse = await ai.models.generateContent({
    model: "gemini-3.5-flash",
    contents: prompt,
  });

  const text = aiResponse.text?.trim();

  if (!text) {
    throw new Error("AI returned empty response");
  }

  console.log("🤖 Gemini questions response received");

  // -------------------------------------------------------
  // 8. Safely parse JSON
  // -------------------------------------------------------

  const questionData = parseGeminiJSON(text);

  // -------------------------------------------------------
  // 9. Validate response
  // -------------------------------------------------------

  if (
    !questionData ||
    !Array.isArray(questionData.questions)
  ) {
    throw new Error(
      "AI returned an invalid interview questions format"
    );
  }

  if (questionData.questions.length !== 10) {
    throw new Error(
      `AI returned ${questionData.questions.length} questions instead of 10`
    );
  }

  for (const question of questionData.questions) {
    if (
      typeof question.type !== "string" ||
      typeof question.question !== "string"
    ) {
      throw new Error(
        "AI returned an invalid question format"
      );
    }
  }

  console.log("✅ Interview questions generated successfully");

  return questionData;
};

/* =========================================================
   Start Interview
   ========================================================= */

export const startInterview = async (
  userId: string,
  resumeId: string,
  jobId: string,
  difficulty: "EASY" | "MEDIUM" | "HARD" = "MEDIUM"
) => {
  // -------------------------------------------------------
  // 1. Find student
  // -------------------------------------------------------

  const student = await prisma.studentProfile.findUnique({
    where: {
      userId,
    },
  });

  if (!student) {
    throw new Error("Student profile not found");
  }

  // -------------------------------------------------------
  // 2. Verify resume
  // -------------------------------------------------------

  const resume = await prisma.resume.findFirst({
    where: {
      id: resumeId,
      studentId: student.id,
    },
  });

  if (!resume) {
    throw new Error("Resume not found");
  }

  // -------------------------------------------------------
  // 3. Verify job
  // -------------------------------------------------------

  const job = await prisma.job.findUnique({
    where: {
      id: jobId,
    },
  });

  if (!job) {
    throw new Error("Job not found");
  }

  // -------------------------------------------------------
  // 4. Generate questions
  // -------------------------------------------------------

  console.log("🎯 Starting interview...");

  const questionData =
    await generateInterviewQuestions(
      userId,
      resumeId,
      jobId
    );

  // -------------------------------------------------------
  // 5. Create interview session
  // -------------------------------------------------------

  const session =
    await prisma.interviewSession.create({
      data: {
        studentId: student.id,
        jobId: job.id,
        difficulty,
        questions: questionData.questions,
      },
    });

  console.log(
    "✅ Interview session created:",
    session.id
  );

  return {
    session,
    questions: questionData.questions,
  };
};

/* =========================================================
   Get Interview Session
   ========================================================= */

export const getInterviewSession = async (
  userId: string,
  sessionId: string
) => {
  console.log("========== GET INTERVIEW SESSION ==========");
  console.log("User ID:", userId);
  console.log("Session ID:", sessionId);

  // 1. Find student
  const student = await prisma.studentProfile.findUnique({
    where: {
      userId,
    },
  });

  if (!student) {
    throw new Error("Student profile not found");
  }

  console.log("Student ID:", student.id);

  // 2. Find session belonging to this student
  const session = await prisma.interviewSession.findFirst({
    where: {
      id: sessionId,
      studentId: student.id,
    },
    include: {
      job: true,
      feedback: true,
    },
  });

  console.log(
    "Session found:",
    session ? session.id : "NOT FOUND"
  );

  if (!session) {
    throw new Error("Interview session not found");
  }

  return session;
};
/* =========================================================
   Submit Interview
   ========================================================= */

export const submitInterview = async (
  userId: string,
  sessionId: string,
  answers: any
) => {
  console.log(
    "========== SUBMIT INTERVIEW START =========="
  );

  console.log("User ID:", userId);
  console.log("Session ID:", sessionId);

  console.log(
    "Answers:",
    Array.isArray(answers)
      ? `${answers.length} answers`
      : "NOT ARRAY"
  );

  try {
    // -----------------------------------------------------
    // 1. Find student
    // -----------------------------------------------------

    const student =
      await prisma.studentProfile.findUnique({
        where: {
          userId,
        },
      });

    if (!student) {
      throw new Error("Student profile not found");
    }

    console.log(
      "✅ Student found:",
      student.id
    );

    // -----------------------------------------------------
    // 2. Find interview session
    // -----------------------------------------------------

    console.log(
      "🔍 Searching interview session..."
    );

    const session =
      await prisma.interviewSession.findUnique({
        where: {
          id: sessionId,
        },
        include: {
          job: true,
        },
      });

    console.log(
      "Session found:",
      session ? session.id : null
    );

    if (!session) {
      throw new Error(
        `Interview session not found: ${sessionId}`
      );
    }

    // -----------------------------------------------------
    // 3. Security check
    // -----------------------------------------------------

    if (session.studentId !== student.id) {
      throw new Error(
        "You are not allowed to submit this interview"
      );
    }

    console.log(
      "✅ Interview ownership verified"
    );

    // -----------------------------------------------------
    // 4. Validate answers
    // -----------------------------------------------------

    if (!Array.isArray(answers)) {
      throw new Error(
        "Answers must be an array"
      );
    }

    if (answers.length === 0) {
      throw new Error(
        "At least one answer is required"
      );
    }

    console.log(
      "✅ Answers validated:",
      answers.length
    );

    // -----------------------------------------------------
    // 5. Save answers
    // -----------------------------------------------------

    const updatedSession =
      await prisma.interviewSession.update({
        where: {
          id: session.id,
        },
        data: {
          answers,
          completedAt: new Date(),
        },
      });

    console.log(
      "✅ Answers saved successfully"
    );

    // -----------------------------------------------------
    // 6. Prepare AI evaluation prompt
    // -----------------------------------------------------

    const prompt = `
You are an expert technical interviewer.

Evaluate the candidate's interview answers carefully.

Give scores from 0 to 100.

Analyze:

- Overall interview performance
- Technical knowledge
- Communication
- Confidence
- Problem solving

Also identify:

- The candidate's strongest areas
- The areas where the candidate needs improvement
- Specific actionable recommendations for future interviews

Return ONLY valid JSON.

Do NOT use markdown.
Do NOT use code fences.
Do NOT include any explanation outside JSON.

Required JSON format:

{
  "score": 80,
  "technical": 85,
  "communication": 75,
  "confidence": 80,
  "feedback": "Detailed overall feedback about the candidate's interview performance.",
  "strengths": [
    "Strong understanding of the discussed technical concepts",
    "Clear explanation of project experience"
  ],
  "improvements": [
    "Some technical answers lacked depth",
    "Problem-solving explanations could be more structured"
  ],
  "recommendations": [
    "Practice explaining technical concepts with concrete examples",
    "Use a structured approach when answering problem-solving questions"
  ]
}

Important requirements:

- "score" must be a number between 0 and 100.
- "technical" must be a number between 0 and 100.
- "communication" must be a number between 0 and 100.
- "confidence" must be a number between 0 and 100.
- "feedback" must be a non-empty string.
- "strengths" must be an array of strings.
- "improvements" must be an array of strings.
- "recommendations" must be an array of strings.
- Provide at least 2 items in each of strengths, improvements, and recommendations.
- Evaluate the candidate based only on the provided questions and answers.
- Do not invent achievements or experience that are not present in the answers.

Questions:

${JSON.stringify(session.questions)}

Candidate Answers:

${JSON.stringify(answers)}
`;

    // -----------------------------------------------------
    // 7. Send answers to Gemini
    // -----------------------------------------------------

    console.log(
      "🤖 Sending interview evaluation to Gemini..."
    );

    const aiResponse =
      await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
      });

    console.log(
      "🤖 Gemini evaluation response received"
    );

    const text = aiResponse.text?.trim();

    // -----------------------------------------------------
    // 8. Check Gemini response
    // -----------------------------------------------------

    if (!text) {
      throw new Error(
        "AI evaluation failed: Gemini returned an empty response"
      );
    }

    console.log(
      "Gemini raw response:",
      text
    );

    // -----------------------------------------------------
    // 9. Safely parse evaluation JSON
    // -----------------------------------------------------

    const evaluation =
      parseGeminiJSON(text);

    console.log(
      "✅ Evaluation parsed:",
      evaluation
    );

    // -----------------------------------------------------
// 10. Validate evaluation
// -----------------------------------------------------

if (
  typeof evaluation.score !== "number" ||
  typeof evaluation.technical !== "number" ||
  typeof evaluation.communication !== "number" ||
  typeof evaluation.confidence !== "number" ||
  typeof evaluation.feedback !== "string" ||
  !Array.isArray(evaluation.strengths) ||
  !Array.isArray(evaluation.improvements) ||
  !Array.isArray(evaluation.recommendations)
) {
  throw new Error(
    "AI evaluation format is invalid"
  );
}

// -----------------------------------------------------
// 11. Validate score ranges
// -----------------------------------------------------

if (
  evaluation.score < 0 ||
  evaluation.score > 100 ||
  evaluation.technical < 0 ||
  evaluation.technical > 100 ||
  evaluation.communication < 0 ||
  evaluation.communication > 100 ||
  evaluation.confidence < 0 ||
  evaluation.confidence > 100
) {
  throw new Error(
    "AI evaluation scores must be between 0 and 100"
  );
}

// -----------------------------------------------------
// 12. Validate feedback sections
// -----------------------------------------------------

const feedbackSections = [
  ...evaluation.strengths,
  ...evaluation.improvements,
  ...evaluation.recommendations,
];

if (
  !feedbackSections.every(
    (item: unknown) =>
      typeof item === "string" &&
      item.trim().length > 0
  )
) {
  throw new Error(
    "AI feedback sections contain invalid data"
  );
}

// -----------------------------------------------------
// 13. Save / update feedback
// -----------------------------------------------------

console.log(
  "💾 Saving interview feedback..."
);

const feedback =
  await prisma.interviewFeedback.upsert({
    where: {
      sessionId: session.id,
    },

    update: {
      score: evaluation.score,
      technical: evaluation.technical,
      communication:
        evaluation.communication,
      confidence: evaluation.confidence,
      feedback: evaluation.feedback,
      strengths: evaluation.strengths,
      improvements:
        evaluation.improvements,
      recommendations:
        evaluation.recommendations,
    },

    create: {
      sessionId: session.id,
      score: evaluation.score,
      technical: evaluation.technical,
      communication:
        evaluation.communication,
      confidence: evaluation.confidence,
      feedback: evaluation.feedback,
      strengths: evaluation.strengths,
      improvements:
        evaluation.improvements,
      recommendations:
        evaluation.recommendations,
    },
  });

console.log(
  "✅ Interview feedback saved"
);

console.log(
  "========== SUBMIT INTERVIEW SUCCESS =========="
);

// -----------------------------------------------------
// 14. Return result
// -----------------------------------------------------

return {
  session: updatedSession,
  feedback,
};
} catch (error) {
  console.error(
    "========== SUBMIT INTERVIEW ERROR =========="
  );

  console.error(error);

  console.error(
    "============================================"
  );

  throw error;
}
};

export const getInterviewHistory = async (
  userId: string
) => {
  console.log(
    "========== GET INTERVIEW HISTORY =========="
  );

  console.log("User ID:", userId);

  // 1. Find student
  const student =
    await prisma.studentProfile.findUnique({
      where: {
        userId,
      },
    });

  if (!student) {
    throw new Error(
      "Student profile not found"
    );
  }

  console.log(
    "Student ID:",
    student.id
  );

  // 2. Get interview sessions
  const sessions =
    await prisma.interviewSession.findMany({
      where: {
        studentId: student.id,
      },
      orderBy: {
        startedAt: "desc",
      },
    });

  console.log(
    "Interview history count:",
    sessions.length
  );

  // 3. Build history
  const history = await Promise.all(
    sessions.map(async (session) => {
      // Get job
      let job = null;

      if (session.jobId) {
        job =
          await prisma.job.findUnique({
            where: {
              id: session.jobId,
            },
            select: {
              id: true,
              title: true,
            },
          });
      }

      // Get feedback
      const feedback =
        await prisma.interviewFeedback.findUnique(
          {
            where: {
              sessionId: session.id,
            },
          }
        );

      return {
        id: session.id,

        jobId: session.jobId,

        jobTitle:
          job?.title ??
          "Unknown Job",

        difficulty:
          session.difficulty,

        status: session.completedAt
          ? "Completed"
          : "In Progress",

        startedAt:
          session.startedAt,

        completedAt:
          session.completedAt,

        score:
          feedback?.score ?? null,

        technical:
          feedback?.technical ?? null,

        communication:
          feedback?.communication ?? null,

        confidence:
          feedback?.confidence ?? null,

        feedback:
          feedback?.feedback ?? null,
      };
    })
  );

  console.log(
    "Interview history prepared:",
    history.length
  );

  return history;
};

export const getInterviewResult = async (
  userId: string,
  sessionId: string
) => {
  console.log(
    "========== GET INTERVIEW RESULT =========="
  );

  console.log("User ID:", userId);
  console.log("Session ID:", sessionId);

  const session =
    await prisma.interviewSession.findFirst({
      where: {
        id: sessionId,
        student: {
          userId,
        },
      },
      include: {
        feedback: true,
        job: true,
      },
    });

  if (!session) {
    throw new Error(
      "Interview result not found"
    );
  }

  console.log(
    "Interview session found:",
    session.id
  );

  // No feedback means the interview has not
  // been evaluated yet.
  if (!session.feedback) {
    throw new Error(
      "Interview feedback not available yet"
    );
  }

  // Calculate question count safely.
  let questionCount = 0;

  if (Array.isArray(session.questions)) {
    questionCount = session.questions.length;
  }

  console.log(
    "Question count:",
    questionCount
  );

  console.log(
    "Started at:",
    session.startedAt
  );

  console.log(
    "Completed at:",
    session.completedAt
  );

  return {
    id: session.id,

    score: session.feedback.score,

    technical:
      session.feedback.technical,

    communication:
      session.feedback.communication,

    confidence:
      session.feedback.confidence,

    feedback:
      session.feedback.feedback,

    strengths:
      session.feedback.strengths,

    improvements:
      session.feedback.improvements,

    recommendations:
      session.feedback.recommendations,

    // Interview session information
    difficulty: session.difficulty,

    questionCount,

    startedAt: session.startedAt,

    completedAt:
      session.completedAt,

    job: session.job
      ? {
          id: session.job.id,
          title: session.job.title,
        }
      : null,
  };
};