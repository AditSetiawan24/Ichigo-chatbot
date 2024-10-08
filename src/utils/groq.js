import { Groq } from "groq-sdk";

const GROQ_API = import.meta.env.VITE_GROQ;
const PROMPT = import.meta.env.VITE_PROMPT;

const groq = new Groq({
  apiKey: GROQ_API,
  dangerouslyAllowBrowser: true,
});

export const reqPesan = async (content, history) => {
  const validRoles = ["user", "assistant", "system"];

  const messageHistory = history.map((msg, index) => {
    if (!validRoles.includes(msg.role)) {
      console.error(`Invalid role detected at message index ${index}:`, msg.role);
      return {
        role: "user",
        content: msg.content,
      };
    }
    return msg;
  });

  console.log("Validated message history:", messageHistory);

  try {
    const reply = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: PROMPT,
        },
        ...messageHistory,
        {
          role: "user",
          content,
        },
      ],
      model: "llama3-70b-8192",
    });

    return reply.choices[0].message.content;
  } catch (error) {
    console.error("Error fetching AI reply:", error);
    throw error;
  }
};
