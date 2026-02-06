"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ClipboardList,
  Briefcase,
  History,
  Wallet,
  User,
  MessageCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/executor", label: "Дашборд", icon: LayoutDashboard },
  { href: "/executor/board", label: "Доска заказов", icon: ClipboardList },
  { href: "/executor/orders", label: "Мои активные", icon: Briefcase },
  { href: "/executor/history", label: "История", icon: History },
  { href: "/executor/finance", label: "Финансы и ЭДО", icon: Wallet },
  { href: "/executor/profile", label: "Профиль и документы", icon: User },
  { href: "/executor/support", label: "Поддержка", icon: MessageCircle },
];

export function ExecutorNav() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-1 overflow-x-auto pb-2 border-b border-[#e2e8f0] bg-white px-4 -mx-4 sm:px-6 sm:-mx-6 mb-6">
      {navItems.map(({ href, label, icon: Icon }) => {
        const isActive =
          href === "/executor" ? pathname === "/executor" : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-2 whitespace-nowrap rounded-xl px-3 py-2.5 text-sm font-medium transition-colors sm:px-4",
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
