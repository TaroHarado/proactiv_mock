"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GlobalFilters } from "@/components/admin/global-filters";
import { UserCog, ExternalLink } from "lucide-react";

const managersMock = [
  { id: "m1", name: "Менеджер Сидорова", ordersCount: 18, tasksInQueue: 12, avgReviewHours: 8, reworkRate: 15, slaOverdue: 2 },
  { id: "m2", name: "Менеджер Иванов", ordersCount: 14, tasksInQueue: 8, avgReviewHours: 12, reworkRate: 22, slaOverdue: 3 },
];

export default function AdminManagersPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#0f172a]">Менеджеры</h1>
      <GlobalFilters />

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <UserCog className="h-4 w-4" />
            Нагрузка и качество управления
          </CardTitle>
          <p className="text-sm text-[#64748b]">Заказов ведёт, задач в очереди, ср. время проверки, доля отправок на доработку, просрочки по SLA</p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#e2e8f0] text-left text-[#64748b]">
                  <th className="pb-2 pr-4">Менеджер</th>
                  <th className="pb-2 pr-4">Заказов</th>
                  <th className="pb-2 pr-4">Задач в очереди</th>
                  <th className="pb-2 pr-4">Ср. проверка (ч)</th>
                  <th className="pb-2 pr-4">Доработки %</th>
                  <th className="pb-2 pr-4">SLA просрочено</th>
                  <th className="pb-2">Действия</th>
                </tr>
              </thead>
              <tbody>
                {managersMock.map((m) => (
                  <tr key={m.id} className="border-b border-[#e2e8f0]">
                    <td className="py-3 pr-4 font-medium text-[#0f172a]">{m.name}</td>
                    <td className="py-3 pr-4">{m.ordersCount}</td>
                    <td className="py-3 pr-4">{m.tasksInQueue}</td>
                    <td className="py-3 pr-4">{m.avgReviewHours}</td>
                    <td className="py-3 pr-4">{m.reworkRate}%</td>
                    <td className="py-3 pr-4">{m.slaOverdue}</td>
                    <td className="py-3">
                      <Link href="/manager/tasks">
                        <Button variant="ghost" size="sm" className="gap-1">
                          <ExternalLink className="h-3 w-3" /> Как менеджер
                        </Button>
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
