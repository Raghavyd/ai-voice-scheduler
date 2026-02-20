import { google } from "googleapis";
import dotenv from "dotenv";

dotenv.config();

const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  "https://developers.google.com/oauthplayground"
);

oauth2Client.setCredentials({
  refresh_token: process.env.REFRESH_TOKEN,
});

const calendar = google.calendar({
  version: "v3",
  auth: oauth2Client,
});

export async function createEvent(session) {
  try {
    // 🔥 DO NOT manually convert timezone
    const start = new Date(session.dateTime);
    const end = new Date(start.getTime() + 30 * 60000);

    const event = {
      summary: session.title || "AI Scheduled Meeting",
      description: `Scheduled via AI`,
      start: {
        dateTime: start.toISOString(),
        timeZone: "Asia/Kolkata",
      },
      end: {
        dateTime: end.toISOString(),
        timeZone: "Asia/Kolkata",
      },
    };

    const res = await calendar.events.insert({
      calendarId: "primary",
      resource: event,
    });

    console.log("✅ Created:", res.data.htmlLink);
    return res.data.htmlLink;
  } catch (err) {
    console.error("❌ Calendar Error:", err.message);
    throw err;
  }
}