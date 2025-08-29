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
 *  - PUT: http://localhost:3001/api/movies/{id} (update)
 *  - DELETE: http://localhost:3001/api/movies/{id} (delete)
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

        if (pathname.startsWith("/api/movies/")) {
          const id = parseInt(pathname.split("/")[3], 10);
          const movieIndex = movies.findIndex((movie) => movie.id === id);

          if (movieIndex === -1) {
            res.writeHead(404, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Movie not found" }));
            break;
          }

          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify(movies[movieIndex]));
          break;
        }

      case "POST":
        if (pathname === "/api/movies") {
          let body = "";

          // Collect data
          req.on("data", (chunk) => {
            body += chunk.toString();
          });

          // Once all data received
          req.on("end", () => {
            try {
              const newMovie = JSON.parse(body);
              newMovie.id = movies.length + 1;
              movies.push(newMovie);

              res.writeHead(201, { "Content-Type": "application/json" });
              res.end(JSON.stringify(newMovie));
            } catch (error) {
              res.writeHead(400, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ error: "Invalid JSON" }));
            }
          });
          break;
        }

      case "PUT":
        if (pathname.startsWith("/api/movies/")) {
          const id = parseInt(pathname.split("/")[3], 10);
          const movieIndex = movies.findIndex((movie) => movie.id === id);

          if (movieIndex === -1) {
            res.writeHead(404, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Movie not found" }));
            break;
          }

          let body = "";

          // Collect data
          req.on("data", (chunk) => {
            body += chunk.toString();
          });

          // Once all data received
          req.on("end", () => {
            try {
              const updatedMovie = JSON.parse(body);
              movies[movieIndex] = { ...movies[movieIndex], ...updatedMovie };

              res.writeHead(201, { "Content-Type": "application/json" });
              res.end(JSON.stringify(movies[movieIndex]));
            } catch (error) {
              res.writeHead(400, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ error: "Invalid JSON" }));
            }
          });
          break;
        }

      case "DELETE":
        if (pathname.startsWith("/api/movies/")) {
          const id = parseInt(pathname.split("/")[3], 10);
          const movieIndex = movies.findIndex((movie) => movie.id === id);

          if (movieIndex === -1) {
            res.writeHead(404, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Movie not found" }));
            break;
          }

          movies = movies.filter((movie) => movie.id !== id);
          res.writeHead(204);
          res.end();
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
