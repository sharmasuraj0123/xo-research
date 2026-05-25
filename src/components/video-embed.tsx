"use client";

interface VideoEmbedProps {
  id: string;
  title?: string;
}

export function VideoEmbed({ id, title }: VideoEmbedProps) {
  return (
    <div
      className="relative my-6 w-full overflow-hidden rounded-xl border border-[hsl(222_14%_18%)] bg-[hsl(222_14%_5%)]"
      style={{ paddingBottom: "56.25%" }}
    >
      <iframe
        src={`https://www.loom.com/embed/${id}`}
        title={title ?? "Video walkthrough"}
        allowFullScreen
        className="absolute inset-0 h-full w-full"
        style={{ border: 0 }}
      />
    </div>
  );
}
