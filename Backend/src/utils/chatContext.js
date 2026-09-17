export const SYSTEM_PROMPT = `
You are a helpful AI assistant.
Answer the user's question clearly and accurately.
If the user asks for code, provide clean and practical code.
If the user asks for explanation, explain in a simple and structured way.
If you are unsure, say that you are unsure instead of guessing.
`;

export const buildMessagesForAI = ({ chat, oldMessages, currentMessage }) => {
  let messages = [];

  for (const msg of oldMessages) {
    messages.push({
      role: msg.role,
      parts: [{ text: msg.content }],   
    });
  }

  messages.push({
    role: "user",
    parts: [{ text: currentMessage }]
  });

  return messages;
};