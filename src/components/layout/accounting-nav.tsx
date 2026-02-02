"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Inbox,
  Wallet,
  CreditCard,
  Package,
  PiggyBank,
  History,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems: { href: string; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { href: "/accounting", label: "Финансовый дашборд", icon: LayoutDashboard },
  { href: "/accounting/not-closed", label: "Очередь «Не закрыто»", icon: Inbox },
  { href: "/accounting/payments", label: "Оплаты заказчиков", icon: Wallet },
  { href: "/accounting/payouts", label: "Выплаты исполнителям", icon: CreditCard },
  { href: "/accounting/materials", label: "Материалы/запчасти", icon: Package },
  { href: "/accounting/balances", label: "Балансы компаний", icon: PiggyBank },
  { href: "/accounting/audit-log", label: "Журнал действий", icon: History },
];

export function AccountingNav() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-1 overflow-x-auto pb-2 border-b border-[#e2e8f0] bg-white px-6 -mx-6 mb-6">
      {navItems.map(({ href, label, icon: Icon }) => {
        const isActive = href === "/accounting" ? pathname === "/accounting" : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-2 whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-medium transition-colors",
              isActive ? "bg-[#2563eb] text-white" : "text-[#64748b] hover:bg-[#f1f5f9] hover:text-[#0f172a]"
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
