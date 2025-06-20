const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const path = require("path");

const PORT = process.env.PORT || 3000;

// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, "public")));

io.on("connection", (socket) => {
  console.log("User connected");

  socket.on("chat message", (msg) => {
    // Broadcast user's message
    io.emit("chat message", `👤 ${msg}`);

    // Bot response
    const botReply = getBotReply(msg);
    if (botReply) {
      setTimeout(() => {
        io.emit("chat message", `🤖 ${botReply}`);
      }, 700); // Delay for realism
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

// Basic bot logic
function getBotReply(message) {
  const msg = message.toLowerCase();
  if (msg.includes("hello")) return "Hi there! How can I help you?";
  if (msg.includes("how are you")) return "I'm a bot, but I'm doing well!";
  if (msg.includes("bye")) return "Goodbye! Have a great day!";
  if (msg.includes("help")) return "Sure! Ask me anything.";
  return "🤖 Sorry, I didn't understand that. Try saying 'hello', 'help', or 'bye'.";
}

http.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
