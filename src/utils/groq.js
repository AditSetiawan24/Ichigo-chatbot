import { Groq } from "groq-sdk";

const GROQ_API = import.meta.env.VITE_GROQ;
const PROMPT = import.meta.env.VITE_PROMPT;

const groq = new Groq({
  apiKey: GROQ_API,
  dangerouslyAllowBrowser: true,
});

export const reqPesan = async (content) => {
  const reply = await groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content: prompt //make your own promt (in .env)
      },
      {
        role: "user",
        content
      },
    ],
    model: "llama3-70b-8192",
  });

  return reply.choices[0].message.content;
};
