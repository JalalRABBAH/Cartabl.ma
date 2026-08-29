import { createReadStream, existsSync, statSync } from "fs";
import { Readable } from "stream";
import path from "path";
import type { NextRequest } from "next/server";
import { uploadDir } from "@/lib/upload";

const MIME: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
};

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path: parts } = await params;
  const safe = path.normalize(parts.join("/")).replace(/^(\.\.(\/|\\|$))+/, "");
  const full = path.join(uploadDir(), safe);

  if (!full.startsWith(uploadDir()) || !existsSync(full) || !statSync(full).isFile()) {
    return new Response(null, { status: 404 });
  }
  const mime = MIME[path.extname(full).toLowerCase()];
  if (!mime) return new Response(null, { status: 404 });

  const stat = statSync(full);
  const stream = Readable.toWeb(createReadStream(full)) as ReadableStream;
  return new Response(stream, {
    headers: {
      "Content-Type": mime,
      "Content-Length": String(stat.size),
      "Cache-Control": "public, max-age=2592000",
    },
  });
}
