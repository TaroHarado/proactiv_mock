"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GlobalFilters } from "@/components/admin/global-filters";
import { adminAuditLogMock } from "@/data/mock";
import { History } from "lucide-react";

export default function AdminAuditLogPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#0f172a]">Журнал действий админа</h1>
      <GlobalFilters showCompany={true} showServiceType={false} showStatus={false} showExecutor={false} showManager={false} showSlaOverdue={false} />

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <History className="h-4 w-4" />
            Список админ-действий
          </CardTitle>
          <p className="text-sm text-[#64748b]">Фильтр по дате и объекту (компания/заказ/пользователь). Что сделано, кто сделал, комментарий</p>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {adminAuditLogMock.map((e) => (
              <li key={e.id} className="flex flex-wrap items-center gap-2 rounded-xl bg-[#f8f9fb] px-4 py-3 text-sm">
                <span className="text-[#64748b]">{e.at.slice(0, 16)}</span>
                <span className="font-medium text-[#0f172a]">{e.action}</span>
                <span className="text-[#64748b]">{e.objectType}: {e.objectLabel}</span>
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
