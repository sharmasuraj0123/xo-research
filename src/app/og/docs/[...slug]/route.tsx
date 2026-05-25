import fs from "node:fs";
import path from "node:path";
import { generate as DefaultImage } from "fumadocs-ui/og";
import { notFound } from "next/navigation";
import { ImageResponse } from "next/og";
import { getPageImage, source } from "@/lib/source";

export const revalidate = false;

const iconBuffer = fs.readFileSync(
  path.join(process.cwd(), "src/app/icon.png"),
);
const iconSrc = `data:image/png;base64,${iconBuffer.toString("base64")}`;

export async function GET(
  _req: Request,
  { params }: RouteContext<"/og/docs/[...slug]">,
) {
  const { slug } = await params;
  const page = source.getPage(slug.slice(0, -1));
  if (!page) notFound();

  return new ImageResponse(
    <DefaultImage
      title={page.data.title}
      description={page.data.description}
      icon={
        <div
          style={{
            width: 56,
            height: 56,
            backgroundImage: `url(${iconSrc})`,
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
          }}
        />
      }
      primaryColor="rgba(131, 214, 58, 0.3)"
      primaryTextColor="#83d63a"
    />,
    {
      width: 1200,
      height: 630,
    },
  );
}

export function generateStaticParams() {
  return source.getPages().map((page) => ({
    lang: page.locale,
    slug: getPageImage(page).segments,
  }));
}
