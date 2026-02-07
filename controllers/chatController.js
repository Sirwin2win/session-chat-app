const Chat = require('../models/chatModel')
const User = require('../models/userModel')
// import { GoogleGenAI } from "@google/genai";
const {GoogleGenAI} = require('@google/genai')


const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY, // Access the key securely

});


exports.chat = async (req, res) => {
  try {
    const userId = req.session.userId;
    if (!userId) {
      return res.status(401).json({ message: "Not logged in" });
    }

    // 1. Fetch previous memory
    const chatData = await Chat.findOne({ userId });
    const history = chatData ? chatData.messages : [];

    // 2. Format for Gemini (with safety filter)
const context = history
  .filter(msg => msg.parts && msg.parts.trim() !== "") // Remove empty messages
  .map(msg => ({
    role: msg.role === "model" ? "model" : "user", // Ensure role is exactly right
    parts: [{ text: msg.parts }]
  }));

// 3. Add new user message (with safety check)
const userPrompt = req.body.prompt;
if (!userPrompt || userPrompt.trim() === "") {
  return res.status(400).json({ error: "Prompt cannot be empty" });
}

context.push({
  role: "user",
  parts: [{ text: userPrompt }]
});

    // 4. Send to AI
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: context
    });

    const aiReply = response.text;
    // context.push({
    //   role:"model",
    //   parts:[{text:aiReply}]
    // })

    // 5. Save only last exchange
    await Chat.findOneAndUpdate(
      { userId },
      {
        $push: {
          messages: {
            $each: [
              { role: "user", parts: req.body.prompt },
              { role: "model", parts: aiReply }
            ],
            $slice: -20
          }
        }
      },
      { upsert: true, new: true }
    );

    // return res.send([{user:req.body.prompt,model:aiReply}]);
    const info = await Chat.findOne({userId})
    res.send(info.messages)

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
