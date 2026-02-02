"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  FileText,
  Loader2,
  ClipboardCheck,
  Car,
  Wallet,
  Inbox,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/manager", label: "Сводка", icon: LayoutDashboard },
  { href: "/manager/tasks", label: "Очередь задач", icon: Inbox },
  { href: "/manager/executors", label: "Исполнители", icon: Users },
  { href: "/manager/orders/new", label: "Заказы: Новые", icon: FileText },
  { href: "/manager/orders/in-progress", label: "Заказы: В работе", icon: Loader2 },
  { href: "/manager/orders/review", label: "Заказы: На проверке", icon: ClipboardCheck },
  { href: "/manager/sales", label: "Продажа под ключ", icon: Car },
  { href: "/manager/finance", label: "Финансы и расчёты", icon: Wallet },
];

export function ManagerNav() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-1 overflow-x-auto pb-2 border-b border-[#e2e8f0] bg-white px-6 -mx-6 mb-6">
      {navItems.map(({ href, label, icon: Icon }) => {
        const isActive =
          href === "/manager"
            ? pathname === "/manager"
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
