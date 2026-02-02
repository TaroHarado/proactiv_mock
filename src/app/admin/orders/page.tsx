"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GlobalFilters } from "@/components/admin/global-filters";
import { mockOrders } from "@/data/mock";
import { FileText } from "lucide-react";

const SERVICE_LABELS: Record<string, string> = {
  inspection: "Инспекция",
  audit: "Аудит",
  maintenance: "Обслуживание/ремонт",
  sale: "Продажа под ключ",
};

export default function AdminOrdersPage() {
  const rows = mockOrders.slice(0, 25);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#0f172a]">Заказы (сквозной реестр)</h1>
      <GlobalFilters />
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Таблица заказов
          </CardTitle>
          <p className="text-sm text-[#64748b]">Тип услуги, компания, статус, исполнитель/менеджер, приоритет, время в статусе, сумма, маркер «аномально долго»</p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#e2e8f0] text-left text-[#64748b]">
                  <th className="pb-2 pr-4">Услуга</th>
                  <th className="pb-2 pr-4">Актив / заказ</th>
                  <th className="pb-2 pr-4">Статус</th>
                  <th className="pb-2 pr-4">Исполнитель</th>
                  <th className="pb-2 pr-4">Приоритет</th>
                  <th className="pb-2 pr-4">Сумма</th>
                  <th className="pb-2">Действия</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((o) => (
                  <tr key={o.id} className="border-b border-[#e2e8f0]">
                    <td className="py-3 pr-4">{SERVICE_LABELS[o.serviceType] ?? o.serviceType}</td>
                    <td className="py-3 pr-4 font-medium text-[#0f172a]">{o.assetName}</td>
                    <td className="py-3 pr-4">
                      <Badge className={o.slaOverdue ? "bg-[#f59e0b]" : ""}>{o.status}</Badge>
                      {o.slaOverdue && <span className="ml-1 text-[#f59e0b]">SLA</span>}
                    </td>
                    <td className="py-3 pr-4 text-[#64748b]">{o.executorName ?? "—"}</td>
                    <td className="py-3 pr-4">{o.priority ?? "normal"}</td>
                    <td className="py-3 pr-4">{o.amount ? `${(o.amount / 1000).toFixed(0)}k ₽` : "—"}</td>
                    <td className="py-3">
                      <Link href={`/manager/orders/card/${o.id}`}>
                        <Button variant="ghost" size="sm">Карточка</Button>
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
