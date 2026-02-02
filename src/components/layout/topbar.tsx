"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell } from "lucide-react";
import { cn } from "@/lib/utils";

import { executorNotificationsMock } from "@/data/mock";

const customerNotifications = [
  { id: "n1", title: "Новый заказ", text: "Появился новый заказ без исполнителя.", time: "5 мин назад" },
  { id: "n2", title: "Задача зависла по SLA", text: "Проверка отчёта по Hyundai Porter просрочена.", time: "30 мин назад" },
  { id: "n3", title: "Платёж от заказчика", text: "Поступила оплата по KamAZ 5490.", time: "1 ч назад" },
];

export function Topbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const isExecutor = pathname.startsWith("/executor");
  const notifications = isExecutor ? executorNotificationsMock : customerNotifications;

  return (
    <header className="sticky top-0 z-30 border-b border-[#e2e8f0] bg-white px-4 sm:px-6">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4">
        <div className="flex items-center gap-4 sm:gap-8">
          <Link
            href={isExecutor ? "/executor" : "/manager"}
            className="flex items-center gap-2"
          >
            <img
              src="/logo.png"
              alt="ПроАктив"
              className="h-9 w-auto object-contain"
            />
          </Link>
          <Link
            href={isExecutor ? "/executor/support" : "#"}
            className="hidden sm:inline text-sm text-[#64748b] hover:text-[#2563eb] transition-colors"
          >
            Поддержка
          </Link>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Переключатель роли: Заказчик ⇄ Исполнитель */}
          <div className="flex rounded-xl border border-[#e2e8f0] bg-[#f8f9fb] p-0.5">
            <Link
              href="/manager"
              className={cn(
                "rounded-lg px-3 py-1.5 text-xs font-medium transition-colors sm:px-4 sm:text-sm",
                !isExecutor
                  ? "bg-white text-[#2563eb] shadow-sm"
                  : "text-[#64748b] hover:text-[#0f172a]"
              )}
            >
              Заказчик
            </Link>
            <Link
              href="/executor"
              className={cn(
                "rounded-lg px-3 py-1.5 text-xs font-medium transition-colors sm:px-4 sm:text-sm",
                isExecutor
                  ? "bg-white text-[#2563eb] shadow-sm"
                  : "text-[#64748b] hover:text-[#0f172a]"
              )}
            >
              Исполнитель
            </Link>
          </div>
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsOpen((v) => !v)}
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
            {isOpen && (
              <div className="absolute right-0 mt-2 w-80 max-w-[90vw] rounded-2xl border border-[#e2e8f0] bg-white shadow-[0_1px_3px_0_rgb(0_0_0/.05),0_1px_2px_-1px_rgb(0_0_0/.05)]">
                <div className="flex items-center justify-between border-b border-[#e2e8f0] px-4 py-3">
                  <p className="text-sm font-semibold text-[#0f172a]">
                    Уведомления
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="text-xs text-[#64748b] hover:text-[#0f172a]"
                  >
                    Закрыть
                  </button>
                </div>
                <ul className="max-h-80 space-y-2 overflow-y-auto px-4 py-3 text-sm">
                  {notifications.map((n) => (
                    <li
                      key={n.id}
                      className="rounded-xl bg-[#f8f9fb] px-3 py-2 text-left"
                    >
                      <p className="font-medium text-[#0f172a]">{n.title}</p>
                      <p className="text-xs text-[#64748b]">{n.text}</p>
                      <p className="mt-1 text-[11px] text-[#94a3b8]">
                        {n.time}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
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
