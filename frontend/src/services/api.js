// API Service
import axios from "axios";

// API Base URL
export const API_BASE = "http://127.0.0.1:8000";

// Construct API URL
export const apiUrl = (path) => `${API_BASE}${path}`;

// Check for abort errors
function isAbort(err) {
  return (
    err.name === "AbortError" ||
    err.name === "TypeError" ||
    (err.message && (
      err.message.includes("BodyStreamBuffer was aborted") ||
      err.message.includes("The operation was aborted") ||
      err.message.includes("Failed to fetch")
    ))
  );
}

// Send streaming message
export const sendMessage = (
  text,
  conversation_id,
  model,
  onToken,
  onDone,
  signal,
  image_base64 = null,
  username = "",
  onMeta = null
) => {
  const payload = { text, model };
  if (conversation_id) payload.conversation_id = conversation_id;
  if (image_base64)    payload.image_base64 = image_base64;

  return fetch(apiUrl("/chat"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    signal,
  })
    .then(async (res) => {
      if (!res.ok) {
        const errorText = await res.text().catch(() => "");
        throw new Error(errorText || `Request failed with status ${res.status}`);
      }
      if (!res.body) throw new Error("Empty response from Nexa backend.");

      const reader  = res.body.getReader();
      const decoder = new TextDecoder();
      let leftover  = "";

      while (true) {
        if (signal?.aborted) { reader.cancel().catch(() => {}); return; }

        let done, value;
        try {
          ({ done, value } = await reader.read());
        } catch (err) {
          if (isAbort(err)) { reader.cancel().catch(() => {}); return; }
          throw err;
        }

        if (done) break;

        const chunk = leftover + decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");
        leftover = lines.pop();

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          try {
            const data = JSON.parse(line.slice(6));
            if (onMeta && data.conversation_id !== undefined) onMeta(data);
            if (data.token !== undefined) onToken(data.token, data.conversation_id);
            if (data.done)               onDone(data.conversation_id);
          } catch {}
        }
      }

      if (leftover.startsWith("data: ")) {
        try {
          const data = JSON.parse(leftover.slice(6));
          if (onMeta && data.conversation_id !== undefined) onMeta(data);
          if (data.token !== undefined) onToken(data.token, data.conversation_id);
          if (data.done)               onDone(data.conversation_id);
        } catch {}
      }
    })
    .catch((err) => {
      if (isAbort(err)) return;
      throw err;
    });
};

// Fetch conversations
export const getConversations = () =>
  axios.get(apiUrl("/conversations")).then((r) => r.data);

// Fetch messages
export const getMessages = (id) =>
  axios.get(apiUrl(`/conversations/${id}`)).then((r) => r.data);

// Delete conversation
export const deleteConversation = (id) =>
  axios.delete(apiUrl(`/conversations/${id}`)).then((r) => r.data);

// Generate title
export const generateTitle = (conversationId, text) =>
  axios
    .post(apiUrl(`/conversations/${conversationId}/generate-title`), { text })
    .then((r) => r.data.title);

// Rename conversation
export const renameConversation = (id, title) =>
  axios
    .patch(apiUrl(`/conversations/${id}/rename`), { title })
    .then((r) => r.data);

// Translate text
export const translateText = (text, target_language) =>
  axios
    .post(apiUrl("/translate"), { text, target_language })
    .then((r) => r.data.translated);

// Save partial message
export const savePartialMessage = (conversation_id, content) =>
  axios
    .post(apiUrl(`/conversations/${conversation_id}/save-partial`), { content })
    .then((r) => r.data);