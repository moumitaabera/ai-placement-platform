import "dotenv/config";
import ai from "./config/gemini";

async function test() {
  const response = await ai.models.generateContent({
    model: "gemini-3.5-flash",
    contents: "Say hello in one sentence.",
  });

  console.log(response.text);
}

test();