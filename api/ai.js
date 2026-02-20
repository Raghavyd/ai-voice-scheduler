// api/ai.js
import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// ✅ NAMED EXPORT
export async function understandUser(message, session = {}) {
  // 🔥 Inject real current date (fixes 2024 bug)
  const now = new Date();

  const currentDate = now.toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const systemPrompt = `
You are a smart voice scheduling assistant.

IMPORTANT CONTEXT:
Today’s real date is: ${currentDate}
Timezone: Asia/Kolkata (IST)

Return JSON only:
{
  "reply": "natural short reply",
  "name": string | null,
  "dateTime": ISO string | null,
  "title": string | null,
  "confirmed": boolean
}

Rules:
- ALWAYS use the current year from today's date
- Convert words like "tomorrow", "next monday" using TODAY’S date
- Use Asia/Kolkata timezone
- If user gives full info, DO NOT repeat questions
- If ready, ask confirmation
- If user says confirm/yes → confirmed=true
`;

  const completion = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    temperature: 0.15, // slightly lower = better date accuracy
    messages: [
      { role: "system", content: systemPrompt },
      {
        role: "user",
        content: `User: ${message}\nSession: ${JSON.stringify(session)}`,
      },
    ],
  });

  const text = completion.choices[0].message.content;

  try {
    return JSON.parse(text);
  } catch {
    return {
      reply: "Sorry, I didn’t catch that. Can you repeat?",
      name: null,
      dateTime: null,
      title: null,
      confirmed: false,
    };
  }
}