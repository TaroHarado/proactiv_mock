"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GlobalFilters } from "@/components/admin/global-filters";
import { adminIntegrationsMock } from "@/data/mock";
import { Plug } from "lucide-react";

const STATUS_LABELS: Record<string, string> = {
  ok: "OK",
  issues: "Проблемы",
  down: "Down",
};

const STATUS_CLASS: Record<string, string> = {
  ok: "bg-[#16a34a]",
  issues: "bg-[#f59e0b]",
  down: "bg-[#dc2626]",
};

export default function AdminIntegrationsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#0f172a]">Интеграции и данные</h1>
      <GlobalFilters showCompany={false} showServiceType={false} showStatus={false} showExecutor={false} showManager={false} showPriority={false} showSlaOverdue={false} />

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Plug className="h-4 w-4" />
            Сервисы
          </CardTitle>
          <p className="text-sm text-[#64748b]">Dadata, НПД, СБИС, скрейперы Avito/Auto.ru/Drom. Статус: OK / проблемы / down, последние ошибки, количество за период</p>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {adminIntegrationsMock.map((s) => (
              <li key={s.id} className="flex items-center justify-between rounded-xl border border-[#e2e8f0] bg-white p-4">
                <div>
                  <p className="font-medium text-[#0f172a]">{s.name}</p>
                  {s.lastError && <p className="mt-1 text-sm text-[#dc2626]">{s.lastError}</p>}
                  <p className="mt-1 text-xs text-[#64748b]">Ошибок за период: {s.errorsCountPeriod}</p>
                </div>
                <Badge className={STATUS_CLASS[s.status]}>{STATUS_LABELS[s.status]}</Badge>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
