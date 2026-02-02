"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GlobalFilters } from "@/components/admin/global-filters";
import { adminFunnelMock } from "@/data/mock";
import { GitBranch } from "lucide-react";

export default function AdminOperationsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#0f172a]">Операционка и SLA</h1>
      <GlobalFilters />
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <GitBranch className="h-4 w-4" />
            Воронка по статусам
          </CardTitle>
          <p className="text-sm text-[#64748b]">Количество, среднее время, p90, просрочено по SLA. Кнопка «провалиться в список заказов»</p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#e2e8f0] text-left text-[#64748b]">
                  <th className="pb-2 pr-4">Этап</th>
                  <th className="pb-2 pr-4">Заказов</th>
                  <th className="pb-2 pr-4">Ср. время (ч)</th>
                  <th className="pb-2 pr-4">p90 (ч)</th>
                  <th className="pb-2 pr-4">Просрочено SLA</th>
                  <th className="pb-2">Действия</th>
                </tr>
              </thead>
              <tbody>
                {adminFunnelMock.map((s) => (
                  <tr key={s.stage} className="border-b border-[#e2e8f0]">
                    <td className="py-3 pr-4 font-medium text-[#0f172a]">{s.stageLabel}</td>
                    <td className="py-3 pr-4">{s.count}</td>
                    <td className="py-3 pr-4">{s.avgTimeHours}</td>
                    <td className="py-3 pr-4">{s.p90TimeHours}</td>
                    <td className="py-3 pr-4">{s.slaOverdueCount}</td>
                    <td className="py-3">
                      <Link href={`/admin/orders?stage=${s.stage}`}>
                        <Button variant="outline" size="sm">Список заказов</Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
