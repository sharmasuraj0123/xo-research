"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

type Version = {
  id: string;
  label: string;
};

const VERSIONS: Version[] = [
  { id: "v1", label: "Version 1" },
  { id: "v2", label: "Version 2" },
  { id: "v3", label: "Version 3 (latest)" },
];

function updateVersionInUrl(
  pathname: string,
  searchParams: URLSearchParams,
  router: ReturnType<typeof useRouter>,
  versionId: string,
) {
  const nextParams = new URLSearchParams(searchParams.toString());
  nextParams.set("version", versionId);
  router.push(`${pathname}?${nextParams.toString()}`);
}

export function VersionSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const selectedVersionId = searchParams.get("version") ?? VERSIONS[VERSIONS.length - 1].id;
  const selectedIndex = Math.max(
    0,
    VERSIONS.findIndex((version) => version.id === selectedVersionId),
  );

  const canGoPrev = selectedIndex > 0;
  const canGoNext = selectedIndex < VERSIONS.length - 1;

  return (
    <div className="not-prose mb-6 inline-flex items-center gap-2 rounded-lg border border-fd-border bg-fd-card px-3 py-2 text-sm">
      <span className="text-fd-muted-foreground">Version</span>
      <button
        type="button"
        onClick={() =>
          updateVersionInUrl(pathname, searchParams, router, VERSIONS[selectedIndex - 1].id)
        }
        disabled={!canGoPrev}
        className="rounded-md border border-fd-border px-2 py-1 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Prev
      </button>
      <select
        aria-label="Select version"
        value={VERSIONS[selectedIndex].id}
        onChange={(event) =>
          updateVersionInUrl(pathname, searchParams, router, event.target.value)
        }
        className="rounded-md border border-fd-border bg-fd-background px-2 py-1"
      >
        {VERSIONS.map((version) => (
          <option key={version.id} value={version.id}>
            {version.label}
          </option>
        ))}
      </select>
      <button
        type="button"
        onClick={() =>
          updateVersionInUrl(pathname, searchParams, router, VERSIONS[selectedIndex + 1].id)
        }
        disabled={!canGoNext}
        className="rounded-md border border-fd-border px-2 py-1 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
}
