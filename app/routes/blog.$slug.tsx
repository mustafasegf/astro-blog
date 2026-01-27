import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { getBlogPost, type BlogPost } from "@/lib/blog.server";
import { formatBlogDate } from "@/lib/utils";
import { Container } from "@/components/Container";

export const Route = createFileRoute("/blog/$slug")({
  component: BlogPostPage,
  loader: async ({ params }) => {
    const post = await getBlogPost({ data: params.slug });
    if (!post) {
      throw notFound();
    }
    return { post };
  },
  head: ({ loaderData, params }) => {
    const post = loaderData?.post;
    const title = post ? `${post.title} - Minggu Ini Ngapain` : "Minggu Ini Ngapain";
    const description = post?.description || "";
    const ogImage = `https://blog.mus.sh/og/blog-${params.slug}.png`;
    const url = `https://blog.mus.sh/blog/${params.slug}`;

    return {
      meta: [
        { title },
        { name: "description", content: description },
        // Open Graph
        { property: "og:type", content: "article" },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: url },
        { property: "og:image", content: ogImage },
        { property: "og:image:width", content: "1200" },
        { property: "og:image:height", content: "630" },
        // Twitter Card
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
        { name: "twitter:image", content: ogImage },
      ],
      links: post?.heroImage
        ? [{ rel: "preload", as: "image", href: post.heroImage }]
        : [],
    };
  },
  notFoundComponent: () => (
    <Container className="pt-16 text-center">
      <h1 className="text-4xl font-bold mb-4">Post Not Found</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        The blog post you're looking for doesn't exist.
      </p>
      <Link to="/" className="text-blue-500 hover:text-blue-600 underline">
        Go back home
      </Link>
    </Container>
  ),
});

function BlogPostPage() {
  const { post } = Route.useLoaderData();

  // Copy to clipboard functionality
  useEffect(() => {
    const handleCopyClick = async (e: MouseEvent) => {
      const button = (e.target as HTMLElement).closest(".copy-button");
      if (!button) return;

      const code = button.getAttribute("data-code");
      if (!code) return;

      try {
        await navigator.clipboard.writeText(code);

        // Update button state
        button.classList.add("copied");
        const textEl = button.querySelector(".copy-text");
        if (textEl) {
          const originalText = textEl.textContent;
          textEl.textContent = "Copied!";

          setTimeout(() => {
            button.classList.remove("copied");
            textEl.textContent = originalText;
          }, 2000);
        }
      } catch (err) {
        console.error("Failed to copy:", err);
      }
    };

    document.addEventListener("click", handleCopyClick);
    return () => document.removeEventListener("click", handleCopyClick);
  }, []);

  return (
    <article className="pt-16">
      <div className="mx-auto max-w-screen-md px-4">
        {/* Back button */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 mb-6 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
          viewTransition
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Kembali
        </Link>

        {post.heroImage && (
          <img
            className="w-full rounded-lg shadow-md"
            style={{ viewTransitionName: post.title.replace(/\s+/g, "_") }}
            width={1020}
            height={510}
            src={post.heroImage}
            alt={post.title}
          />
        )}
      </div>

      <div
        id="blog-container"
        className="prose mx-auto max-w-screen-md space-y-4 px-4"
      >
        <div className="space-y-4 text-center">
          <div className="py-4">
            <time
              dateTime={post.pubDate}
              className="text-gray-500 dark:text-gray-400"
            >
              {formatBlogDate(post.pubDate)}
            </time>
            {post.updatedDate && (
              <span className="text-gray-500 dark:text-gray-400 ml-2">
                (Updated: {formatBlogDate(post.updatedDate)})
              </span>
            )}
          </div>
          <h1
            className="m-0 mb-2 py-2 text-2xl font-bold text-gray-900 dark:text-white"
            style={{
              viewTransitionName: `title-${post.title.replace(/\s+/g, "_")}`,
            }}
          >
            {post.title}
          </h1>
          <hr className="border-gray-200 dark:border-gray-700" />
        </div>

        {/* Rendered MDX content */}
        <div
          className="blog-content"
          dangerouslySetInnerHTML={{ __html: post.html }}
        />

        {/* Twitter embed script */}
        <script
          async
          src="https://platform.twitter.com/widgets.js"
          charSet="utf-8"
        />

        {/* Comments section */}
        <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
            Comments
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            Comments section - you can integrate Giscus or another commenting
            system here.
          </p>
        </div>
      </div>
    </article>
  );
}
