const http = require("http");

http.createServer((req, res) => {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk;
  });
  req.on("end", () => {
    let payload = null;
    try {
      payload = body ? JSON.parse(body) : null;
    } catch (error) {
      console.error("Invalid JSON payload", error);
    }
    console.log("Received:", payload);
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ status: "success" }));
  });
}).listen(8765, () => {
  console.log("Test server running at http://localhost:8765");
});
