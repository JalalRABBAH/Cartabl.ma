"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { STATUS_STYLE } from "@/lib/orders";
import type { OrderStatus } from "@prisma/client";

type Datum = { status: OrderStatus; count: number };

const STATUS_ORDER: OrderStatus[] = [
  "PENDING",
  "CONFIRMED",
  "PREPARING",
  "HANDED_TO_DELIVERY",
  "IN_TRANSIT",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "CANCELED",
];

export function StatusDonut({
  data,
  labels,
}: {
  data: Datum[];
  labels: Record<string, string>;
}) {
  const total = data.reduce((acc, d) => acc + d.count, 0);
  const chartData = STATUS_ORDER.filter((s) => data.find((d) => d.status === s)?.count)
    .map((s) => ({ name: labels[s] ?? s, value: data.find((d) => d.status === s)?.count ?? 0, status: s }))
    .filter((d) => d.value > 0);

  if (total === 0) {
    return (
      <div className="flex h-48 items-center justify-center text-sm text-gray-400">
        —
      </div>
    );
  }

  return (
    <div>
      <div className="relative h-48">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={chartData} dataKey="value" nameKey="name" innerRadius={58} outerRadius={82} paddingAngle={3} strokeWidth={0}>
              {chartData.map((d) => (
                <Cell key={d.status} fill={STATUS_STYLE[d.status].dot} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => [value, ""]} />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-black text-gray-900">{total}</span>
          <span className="text-xs text-gray-400">Total</span>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap justify-center gap-x-4 gap-y-1.5">
        {chartData.map((d) => (
          <span key={d.status} className="flex items-center gap-1.5 text-xs text-gray-600">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: STATUS_STYLE[d.status].dot }} />
            {d.name} · {d.value}
          </span>
        ))}
      </div>
    </div>
  );
}
