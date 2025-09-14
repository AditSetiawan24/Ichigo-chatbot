import { Groq } from "groq-sdk";

const GROQ_API = import.meta.env.VITE_GROQ;
const PROMPT_PACAR = import.meta.env.VITE_PROMPT_PACAR;
const PROMPT_BESTFRIEND = import.meta.env.VITE_PROMPT_BESTFRIEND;

const groq = new Groq({
  apiKey: GROQ_API,
  dangerouslyAllowBrowser: true,
});

export const reqPesan = async (content, history, promptMode) => {
  const validRoles = ["user", "assistant", "system"];

  const messageHistory = history.map((msg, index) => {
    if (!validRoles.includes(msg.role)) {
      console.error(
        `Invalid role detected at message index ${index}:`,
        msg.role
      );
      return {
        role: "user",
        content: msg.content,
      };
    }
    return msg;
  });

  console.log("Validated message history:", messageHistory);

  let prompt;
  if (promptMode === "pacar") {
    prompt = PROMPT_PACAR;
  } else if (promptMode === "bestfriend") {
    prompt = PROMPT_BESTFRIEND;
  } else {
    alert("Pilih mode chat terlebih dahulu ya");
    // return;
  }

  try {
    const reply = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: prompt,
        },
        ...messageHistory,
        {
          role: "user",
          content,
        },
      ],
      model: "openai/gpt-oss-120b",
    });

    return reply.choices[0].message.content;
  } catch (error) {
    console.error("Error fetching AI reply:", error);
    throw error;
  }
};
