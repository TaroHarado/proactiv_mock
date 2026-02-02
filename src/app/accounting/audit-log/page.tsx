"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { accountingAuditLogMock } from "@/data/mock";
import { History } from "lucide-react";

export default function AccountingAuditLogPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-[#0f172a]">Журнал действий бухгалтера</h1>
        <Select className="w-40" defaultValue="all">
          <option value="all">Все объекты</option>
          <option value="company">Компания</option>
          <option value="order">Заказ</option>
          <option value="payout">Выплата</option>
        </Select>
      </div>
      <p className="text-sm text-[#64748b]">Дата/время, что сделано (подтвердил оплату / изменил баланс / обработал вывод / отметил документ), объект, кто сделал, комментарий.</p>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <History className="h-4 w-4" />
            Список действий
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {accountingAuditLogMock.map((e) => (
              <li key={e.id} className="flex flex-wrap items-center gap-2 rounded-xl bg-[#f8f9fb] px-4 py-3 text-sm">
                <span className="text-[#64748b]">{e.at.slice(0, 16)}</span>
                <span className="font-medium text-[#0f172a]">{e.action}</span>
                <span className="text-[#64748b]">{e.objectType}: {e.objectId}</span>
                <span className="text-[#64748b]">— {e.who}</span>
                {e.comment && <span className="text-[#64748b] italic">«{e.comment}»</span>}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
