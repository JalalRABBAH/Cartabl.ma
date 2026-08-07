"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Star, Loader2, Send } from "lucide-react";
import { useLocale } from "@/app/providers";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ReviewForm({ productId, loggedIn }: { productId: string; loggedIn: boolean }) {
  const { T } = useLocale();
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<"" | "ok" | "err" | "dup">("");

  if (!loggedIn) {
    return (
      <div className="mt-6 rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-4 text-center text-sm text-gray-600">
        <Link href="/compte/connexion" className="font-bold text-brand-600 hover:underline">
          {T("auth_login_btn")}
        </Link>{" "}
        {T("review_login_hint")}
      </div>
    );
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0 || comment.trim().length < 3) return;
    setBusy(true);
    setMsg("");
    try {
      const res = await fetch(`/api/products/${productId}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, comment }),
      });
      if (res.status === 409) {
        setMsg("dup");
        return;
      }
      if (!res.ok) {
        setMsg("err");
        return;
      }
      setMsg("ok");
      setRating(0);
      setComment("");
      router.refresh();
    } catch {
      setMsg("err");
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="mt-6 rounded-2xl border border-gray-100 bg-gray-50 p-4">
      <p className="text-sm font-bold text-gray-800">{T("review_title")}</p>
      <div className="mt-2 flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <button
            key={i}
            type="button"
            onClick={() => setRating(i)}
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(0)}
            className="cursor-pointer transition"
            aria-label={`${i} étoiles`}
          >
            <Star
              className={cn(
                "h-7 w-7",
                i <= (hover || rating) ? "fill-amber-400 text-amber-400" : "text-gray-300",
              )}
            />
          </button>
        ))}
      </div>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder={T("review_placeholder")}
        className="mt-3 h-20 w-full resize-none rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
      />
      {msg === "dup" && <p className="mt-2 text-xs font-semibold text-amber-600">{T("review_already")}</p>}
      {msg === "err" && <p className="mt-2 text-xs font-semibold text-red-600">{T("checkout_error")}</p>}
      {msg === "ok" && <p className="mt-2 text-xs font-semibold text-emerald-600">{T("review_success")}</p>}
      <Button type="submit" size="sm" disabled={busy || rating === 0 || comment.trim().length < 3} className="mt-3">
        {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
        {T("review_submit")}
      </Button>
    </form>
  );
}
