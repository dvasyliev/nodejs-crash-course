require("dotenv").config();
let http = require("http");

const PORT = process.env.PORT || 8080;
const ENV = process.env.NODE_ENV || "production";

http
  .createServer(function (req, res) {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end("Hello from a server!");
  })
  .listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT} in ${ENV} mode`);
  });
