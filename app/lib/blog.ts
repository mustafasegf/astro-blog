import { compile, run } from "@mdx-js/mdx";
import * as runtime from "react/jsx-runtime";
import matter from "gray-matter";
import remarkGfm from "remark-gfm";
import rehypeShiki from "@shikijs/rehype";
import rehypeSlug from "rehype-slug";
import * as fs from "node:fs";
import * as path from "node:path";
import { renderToStaticMarkup } from "react-dom/server";
import React from "react";
import { wrapCodeBlocks } from "./rehype-code-frame";

export interface BlogPostMeta {
  slug: string;
  title: string;
  description: string;
  pubDate: Date;
  updatedDate?: Date;
  heroImage: string;
}

export interface BlogPost extends BlogPostMeta {
  html: string;
}

const CONTENT_DIR = path.join(process.cwd(), "content", "blog");

// Custom MDX components
const mdxComponents = {
  Tweet: ({ id }: { id: string }) => {
    const tweetId = id.includes("/") ? id.split("/").pop() : id;
    return React.createElement(
      "div",
      { className: "my-6 flex justify-center" },
      React.createElement(
        "blockquote",
        { className: "twitter-tweet", "data-theme": "dark" },
        React.createElement(
          "a",
          { href: `https://twitter.com/x/status/${tweetId}` },
          "View Tweet",
        ),
      ),
    );
  },

  ImgCaption: ({
    src,
    alt,
    caption,
  }: {
    src: string;
    alt: string;
    caption?: string;
  }) =>
    React.createElement(
      "figure",
      { className: "my-6" },
      React.createElement("img", {
        src,
        alt,
        className: "rounded-lg w-full",
        loading: "lazy",
      }),
      caption &&
        React.createElement(
          "figcaption",
          {
            className:
              "text-center text-sm text-gray-500 dark:text-gray-400 mt-2",
          },
          caption,
        ),
    ),

  Image: ({ src, alt }: { src: string; alt: string }) =>
    React.createElement(
      "figure",
      { className: "my-6" },
      React.createElement("img", {
        src,
        alt,
        className: "rounded-lg w-full",
        loading: "lazy",
      }),
    ),
};

// Get all blog post metadata
export function getBlogPosts(): BlogPostMeta[] {
  const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith(".mdx"));

  const posts = files.map((file) => {
    const slug = file.replace(/\.mdx$/, "");
    const filePath = path.join(CONTENT_DIR, file);
    const content = fs.readFileSync(filePath, "utf-8");
    const { data } = matter(content);

    return {
      slug,
      title: data.title,
      description: data.description,
      pubDate: new Date(data.pubDate),
      updatedDate: data.updatedDate ? new Date(data.updatedDate) : undefined,
      heroImage: data.heroImage,
    } as BlogPostMeta;
  });

  return posts.sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime());
}

// Get a single blog post with rendered HTML
export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  const filePath = path.join(CONTENT_DIR, `${slug}.mdx`);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  const content = fs.readFileSync(filePath, "utf-8");
  const { data, content: mdxContent } = matter(content);

  // Compile MDX to JavaScript with Shiki syntax highlighting
  const compiled = await compile(mdxContent, {
    outputFormat: "function-body",
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      [
        rehypeShiki,
        {
          themes: {
            light: "github-light",
            dark: "dracula",
          },
          defaultColor: false,
          cssVariablePrefix: "--shiki-",
          wrap: true,
        },
      ],
      rehypeSlug,
    ],
    development: false,
  });

  // Run the compiled MDX to get a React component
  const { default: MDXContent } = await run(String(compiled), {
    ...runtime,
    baseUrl: import.meta.url,
  });

  // Render to static HTML
  const rawHtml = renderToStaticMarkup(
    React.createElement(MDXContent, { components: mdxComponents }),
  );

  // Wrap code blocks with expressive-code-like frames
  const html = wrapCodeBlocks(rawHtml);

  return {
    slug,
    title: data.title,
    description: data.description,
    pubDate: new Date(data.pubDate),
    updatedDate: data.updatedDate ? new Date(data.updatedDate) : undefined,
    heroImage: data.heroImage,
    html,
  };
}

// Get blog post metadata only (for listing)
export function getBlogPostMeta(slug: string): BlogPostMeta | null {
  const filePath = path.join(CONTENT_DIR, `${slug}.mdx`);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  const content = fs.readFileSync(filePath, "utf-8");
  const { data } = matter(content);

  return {
    slug,
    title: data.title,
    description: data.description,
    pubDate: new Date(data.pubDate),
    updatedDate: data.updatedDate ? new Date(data.updatedDate) : undefined,
    heroImage: data.heroImage,
  };
}

export function formatBlogDate(date: Date): string {
  return new Intl.DateTimeFormat("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

// Get all slugs for static generation
export function getAllBlogSlugs(): string[] {
  const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith(".mdx"));
  return files.map((f) => f.replace(/\.mdx$/, ""));
}
