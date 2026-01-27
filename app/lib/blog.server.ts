import { createServerFn } from "@tanstack/react-start";
import { staticFunctionMiddleware } from "@tanstack/start-static-server-functions";
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
  pubDate: string;
  updatedDate?: string;
  heroImage: string;
}

export interface BlogPost extends BlogPostMeta {
  html: string;
}

function getContentDir() {
  return path.join(process.cwd(), "content", "blog");
}

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

// Server function to get all blog posts
export const getBlogPosts = createServerFn({ method: "GET" })
  .middleware([staticFunctionMiddleware])
  .handler(async (): Promise<BlogPostMeta[]> => {
    const contentDir = getContentDir();
    const files = fs.readdirSync(contentDir).filter((f) => f.endsWith(".mdx"));

    const posts = files.map((file) => {
      const slug = file.replace(/\.mdx$/, "");
      const filePath = path.join(contentDir, file);
      const content = fs.readFileSync(filePath, "utf-8");
      const { data } = matter(content);

      return {
        slug,
        title: data.title,
        description: data.description,
        pubDate: new Date(data.pubDate).toISOString(),
        updatedDate: data.updatedDate
          ? new Date(data.updatedDate).toISOString()
          : undefined,
        heroImage: data.heroImage,
      } as BlogPostMeta;
    });

    return posts.sort(
      (a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime(),
    );
  });

// Server function to get a single blog post
export const getBlogPost = createServerFn({ method: "GET" })
  .middleware([staticFunctionMiddleware])
  .handler(async (ctx): Promise<BlogPost | null> => {
    const slug = (ctx as unknown as { data: string }).data;
    const contentDir = getContentDir();
    const filePath = path.join(contentDir, `${slug}.mdx`);

    if (!fs.existsSync(filePath)) {
      return null;
    }

    const content = fs.readFileSync(filePath, "utf-8");
    const { data: frontmatter, content: mdxContent } = matter(content);

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

    const { default: MDXContent } = await run(String(compiled), {
      ...runtime,
      baseUrl: import.meta.url,
    });

    const rawHtml = renderToStaticMarkup(
      React.createElement(MDXContent, { components: mdxComponents }),
    );

    const html = wrapCodeBlocks(rawHtml);

    return {
      slug,
      title: frontmatter.title,
      description: frontmatter.description,
      pubDate: new Date(frontmatter.pubDate).toISOString(),
      updatedDate: frontmatter.updatedDate
        ? new Date(frontmatter.updatedDate).toISOString()
        : undefined,
      heroImage: frontmatter.heroImage,
      html,
    };
  });
