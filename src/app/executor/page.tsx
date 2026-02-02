"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  executorUser,
  executorActiveOrdersMock,
  getRatingCategoryLabel,
} from "@/data/mock";

// Продажа под ключ — только у менеджера. У исполнителя показываем только инспекцию, аудит, обслуживание.
const executorOrders = executorActiveOrdersMock.filter((o) => o.serviceType !== "sale");

export default function ExecutorDashboardPage() {
  const ratingDesc =
    "Рейтинг складывается из: Качество (оценка менеджера по сдаче отчётов), Скорость отклика (5: <90 мин, 4: 91–120, 3: 121–150, 2: 151–180, 1: >3 ч), Коэффициент выбора / % отказов. Top (4.5–5.0) видит новые заказы первые 90 минут эксклюзивно.";

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#0f172a]">Дашборд</h1>

      {/* A) Рейтинг */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Рейтинг</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="text-3xl font-bold text-[#0f172a]">
              {executorUser.rating}
            </div>
            <Badge
              variant={
                executorUser.ratingCategory === "top"
                  ? "default"
                  : executorUser.ratingCategory === "good"
                    ? "success"
                    : "secondary"
              }
            >
              {getRatingCategoryLabel(executorUser.ratingCategory)}
            </Badge>
          </div>
          <p className="text-sm text-[#64748b] max-w-2xl">{ratingDesc}</p>
          <div className="grid gap-3 sm:grid-cols-3 text-sm">
            <div className="rounded-xl bg-[#f8f9fb] p-3">
              <span className="text-[#64748b]">Качество</span>
              <p className="font-semibold text-[#0f172a]">{executorUser.qualityScore}</p>
            </div>
            <div className="rounded-xl bg-[#f8f9fb] p-3">
              <span className="text-[#64748b]">Скорость отклика (ССР)</span>
              <p className="font-semibold text-[#0f172a]">{executorUser.responseSpeedScore}</p>
            </div>
            <div className="rounded-xl bg-[#f8f9fb] p-3">
              <span className="text-[#64748b]">% отказов</span>
              <p className="font-semibold text-[#0f172a]">{executorUser.selectionCoeff}%</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* B) Быстрые показатели за период */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Показатели за месяц</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl bg-[#f8f9fb] p-4">
              <p className="text-sm text-[#64748b]">Выполнено заказов</p>
              <p className="text-2xl font-bold text-[#0f172a]">
                {executorUser.completedThisMonth}
              </p>
            </div>
            <div className="rounded-xl bg-[#f8f9fb] p-4">
              <p className="text-sm text-[#64748b]">По типам: инспекции / аудиты / подготовка</p>
              <p className="text-sm font-medium text-[#0f172a]">
                {executorUser.completedByType.inspection} / {executorUser.completedByType.audit} / {executorUser.completedByType.maintenance}
              </p>
            </div>
            <div className="rounded-xl bg-[#f8f9fb] p-4">
              <p className="text-sm text-[#64748b]">Принято с первого раза (без доработки)</p>
              <p className="text-2xl font-bold text-[#16a34a]">
                {executorUser.firstTimeAcceptRate}%
              </p>
            </div>
            <div className="rounded-xl bg-[#f8f9fb] p-4">
              <p className="text-sm text-[#64748b]">Среднее время отклика</p>
              <p className="text-2xl font-bold text-[#0f172a]">
                {executorUser.avgResponseMinutes} мин
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* C) Активные заказы */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Активные заказы</CardTitle>
          <Link href="/executor/orders">
            <Button variant="secondary" size="sm">Все</Button>
          </Link>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {executorOrders.slice(0, 3).map((o) => (
              <li
                key={o.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[#e2e8f0] bg-white p-4 hover:bg-[#f8f9fb] transition-colors"
              >
                <div>
                  <p className="font-medium text-[#0f172a]">{o.assetName}</p>
                  <p className="text-sm text-[#64748b]">{o.serviceLabel} · {o.statusLabel}</p>
                </div>
                <Link href={`/executor/orders/${o.id}`}>
                  <Button variant="primary" size="sm">Открыть</Button>
                </Link>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
