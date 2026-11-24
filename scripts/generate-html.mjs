import fs from "fs";
import path from "path";

async function generateHtml() {
  try {
    const serverModule = await import("../dist/server/server.js");
    const res = await serverModule.default.fetch(
      new Request("http://localhost/app/dashboard"),
      {},
      {}
    );
    const html = await res.text();
    const clientDir = path.resolve("dist/client");
    if (!fs.existsSync(clientDir)) {
      fs.mkdirSync(clientDir, { recursive: true });
    }
    fs.writeFileSync(path.join(clientDir, "index.html"), html);
    fs.writeFileSync(path.join(clientDir, "200.html"), html);
    console.log("✅ Generated dist/client/index.html and 200.html successfully!");
  } catch (err) {
    console.error("Error generating index.html:", err);
    process.exit(1);
  }
}

generateHtml();
