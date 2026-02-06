"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Package, Bell } from "lucide-react";

const materialsMock = [
  { id: "m1", orderId: "prep2", orderType: "Обслуживание", companyName: "ИП Петров", amount: 45000, status: "invoice_pending" as const, responsible: "Менеджер Иванов" },
  { id: "m2", orderId: "prep3", orderType: "Обслуживание", companyName: "ООО Флот", amount: 120000, status: "paid" as const, responsible: "Менеджер Сидорова" },
];

const STATUS_LABELS: Record<string, string> = {
  invoice_pending: "Счёт не получен",
  sent_to_pay: "Отправлено на оплату",
  paid: "Оплачено",
  closed: "Закрыто документами",
};

export default function AccountingMaterialsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#0f172a]">Материалы/запчасти (счета поставщиков)</h1>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Package className="h-4 w-4" />
            Список по счетам поставщиков
          </CardTitle>
          <p className="text-sm text-[#64748b]">К заказу, сумма, статус. Подтвердить оплату, прикрепить подтверждение, эскалация менеджеру.</p>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {materialsMock.map((m) => (
              <li key={m.id} className="flex flex-wrap items-center justify-between rounded-xl border border-[#e2e8f0] bg-white p-4">
                <div>
                  <p className="font-medium text-[#0f172a]">{m.companyName} · {m.orderType}</p>
                  <p className="text-sm text-[#64748b]">Заказ {m.orderId} · {m.amount.toLocaleString("ru-RU")} ₽</p>
                  <p className="text-xs text-[#94a3b8]">Ответственный: {m.responsible}</p>
                </div>
                <Badge className="bg-[#64748b]">{STATUS_LABELS[m.status]}</Badge>
                <div className="flex gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                  <Button variant="outline" size="sm">Подтвердить оплату</Button>
                  <Button variant="secondary" size="sm" className="gap-1">
                    <Bell className="h-3 w-3" /> Эскалация
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
