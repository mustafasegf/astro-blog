// Client-safe utility functions

export function formatBlogDate(dateString: string): string {
  return new Intl.DateTimeFormat("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(dateString));
}
