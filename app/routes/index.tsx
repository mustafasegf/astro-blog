import { createFileRoute, Link } from "@tanstack/react-router";
import { Container } from "@/components/Container";
import { getBlogPosts, type BlogPostMeta } from "@/lib/blog.server";
import { formatBlogDate } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n";
import { DEFAULT_LOCALE } from "@/lib/consts";

export const Route = createFileRoute("/")({
  component: HomePage,
  loader: async () => {
    const posts = await getBlogPosts();
    return { posts };
  },
  head: () => ({
    meta: [
      { title: "Minggu Ini Ngapain - Blog" },
      { name: "description", content: "Blog pribadi yang berisi catatan, tutorial, dan opini." },
      // Open Graph
      { property: "og:type", content: "website" },
      { property: "og:title", content: "Minggu Ini Ngapain" },
      { property: "og:description", content: "Blog pribadi yang berisi catatan, tutorial, dan opini." },
      { property: "og:url", content: "https://blog.mus.sh" },
      { property: "og:image", content: "https://blog.mus.sh/og/home.png" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      // Twitter Card
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Minggu Ini Ngapain" },
      { name: "twitter:description", content: "Blog pribadi yang berisi catatan, tutorial, dan opini." },
      { name: "twitter:image", content: "https://blog.mus.sh/og/home.png" },
    ],
  }),
});

function HomePage() {
  const { posts } = Route.useLoaderData();
  const t = useTranslation(DEFAULT_LOCALE);

  return (
    <Container className="pt-16">
      <p className="mb-8 text-center text-lg text-gray-600 dark:text-gray-400">
        {t("home.description")}
      </p>
      <ul className="m-0 grid list-none grid-cols-2 md:grid-cols-3 gap-6 p-0">
        {posts.map((post, index) => (
          <li
            key={post.slug}
            className={
              index === 0
                ? "col-span-2 md:col-span-3 mb-4 w-full text-center"
                : ""
            }
          >
            <Link
              to="/blog/$slug"
              params={{ slug: post.slug }}
              className="block transition-colors duration-200"
              viewTransition
            >
              <img
                src={post.heroImage}
                alt={post.title}
                className="w-full mb-2 rounded-lg hover:shadow-md"
                style={{
                  viewTransitionName: post.title.replace(/\s+/g, "_"),
                  maxWidth: index === 0 ? undefined : "100%",
                }}
                loading="lazy"
                decoding="async"
              />
              <div
                style={{
                  viewTransitionName: `title-${post.title.replace(/\s+/g, "_")}`,
                }}
              >
                <h4
                  className={`${
                    index === 0 ? "text-xl md:text-2xl lg:text-3xl" : ""
                  } m-0`}
                >
                  {post.title}
                </h4>
                <p className="m-0">
                  <time dateTime={post.pubDate}>
                    {formatBlogDate(post.pubDate)}
                  </time>
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </Container>
  );
}
