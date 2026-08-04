import ai from "../config/gemini";

export const analyzeResumeWithAI = async (
  resumeText: string
) => {
  const prompt = `
You are an expert technical recruiter.

Analyze the following resume.

Return ONLY valid JSON.

{
  "score": number,
  "strengths": ["..."],
  "weaknesses": ["..."],
  "suggestions": ["..."]
}

Resume:

${resumeText}
`;

  const response = await ai.models.generateContent({
    model: "gemini-3.5-flash",
    contents: prompt,
  });

  const text = response.text;

  if (!text) {
    throw new Error("No response from AI");
  }

  // Gemini sometimes wraps JSON in markdown
  const cleaned = text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  return JSON.parse(cleaned);
};