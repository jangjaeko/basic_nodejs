// express version + Prisma
const express = require("express");
const { prisma } = require("./db");
const app = express();


function slugify(title) {
  return title
    .toString()
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")        // 공백 → -
    .replace(/[^a-z0-9-_]/g, "") // 한글/특수문자 제거 (간단 버전)
    .replace(/--+/g, "-")        // -- → -
    .replace(/^-+|-+$/g, "");    // 앞/뒤 - 제거
}
/**
 * Request logger
 */
app.use((req, _res, next) => {
  const hasQuery = Object.keys(req.query).length > 0;
  const qs = hasQuery ? `?${new URLSearchParams(req.query).toString()}` : "";
  console.log(`${req.method} ${req.path}${qs}`);
  next();
});

/**
 * JSON parser for write methods only (POST, PUT, PATCH)
 */
app.use((req, res, next) => {
  if (["POST", "PUT", "PATCH"].includes(req.method)) {
    return express.json()(req, res, next);
  }
  next();
});

/**
 * Handle malformed JSON: return 400 instead of crashing
 */
app.use((err, _req, res, next) => {
  if (err instanceof SyntaxError && "body" in err) {
    return res.status(400).json({ error: "Invalid JSON body" });
  }
  next(err);
});

/**
 * Simple validator for Project input
 */
function validateProject(body) {
  const errors = [];
  if (!body || typeof body !== "object") errors.push("Body must be a JSON object");
  if (!body.title || typeof body.title !== "string" || body.title.trim().length < 2) {
    errors.push("title must be a string with length >= 2");
  }
  if (body.summary && typeof body.summary !== "string") {
    errors.push("summary must be a string");
  }
  return errors;
}

/**
 * Basic routes
 */
app.get("/", (_req, res) => {
  return res.json({ message: "welcome" });
});

app.get("/time", (_req, res) => {
  return res.json({ now: new Date().toISOString() });
});

app.get("/me", (req, res) => {
  const name = req.query.name || "Jaeho";
  return res.json({
    name,
    job: "Frontend Developer",
    location: "Vancouver",
  });
});

/**
 * GET /projects
 * List + simple search
 */
app.get("/projects", async (req, res, next) => {
  try {
    const q = (req.query.q || "").toString().toLowerCase();

    const where = q
      ? {
          OR: [
            { title: { contains: q, mode: "insensitive" } },
            { summary: { contains: q, mode: "insensitive" } },
          ],
        }
      : {};

    const items = await prisma.project.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    res.json({ total: items.length, items });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /projects/:id
 * Detail
 */
app.get("/projects/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ error: "Invalid id" });
    }

    const found = await prisma.project.findUnique({
      where: { id },
    });

    if (!found) return res.status(404).json({ error: "Project not found" });
    res.json(found);
  } catch (err) {
    next(err);
  }
});

/**
 * POST /projects
 * Create
 */
// -------- POST /projects (create) --------
app.post("/projects", async (req, res, next) => {
  try {
    const errors = validateProject(req.body);
    if (errors.length) {
      return res
        .status(400)
        .json({ error: "ValidationError", details: errors });
    }

    const { title, summary = "" } = req.body;

    const created = await prisma.project.create({
      data: {
        title: title.trim(),
        summary: summary.trim(),
        slug: slugify(title), // ✅ 여기 중요
      },
    });

    return res.status(201).json(created);
  } catch (err) {
    next(err); // ✅ 글로벌 에러 핸들러로 전달
  }
});
/**
 * 404 handler
 */
app.use((_req, res) => {
  return res.status(404).json({ error: "Not Found" });
});

/**
 * Global error handler
 */
app.use((err, _req, res, _next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal Server Error" });
});

/**
 * Start server
 */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Express server running at http://localhost:${PORT}`));






















/*
simple request logger middleware
*/

// app.use ((req, _res, next)=> {
//     const q = Object.keys(req.query).length ? `${new URLSearchParams(req.query).toString()}` : "";
//     console.log(`${req.method} ${req.path}${q}`);
//     next();
// });

// /*
// Built-in middleware to parse JSON bodies (for future Post mission)
// */

// app.use(express.json());

// //GET
// app.get("/", (_req, res) => {
//     return res.json({message: "welcome"})
// });

// //GET /time
// app.get ("/time", (_req,res)=> {
//     return res.json({now: new Date().toISOString()});
// });

// //GET /me 

// app.get("/me", (req, res) => {
//   const name = req.query.name || "Jaeho";
//   return res.json({
//     name,
//     job: "Frontend Developer",
//     location: "Vancouver",
//   });
// });

// //In-memory store (reset on server restart)
// const projects = [];
// let seq = 1;

// // GET /projects

// app.get("/projects", (_req, res)=>{
//     return res.json({item:projects});
// });

// //GET /projects/:id
// // single project by id

// app.get("/projects/:id", (req, res) =>{
//     const id = Number(req.params.id);
//     const found = projects.find(p=> p.id === id);
//     if(!found) return res.status(404).json({error : "project not found"});
//     return res.json(found);
// });

// //Post /projects
// // create project
// // Body : {title: string, summary? : string}

// app.post("/projects", (req, res) => {
//     const {title, summary}= req.body || {};
//     if(!title || typeof title !== "string" || title.trim().length < 2) {
//         return res.status(400).json({ error : "title required (min length = 2"});
//     }

//     const project = {
//         id : seq++,
//         title : title.trim(),
//         summary: typeof summary === "string" ? summary.trim() : "",
//         createdAt : new Date().toISOString(),
//     };
//     projects.push(project);
//     return res.status(201).json(project);
// })

// // 404  handler
// app.use((_req, res)=>{
//     return res.status(404).json({error : "Not Found"});
// });

// // Golbal err handler = unexpect err
// app.use((err, _req,res,next)=>{
//     console.log("unHandled err", err);
//     return res.status(500).json({error : "Internal server err"});
// })

// //start 
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`✅ Express server running at http://localhost:${PORT}`);
// });










//////////////////////////////////////////////////
/////////////////////////////////////////////////

// witout express 

// const http = require("http");
// const { URL } = require("url");

// /**
//  * Helper function to send JSON response
//  * @param {ServerResponse} res - Response object
//  * @param {number} status - HTTP status code
//  * @param {object} data - JSON payload
//  */
// function json(res, status, data) {
//   res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
//   res.end(JSON.stringify(data));
// }

// const server = http.createServer((req, res) => {
//   // Parse URL using the request URL and base URL
//   const url = new URL(req.url, "http://localhost:3000");
//   const path = url.pathname;     // Route path (e.g., /me, /time)
//   const method = req.method.toUpperCase(); // HTTP method (GET, POST...)

//   // Log incoming request (for debugging)
//   console.log(`${method} ${path}${url.search}`);

//   // This mission handles only GET methods
//   if (method !== "GET") {
//     return json(res, 405, { error: "Method Not Allowed" });
//   }

//   /**
//    * Routing logic
//    * Match the request path to a specific response
//    */

//   // Home route
//   if (path === "/") {
//     return json(res, 200, { message: "Welcome to Node API!" });
//   }

//   // Return current server time
//   if (path === "/time") {
//     return json(res, 200, { now: new Date().toISOString() });
//   }

//   // Return simple user profile
//   // Example: /me?name=Jaeho
//   if (path === "/me") {
//     const name = url.searchParams.get("name") || "Jaeho";
//     return json(res, 200, {
//       name,
//       job: "Frontend Developer",
//       location: "Vancouver",
//     });
//   }

//   // 404 for any unknown route
//   return json(res, 404, { error: "Not Found" });
// });

// // Start the HTTP server on port 3000
// server.listen(3000, () => {
//   console.log("✅ Server running at http://localhost:3000");
// });
