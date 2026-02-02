"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GlobalFilters } from "@/components/admin/global-filters";
import {
  adminKpiMock,
  adminServiceSliceMock,
  adminCompaniesMock,
  adminAlertsMock,
} from "@/data/mock";
import { Building2, FileText, Wallet, TrendingUp, AlertTriangle } from "lucide-react";

export default function AdminDashboardPage() {
  const k = adminKpiMock;
  const atRisk = adminCompaniesMock.filter((c) => c.isAtRisk);
  const top10AtRisk = atRisk.slice(0, 10);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-[#0f172a]">Главный дашборд</h1>
      </div>

      <GlobalFilters />

      {/* A1) KPI-карточки */}
      <div>
        <h2 className="text-lg font-semibold text-[#0f172a] mb-3">KPI</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-[#64748b] flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Компании
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              <p className="text-2xl font-bold text-[#0f172a]">
                {k.companiesTotal} <span className="text-sm font-normal text-[#64748b]">/ {k.companiesInPeriod} за период</span>
              </p>
              <p className="text-sm text-[#64748b]">Затухает: {k.companiesCooling} · В риске: {k.companiesAtRisk}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-[#64748b] flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Операционка
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              <p className="text-sm text-[#0f172a]">Новых (не назначены): <strong>{k.ordersNew}</strong></p>
              <p className="text-sm text-[#0f172a]">В работе: <strong>{k.ordersInProgress}</strong></p>
              <p className="text-sm text-[#0f172a]">На проверке: <strong>{k.ordersOnReview}</strong></p>
              <p className="text-sm text-[#0f172a]">На доработке: <strong>{k.ordersOnRework}</strong></p>
              <p className="text-sm text-[#f59e0b]">Просрочено по SLA: <strong>{k.ordersSlaOverdue}</strong></p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-[#64748b] flex items-center gap-2">
                <Wallet className="h-4 w-4" />
                Финансы за период
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              <p className="text-sm text-[#0f172a]">Выручка: <strong>{k.revenuePeriod.toLocaleString("ru-RU")} ₽</strong></p>
              <p className="text-sm text-[#0f172a]">Выплаты: <strong>{k.payoutsPeriod.toLocaleString("ru-RU")} ₽</strong></p>
              <p className="text-sm text-[#0f172a]">Материалы: <strong>{k.materialsPeriod.toLocaleString("ru-RU")} ₽</strong></p>
              <p className="text-sm text-[#16a34a]">Дельта/маржа: <strong>{k.marginTarget.toLocaleString("ru-RU")} ₽</strong></p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-[#64748b] flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Тревоги
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-[#0f172a]">{adminAlertsMock.length}</p>
              <Link href="/admin/alerts">
                <Button variant="outline" size="sm" className="mt-2">Панель тревог</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* A2) Срез «Услуги» */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Срез «Услуги»</CardTitle>
          <p className="text-sm text-[#64748b]">По типам: создано / завершено / в работе / не состоялось, средний срок цикла</p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#e2e8f0] text-left text-[#64748b]">
                  <th className="pb-2 pr-4">Услуга</th>
                  <th className="pb-2 pr-4">Создано</th>
                  <th className="pb-2 pr-4">Завершено</th>
                  <th className="pb-2 pr-4">В работе</th>
                  <th className="pb-2 pr-4">Не состоялось</th>
                  <th className="pb-2">Lead time (дн.)</th>
                </tr>
              </thead>
              <tbody>
                {adminServiceSliceMock.map((s) => (
                  <tr key={s.serviceType} className="border-b border-[#e2e8f0]">
                    <td className="py-3 pr-4 font-medium text-[#0f172a]">{s.serviceLabel}</td>
                    <td className="py-3 pr-4">{s.created}</td>
                    <td className="py-3 pr-4">{s.completed}</td>
                    <td className="py-3 pr-4">{s.inProgress}</td>
                    <td className="py-3 pr-4">{s.notCompleted}</td>
                    <td className="py-3">{s.avgLeadTimeDays}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* A3) Здоровье компаний — Top-10 в риске */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base">Здоровье компаний — Top-10 в риске</CardTitle>
            <p className="text-sm text-[#64748b] mt-1">Причины: нет заказов X дней, не заходили, висит доступ, незакрытые оплаты, нет активности по продажам</p>
          </div>
          <Link href="/admin/companies?filter=at_risk">
            <Button size="sm">Открыть компании</Button>
          </Link>
        </CardHeader>
        <CardContent>
          {top10AtRisk.length === 0 ? (
            <p className="text-sm text-[#64748b]">Нет компаний в риске.</p>
          ) : (
            <ul className="space-y-2">
              {top10AtRisk.map((c) => (
                <li key={c.id} className="flex items-center justify-between rounded-xl bg-[#f8f9fb] px-4 py-3">
                  <span className="font-medium text-[#0f172a]">{c.name}</span>
                  <span className="text-sm text-[#64748b]">{c.riskReasons.join(" · ")}</span>
                  <Link href={`/admin/companies/${c.id}`}>
                    <Button variant="ghost" size="sm">Карточка</Button>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
