import { useEffect } from "react";

declare global {
  interface Window {
    initWidget: (config: {
      cdnPath: string;
      cubism2Path: string;
      cubism5Path: string;
      tools: string[];
      logLevel: string;
      drag: boolean;
    }) => void;
  }
}

const live2d_path =
  "https://fastly.jsdelivr.net/npm/live2d-widgets@1.0.0/dist/";

function loadExternalResource(
  url: string,
  type: "css" | "js",
): Promise<string> {
  return new Promise((resolve, reject) => {
    let tag: HTMLLinkElement | HTMLScriptElement;
    if (type === "css") {
      tag = document.createElement("link");
      tag.rel = "stylesheet";
      tag.href = url;
    } else {
      tag = document.createElement("script");
      tag.type = "module";
      tag.src = url;
    }
    tag.onload = () => resolve(url);
    tag.onerror = () => reject(url);
    document.head.appendChild(tag);
  });
}

async function initLive2DWidget() {
  if (document.getElementById("waifu")) return;

  const OriginalImage = window.Image;
  window.Image = function (...args: any[]) {
    const img = new OriginalImage(...args);
    img.crossOrigin = "anonymous";
    return img;
  } as typeof Image;
  window.Image.prototype = OriginalImage.prototype;

  await Promise.all([
    loadExternalResource(live2d_path + "waifu.css", "css"),
    loadExternalResource(live2d_path + "waifu-tips.js", "js"),
  ]);

  // Wait for initWidget to become available (module scripts are deferred)
  const waitForInitWidget = () => {
    return new Promise<void>((resolve) => {
      const check = () => {
        if (typeof window.initWidget === "function") {
          resolve();
        } else {
          setTimeout(check, 50);
        }
      };
      check();
    });
  };

  await waitForInitWidget();

  window.initWidget({
    cdnPath: "/live2d/",
    cubism2Path: live2d_path + "live2d.min.js",
    cubism5Path:
      "https://cubism.live2d.com/sdk-web/cubismcore/live2dcubismcore.min.js",
    tools: [],
    logLevel: "warn",
    drag: false,
  });
}

export function Live2DWidget() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    initLive2DWidget().catch((err) => {
      console.error("Failed to initialize Live2D widget:", err);
    });
  }, []);

  return null;
}
