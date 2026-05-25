import defaultMdxComponents from "fumadocs-ui/mdx";
import type { MDXComponents } from "mdx/types";
import { BrandIcon } from "./brand-icon";
import { Card, Cards } from "./card";
import { MetrDoublingChart, StatBlock } from "./data-viz";
import { HtmlEmbed, HtmlInline, IframeEmbed } from "./html-embed";

export function getMDXComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
    BrandIcon,
    Card,
    Cards,
    HtmlEmbed,
    HtmlInline,
    IframeEmbed,
    MetrDoublingChart,
    StatBlock,
    ...components,
  } satisfies MDXComponents;
}

export const useMDXComponents = getMDXComponents;

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
