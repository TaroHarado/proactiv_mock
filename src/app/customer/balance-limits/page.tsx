"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  customerNominalAccountMock,
  customerEmployeesMock,
} from "@/data/mock";
import { Wallet, FileText, Users } from "lucide-react";

export default function CustomerBalanceLimitsPage() {
  const acc = customerNominalAccountMock;
  const [limits, setLimits] = useState<Record<string, number>>(
    customerEmployeesMock.reduce((o, e) => ({ ...o, [e.id]: e.limit }), {})
  );
  const totalLimits = Object.values(limits).reduce((s, v) => s + v, 0);
  const canSave = totalLimits <= acc.balance;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#0f172a]">Баланс и лимиты</h1>
      <p className="text-sm text-[#64748b]">Номинальный счёт (остаток, реквизиты), договор и акт сверки. Управление лимитами сотрудников. При выставлении лимитов сумма списывается с номинального счёта.</p>

      {/* Номинальный счёт */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Wallet className="h-4 w-4" />
            Номинальный счёт
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-xl bg-[#f8f9fb] p-4">
            <p className="text-sm text-[#64748b]">Остаток</p>
            <p className="text-2xl font-bold text-[#0f172a]">{acc.balance.toLocaleString("ru-RU")} ₽</p>
          </div>
          <p className="text-sm text-[#64748b]">{acc.requisites}</p>
          <div className="flex gap-2">
            <a href={acc.contractUrl ?? "#"}>
              <Button variant="outline" size="sm">Договор</Button>
            </a>
            <a href={acc.reconciliationActUrl ?? "#"}>
              <Button variant="outline" size="sm">Акт сверки</Button>
            </a>
          </div>
        </CardContent>
      </Card>

      {/* Сотрудники и лимиты */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Users className="h-4 w-4" />
            Сотрудники и лимиты
          </CardTitle>
          <p className="text-sm text-[#64748b]">Установите лимит (сумма, которую сотрудник может тратить). Сохраните — сумма спишется с номинального счёта. Нельзя выставить лимиты больше остатка.</p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#e2e8f0] text-left text-[#64748b]">
                  <th className="pb-2 pr-4">Сотрудник</th>
                  <th className="pb-2 pr-4">Текущий лимит</th>
                  <th className="pb-2 pr-4">Остаток</th>
                  <th className="pb-2">Новый лимит, ₽</th>
                </tr>
              </thead>
              <tbody>
                {customerEmployeesMock.map((e) => (
                  <tr key={e.id} className="border-b border-[#e2e8f0]">
                    <td className="py-3 pr-4 font-medium text-[#0f172a]">{e.fullName}</td>
                    <td className="py-3 pr-4">{e.limit.toLocaleString("ru-RU")} ₽</td>
                    <td className="py-3 pr-4">{e.limitRemaining.toLocaleString("ru-RU")} ₽</td>
                    <td className="py-3">
                      <Input
                        type="number"
                        value={limits[e.id] ?? e.limit}
                        onChange={(ev) => setLimits((prev) => ({ ...prev, [e.id]: Number(ev.target.value) || 0 }))}
                        className="w-36"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-sm text-[#64748b]">
            Сумма лимитов: {totalLimits.toLocaleString("ru-RU")} ₽. Остаток на счёте: {acc.balance.toLocaleString("ru-RU")} ₽.
            {!canSave && <span className="text-[#dc2626]"> Лимиты превышают остаток. Уменьшите лимиты.</span>}
          </p>
          <Button className="mt-4" size="sm" disabled={!canSave}>
            Сохранить
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
