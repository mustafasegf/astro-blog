import { type CollectionEntry, getCollection, getEntry } from "astro:content";
import { getLocale } from "astro-i18n-aut";
import { DEFAULT_LOCALE } from "@src/consts";
import type { APIRoute } from "astro";

import satori from "satori";
import fs from "fs/promises";
import sharp from "sharp";

const roboto = fs.readFile("./public/fonts/roboto/Roboto-Regular.ttf");
const robotoBold = fs.readFile("./public/fonts/roboto/Roboto-Bold.ttf");

export default async function renderOgImage(title: string, description: string) {
  const robotoBoldData = await robotoBold;
  const robotoData = await roboto;

  const svg = await satori(
    {
      type: "div",
      props: {
        children: [
          {
            type: "h1",
            props: {
              children: title,
              style: {
                fontFamily: "Roboto Bold",
                fontSize: "64px",
                lineHeight: 1,
                color: "#111",
                marginBottom: "32px",
              },
            },
          },
          {
            type: "span",
            props: {
              children: description,
              style: {
                color: "#333",
                fontFamily: "Roboto",
                fontSize: "40px",
              },
            },
          },
        ],
        style: {
          width: 1200,
          height: 630,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          borderBottom: "20px solid rgb(53, 88, 255)",
          background: "white",
          // backgroundImage: `url('data:image/png;base64,${base64Pattern}')`,
          // backgroundRepeat: "repeat",

          // opacity: "var(--pattern-opacity, 0.4)",
          // backgroundColor: "var(--pattern-bg-color, transparent)",
          // background:
          // 	"repeating-linear-gradient( 45deg, var(--pattern-color), var(--pattern-color) calc(var(--pattern-size, 40px) * 0.2), var(--pattern-bg-color, transparent) calc(var(--pattern-size, 40px) * 0.2), var(--pattern-bg-color) var(--pattern-size, 40px) )",
          padding: "80px",
        },
      },
    },
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: "Roboto Bold",
          data: robotoBoldData,
          weight: 700,
          style: "normal",
        },
        {
          name: "Roboto",
          data: robotoData,
          weight: 400,
          style: "normal",
        },
      ],
    },
  );

  const png = await sharp(Buffer.from(svg)).png().toBuffer();

  return new Response(png, {
    headers: {
      "Content-Type": "image/png",
    },
  });
}

export async function getStaticPaths() {
  const posts = await getCollection("blog", (entry) => entry.slug.startsWith(DEFAULT_LOCALE + "/"));
  return posts.map((post) => ({
    params: { slug: post.slug.replace(`${DEFAULT_LOCALE}/`, "") },
  }));
}

type Props = CollectionEntry<"blog">;

export const GET: APIRoute = async ({ params, url }) => {
  const { slug } = params;
  const locale = getLocale(url) ?? DEFAULT_LOCALE;

  const post = await getEntry({
    collection: "blog",
    slug: locale + "/" + slug,
  });

  if (!post) {
    return new Response(null, {
      status: 404,
      statusText: "Not found",
    });
  }

  // return new Response(JSON.stringify(post), { status: 200, statusText: "OK" });
  return renderOgImage(post.data.title, post.data.description);
};
