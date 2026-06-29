import path from "path";
import express from "express";
import { app } from "./app";

const PORT = Number(process.env.PORT) || 3000;

(async () => {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Project Chakravek full-stack engine online on http://localhost:${PORT}`);
  });
})().catch((err) => {
  console.error("Failed to boot local Express and Vite development server:", err);
});
