"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GlobalFilters } from "@/components/admin/global-filters";
import { Clock, AlertTriangle } from "lucide-react";

export default function AdminTimingsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#0f172a]">Тайминги и аномалии</h1>
      <GlobalFilters />

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Тайминги по услугам
          </CardTitle>
          <p className="text-sm text-[#64748b]">time-to-accept, time-to-access-confirm, execution time, manager review time, полный цикл. Разрезы: по исполнителям, менеджерам, компаниям</p>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-[#64748b]">(Таблица/диаграмма по типам услуг и разрезам — мок.)</p>
          <div className="mt-4 rounded-xl border border-[#e2e8f0] bg-[#f8f9fb] p-4 text-sm">
            <p className="font-medium text-[#0f172a]">Инспекция:</p>
            <p className="text-[#64748b]">Ср. time-to-accept: 2 ч · execution: 24 ч · review: 4 ч</p>
            <p className="font-medium text-[#0f172a] mt-2">Аудит:</p>
            <p className="text-[#64748b]">Ср. time-to-accept: 4 ч · execution: 72 ч · review: 12 ч</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-[#f59e0b]" />
            Аномалии — кто делает слишком долго
          </CardTitle>
          <p className="text-sm text-[#64748b]">Заказы с завышенным execution/review time; компании с зависшим доступом; исполнители с системно завышенными таймингами</p>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center justify-between rounded-xl bg-[#f8f9fb] px-4 py-2">
              <span>ord3 — Hyundai Porter · review time 48 ч (типично 12)</span>
              <a href={`/manager/orders/card/ord3`} className="text-[#2563eb] hover:underline">Заказ</a>
            </li>
            <li className="flex items-center justify-between rounded-xl bg-[#f8f9fb] px-4 py-2">
              <span>Петр Петров · execution по аудиту 120 ч (типично 72)</span>
              <a href="/admin/executors" className="text-[#2563eb] hover:underline">Исполнители</a>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
