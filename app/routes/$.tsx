import { createFileRoute, Link } from "@tanstack/react-router";
import { Container } from "@/components/Container";

export const Route = createFileRoute("/$")({
  component: NotFoundPage,
  head: () => ({
    meta: [{ title: "404 - Page Not Found" }],
  }),
});

function NotFoundPage() {
  return (
    <Container className="pt-16 text-center min-h-[60vh] flex flex-col items-center justify-center">
      <h1 className="text-6xl font-bold text-gray-300 dark:text-gray-600 mb-4">
        404
      </h1>
      <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link
        to="/"
        className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
      >
        Go back home
      </Link>
    </Container>
  );
}
