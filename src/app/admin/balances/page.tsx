"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GlobalFilters } from "@/components/admin/global-filters";
import { adminBalancesMock } from "@/data/mock";
import { PiggyBank } from "lucide-react";

export default function AdminBalancesPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#0f172a]">Балансы компаний</h1>
      <GlobalFilters showServiceType={false} showStatus={false} showExecutor={false} showManager={false} showSlaOverdue={false} />

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <PiggyBank className="h-4 w-4" />
            Список компаний с балансами
          </CardTitle>
          <p className="text-sm text-[#64748b]">Баланс, зарезервировано, доступно, последние изменения</p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#e2e8f0] text-left text-[#64748b]">
                  <th className="pb-2 pr-4">Компания</th>
                  <th className="pb-2 pr-4">Баланс</th>
                  <th className="pb-2 pr-4">Зарезервировано</th>
                  <th className="pb-2 pr-4">Доступно</th>
                  <th className="pb-2 pr-4">Изменение</th>
                  <th className="pb-2">Действия</th>
                </tr>
              </thead>
              <tbody>
                {adminBalancesMock.map((b) => (
                  <tr key={b.companyId} className="border-b border-[#e2e8f0]">
                    <td className="py-3 pr-4 font-medium text-[#0f172a]">{b.companyName}</td>
                    <td className="py-3 pr-4">{b.balance.toLocaleString("ru-RU")} ₽</td>
                    <td className="py-3 pr-4">{b.reserved != null ? `${b.reserved.toLocaleString("ru-RU")} ₽` : "—"}</td>
                    <td className="py-3 pr-4">{b.available != null ? `${b.available.toLocaleString("ru-RU")} ₽` : "—"}</td>
                    <td className="py-3 pr-4 text-[#64748b]">{b.lastChangedAt.slice(0, 16)}</td>
                    <td className="py-3">
                      <Button variant="outline" size="sm">Изменить</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Ручное изменение баланса</CardTitle>
          <p className="text-sm text-[#64748b]">Увеличить/уменьшить баланс, комментарий обязателен. Попадает в журнал.</p>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4 items-end">
          <div>
            <label className="block text-sm text-[#64748b] mb-1">Компания</label>
            <select className="h-10 rounded-xl border border-[#e2e8f0] px-3 text-sm w-48">
              {adminBalancesMock.map((b) => (
                <option key={b.companyId} value={b.companyId}>{b.companyName}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-[#64748b] mb-1">Сумма</label>
            <Input type="number" placeholder="0" className="w-32" />
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm text-[#64748b] mb-1">Комментарий</label>
            <Input placeholder="Основание" className="w-full" />
          </div>
          <Button size="sm">Применить</Button>
        </CardContent>
      </Card>
    </div>
  );
}
