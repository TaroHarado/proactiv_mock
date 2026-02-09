"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { AssetTypeIcon } from "@/components/ui/asset-type-icon";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import {
  customerDashboardKpiMock,
  customerEmployeesMock,
  stockAssetsMock,
  customerAssetsInWorkMock,
  customerAssetsRealizedMock,
  CUSTOMER_ASSET_TYPE_LABELS,
} from "@/data/mock";
import { Package, Users, Bell, TrendingUp, TrendingDown } from "lucide-react";
import { SegmentedControl } from "@/components/ui/segmented-control";

const assetStock = stockAssetsMock.filter((a) => (a.portfolioStatus ?? "stock") === "stock");
const assetInWork = stockAssetsMock.filter((a) => a.portfolioStatus === "in_work");
const assetRealized = customerAssetsRealizedMock;

const ASSET_CHART_COLORS = ["#22d3ee", "#e879f9", "#6366f1", "#a78bfa", "#4f46e5"];

export default function CustomerDashboardPage() {
  const [employeeSearch, setEmployeeSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"assets" | "in_work" | "realized">("assets");
  const k = customerDashboardKpiMock;
  const employeesFiltered = customerEmployeesMock.filter(
    (e) =>
      !employeeSearch.trim() ||
      e.fullName.toLowerCase().includes(employeeSearch.toLowerCase()) ||
      e.email.toLowerCase().includes(employeeSearch.toLowerCase())
  );

  const pieData = k.structureByType.map((s, i) => ({
    name: s.label,
    value: s.count,
    color: ASSET_CHART_COLORS[i % ASSET_CHART_COLORS.length],
  }));

  const semiPieData = [
    { name: "В портфеле", value: k.assetValuePercentInPortfolio, color: "var(--border)" },
    { name: "Продано", value: k.assetValuePercentSold, color: "#22c55e" },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-[var(--black)]">Личный кабинет главного руководителя</h1>
      </div>

      {/* Блок 1: Активы — doughnut + легенда + Скачать xlsx; справа ROI и OPEX */}
      <div className="grid gap-6 lg:grid-cols-[1fr_auto_auto]">
        <Card className="overflow-hidden">
          <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:gap-8">
            <div className="relative flex h-[200px] min-h-[200px] w-[200px] min-w-[200px] flex-shrink-0 items-center justify-center sm:h-[240px] sm:min-h-[240px] sm:w-[240px] sm:min-w-[240px]">
              <ResponsiveContainer width="100%" height="100%" minHeight={200}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius="55%"
                    outerRadius="95%"
                    paddingAngle={1}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-sm font-medium text-[var(--gray-icon)]">Активы</span>
                <span className="text-3xl font-bold text-[var(--black)]">{k.assetsTotal}</span>
              </div>
            </div>
            <div className="flex flex-1 flex-col gap-3">
              <Button variant="secondary" size="sm" className="w-fit rounded-[64px]">
                Скачать xlsx
              </Button>
              <ul className="space-y-2">
                {k.structureByType.map((s, i) => (
                  <li key={s.type} className="flex items-center gap-2 text-sm">
                    <span
                      className="h-3 w-8 flex-shrink-0 rounded-sm"
                      style={{ backgroundColor: ASSET_CHART_COLORS[i % ASSET_CHART_COLORS.length] }}
                    />
                    <span className="text-[var(--black)]">
                      {s.percent}% {s.label} {s.count}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-4 lg:min-w-[180px]">
          <Card className="rounded-2xl border border-[var(--border)] bg-[var(--white)] p-4">
            <p className="text-sm text-[var(--gray-icon)]">ROI</p>
            <p className="text-2xl font-bold text-[var(--black)]">{k.roiPercent}%</p>
            <p className="mt-1 flex items-center gap-1 text-sm text-[#22c55e]">
              <TrendingUp className="h-4 w-4" />
              {k.roiChangeVsLastMonth} с прошлого месяца
            </p>
          </Card>
          <Card className="rounded-2xl border border-[var(--border)] bg-[var(--white)] p-4">
            <p className="text-sm text-[var(--gray-icon)]">OPEX</p>
            <p className="text-2xl font-bold text-[var(--black)]">{k.opexPercent}%</p>
            <p className="mt-1 flex items-center gap-1 text-sm text-[#22c55e]">
              <TrendingUp className="h-4 w-4" />
              {k.opexChangeVsLastMonth} с прошлого месяца
            </p>
          </Card>
        </div>
      </div>

      {/* Блок 2: Три карточки — Средний чек, Средний срок, Стоимость активов */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-[var(--black)]">Средний чек</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-2xl font-bold text-[var(--black)]">
              {k.avgCheckRub.toLocaleString("ru-RU")} ₽
            </p>
            <p className="flex items-center gap-1 text-sm text-[#22c55e]">
              <TrendingUp className="h-4 w-4" />
              {k.avgCheckChange.toLocaleString("ru-RU")} за все время
            </p>
            <div className="h-[140px] min-h-[140px] w-full">
              <ResponsiveContainer width="100%" height="100%" minHeight={140}>
                <BarChart data={k.monthlyAvgCheck} margin={{ top: 4, right: 4, left: 4, bottom: 0 }}>
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis hide />
                  <Tooltip formatter={(v: number | undefined) => [v != null ? v.toLocaleString("ru-RU") : "", "Средний чек"]} />
                  <Bar dataKey="avgCheck" radius={[4, 4, 0, 0]} maxBarSize={28}>
                    {k.monthlyAvgCheck.map((_, index) => (
                      <Cell
                        key={index}
                        fill={index === k.monthlyAvgCheck.length - 1 ? "var(--blue-50)" : "var(--border)"}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-end gap-1 text-xs text-[var(--gray-icon)]">
              {k.monthlyAvgCheck.map((m, i) => (
                <span key={m.month} className={i === k.monthlyAvgCheck.length - 1 ? "font-medium text-[var(--blue-50)]" : ""}>
                  {m.month}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-[var(--black)]">Средний срок</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-2xl font-bold text-[var(--black)]">{k.avgExposureDays} дня</p>
            <p className="flex items-center gap-1 text-sm text-[#22c55e]">
              <TrendingDown className="h-4 w-4" />
              {k.avgExposureChange} за все время
            </p>
            <div className="h-[140px] min-h-[140px] w-full">
              <ResponsiveContainer width="100%" height="100%" minHeight={140}>
                <BarChart data={k.monthlyAvgDuration} margin={{ top: 4, right: 4, left: 4, bottom: 0 }}>
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis hide />
                  <Tooltip formatter={(v: number | undefined) => [v != null ? `${v} дн.` : "", "Срок"]} />
                  <Bar dataKey="avgDuration" radius={[4, 4, 0, 0]} maxBarSize={28}>
                    {k.monthlyAvgDuration.map((_, index) => (
                      <Cell
                        key={index}
                        fill={index === k.monthlyAvgDuration.length - 1 ? "var(--blue-50)" : "var(--border)"}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-end gap-1 text-xs text-[var(--gray-icon)]">
              {k.monthlyAvgDuration.map((m, i) => (
                <span key={m.month} className={i === k.monthlyAvgDuration.length - 1 ? "font-medium text-[var(--blue-50)]" : ""}>
                  {m.month}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-[var(--black)]">Стоимость активов</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-2xl font-bold text-[var(--black)]">
              {k.portfolioValueRub.toLocaleString("ru-RU")} ₽
            </p>
            <p className="text-sm text-[var(--gray-icon)]">
              {k.portfolioValueSold.toLocaleString("ru-RU")} продано
            </p>
            <div className="relative flex h-[120px] min-h-[120px] w-full items-end justify-center">
              <ResponsiveContainer width="100%" height="100%" minHeight={120}>
                <PieChart>
                  <Pie
                    data={semiPieData}
                    cx="50%"
                    cy="100%"
                    startAngle={180}
                    endAngle={0}
                    innerRadius="60%"
                    outerRadius="100%"
                    paddingAngle={0}
                    dataKey="value"
                  >
                    {semiPieData.map((entry, index) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-center gap-4 rounded-[64px] border border-[var(--border)] bg-[var(--app-bg)] py-2 px-4 text-sm">
              <span className="text-[var(--black)]">&lt; {k.dashboardYear} &gt;</span>
              <span className="text-[var(--black)]">&lt; {k.dashboardMonth} &gt;</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Блок 3: Сотрудники */}
      <Card>
        <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-4">
          <CardTitle className="text-base flex items-center gap-2">
            <Users className="h-4 w-4" />
            Сотрудники
          </CardTitle>
          <div className="flex gap-2">
            <Input
              placeholder="Найдите сотрудника"
              value={employeeSearch}
              onChange={(e) => setEmployeeSearch(e.target.value)}
              className="w-48"
            />
            <Link href="/customer/employees/add">
              <Button size="sm">Добавить</Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border)] text-left text-[var(--gray-icon)]">
                  <th className="pb-2 pr-4">Сотрудник</th>
                  <th className="pb-2 pr-4">Активы / в работе</th>
                  <th className="pb-2 pr-4">Ср. срок экспозиции</th>
                  <th className="pb-2 pr-4">Лимит / остаток</th>
                  <th className="pb-2">Уведомления</th>
                </tr>
              </thead>
              <tbody>
                {employeesFiltered.map((e) => (
                  <tr key={e.id} className="border-b border-[var(--border)]">
                    <td className="py-3 pr-4 font-medium text-[var(--black)]">{e.fullName}</td>
                    <td className="py-3 pr-4">{e.assetsCount} / {e.assetsInWorkCount}</td>
                    <td className="py-3 pr-4">{e.avgExposureDays != null ? `${e.avgExposureDays} дн.` : "—"}</td>
                    <td className="py-3 pr-4">{(e.limit / 1e6).toFixed(1)} млн / {(e.limitRemaining / 1e6).toFixed(1)} млн ₽</td>
                    <td className="py-3">
                      <button type="button" className="relative rounded-full p-2 text-[var(--gray-icon)] hover:bg-[var(--app-bg)] hover:text-[var(--black)]">
                        <Bell className="h-5 w-5" />
                        {e.unreadNotificationsCount != null && e.unreadNotificationsCount > 0 && (
                          <span className="absolute right-0 top-0 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--blue-50)] text-[10px] font-semibold text-[var(--white)]">
                            {e.unreadNotificationsCount}
                          </span>
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Блок 4: Реестр активов с вкладками */}
      <Card>
        <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-4">
          <CardTitle className="text-base flex items-center gap-2">
            <Package className="h-4 w-4" />
            Реестр активов
          </CardTitle>
          <SegmentedControl
            value={activeTab}
            onChange={setActiveTab}
            options={[
              { value: "assets", label: "Активы", count: assetStock.length },
              { value: "in_work", label: "В работе", count: assetInWork.length },
              { value: "realized", label: "Реализованные", count: assetRealized.length },
            ]}
          />
        </CardHeader>
        <CardContent>
          {activeTab === "assets" && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--border)] text-left text-[var(--gray-icon)]">
                    <th className="pb-2 pr-2 w-10">Тип</th>
                    <th className="pb-2 pr-4">Марка</th>
                    <th className="pb-2 pr-4">Модель</th>
                    <th className="pb-2 pr-4">Год</th>
                    <th className="pb-2 pr-4">Пробег/моточсы</th>
                    <th className="pb-2 pr-4">VIN</th>
                    <th className="pb-2 pr-4">Цена, ₽</th>
                    <th className="pb-2 pr-4">Экспозиция</th>
                    <th className="pb-2 pr-4">Город</th>
                    <th className="pb-2">Сотрудник</th>
                  </tr>
                </thead>
                <tbody>
                  {assetStock.slice(0, 10).map((a) => (
                    <tr key={a.id} className="border-b border-[var(--border)]">
                      <td className="py-2 pr-2 text-[var(--gray-icon)]">
                        {a.type ? (
                          <div className="flex items-center gap-1.5">
                            <AssetTypeIcon type={a.type} />
                            <span className="hidden sm:inline text-[11px]">
                              {CUSTOMER_ASSET_TYPE_LABELS[a.type].split(" ")[0]}
                            </span>
                          </div>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="py-2 pr-4 font-medium text-[var(--black)]">{a.brand ?? a.name.split(" ")[0]}</td>
                      <td className="py-2 pr-4">{a.model ?? a.name.split(" ").slice(1).join(" ")}</td>
                      <td className="py-2 pr-4">{a.year}</td>
                      <td className="py-2 pr-4">{a.mileage ?? a.motohours ?? "—"}</td>
                      <td className="py-2 pr-4 text-[var(--gray-icon)] font-mono text-xs">{a.vin}</td>
                      <td className="py-2 pr-4">{a.price != null ? (a.price / 1000).toFixed(0) + "k" : "—"}</td>
                      <td className="py-2 pr-4">{a.exposureDays != null ? `${a.exposureDays} дн.` : "—"}</td>
                      <td className="py-2 pr-4">{a.city}</td>
                      <td className="py-2 text-[var(--gray-icon)]">{customerEmployeesMock.find((e) => e.id === a.employeeId)?.fullName ?? "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="mt-2 text-xs text-[var(--gray-icon)]">Показаны первые 10. Полный реестр — раздел «Активы».</p>
            </div>
          )}
          {activeTab === "in_work" && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--border)] text-left text-[var(--gray-icon)]">
                    <th className="pb-2 pr-4">Актив</th>
                    <th className="pb-2 pr-4">Услуга</th>
                    <th className="pb-2 pr-4">Этап</th>
                    <th className="pb-2 pr-4">Сотрудник</th>
                    <th className="pb-2">Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {customerAssetsInWorkMock.map((a) => (
                    <tr key={a.assetId} className="border-b border-[var(--border)]">
                      <td className="py-2 pr-4 font-medium text-[var(--black)]">{a.assetName}</td>
                      <td className="py-2 pr-4">{a.serviceLabel}</td>
                      <td className="py-2 pr-4">
                        {a.stageLabel}
                        {a.needsCustomerAction && <Badge className="ml-1 bg-amber-500">{a.actionLabel}</Badge>}
                      </td>
                      <td className="py-2 pr-4">{a.employeeName ?? "—"}</td>
                      <td className="py-2">
                        <Link href={`/customer/orders/${a.orderId}`}>
                          <Button variant="ghost" size="sm">Заказ</Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {activeTab === "realized" && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--border)] text-left text-[var(--gray-icon)]">
                    <th className="pb-2 pr-4">Актив</th>
                    <th className="pb-2 pr-4">Город</th>
                    <th className="pb-2 pr-4">Сотрудник</th>
                    <th className="pb-2 pr-4">Снижение экспозиции</th>
                    <th className="pb-2 pr-4">ROI</th>
                    <th className="pb-2">Дата</th>
                  </tr>
                </thead>
                <tbody>
                  {customerAssetsRealizedMock.map((a) => (
                    <tr key={a.assetId} className="border-b border-[var(--border)]">
                      <td className="py-2 pr-4 font-medium text-[var(--black)]">{a.assetName}</td>
                      <td className="py-2 pr-4">{a.city}</td>
                      <td className="py-2 pr-4">{a.employeeName ?? "—"}</td>
                      <td className="py-2 pr-4 text-[#22c55e]">−{a.exposureReductionDays} дн.</td>
                      <td className="py-2 pr-4">{a.roiPercent}%</td>
                      <td className="py-2">{a.realizedAt}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <div className="mt-4">
            <Link href="/customer/stock">
              <Button variant="outline" size="sm">Перейти в раздел «Активы»</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
