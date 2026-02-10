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
      <p className="text-sm text-[#64748b]">
        Управление лимитами сотрудников на запрос услуг. В этой версии прототипа номинальный счёт
        не показывается исполнителям.
      </p>

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
