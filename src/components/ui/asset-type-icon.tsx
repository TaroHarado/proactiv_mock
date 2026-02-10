import { cn } from "@/lib/utils";
import type { AuditAssetType, CustomerAssetType } from "@/data/mock";

type AssetType = AuditAssetType | CustomerAssetType;

const TYPE_CONFIG: Record<
  AssetType,
  { emoji: string; label: string; bg: string; fg: string }
> = {
  passenger: { emoji: "🚗", label: "Легковые автомобили", bg: "bg-[#eff6ff]", fg: "text-[#1d4ed8]" },
  lcv: { emoji: "🚐", label: "Легкий коммерческий транспорт", bg: "bg-[#dbeafe]", fg: "text-[#1e40af]" },
  truck: { emoji: "🚛", label: "Грузовой транспорт", bg: "bg-[#fef9c3]", fg: "text-[#92400e]" },
  special: { emoji: "🚜", label: "Спецтехника и спецтранспорт", bg: "bg-[#f5f3ff]", fg: "text-[#5b21b6]" },
  trailer: { emoji: "🚚", label: "Прицепы и полуприцепы", bg: "bg-[#ecfeff]", fg: "text-[#0f766e]" },
};

export function AssetTypeIcon({
  type,
  className,
  withLabel = false,
}: {
  type?: AssetType;
  className?: string;
  withLabel?: boolean;
}) {
  if (!type) return null;
  const cfg = TYPE_CONFIG[type];
  if (!cfg) return null;

  if (withLabel) {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
          cfg.bg,
          cfg.fg,
          className
        )}
      >
        <span aria-hidden>{cfg.emoji}</span>
        <span>{cfg.label}</span>
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex h-7 w-7 items-center justify-center rounded-full text-sm",
        cfg.bg,
        cfg.fg,
        className
      )}
      title={cfg.label}
      aria-label={cfg.label}
    >
      <span aria-hidden>{cfg.emoji}</span>
    </span>
  );
}

