"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, FileText, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/customer", label: "Портфель", icon: LayoutDashboard },
  { href: "/customer/stock", label: "Активы", icon: Package },
  { href: "/customer/orders", label: "Заказы услуг", icon: FileText },
  { href: "/customer/balance-limits", label: "Баланс и лимиты", icon: Wallet },
];

export function CustomerNav() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-1 overflow-x-auto pb-2 border-b border-[#e2e8f0] bg-white px-6 -mx-6 mb-6">
      {navItems.map(({ href, label, icon: Icon }) => {
        const isActive =
          href === "/customer"
            ? pathname === "/customer"
            : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-2 whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-medium transition-colors",
              isActive
                ? "bg-[#2563eb] text-white"
                : "text-[#64748b] hover:bg-[#f1f5f9] hover:text-[#0f172a]"
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
