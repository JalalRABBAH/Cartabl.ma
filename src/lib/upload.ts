import { randomBytes } from "crypto";
import { mkdir, writeFile, unlink } from "fs/promises";
import path from "path";

const ALLOWED: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

export const MAX_IMAGE_SIZE = 4 * 1024 * 1024;

export function uploadDir(): string {
  return process.env.UPLOAD_DIR || path.join(process.cwd(), "public", "uploads");
}

export async function saveProductImage(file: File): Promise<string | null> {
  const ext = ALLOWED[file.type];
  if (!ext) return null;
  if (file.size === 0 || file.size > MAX_IMAGE_SIZE) return null;
  const name = `${Date.now().toString(36)}-${randomBytes(8).toString("hex")}.${ext}`;
  await mkdir(uploadDir(), { recursive: true });
  await writeFile(path.join(uploadDir(), name), Buffer.from(await file.arrayBuffer()));
  return `/uploads/${name}`;
}

export async function saveProductImages(files: File[]): Promise<string[]> {
  const results: string[] = [];
  for (const file of files) {
    const url = await saveProductImage(file);
    if (url) results.push(url);
  }
  return results;
}

export async function deleteProductImages(urls: (string | null | undefined)[]): Promise<void> {
  for (const url of urls) await deleteProductImage(url);
}

export async function deleteProductImage(url: string | null | undefined): Promise<void> {
  if (!url || !url.startsWith("/uploads/") || url.includes("..")) return;
  try {
    await unlink(path.join(uploadDir(), path.basename(url)));
  } catch {
    // fichier deja absent
  }
}
