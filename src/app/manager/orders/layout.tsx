"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const tabs = [
  { href: "/manager/orders/new", label: "Новые / Не назначены" },
  { href: "/manager/orders/in-progress", label: "В работе" },
  { href: "/manager/orders/review", label: "На проверке" },
];

export default function OrdersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#0f172a]">Заказы</h1>
      <div className="flex gap-1 border-b border-[#e2e8f0]">
        {tabs.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "rounded-t-xl px-4 py-2.5 text-sm font-medium transition-colors",
              pathname === href
                ? "bg-[#2563eb] text-white"
                : "text-[#64748b] hover:bg-[#f1f5f9] hover:text-[#0f172a]"
            )}
          >
            {label}
          </Link>
        ))}
      </div>
      {children}
    </div>
  );
}
