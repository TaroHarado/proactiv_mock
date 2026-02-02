"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  FileText,
  GitBranch,
  Clock,
  Users,
  UserCog,
  Wallet,
  Plug,
  PiggyBank,
  History,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems: { href: string; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { href: "/admin", label: "Дашборд", icon: LayoutDashboard },
  { href: "/admin/companies", label: "Компании", icon: Building2 },
  { href: "/admin/orders", label: "Заказы", icon: FileText },
  { href: "/admin/operations", label: "Операционка и SLA", icon: GitBranch },
  { href: "/admin/timings", label: "Тайминги и аномалии", icon: Clock },
  { href: "/admin/executors", label: "Исполнители", icon: Users },
  { href: "/admin/managers", label: "Менеджеры", icon: UserCog },
  { href: "/admin/finance", label: "Финансы", icon: Wallet },
  { href: "/admin/integrations", label: "Интеграции", icon: Plug },
  { href: "/admin/balances", label: "Балансы", icon: PiggyBank },
  { href: "/admin/audit-log", label: "Журнал действий", icon: History },
  { href: "/admin/alerts", label: "Панель тревог", icon: AlertTriangle },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-1 overflow-x-auto pb-2 border-b border-[#e2e8f0] bg-white px-6 -mx-6 mb-6">
      {navItems.map(({ href, label, icon: Icon }) => {
        const isActive = href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
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
