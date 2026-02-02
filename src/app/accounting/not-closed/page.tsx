"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { accountingNotClosedMock } from "@/data/mock";
import { Inbox, Bell } from "lucide-react";

export default function AccountingNotClosedPage() {
  const byCategory = accountingNotClosedMock.reduce<Record<string, typeof accountingNotClosedMock>>((acc, n) => {
    const key = n.category;
    if (!acc[key]) acc[key] = [];
    acc[key].push(n);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#0f172a]">Очередь «Не закрыто»</h1>
      <p className="text-sm text-[#64748b]">Главный рабочий экран. Категории: исполнители (счёт/акт/выплата), заказчики (счёт/оплата/акт), материалы.</p>

      {Object.entries(byCategory).map(([category, items]) => (
        <Card key={category}>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Inbox className="h-4 w-4" />
              {items[0]?.categoryLabel ?? category}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {items.map((n) => (
                <li key={n.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-[#f8f9fb] px-4 py-3">
                  <div>
                    <p className="font-medium text-[#0f172a]">{n.companyName} · {n.orderType}</p>
                    <p className="text-sm text-[#64748b]">{n.whatUnclosed}</p>
                    <p className="text-xs text-[#94a3b8]">Ответственный: {n.responsible} · {n.daysPending} дн.</p>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/manager/orders/card/${n.orderId}`}>
                      <Button variant="outline" size="sm">Карточка (финансы)</Button>
                    </Link>
                    <Button variant="secondary" size="sm" className="gap-1">
                      <Bell className="h-3 w-3" /> Пнуть
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
