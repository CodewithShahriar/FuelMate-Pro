import fs from "fs";
import path from "path";

const routes = [
  "/",
  "/app/dashboard",
  "/app/fuel",
  "/app/calculator",
  "/app/expenses",
  "/app/stats",
  "/app/settings",
];

async function generateAllRoutes() {
  try {
    const serverModule = await import("../dist/server/server.js");
    const clientDir = path.resolve("dist/client");

    if (!fs.existsSync(clientDir)) {
      fs.mkdirSync(clientDir, { recursive: true });
    }

    // First generate main index.html using /app/dashboard
    const defaultRes = await serverModule.default.fetch(
      new Request("http://localhost/app/dashboard"),
      {},
      {}
    );
    const defaultHtml = await defaultRes.text();

    fs.writeFileSync(path.join(clientDir, "index.html"), defaultHtml);
    fs.writeFileSync(path.join(clientDir, "200.html"), defaultHtml);
    fs.writeFileSync(path.join(clientDir, "404.html"), defaultHtml);

    // Pre-render each specific route as static index.html and route.html
    for (const route of routes) {
      try {
        const res = await serverModule.default.fetch(
          new Request(`http://localhost${route}`),
          {},
          {}
        );
        const html = await res.text();

        // Create folder for route if subpath (e.g. dist/client/app/fuel/index.html)
        if (route !== "/") {
          const routeDir = path.join(clientDir, route.replace(/^\//, ""));
          fs.mkdirSync(routeDir, { recursive: true });
          fs.writeFileSync(path.join(routeDir, "index.html"), html);
          // Also create .html file (e.g. dist/client/app/fuel.html)
          fs.writeFileSync(`${routeDir}.html`, html);
        }
      } catch (routeErr) {
        console.warn(`Warning generating route ${route}:`, routeErr);
      }
    }

    console.log("✅ Successfully pre-rendered all static routes for seamless SPA refresh!");
  } catch (err) {
    console.error("Error generating routes:", err);
    process.exit(1);
  }
}

generateAllRoutes();
