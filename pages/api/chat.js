
const { getArticleContent, generateSystemPrompt } = require("../../utils/helpers");
const { GoogleGenerativeAI } = require("@google/generative-ai");

export default async function handler(
  req,
  res
) {
  if (req.method == "POST") {
    const { token, history = [], prompt } = req.body.data;
    
    const articleContent = await getArticleContent(token);
    const systemInstruction = generateSystemPrompt(articleContent);
    const genAI = new GoogleGenerativeAI(process.env.API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-8b", systemInstruction });
    const chat = model.startChat({
      history
    });
    const result = await chat.sendMessage(prompt);
    res.status(200).json({ message:result.response.text(),  content: articleContent  })
  }
}