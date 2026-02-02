"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Bell, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

import {
  executorNotificationsMock,
  customerNotificationsMock,
  customerNotificationsWithCategoryMock,
  managerNotificationsMock,
  adminNotificationsMock,
  accountingNotificationsMock,
} from "@/data/mock";

type CabinetRole = "customer" | "manager" | "executor" | "admin" | "accounting";

const ROLE_CONFIG: { role: CabinetRole; label: string; path: string }[] = [
  { role: "customer", label: "Заказчик", path: "/customer" },
  { role: "manager", label: "Менеджер", path: "/manager" },
  { role: "executor", label: "Исполнитель", path: "/executor" },
  { role: "admin", label: "Админ", path: "/admin" },
  { role: "accounting", label: "Бухгалтер", path: "/accounting" },
];

function getActiveRole(pathname: string): CabinetRole {
  if (pathname.startsWith("/customer")) return "customer";
  if (pathname.startsWith("/manager")) return "manager";
  if (pathname.startsWith("/executor")) return "executor";
  if (pathname.startsWith("/admin")) return "admin";
  if (pathname.startsWith("/accounting")) return "accounting";
  return "manager";
}

const CUSTOMER_CATEGORY_ORDER = { agreement: 0, completion: 1, upsell: 2 };

function getNotificationsByRole(role: CabinetRole) {
  switch (role) {
    case "customer": {
      const list = [...customerNotificationsWithCategoryMock].sort(
        (a, b) => CUSTOMER_CATEGORY_ORDER[a.category] - CUSTOMER_CATEGORY_ORDER[b.category]
      );
      return list;
    }
    case "manager":
      return managerNotificationsMock;
    case "executor":
      return executorNotificationsMock;
    case "admin":
      return adminNotificationsMock;
    case "accounting":
      return accountingNotificationsMock;
    default:
      return managerNotificationsMock;
  }
}

function getCabinetHref(role: CabinetRole): string {
  return ROLE_CONFIG.find((r) => r.role === role)?.path ?? "/manager";
}

export function Topbar() {
  const pathname = usePathname();
  const router = useRouter();
  const activeRole = getActiveRole(pathname);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isRoleOpen, setIsRoleOpen] = useState(false);

  const notifications = getNotificationsByRole(activeRole);
  const cabinetHref = getCabinetHref(activeRole);

  const handleRoleSelect = (path: string) => {
    setIsRoleOpen(false);
    router.push(path);
  };

  return (
    <header className="sticky top-0 z-30 border-b border-[#e2e8f0] bg-white px-4 sm:px-6">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4">
        <div className="flex items-center gap-4 sm:gap-8">
          <Link href={cabinetHref} className="flex items-center gap-2">
            <img
              src="/logo.png"
              alt="ПроАктив"
              className="h-9 w-auto object-contain"
            />
          </Link>
          <Link
            href={activeRole === "executor" ? "/executor/support" : "#"}
            className="hidden sm:inline text-sm text-[#64748b] hover:text-[#2563eb] transition-colors"
          >
            Поддержка
          </Link>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Переключатель роли (dev-only) */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsRoleOpen((v) => !v)}
              className={cn(
                "flex items-center gap-1.5 rounded-xl border px-3 py-2 text-sm font-medium transition-colors sm:px-4",
                "border-[#e2e8f0] bg-[#f8f9fb] hover:bg-[#f1f5f9]",
                "text-[#0f172a]"
              )}
            >
              <span className="text-[#64748b]">Роль:</span>
              <span className="text-[#2563eb]">
                {ROLE_CONFIG.find((r) => r.role === activeRole)?.label ?? "Менеджер"}
              </span>
              <ChevronDown className="h-4 w-4 text-[#64748b]" />
            </button>
            {isRoleOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  aria-hidden
                  onClick={() => setIsRoleOpen(false)}
                />
                <div className="absolute right-0 top-full z-20 mt-1 w-48 rounded-2xl border border-[#e2e8f0] bg-white py-1 shadow-lg">
                  {ROLE_CONFIG.map(({ role, label, path }) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => handleRoleSelect(path)}
                      className={cn(
                        "w-full px-4 py-2.5 text-left text-sm font-medium transition-colors",
                        activeRole === role
                          ? "bg-[#eff6ff] text-[#2563eb]"
                          : "text-[#0f172a] hover:bg-[#f8f9fb]"
                      )}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsNotifOpen((v) => !v)}
                className="relative flex h-9 w-9 items-center justify-center rounded-full text-[#64748b] hover:bg-[#f1f5f9] hover:text-[#0f172a] transition-colors"
                aria-label="Уведомления"
              >
                <Bell className="h-5 w-5" />
                {notifications.length > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-3 w-3 items-center justify-center rounded-full bg-[#2563eb] text-[9px] font-semibold text-white">
                    {notifications.length}
                  </span>
                )}
              </button>
              {isNotifOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    aria-hidden
                    onClick={() => setIsNotifOpen(false)}
                  />
                  <div className="absolute right-0 z-20 mt-2 w-80 max-w-[90vw] rounded-2xl border border-[#e2e8f0] bg-white shadow-[0_1px_3px_0_rgb(0_0_0/.05),0_1px_2px_-1px_rgb(0_0_0/.05)]">
                    <div className="flex items-center justify-between border-b border-[#e2e8f0] px-4 py-3">
                      <p className="text-sm font-semibold text-[#0f172a]">
                        Уведомления
                      </p>
                      <button
                        type="button"
                        onClick={() => setIsNotifOpen(false)}
                        className="text-xs text-[#64748b] hover:text-[#0f172a]"
                      >
                        Закрыть
                      </button>
                    </div>
                    <ul className="max-h-80 space-y-2 overflow-y-auto px-4 py-3 text-sm">
                      {notifications.map((n) => {
                        const isAgreement = "category" in n && n.category === "agreement";
                        return (
                          <li
                            key={n.id}
                            className={cn(
                              "rounded-xl px-3 py-2 text-left",
                              isAgreement ? "bg-[#fffbeb] border border-[#f59e0b]" : "bg-[#f8f9fb]"
                            )}
                          >
                            <div className="flex items-center gap-2">
                              <p className="font-medium text-[#0f172a]">{n.title}</p>
                              {isAgreement && (
                                <span className="rounded bg-[#f59e0b] px-1.5 py-0.5 text-[10px] font-medium text-white">
                                  Согласование
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-[#64748b]">{n.text}</p>
                            <p className="mt-1 text-[11px] text-[#94a3b8]">
                              {n.time}
                            </p>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </>
              )}
            </div>
            <div className="hidden sm:flex h-9 items-center rounded-full border border-[#2563eb] bg-white px-4 text-xs sm:text-sm font-medium text-[#0f172a]">
              100 000 200 ₽
            </div>
            <div className="flex items-center gap-2 sm:gap-3 pl-1 sm:pl-2">
              <div className="h-9 w-9 rounded-full bg-[#e2e8f0] flex items-center justify-center text-sm font-medium text-[#64748b]">
                ИИ
              </div>
              <div className="hidden xs:block text-left">
                <p className="text-sm font-medium text-[#0f172a]">
                  Иванов Иван
                </p>
                <p className="hidden text-xs text-[#64748b] sm:block">
                  ivan_i@gmail.com
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
