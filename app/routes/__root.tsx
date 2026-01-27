import {
  createRootRoute,
  Outlet,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import "@/styles/global.css";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" data-theme="dark" data-code="dracula">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="description"
          content="Blog pribadi yang berisi catatan, tutorial, dan opini."
        />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap"
        />
        <title>Minggu Ini Ngapain</title>
        <HeadContent />
        <ThemeInitScript />
      </head>
      <body className="min-h-screen m-0 p-0 bg-gray-50 text-gray-800 transition-all duration-300 dark:bg-gray-800 dark:text-gray-50">
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
        <Live2DScript />
        <Scripts />
        <TanStackRouterDevtools position="bottom-right" />
      </body>
    </html>
  );
}

// Theme initialization script to prevent flash
function ThemeInitScript() {
  const script = `
    (function() {
      const stored = localStorage.getItem('theme');
      let theme = 'dark';
      
      if (stored === 'light') {
        theme = 'light';
      } else if (stored === 'system') {
        theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      } else if (stored === 'dark') {
        theme = 'dark';
      }
      
      const codeTheme = theme === 'dark' ? 'dracula' : 'github-light';
      document.documentElement.dataset.theme = theme;
      document.documentElement.dataset.code = codeTheme;
    })();
  `;

  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}

// Live2D Widget initialization script
function Live2DScript() {
  const script = `
    (function() {
      const live2d_path = 'https://fastly.jsdelivr.net/npm/live2d-widgets@1.0.0/dist/';
      
      function loadExternalResource(url, type) {
        return new Promise((resolve, reject) => {
          let tag;
          if (type === 'css') {
            tag = document.createElement('link');
            tag.rel = 'stylesheet';
            tag.href = url;
          } else if (type === 'js') {
            tag = document.createElement('script');
            tag.type = 'module';
            tag.src = url;
          }
          if (tag) {
            tag.onload = () => resolve(url);
            tag.onerror = () => reject(url);
            document.head.appendChild(tag);
          }
        });
      }

      async function initLive2DWidget() {
        if (document.getElementById('waifu')) return;
        
        const OriginalImage = window.Image;
        window.Image = function(...args) {
          const img = new OriginalImage(...args);
          img.crossOrigin = "anonymous";
          return img;
        };
        window.Image.prototype = OriginalImage.prototype;

        await Promise.all([
          loadExternalResource(live2d_path + 'waifu.css', 'css'),
          loadExternalResource(live2d_path + 'waifu-tips.js', 'js')
        ]);

        // Wait for initWidget to be available
        const waitForInit = setInterval(() => {
          if (typeof window.initWidget === 'function') {
            clearInterval(waitForInit);
            window.initWidget({
              cdnPath: '/live2d/',
              cubism2Path: live2d_path + 'live2d.min.js',
              cubism5Path: 'https://cubism.live2d.com/sdk-web/cubismcore/live2dcubismcore.min.js',
              tools: [],
              logLevel: 'warn',
              drag: false
            });
          }
        }, 100);
      }

      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initLive2DWidget);
      } else {
        initLive2DWidget();
      }
    })();
  `;

  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
