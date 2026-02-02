"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { payoutRequestsMock } from "@/data/mock";
import { CreditCard } from "lucide-react";

const STATUS_LABELS: Record<string, string> = {
  processing: "В обработке",
  approved: "Обработано",
  rejected: "Отклонено",
};

export default function AccountingPayoutsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#0f172a]">Выплаты исполнителям (заявки на вывод)</h1>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Список заявок на вывод
          </CardTitle>
          <p className="text-sm text-[#64748b]">Исполнитель, сумма, дата, статус. При отклонении — комментарий обязателен. Ссылка на историю начислений.</p>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {payoutRequestsMock.map((p) => (
              <li key={p.id} className="flex flex-wrap items-center justify-between rounded-xl border border-[#e2e8f0] bg-white p-4">
                <div>
                  <p className="font-medium text-[#0f172a]">Заявка #{p.id}</p>
                  <p className="text-sm text-[#64748b]">{p.amount.toLocaleString("ru-RU")} ₽ · {p.createdAt}</p>
                </div>
                <Badge className={p.status === "approved" ? "bg-[#16a34a]" : p.status === "rejected" ? "bg-[#dc2626]" : "bg-[#f59e0b]"}>{STATUS_LABELS[p.status]}</Badge>
                <div className="flex gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                  <Button variant="outline" size="sm">Обработано</Button>
                  <Button variant="outline" size="sm">Отклонить</Button>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
