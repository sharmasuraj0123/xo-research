"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { gitConfig } from "@/lib/shared";

type GitCommit = {
  sha: string;
  shortSha: string;
  author: string;
  date: string;
  subject: string;
};

function updateVersionInUrl(
  pathname: string,
  searchParams: URLSearchParams,
  router: ReturnType<typeof useRouter>,
  commitSha: string,
) {
  const nextParams = new URLSearchParams(searchParams.toString());
  nextParams.set("version", commitSha);
  router.push(`${pathname}?${nextParams.toString()}`);
}

export function VersionSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [commits, setCommits] = useState<GitCommit[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadCommitHistory() {
      try {
        const response = await fetch("/api/versions", { cache: "no-store" });
        const json = (await response.json()) as { commits?: GitCommit[] };
        if (!cancelled) {
          setCommits(json.commits ?? []);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadCommitHistory();
    return () => {
      cancelled = true;
    };
  }, []);

  const selectedVersionId = searchParams.get("version") ?? commits[0]?.sha;

  const selectedIndex = useMemo(() => {
    if (!selectedVersionId) return 0;
    const index = commits.findIndex((commit) => commit.sha === selectedVersionId);
    return index >= 0 ? index : 0;
  }, [commits, selectedVersionId]);

  const canGoPrev = selectedIndex > 0;
  const canGoNext = selectedIndex < commits.length - 1;
  const selectedCommit = commits[selectedIndex];
  const commitUrl = selectedCommit
    ? `https://github.com/${gitConfig.user}/${gitConfig.repo}/commit/${selectedCommit.sha}`
    : null;

  return (
    <div className="not-prose mb-6 inline-flex items-center gap-2 rounded-lg border border-fd-border bg-fd-card px-3 py-2 text-sm">
      <span className="text-fd-muted-foreground">History</span>
      <button
        type="button"
        onClick={() =>
          canGoPrev &&
          updateVersionInUrl(pathname, searchParams, router, commits[selectedIndex - 1].sha)
        }
        disabled={!canGoPrev || isLoading}
        className="rounded-md border border-fd-border px-2 py-1 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Prev
      </button>
      <select
        aria-label="Select git version"
        value={selectedCommit?.sha ?? ""}
        onChange={(event) =>
          updateVersionInUrl(pathname, searchParams, router, event.target.value)
        }
        disabled={isLoading || commits.length === 0}
        className="rounded-md border border-fd-border bg-fd-background px-2 py-1"
      >
        {isLoading ? <option value="">Loading history...</option> : null}
        {!isLoading && commits.length === 0 ? <option value="">No commits found</option> : null}
        {commits.map((commit) => (
          <option key={commit.sha} value={commit.sha}>
            {commit.shortSha} {commit.subject}
          </option>
        ))}
      </select>
      <button
        type="button"
        onClick={() =>
          canGoNext &&
          updateVersionInUrl(pathname, searchParams, router, commits[selectedIndex + 1].sha)
        }
        disabled={!canGoNext || isLoading}
        className="rounded-md border border-fd-border px-2 py-1 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Next
      </button>
      {selectedCommit ? (
        <a
          href={commitUrl ?? "#"}
          target="_blank"
          rel="noreferrer"
          className="rounded-md border border-fd-border px-2 py-1 text-fd-muted-foreground hover:bg-fd-accent hover:text-fd-accent-foreground"
        >
          {selectedCommit.author} {selectedCommit.date}
        </a>
      ) : null}
    </div>
  );
}
