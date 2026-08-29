import { ADSENSE_CLIENT } from "@/lib/adsense";

type Props = {
  slot: string;
  className?: string;
};

export function AdSlot({ slot, className = "" }: Props) {
  if (!ADSENSE_CLIENT) return null;

  return (
    <div className={`relative overflow-hidden rounded-2xl ${className}`}>
      <ins
        className="adsbygoogle block min-h-24 w-full"
        style={{ display: "block" }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}