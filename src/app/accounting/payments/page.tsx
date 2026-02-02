"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select } from "@/components/ui/select";
import { Wallet } from "lucide-react";

const paymentsMock = [
  { id: "p1", companyName: "ООО Лизинг Альфа", period: "2025-02", amount: 450000, purpose: "Заказы ord1, ord2", status: "confirmed" as const },
  { id: "p2", companyName: "АО ТрансЛогист", period: "2025-02", amount: 180000, purpose: "Заказ ord3", status: "pending" as const },
];

export default function AccountingPaymentsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-[#0f172a]">Оплаты заказчиков (поступления)</h1>
        <Select className="w-40" defaultValue="month">
          <option value="month">Месяц</option>
          <option value="quarter">Квартал</option>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Wallet className="h-4 w-4" />
            Реестр поступлений
          </CardTitle>
          <p className="text-sm text-[#64748b]">Компания, период, сумма, назначение, статус подтверждения</p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#e2e8f0] text-left text-[#64748b]">
                  <th className="pb-2 pr-4">Компания</th>
                  <th className="pb-2 pr-4">Период</th>
                  <th className="pb-2 pr-4">Сумма</th>
                  <th className="pb-2 pr-4">Назначение</th>
                  <th className="pb-2">Статус</th>
                </tr>
              </thead>
              <tbody>
                {paymentsMock.map((p) => (
                  <tr key={p.id} className="border-b border-[#e2e8f0]">
                    <td className="py-3 pr-4 font-medium text-[#0f172a]">{p.companyName}</td>
                    <td className="py-3 pr-4">{p.period}</td>
                    <td className="py-3 pr-4">{p.amount.toLocaleString("ru-RU")} ₽</td>
                    <td className="py-3 pr-4">{p.purpose}</td>
                    <td className="py-3">
                      <Badge className={p.status === "confirmed" ? "bg-[#16a34a]" : "bg-[#f59e0b]"}>{p.status === "confirmed" ? "Подтверждено" : "Не подтверждено"}</Badge>
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
