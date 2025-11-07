const http = require("http");
const { URL } = require("url");

/**
 * Helper function to send JSON response
 * @param {ServerResponse} res - Response object
 * @param {number} status - HTTP status code
 * @param {object} data - JSON payload
 */
function json(res, status, data) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(data));
}

const server = http.createServer((req, res) => {
  // Parse URL using the request URL and base URL
  const url = new URL(req.url, "http://localhost:3000");
  const path = url.pathname;     // Route path (e.g., /me, /time)
  const method = req.method.toUpperCase(); // HTTP method (GET, POST...)

  // Log incoming request (for debugging)
  console.log(`${method} ${path}${url.search}`);

  // This mission handles only GET methods
  if (method !== "GET") {
    return json(res, 405, { error: "Method Not Allowed" });
  }

  /**
   * Routing logic
   * Match the request path to a specific response
   */

  // Home route
  if (path === "/") {
    return json(res, 200, { message: "Welcome to Node API!" });
  }

  // Return current server time
  if (path === "/time") {
    return json(res, 200, { now: new Date().toISOString() });
  }

  // Return simple user profile
  // Example: /me?name=Jaeho
  if (path === "/me") {
    const name = url.searchParams.get("name") || "Jaeho";
    return json(res, 200, {
      name,
      job: "Frontend Developer",
      location: "Vancouver",
    });
  }

  // 404 for any unknown route
  return json(res, 404, { error: "Not Found" });
});

// Start the HTTP server on port 3000
server.listen(3000, () => {
  console.log("✅ Server running at http://localhost:3000");
});
