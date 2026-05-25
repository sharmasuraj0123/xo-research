import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import Image from "next/image";
import { appName, gitConfig } from "./shared";

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: (
        <Image
          src="/icon.png"
          alt={appName}
          width={80}
          height={32}
          className="h-7 w-auto"
          priority
        />
      ),
    },
    githubUrl: `https://github.com/${gitConfig.user}/${gitConfig.repo}`,
    links: [
      {
        type: "icon",
        label: "xo.builders",
        text: "xo.builders",
        icon: <span className="icon-[ph--globe-fill] size-4" />,
        url: "https://xo.builders",
        external: true,
        secondary: true,
      },
      {
        type: "icon",
        label: "X (Twitter)",
        text: "X",
        icon: <span className="icon-[lineicons--x] size-4" />,
        url: "https://x.com/xo_builders",
        external: true,
        secondary: true,
      },
      {
        type: "icon",
        label: "Instagram",
        text: "Instagram",
        icon: <span className="icon-[ph--instagram-logo-fill] size-4" />,
        url: "https://www.instagram.com/xo_builders/",
        external: true,
        secondary: true,
      },
      {
        type: "icon",
        label: "LinkedIn",
        text: "LinkedIn",
        icon: <span className="icon-[ph--linkedin-logo-fill] size-4" />,
        url: "https://linkedin.com/company/xo-builders",
        external: true,
        secondary: true,
      },
      {
        type: "icon",
        label: "YouTube",
        text: "YouTube",
        icon: <span className="icon-[ph--youtube-logo-fill] size-4" />,
        url: "https://www.youtube.com/@xo_builders",
        external: true,
        secondary: true,
      },
    ],
  };
}
