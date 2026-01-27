import { Twitter, Github } from "lucide-react";
import { TWITTER_HANDLE } from "@/lib/consts";

// Static build date to avoid hydration mismatch
const BUILD_DATE = "2026";

export function Footer() {
  return (
    <footer className="bg-gradient-to-br p-4 pb-16 pt-16 text-center text-gray-500">
      &copy; {BUILD_DATE} Mustafa Zaki Assagaf. All rights reserved.
      <div className="mt-4 flex justify-center space-x-4">
        <a
          href={`https://twitter.com/${TWITTER_HANDLE}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
        >
          <span className="sr-only">Follow Me on Twitter</span>
          <Twitter size={32} />
        </a>

        <a
          href="https://github.com/mustafasegf"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
        >
          <span className="sr-only">Follow on Github</span>
          <Github size={32} />
        </a>
      </div>
    </footer>
  );
}
