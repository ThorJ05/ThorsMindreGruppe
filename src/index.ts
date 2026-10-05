import { serve } from "bun";
import index from "./index.html";

const BACKEND = "http://localhost:5123";

serve({
  routes: {
    // Proxy /api/* to the .NET backend so Api.ts's relative paths work locally.
    "/api/*": async (req) => {
      const url = new URL(req.url);
      return fetch(BACKEND + url.pathname + url.search, {
        method: req.method,
        headers: req.headers,
        body: ["GET", "HEAD"].includes(req.method) ? undefined : req.body,
      });
    },

    // Serve the React app for everything else.
    "/*": index,
  },
  development: process.env.NODE_ENV !== "production" && {
    hmr: true,
    console: true,
  },
});