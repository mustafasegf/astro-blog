import { chromium } from "playwright";
import { mkdir, readdir, stat, unlink } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync } from "node:fs";
import { execSync } from "node:child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = join(__dirname, "../dist/client");
const ogDir = join(distDir, "og");

// Simple static file server
function createStaticServer(root: string, port: number) {
  const mimeTypes: Record<string, string> = {
    ".html": "text/html",
    ".js": "application/javascript",
    ".css": "text/css",
    ".json": "application/json",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".svg": "image/svg+xml",
    ".woff": "font/woff",
    ".woff2": "font/woff2",
  };

  const server = createServer((req, res) => {
    let filePath = join(root, req.url?.split("?")[0] || "/");

    try {
      const stats = statSync(filePath);
      
      // If it's a directory, look for index.html
      if (stats.isDirectory()) {
        const indexPath = join(filePath, "index.html");
        if (existsSync(indexPath)) {
          filePath = indexPath;
        } else {
          res.writeHead(404);
          res.end("Not found");
          return;
        }
      }
    } catch {
      // File doesn't exist, try adding .html
      if (existsSync(filePath + ".html")) {
        filePath = filePath + ".html";
      } else if (existsSync(join(filePath, "index.html"))) {
        filePath = join(filePath, "index.html");
      }
    }

    try {
      const content = readFileSync(filePath);
      const ext = filePath.substring(filePath.lastIndexOf("."));
      const contentType = mimeTypes[ext] || "application/octet-stream";
      res.writeHead(200, { "Content-Type": contentType });
      res.end(content);
    } catch {
      res.writeHead(404);
      res.end("Not found");
    }
  });

  return new Promise<typeof server>((resolve) => {
    server.listen(port, () => resolve(server));
  });
}

// Find all HTML files in dist/client
async function findHtmlFiles(dir: string, base = ""): Promise<string[]> {
  const files: string[] = [];
  const entries = await readdir(dir);

  for (const entry of entries) {
    const fullPath = join(dir, entry);
    const relativePath = join(base, entry);
    const stats = await stat(fullPath);

    if (stats.isDirectory()) {
      // Skip assets and og directories
      if (entry !== "assets" && entry !== "og" && entry !== "__tsr") {
        files.push(...(await findHtmlFiles(fullPath, relativePath)));
      }
    } else if (entry.endsWith(".html")) {
      files.push(relativePath);
    }
  }

  return files;
}

async function generateOgImages() {
  console.log("🖼️  Generating OG images...");

  // Create og directory
  await mkdir(ogDir, { recursive: true });

  // Start static server
  const port = 4173;
  const server = await createStaticServer(distDir, port);
  console.log(`📡 Static server running on port ${port}`);

  // Launch browser
  const browser = await chromium.launch({
    executablePath: process.env.CHROME_PATH || "/run/current-system/sw/bin/google-chrome-stable",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  // Capture at larger viewport to show more content
  const captureWidth = 1600;
  const captureHeight = 900;
  const outputWidth = 1200;
  const outputHeight = 630;

  const context = await browser.newContext({
    viewport: { width: captureWidth, height: captureHeight },
    deviceScaleFactor: 1,
  });

  try {
    // Find all pages
    const htmlFiles = await findHtmlFiles(distDir);
    console.log(`📄 Found ${htmlFiles.length} pages`);

    for (const htmlFile of htmlFiles) {
      // Convert file path to route
      let route = htmlFile.replace(/\.html$/, "").replace(/\/?index$/, "") || "/";
      if (!route.startsWith("/")) route = "/" + route;
      if (route === "/") route = "/";

      // Generate output filename
      const ogFileName =
        route === "/" ? "home.png" : route.slice(1).replace(/\//g, "-") + ".png";
      const ogPath = join(ogDir, ogFileName);
      const tempPath = join(ogDir, `_temp_${ogFileName}`);

      console.log(`📸 Capturing ${route} -> og/${ogFileName}`);

      const page = await context.newPage();

      // Navigate and wait for full load
      await page.goto(`http://localhost:${port}${route}`, {
        waitUntil: "networkidle",
      });

      // Wait for Live2D model to load
      console.log(`   Waiting for Live2D to load...`);
      try {
        await page.waitForSelector("#waifu.waifu-active", { timeout: 10000 });
        // Extra wait for the model to fully render and animate
        await page.waitForTimeout(2000);
        console.log(`   Live2D loaded!`);
        
        // Move mouse to the left side so the model looks left
        console.log(`   Moving mouse to make model look left...`);
        await page.mouse.move(100, captureHeight / 2);
        await page.waitForTimeout(1500);
      } catch {
        console.log(`   Live2D not loaded, continuing anyway...`);
        await page.waitForTimeout(1000);
      }

      // Take screenshot at larger size
      await page.screenshot({
        path: tempPath,
        type: "png",
      });

      await page.close();

      // Resize using ImageMagick to OG dimensions (1200x630)
      try {
        execSync(`magick "${tempPath}" -resize ${outputWidth}x${outputHeight}! "${ogPath}"`, {
          stdio: "pipe",
        });
        // Remove temp file
        await unlink(tempPath);
      } catch (e) {
        console.log(`   Warning: Could not resize with ImageMagick, using original size`);
        // Just rename temp to final
        execSync(`mv "${tempPath}" "${ogPath}"`);
      }
    }

    console.log(`✅ Generated ${htmlFiles.length} OG images`);
  } finally {
    await browser.close();
    server.close();
  }
}

generateOgImages().catch((err) => {
  console.error("Failed to generate OG images:", err);
  process.exit(1);
});
