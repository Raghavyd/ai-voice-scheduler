import express from "express";
import cors from "cors";

// Import functions directly
import handler from "./api/chat.js";

const app = express();
app.use(cors());
app.use(express.json());

// Wrap Vercel handler for Express
app.post("/api/chat", async (req, res) => {
  try {
    await handler(req, res);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.listen(3000, () => {
  console.log("✅ Dev backend running on http://localhost:3000");
});
