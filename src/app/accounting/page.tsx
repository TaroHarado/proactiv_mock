"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { accountingKpiMock, accountingNotClosedMock } from "@/data/mock";
import { Wallet, CreditCard, FileText, Inbox } from "lucide-react";

export default function AccountingDashboardPage() {
  const k = accountingKpiMock;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-[#0f172a]">Финансовый дашборд</h1>
        <Select className="w-40" defaultValue="month">
          <option value="month">Месяц</option>
          <option value="quarter">Квартал</option>
          <option value="year">Год</option>
        </Select>
      </div>

      {/* 4.2 KPI-карточки */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-[#64748b] flex items-center gap-2">
              <Wallet className="h-4 w-4" />
              Подтверждённые поступления от заказчиков
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-[#16a34a]">{k.confirmedIncoming.toLocaleString("ru-RU")} ₽</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-[#64748b] flex items-center gap-2">
              <Wallet className="h-4 w-4" />
              Ожидаемые поступления (выставлено/ожидаем)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-[#0f172a]">{k.expectedIncoming.toLocaleString("ru-RU")} ₽</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-[#64748b] flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Подтверждённые выплаты исполнителям
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-[#0f172a]">{k.confirmedPayouts.toLocaleString("ru-RU")} ₽</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-[#64748b] flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Выплаты в работе (не обработано)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-[#f59e0b]">{k.payoutsInWork.toLocaleString("ru-RU")} ₽</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-[#64748b] flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Заказов с незакрытыми документами
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-[#0f172a]">{k.ordersUnclosedDocs}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-[#64748b] flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Заказов с неподтверждённой оплатой
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-[#0f172a]">{k.ordersUnconfirmedPayment}</p>
          </CardContent>
        </Card>
      </div>

      {/* 4.3 Быстрые очереди */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Inbox className="h-4 w-4" />
            Быстрые очереди
          </CardTitle>
          <p className="text-sm text-[#64748b]">Срочно закрыть сегодня · Зависло больше X дней</p>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4">
          <Link href="/accounting/not-closed?urgent=today">
            <Button variant="outline" size="sm">Срочно закрыть сегодня</Button>
          </Link>
          <Link href="/accounting/not-closed?stale=7">
            <Button variant="outline" size="sm">Зависло больше 7 дней</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
