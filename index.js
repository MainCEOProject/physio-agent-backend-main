const http = require("http");

/**
 * PORT
 * - lokal: 3000
 * - cloud: kommt automatisch aus process.env.PORT
 */
const PORT = Number(process.env.PORT) || 3000;

/**
 * Simple Agent Logic (Platzhalter)
 * -> hier bauen wir später echte KI-Logik rein
 */
function handleAgent(message) {
  if (!message) {
    return "Keine Nachricht erhalten.";
  }

  if (message.toLowerCase().includes("termin")) {
    return "🗓️ Ich prüfe verfügbare Termine für dich.";
  }

  return `🤖 Agent hat empfangen: "${message}"`;
}

/**
 * HTTP Server
 */
const server = http.createServer((req, res) => {
  console.log("➡️", req.method, req.url);

  // ROOT
  if (req.method === "GET" && req.url === "/") {
    res.writeHead(200, { "Content-Type": "text/plain" });
    return res.end("Physio Agent Backend running");
  }

  // HEALTH CHECK
  if (req.method === "GET" && req.url === "/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ status: "ok" }));
  }

  // AGENT ENDPOINT
  if (req.method === "POST" && req.url === "/agent") {
    let body = "";

    req.on("data", chunk => {
      body += chunk;
    });

    req.on("end", () => {
      try {
        const data = JSON.parse(body);
        console.log("📥 Payload:", data);

        const answer = handleAgent(data.message);

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({
          success: true,
          answer
        }));
      } catch (err) {
        console.error("❌ JSON Error:", err.message);
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({
          success: false,
          error: "Invalid JSON"
        }));
      }
    });

    return;
  }

  // FALLBACK 404
  res.writeHead(404, { "Content-Type": "text/plain" });
  res.end("Not Found");
});

/**
 * START SERVER
 */
server.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
