import ai from "../config/gemini";

export const evaluateAnswer = async (
  question: string,
  answer: string
) => {
  const prompt = `
You are a senior software engineering interviewer.

Evaluate the candidate's answer.

Return ONLY valid JSON.

{
  "technicalScore": 0,
  "communicationScore": 0,
  "confidenceScore": 0,
  "overallScore": 0,
  "strengths": [],
  "improvements": [],
  "feedback": ""
}

Question:

${question}

Candidate Answer:

${answer}
`;

  const response = await ai.models.generateContent({
    model: "gemini-3.5-flash",
    contents: prompt,
  });

  const text = response.text
    ?.replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  if (!text) {
    throw new Error("AI returned empty response");
  }

  return JSON.parse(text);
};