// server/controllers/openaiController.js
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

exports.analyzeExcelData = async (req, res) => {
  try {
    const { fileId } = req.query;
    if (!fileId) return res.status(400).json({ msg: "Missing fileId parameter" });

    const UploadData = require("../models/uploaddata");
    const rows = await UploadData.find({ fileId }).limit(10);
    if (!rows.length) return res.status(404).json({ msg: "No data found for this file" });

    const prompt = `You are a helpful assistant. Analyze this Excel data and provide insights:\n${rows.map(r => JSON.stringify(r.data)).join("\n")}`;

    const completion = await openai.createChatCompletion({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 400,
      temperature: 0.6,
    });

    const analysis = completion.data.choices[0].message.content;

    res.json({ analysis });
  } catch (err) {
    console.error("OpenAI error:", err);
    res.status(500).json({ msg: "OpenAI analysis failed", error: err.message });
  }
};
