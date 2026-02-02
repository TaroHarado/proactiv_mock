"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GlobalFilters } from "@/components/admin/global-filters";
import { adminKpiMock, accountingNotClosedMock } from "@/data/mock";
import { Wallet, FileText } from "lucide-react";

export default function AdminFinancePage() {
  const k = adminKpiMock;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#0f172a]">Финансы и закрывашки</h1>
      <GlobalFilters />

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Wallet className="h-4 w-4" />
            Финансовая сводка
          </CardTitle>
          <p className="text-sm text-[#64748b]">Выручка, выплаты, материалы, дельта. Разрезы по услугам, компаниям, приоритетным заказам</p>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-4">
          <div className="rounded-xl bg-[#f8f9fb] p-4">
            <p className="text-sm text-[#64748b]">Выручка за период</p>
            <p className="text-xl font-bold text-[#0f172a]">{k.revenuePeriod.toLocaleString("ru-RU")} ₽</p>
          </div>
          <div className="rounded-xl bg-[#f8f9fb] p-4">
            <p className="text-sm text-[#64748b]">Выплаты исполнителям</p>
            <p className="text-xl font-bold text-[#0f172a]">{k.payoutsPeriod.toLocaleString("ru-RU")} ₽</p>
          </div>
          <div className="rounded-xl bg-[#f8f9fb] p-4">
            <p className="text-sm text-[#64748b]">Материалы/запчасти</p>
            <p className="text-xl font-bold text-[#0f172a]">{k.materialsPeriod.toLocaleString("ru-RU")} ₽</p>
          </div>
          <div className="rounded-xl bg-[#eff6ff] p-4">
            <p className="text-sm text-[#2563eb]">Дельта/маржа</p>
            <p className="text-xl font-bold text-[#2563eb]">{k.marginTarget.toLocaleString("ru-RU")} ₽</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Реестр «НЕ закрыто»
          </CardTitle>
          <p className="text-sm text-[#64748b]">Выполнено без счета/акта; заказчику не выставлено; материалы не закрыты. Строка → карточка заказа</p>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {accountingNotClosedMock.map((n) => (
              <li key={n.id} className="flex items-center justify-between rounded-xl bg-[#f8f9fb] px-4 py-3">
                <span className="text-sm font-medium text-[#0f172a]">{n.companyName} · {n.orderType}</span>
                <span className="text-sm text-[#64748b]">{n.whatUnclosed} · {n.daysPending} дн.</span>
                <Link href={`/manager/orders/card/${n.orderId}`}>
                  <Button variant="outline" size="sm">Карточка</Button>
                </Link>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Заявки на вывод</CardTitle>
          <p className="text-sm text-[#64748b]">Список заявок, статус, комментарий при отклонении</p>
        </CardHeader>
        <CardContent>
          <Link href="/accounting">
            <Button variant="outline" size="sm">Перейти в кабинет бухгалтера</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
