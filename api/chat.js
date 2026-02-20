import { understandUser } from "./ai.js";
import { createEvent } from "./calendar.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const { message, session = {} } = req.body;

  try {
    const ai = await understandUser(message, session);

    let newSession = { ...session };

    // Merge extracted fields
    if (ai.name && !newSession.name) newSession.name = ai.name;
    if (ai.dateTime) newSession.dateTime = ai.dateTime;
    if (ai.title) newSession.title = ai.title;

    const hasTime = !!newSession.dateTime;
    const hasTitle = !!newSession.title;

    const readyToConfirm = hasTime && hasTitle;

    // 🧠 FINAL SCHEDULING
    if (ai.confirmed && readyToConfirm) {
      const date = new Date(newSession.dateTime);

      // Force IST consistency
      const istDate = new Date(
        date.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
      );

      newSession.dateTime = istDate.toISOString();

      const link = await createEvent(newSession);

      return res.json({
        reply: `🎉 Done! Your meeting is scheduled.`,
        link,
        session: {},
      });
    }

    // Ask confirmation if everything ready
    if (readyToConfirm && !ai.confirmed) {
      const prettyTime = new Intl.DateTimeFormat("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
        timeZone: "Asia/Kolkata",
      }).format(new Date(newSession.dateTime));

      return res.json({
        reply: `I'll schedule "${newSession.title}" on ${prettyTime}. Say "confirm" to finalize.`,
        session: newSession,
      });
    }

    return res.json({
      reply: ai.reply,
      session: newSession,
    });
  } catch (err) {
    console.error("❌ Chat Error:", err);

    return res.json({
      reply: "Something went wrong while scheduling.",
      session,
    });
  }
}