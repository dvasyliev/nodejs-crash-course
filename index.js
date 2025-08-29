require("dotenv").config();
let http = require("http");
const { URL } = require("url");

const PORT = process.env.PORT || 8080;
const ENV = process.env.NODE_ENV || "production";

// In-memory data store
let movies = [
  { id: 1, title: "Titanic", year: 1997, genre: "Romance", rating: 7.9 },
  { id: 2, title: "Avatar", year: 2009, genre: "Sci-Fi", rating: 7.8 },
  { id: 3, title: "Shrek", year: 2001, genre: "Animation", rating: 7.9 },
  { id: 4, title: "The Matrix", year: 1999, genre: "Sci-Fi", rating: 8.7 },
];

/*
 *  REST API Routes
 *  - GET: http://localhost:3001/api/movies (get all)
 *  - GET: http://localhost:3001/api/movies/{id} (get by ID)
 *  - GET: http://localhost:3001/api/movies?year=1997 (filter by query)
 *  - POST: http://localhost:3001/api/movies (create)
 *  - PUT: http://localhost:3001/api/movies (update)
 *  - DELETE: http://localhost:3001/api/movies (delete)
 */

http
  .createServer(function (req, res) {
    const baseURL = `http://${req.headers.host}/`;
    const { pathname } = new URL(req.url, baseURL);

    console.log("Request", req.method, pathname);

    switch (req.method) {
      case "GET":
        if (pathname === "/api/movies") {
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify(movies));
          break;
        }

      default:
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Not Found" }));
        break;
    }
  })
  .listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT} in ${ENV} mode`);
  });
