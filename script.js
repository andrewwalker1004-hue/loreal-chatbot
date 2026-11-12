// Point this at your deployed Cloudflare Worker URL (see worker/README).
const WORKER_URL = "https://loreal-chatbot-worker.awalker-dev.workers.dev";

const chatWindow = document.getElementById("chat-window");
const chatForm = document.getElementById("chat-form");
const chatInput = document.getElementById("chat-input");
const sendBtn = document.getElementById("send-btn");

// Conversation history sent to the Worker on every request so the model
// stays context-aware across turns (LevelUp: conversation memory).
const history = [];

function addMessage(role, text) {
  const row = document.createElement("div");
  row.className = `message ${role === "user" ? "user" : "bot"}`;

  const bubble = document.createElement("div");
  bubble.className = "bubble";
  bubble.textContent = text;

  row.appendChild(bubble);
  chatWindow.appendChild(row);
  chatWindow.scrollTop = chatWindow.scrollHeight;
  return bubble;
}

async function sendMessage(userText) {
  addMessage("user", userText);
  history.push({ role: "user", content: userText });

  const loadingBubble = addMessage("bot", "Thinking…");
  loadingBubble.classList.add("loading");

  sendBtn.disabled = true;

  try {
    const res = await fetch(WORKER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: history }),
    });

    if (!res.ok) {
      throw new Error(`Worker responded with ${res.status}`);
    }

    const data = await res.json();
    const reply = data.reply || "Sorry, I couldn't generate a response.";

    loadingBubble.textContent = reply;
    loadingBubble.classList.remove("loading");
    history.push({ role: "assistant", content: reply });
  } catch (err) {
    loadingBubble.textContent =
      "Something went wrong reaching the advisor. Please try again in a moment.";
    loadingBubble.classList.remove("loading");
    console.error(err);
  } finally {
    sendBtn.disabled = false;
  }
}

chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = chatInput.value.trim();
  if (!text) return;
  chatInput.value = "";
  sendMessage(text);
});
