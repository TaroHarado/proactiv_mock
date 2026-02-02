"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { dashboardMetrics } from "@/data/mock";
import { TrendingUp, AlertTriangle } from "lucide-react";
import Link from "next/link";

export default function ManagerDashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#0f172a]">Сводка</h1>
        <Select defaultValue="month" className="w-40">
          <option value="month">Последний месяц</option>
          <option value="week">Неделя</option>
          <option value="quarter">Квартал</option>
        </Select>
      </div>

      {/* Карточки метрик */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-[#64748b]">
              Активов на платформе / в работе
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#0f172a]">
              {dashboardMetrics.assetsTotal} / {dashboardMetrics.assetsInWork}
            </div>
            <p className="text-xs text-[#64748b] mt-1">
              Период: {dashboardMetrics.period}
            </p>
          </CardContent>
        </Card>
        <Link href="/manager/orders/new">
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-[#64748b]">
                Новые заказы (не назначены)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#2563eb]">
                {dashboardMetrics.newOrders}
              </div>
              <p className="text-xs text-[#64748b] mt-1 flex items-center gap-1">
                <TrendingUp className="h-3 w-3 text-[#16a34a]" />
                перейти в раздел
              </p>
            </CardContent>
        </Card>
        </Link>
        <Link href="/manager/orders/in-progress">
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-[#64748b]">
                В работе
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#0f172a]">
                {dashboardMetrics.inProgress}
              </div>
              <p className="text-xs text-[#64748b] mt-1">заказов</p>
            </CardContent>
        </Card>
        </Link>
        <Link href="/manager/orders/review">
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-[#64748b]">
                На проверке
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#0f172a]">
                {dashboardMetrics.onReview}
              </div>
              <p className="text-xs text-[#64748b] mt-1">отчётов</p>
            </CardContent>
        </Card>
        </Link>
        <Card className="border-[#fef3c7] bg-[#fffbeb]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-[#92400e] flex items-center gap-1">
              <AlertTriangle className="h-4 w-4" />
              Зависшие по SLA
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#92400e]">
              {dashboardMetrics.slaOverdue}
            </div>
            <p className="text-xs text-[#64748b] mt-1">
              долго не взяты / на доработке
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Блок исполнители */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Исполнители</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl bg-[#f8f9fb] p-4">
              <p className="text-sm text-[#64748b]">Средний рейтинг</p>
              <p className="text-2xl font-bold text-[#0f172a]">
                {dashboardMetrics.executorsAvgRating}
              </p>
            </div>
            <div className="rounded-xl bg-[#f8f9fb] p-4">
              <p className="text-sm text-[#64748b]">Топ исполнители</p>
              <ul className="mt-2 space-y-1 text-sm font-medium text-[#0f172a]">
                {dashboardMetrics.topExecutors.map((name, i) => (
                  <li key={i}>{name}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl bg-[#fef2f2] p-4">
              <p className="text-sm text-[#64748b]">Проблемные</p>
              <ul className="mt-2 space-y-1 text-sm font-medium text-[#991b1b]">
                {dashboardMetrics.problemExecutors.map((name, i) => (
                  <li key={i}>{name}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl bg-[#f8f9fb] p-4">
              <p className="text-sm text-[#64748b]">Доля отказов по рынку</p>
              <p className="text-2xl font-bold text-[#0f172a]">
                {dashboardMetrics.marketRejectionRate}%
              </p>
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <Link href="/manager/executors">
              <Button variant="secondary">Перейти к списку</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
