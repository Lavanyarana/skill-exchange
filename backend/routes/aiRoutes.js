import express from "express";
import https from "https";
const router = express.Router();

router.post("/chat", async (req, res) => {
  const { message, history } = req.body;
  try {
    const body = JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: "You are a helpful assistant for SkillXchange. Help users find skill partners and give learning tips. Be friendly and concise." },
        ...(history || []),
        { role: "user", content: message }
      ],
      max_tokens: 500
    });

    const data = await new Promise((resolve, reject) => {
      const r = https.request({
        hostname: "api.groq.com",
        path: "/openai/v1/chat/completions",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + process.env.GROQ_API_KEY,
          "Content-Length": Buffer.byteLength(body)
        }
      }, (res2) => {
        let d = "";
        res2.on("data", c => d += c);
        res2.on("end", () => resolve(JSON.parse(d)));
      });
      r.on("error", reject);
      r.write(body);
      r.end();
    });

    res.json({ reply: data.choices[0].message.content });
  } catch (err) {
    console.error("AI error:", err.message);
    res.status(500).json({ error: "AI error" });
  }
});

export default router;
