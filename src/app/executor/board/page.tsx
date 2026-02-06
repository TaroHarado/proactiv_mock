"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { boardOrdersMock } from "@/data/mock";
import { Clock, MapPin, MessageCircle, FileText, LayoutGrid, List } from "lucide-react";
import { cn } from "@/lib/utils";

function formatMinutes(m: number) {
  if (m < 60) return `${m} мин`;
  const h = Math.floor(m / 60);
  const rest = m % 60;
  return rest ? `${h} ч ${rest} мин` : `${h} ч`;
}

/** Сортировка: повышенный приоритет доступа → Ваш заказ (после вашего аудита) → остальные */
function sortBoardOrders<T extends { exclusiveForTop?: boolean; isFollowUpForSameExecutor?: boolean }>(orders: T[]): T[] {
  return [...orders].sort((a, b) => {
    if (a.exclusiveForTop && !b.exclusiveForTop) return -1;
    if (!a.exclusiveForTop && b.exclusiveForTop) return 1;
    if (a.isFollowUpForSameExecutor && !b.isFollowUpForSameExecutor) return -1;
    if (!a.isFollowUpForSameExecutor && b.isFollowUpForSameExecutor) return 1;
    return 0;
  });
}

type ViewMode = "cards" | "table";

function BoardOrderCardRow({
  order,
  formatMinutes,
}: {
  order: (typeof boardOrdersMock)[0];
  formatMinutes: (m: number) => string;
}) {
  return (
    <Card
      className={cn(
        "overflow-hidden transition-shadow hover:shadow-md",
        order.priority === "high" && "border-amber-200 bg-[#fffbeb]",
        order.isFollowUpForSameExecutor && "border-[#2563eb]/40 bg-[#eff6ff]"
      )}
    >
      <CardHeader className="pb-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <Badge variant={order.priority === "high" ? "warning" : "secondary"}>
              {order.priority === "high" ? "Высокий приоритет" : "Обычный"}
            </Badge>
            {order.isFollowUpForSameExecutor && (
              <Badge variant="default">Ваш заказ</Badge>
            )}
          </div>
          {order.exclusiveForTop && (
            <span className="text-xs font-medium text-[#2563eb]">Повышенный</span>
          )}
        </div>
        <h3 className="font-semibold text-[var(--black)]">{order.serviceLabel}</h3>
        <div className="flex items-center gap-1 text-sm text-[var(--gray-icon)]">
          <MapPin className="h-4 w-4 shrink-0" />
          {order.address}
        </div>
        {order.requiresAccessAgreement && (
          <p className="text-xs text-[var(--gray-icon)]">Требуется согласование доступа заказчиком</p>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
          <span className="text-[var(--gray-icon)]">Выплата исполнителю</span>
          <span className="font-semibold text-[var(--black)]">
            {order.payoutAmount.toLocaleString("ru")} ₽
          </span>
        </div>
        <div className="flex items-center gap-1 text-sm text-[var(--gray-icon)]">
          <Clock className="h-4 w-4 shrink-0" />
          Висит: {formatMinutes(order.minutesPending)} · Отказов: {order.rejectionsCount}
        </div>
        <div className="flex flex-wrap gap-2 pt-2">
          <Link href={`/executor/orders/${order.id}`}>
            <Button variant="outline" size="sm" className="gap-1">
              <FileText className="h-4 w-4" />
              Ознакомиться с заказом
            </Button>
          </Link>
          <Button variant="primary" size="sm" className="flex-1 sm:flex-none">
            Принять
          </Button>
          <Button variant="secondary" size="sm">Отказаться</Button>
          <Button variant="ghost" size="sm" className="gap-1">
            <MessageCircle className="h-4 w-4" />
            Задать вопрос менеджеру
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function ExecutorBoardPage() {
  const sortedOrders = useMemo(() => sortBoardOrders(boardOrdersMock), []);
  const [viewMode, setViewMode] = useState<ViewMode>("cards");

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[var(--black)]">Доска заказов</h1>
      <p className="text-sm text-[var(--gray-icon)]">
        Новые заказы. Повышенный приоритет доступа — для исполнителей с высоким рейтингом. Высокий приоритет — заказ завис или много отказов. Заказы с синей заливкой — по активу, по которому вы уже делали аудит (обслуживание/ремонт предлагаются вам в первую очередь).
      </p>

      {/* Переключатель: карточки по 3 / таблица */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-[var(--gray-icon)]">Вид:</span>
        <div className="inline-flex rounded-lg border border-[#e2e8f0] bg-[#f8fafc] p-0.5">
          <button
            type="button"
            onClick={() => setViewMode("cards")}
            className={cn(
              "flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              viewMode === "cards" ? "bg-white text-[#0f172a] shadow-sm" : "text-[#64748b] hover:text-[#0f172a]"
            )}
          >
            <LayoutGrid className="h-4 w-4" />
            Карточки (по 3)
          </button>
          <button
            type="button"
            onClick={() => setViewMode("table")}
            className={cn(
              "flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              viewMode === "table" ? "bg-white text-[#0f172a] shadow-sm" : "text-[#64748b] hover:text-[#0f172a]"
            )}
          >
            <List className="h-4 w-4" />
            Таблица
          </button>
        </div>
      </div>

      {viewMode === "cards" && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sortedOrders.map((order) => (
            <BoardOrderCardRow key={order.id} order={order} formatMinutes={formatMinutes} />
          ))}
        </div>
      )}

      {viewMode === "table" && (
        <div className="overflow-x-auto rounded-xl border border-[var(--border)] bg-white">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--app-bg)]">
                <th className="px-4 py-3 font-medium text-[var(--black)]">Услуга / адрес</th>
                <th className="px-4 py-3 font-medium text-[var(--black)]">Выплата</th>
                <th className="px-4 py-3 font-medium text-[var(--black)]">Время · отказов</th>
                <th className="px-4 py-3 font-medium text-[var(--black)]">Метки</th>
                <th className="px-4 py-3 font-medium text-[var(--black)]">Действия</th>
              </tr>
            </thead>
            <tbody>
              {sortedOrders.map((order) => (
                <tr
                  key={order.id}
                  className={cn(
                    "border-b border-[var(--border)] transition-colors hover:bg-[var(--app-bg)]",
                    order.isFollowUpForSameExecutor && "bg-[#eff6ff]"
                  )}
                >
                  <td className="px-4 py-3">
                    <p className="font-medium text-[var(--black)]">{order.serviceLabel}</p>
                    <p className="text-xs text-[var(--gray-icon)]">{order.address}</p>
                  </td>
                  <td className="px-4 py-3 font-semibold text-[var(--black)]">
                    {order.payoutAmount.toLocaleString("ru")} ₽
                  </td>
                  <td className="px-4 py-3 text-[var(--gray-icon)]">
                    {formatMinutes(order.minutesPending)} · {order.rejectionsCount} отк.
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {order.priority === "high" && (
                        <Badge variant="warning">Высокий приоритет</Badge>
                      )}
                      {order.isFollowUpForSameExecutor && (
                        <Badge variant="default">Ваш заказ</Badge>
                      )}
                      {order.exclusiveForTop && (
                        <span className="text-xs text-[#2563eb]">Повышенный</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      <Link href={`/executor/orders/${order.id}`}>
                        <Button variant="outline" size="sm" className="gap-1">
                          <FileText className="h-4 w-4" />
                          Ознакомиться
                        </Button>
                      </Link>
                      <Button variant="primary" size="sm">Принять</Button>
                      <Button variant="secondary" size="sm">Отказаться</Button>
                      <Button variant="ghost" size="sm" className="gap-1">
                        <MessageCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
