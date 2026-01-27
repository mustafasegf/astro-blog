# Minggu Ini Ngapain - Blog

A personal blog built with **TanStack Start** in **SPA mode** - a modern, type-safe full-stack React framework.

## Features

- **TanStack Router** - Type-safe routing with automatic code splitting
- **TanStack Start SPA Mode** - Static site generation for optimal performance
- **Tailwind CSS** - Utility-first CSS framework
- **Dark/Light Theme** - System-aware theme switching with persistence
- **i18n Ready** - Internationalization support (Indonesian default)
- **Responsive Design** - Mobile-first approach

## Tech Stack

- [TanStack Start](https://tanstack.com/start) - Full-stack React framework
- [TanStack Router](https://tanstack.com/router) - Type-safe router
- [Tailwind CSS](https://tailwindcss.com) - Utility-first CSS
- [Lucide React](https://lucide.dev) - Beautiful icons
- [TypeScript](https://www.typescriptlang.org) - Type safety

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

### Installation

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

## Project Structure

```
.
├── app/
│   ├── components/     # Reusable React components
│   │   ├── Container.tsx
│   │   ├── Footer.tsx
│   │   ├── Navbar.tsx
│   │   └── ThemeSelector.tsx
│   ├── lib/            # Utilities and constants
│   │   ├── blog.ts
│   │   ├── consts.ts
│   │   └── i18n.ts
│   ├── routes/         # TanStack Router routes
│   │   ├── __root.tsx
│   │   ├── $.tsx       # 404 catch-all
│   │   ├── blog.$slug.tsx
│   │   └── index.tsx
│   ├── styles/
│   │   └── global.css
│   ├── client.tsx      # Client entry point
│   ├── router.tsx      # Router configuration
│   └── ssr.tsx         # SSR entry point
├── public/             # Static assets
│   └── images/
├── app.config.ts       # TanStack Start config
├── package.json
└── tsconfig.json
```

## SPA Mode

This project uses TanStack Start in SPA (Single Page Application) mode, which means:

- **Static Generation** - Pages are pre-rendered at build time
- **Client-Side Navigation** - Fast navigation without full page reloads
- **No Server Required** - Can be deployed to any static hosting
- **SEO Friendly** - Initial HTML is rendered for search engines

## Configuration

The SPA mode is configured in `app.config.ts`:

```ts
import { defineConfig } from "@tanstack/react-start/config";

export default defineConfig({
  server: {
    preset: "static",
  },
});
```

## Deployment

Build the project and deploy the `.output/public` directory to any static hosting:

- Netlify
- Vercel
- Cloudflare Pages
- GitHub Pages
- Any static file server

## License

MIT License - see [LICENSE](LICENSE) for details.

## Author

**Mustafa Zaki Assagaf**

- Twitter: [@mustafasegf](https://twitter.com/mustafasegf)
- GitHub: [@mustafasegf](https://github.com/mustafasegf)
