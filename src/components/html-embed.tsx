import fs from "node:fs";
import path from "node:path";

type HtmlEmbedProps = {
  /**
   * Path to a local .html file, relative to the project root.
   * Example: "content/docs/agent-harness/charts/metr-doubling.html"
   *
   * The file is read at build/render time on the server, then injected via
   * dangerouslySetInnerHTML inside a styled wrapper. The HTML must be trusted
   * (it ships from this repo, not from user input).
   */
  src: string;

  /**
   * Optional caption rendered below the HTML in a muted-foreground style.
   */
  caption?: string;

  /**
   * Optional className for the outer wrapper.
   */
  className?: string;
};

/**
 * Renders the contents of a local .html file inline in an MDX page.
 *
 * The intended use: place a .html file next to a brief's .mdx file (for a
 * Chart.js dashboard, a D3 viz, a Plotly chart, an interactive table, etc.),
 * then reference it with <HtmlEmbed src="content/docs/.../viz.html" />.
 *
 * This is a server component. The HTML is inlined at request time. For
 * untrusted HTML, use <IframeEmbed url="..." /> instead.
 */
export function HtmlEmbed({ src, caption, className }: HtmlEmbedProps) {
  const absolutePath = path.join(process.cwd(), src);

  let html: string;
  try {
    html = fs.readFileSync(absolutePath, "utf8");
  } catch {
    return (
      <div className="my-6 rounded-lg border border-red-500/40 bg-red-500/5 p-4 text-sm text-red-600">
        HtmlEmbed failed to read <code className="font-mono">{src}</code>.
        Check the path is relative to the project root.
      </div>
    );
  }

  return (
    <figure className={`not-prose my-8 ${className ?? ""}`}>
      <div
        className="overflow-hidden rounded-lg border border-fd-border bg-fd-background"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: HTML is loaded from a trusted in-repo file
        dangerouslySetInnerHTML={{ __html: html }}
      />
      {caption ? (
        <figcaption className="mt-2 text-center text-xs text-fd-muted-foreground">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

type HtmlInlineProps = {
  /**
   * Inline HTML string. Must be trusted (the string ships from this repo).
   */
  html: string;
  caption?: string;
  className?: string;
};

/**
 * Renders an inline HTML string. Useful when the HTML is short and you want
 * to keep the brief self-contained, or when generating HTML programmatically
 * inside the MDX file.
 */
export function HtmlInline({ html, caption, className }: HtmlInlineProps) {
  return (
    <figure className={`not-prose my-8 ${className ?? ""}`}>
      <div
        className="overflow-hidden rounded-lg border border-fd-border bg-fd-background p-4"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: trusted inline HTML from MDX author
        dangerouslySetInnerHTML={{ __html: html }}
      />
      {caption ? (
        <figcaption className="mt-2 text-center text-xs text-fd-muted-foreground">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

type IframeEmbedProps = {
  /**
   * External URL to embed. Rendered inside a sandboxed iframe.
   */
  url: string;
  /**
   * Pixel height of the iframe. Default 480.
   */
  height?: number;
  caption?: string;
  className?: string;
  /**
   * iframe sandbox attribute. Default: "allow-scripts allow-same-origin"
   * to support most interactive embeds. Tighten for untrusted sources.
   */
  sandbox?: string;
};

/**
 * Renders an external URL in a sandboxed iframe. Use this for embedding
 * third-party visualizations, archived pages, or any HTML you don't fully
 * control. The sandbox attribute prevents top-level navigation and form
 * submission by default.
 */
export function IframeEmbed({
  url,
  height = 480,
  caption,
  className,
  sandbox = "allow-scripts allow-same-origin",
}: IframeEmbedProps) {
  return (
    <figure className={`not-prose my-8 ${className ?? ""}`}>
      <div className="overflow-hidden rounded-lg border border-fd-border bg-fd-background">
        <iframe
          src={url}
          title={caption ?? `Embedded content from ${url}`}
          sandbox={sandbox}
          loading="lazy"
          referrerPolicy="no-referrer"
          style={{ width: "100%", height: `${height}px`, border: 0 }}
        />
      </div>
      {caption ? (
        <figcaption className="mt-2 text-center text-xs text-fd-muted-foreground">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
