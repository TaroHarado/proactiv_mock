"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GlobalFilters } from "@/components/admin/global-filters";
import { mockExecutors } from "@/data/mock";
import { Users, ExternalLink } from "lucide-react";

export default function AdminExecutorsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#0f172a]">Исполнители</h1>
      <GlobalFilters showCompany={false} showServiceType={false} showStatus={false} />

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Users className="h-4 w-4" />
            Список исполнителей
          </CardTitle>
          <p className="text-sm text-[#64748b]">Рейтинг, качество/скорость/% отказов, доля доработок, тайминги по услугам, нагрузка, заработано, заявки на вывод</p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#e2e8f0] text-left text-[#64748b]">
                  <th className="pb-2 pr-4">Исполнитель</th>
                  <th className="pb-2 pr-4">Рейтинг</th>
                  <th className="pb-2 pr-4">Отказов %</th>
                  <th className="pb-2 pr-4">Активных заказов</th>
                  <th className="pb-2">Действия</th>
                </tr>
              </thead>
              <tbody>
                {mockExecutors.map((e) => (
                  <tr key={e.id} className="border-b border-[#e2e8f0]">
                    <td className="py-3 pr-4 font-medium text-[#0f172a]">{e.name}</td>
                    <td className="py-3 pr-4">{e.rating}</td>
                    <td className="py-3 pr-4">{e.rejectionRate}%</td>
                    <td className="py-3 pr-4">{e.activeOrders}</td>
                    <td className="py-3">
                      <Link href={`/manager/executors/${e.id}`}>
                        <Button variant="ghost" size="sm">Профиль</Button>
                      </Link>
                      <Link href="/executor" className="ml-1">
                        <Button variant="ghost" size="sm" className="gap-1">
                          <ExternalLink className="h-3 w-3" /> Как исполнитель
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
