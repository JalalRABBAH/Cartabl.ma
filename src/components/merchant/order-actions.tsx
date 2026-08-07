"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, CheckCircle2, AlertCircle, Truck } from "lucide-react";
import { allowedTransitions, type ActorType } from "@/lib/orders";
import { useLocale } from "@/app/providers";
import { Button } from "@/components/ui/button";
import type { OrderStatus } from "@prisma/client";

export type DeliveryOption = { id: string; name: string };

export function OrderActions({
  orderNumber,
  status,
  actorType,
  deliveries = [],
  assignedDeliveryId,
}: {
  orderNumber: string;
  status: OrderStatus;
  actorType: ActorType;
  deliveries?: DeliveryOption[];
  assignedDeliveryId?: string | null;
}) {
  const { T } = useLocale();
  const router = useRouter();
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState<OrderStatus | null>(null);
  const [msg, setMsg] = useState<"ok" | "err" | "">("");
  const [deliveryId, setDeliveryId] = useState(assignedDeliveryId ?? deliveries[0]?.id ?? "");

  const transitions = allowedTransitions(status, actorType);

  const labelFor = (s: OrderStatus) => {
    if (actorType === "SELLER") {
      switch (s) {
        case "CONFIRMED":
          return T("merchant_confirm");
        case "PREPARING":
          return T("merchant_preparing");
        case "HANDED_TO_DELIVERY":
          return T("merchant_hand_delivery");
        case "CANCELED":
          return T("cancel_order");
        default:
          return s;
      }
    }
    switch (s) {
      case "IN_TRANSIT":
        return T("delivery_pick_up");
      case "OUT_FOR_DELIVERY":
        return T("delivery_out");
      case "DELIVERED":
        return T("delivery_deliver");
      default:
        return s;
    }
  };

  const variantFor = (s: OrderStatus) =>
    s === "DELIVERED" ? ("success" as const) : s === "CANCELED" ? ("destructive" as const) : ("default" as const);

  const run = async (s: OrderStatus) => {
    setBusy(s);
    setMsg("");
    try {
      if (actorType === "SELLER" && s === "HANDED_TO_DELIVERY" && deliveryId) {
        await fetch(`/api/orders/${orderNumber}/assign`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ deliveryId }),
        });
      }
      const res = await fetch(`/api/orders/${orderNumber}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: s, note: note.trim() || undefined }),
      });
      if (!res.ok) {
        setMsg("err");
        return;
      }
      setMsg("ok");
      setNote("");
      router.refresh();
    } catch {
      setMsg("err");
    } finally {
      setBusy(null);
    }
  };

  if (transitions.length === 0 && !(actorType === "SELLER" && status === "PREPARING")) {
    return null;
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {transitions.map((s) => (
          <Button
            key={s}
            size="sm"
            variant={variantFor(s)}
            disabled={busy !== null}
            onClick={() => run(s)}
          >
            {busy === s && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            {labelFor(s)}
          </Button>
        ))}
      </div>

      {actorType === "SELLER" && status === "PREPARING" && (
        <div className="flex flex-wrap items-center gap-2">
          <Truck className="h-4 w-4 text-gray-400" />
          <select
            value={deliveryId}
            onChange={(e) => setDeliveryId(e.target.value)}
            className="h-8 cursor-pointer rounded-lg border border-gray-200 bg-white px-2 text-xs outline-none"
          >
            {deliveries.length === 0 && (
              <option value="">{T("merchant_no_delivery")}</option>
            )}
            {deliveries.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {msg === "ok" && (
        <p className="flex items-center gap-1 text-xs font-semibold text-emerald-600">
          <CheckCircle2 className="h-3.5 w-3.5" /> {T("merchant_status_updated")}
        </p>
      )}
      {msg === "err" && (
        <p className="flex items-center gap-1 text-xs font-semibold text-red-600">
          <AlertCircle className="h-3.5 w-3.5" /> {T("checkout_error")}
        </p>
      )}

      {(actorType === "SELLER" || transitions.some((s) => s === "DELIVERED")) && transitions.length > 0 && (
        <input
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder={T("merchant_delivery_note")}
          className="h-8 w-full max-w-60 rounded-lg border border-gray-200 px-2.5 text-xs outline-none focus:border-brand-400"
        />
      )}
    </div>
  );
}
