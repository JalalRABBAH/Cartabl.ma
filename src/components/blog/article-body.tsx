import Link from "next/link";
import type { BlogBlock } from "@/lib/blog";

function fmt(text: string): React.ReactNode[] {
  const regex = /(\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)]+\))/g;
  const parts = text.split(regex).filter(Boolean);

  return parts.map((part, i) => {
    if (part.startsWith("**"))
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    if (part.startsWith("*"))
      return <em key={i}>{part.slice(1, -1)}</em>;
    const m = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (m) {
      const internal = m[2].startsWith("/");
      const cls = "font-semibold text-brand-700 underline decoration-brand-300 underline-offset-2 hover:text-brand-800";
      return internal ? (
        <Link key={i} href={m[2]} className={cls}>
          {m[1]}
        </Link>
      ) : (
        <a key={i} href={m[2]} target="_blank" rel="noopener noreferrer" className={cls}>
          {m[1]}
        </a>
      );
    }
    return part;
  });
}

export function ArticleBody({ blocks }: { blocks: BlogBlock[] }) {
  return (
    <div className="space-y-5">
      {blocks.map((block, i) => {
        switch (block.type) {
          case "p":
            return (
              <p key={i} className="text-base leading-relaxed text-gray-600 sm:text-lg">
                {fmt(block.text)}
              </p>
            );
          case "h2":
            return (
              <h2
                key={i}
                id={block.text.replace(/\s+/g, "-").toLowerCase().replace(/[^\p{L}\p{N}-]/gu, "")}
                className="pt-4 text-2xl font-black text-gray-900"
              >
                {fmt(block.text)}
              </h2>
            );
          case "h3":
            return (
              <h3 key={i} className="pt-2 text-xl font-bold text-gray-900">
                {fmt(block.text)}
              </h3>
            );
          case "ul":
            return (
              <ul key={i} className="space-y-2.5 ps-1">
                {block.items.map((item, j) => (
                  <li key={j} className="flex gap-2.5 text-base leading-relaxed text-gray-600 sm:text-lg">
                    <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
                    <span>{fmt(item)}</span>
                  </li>
                ))}
              </ul>
            );
          case "quote":
            return (
              <blockquote
                key={i}
                className="rounded-2xl border-s-4 border-sand-500 bg-sand-50/70 px-6 py-5 text-base font-semibold leading-relaxed text-gray-800 sm:text-lg"
              >
                {fmt(block.text)}
              </blockquote>
            );
        }
      })}
    </div>
  );
}