"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GlobalFilters } from "@/components/admin/global-filters";
import { adminCompaniesMock } from "@/data/mock";
import { Building2, ExternalLink } from "lucide-react";
import { Suspense } from "react";

function CompaniesContent() {
  const searchParams = useSearchParams();
  const filterAtRisk = searchParams.get("filter") === "at_risk";
  const list = filterAtRisk ? adminCompaniesMock.filter((c) => c.isAtRisk) : adminCompaniesMock;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-[#0f172a]">Компании</h1>
        {filterAtRisk && <Badge className="bg-[#f59e0b]">В риске</Badge>}
      </div>
      <GlobalFilters />
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Список компаний
          </CardTitle>
          <p className="text-sm text-[#64748b]">Статус, активность, выручка, флаги «затухает» / «в риске»</p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#e2e8f0] text-left text-[#64748b]">
                  <th className="pb-2 pr-4">Компания</th>
                  <th className="pb-2 pr-4">Статус</th>
                  <th className="pb-2 pr-4">Заказов за период</th>
                  <th className="pb-2 pr-4">Последняя активность</th>
                  <th className="pb-2 pr-4">Выручка</th>
                  <th className="pb-2 pr-4">Флаги</th>
                  <th className="pb-2">Действия</th>
                </tr>
              </thead>
              <tbody>
                {list.map((c) => (
                  <tr key={c.id} className="border-b border-[#e2e8f0]">
                    <td className="py-3 pr-4 font-medium text-[#0f172a]">{c.name}</td>
                    <td className="py-3 pr-4">{c.statusLabel}</td>
                    <td className="py-3 pr-4">{c.ordersCount}</td>
                    <td className="py-3 pr-4 text-[#64748b]">{c.lastActivityAt.slice(0, 10)}</td>
                    <td className="py-3 pr-4">{c.revenuePeriod.toLocaleString("ru-RU")} ₽</td>
                    <td className="py-3 pr-4">
                      {c.isCooling && <Badge variant="secondary" className="mr-1">Затухает</Badge>}
                      {c.isAtRisk && <Badge className="bg-[#f59e0b]">В риске</Badge>}
                    </td>
                    <td className="py-3">
                      <Link href={`/admin/companies/${c.id}`}>
                        <Button variant="ghost" size="sm">Карточка</Button>
                      </Link>
                      <Link href="/customer" className="ml-1">
                        <Button variant="ghost" size="sm" className="gap-1">
                          <ExternalLink className="h-3 w-3" /> Как заказчик
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function AdminCompaniesPage() {
  return (
    <Suspense fallback={<div className="text-[#64748b] p-4">Загрузка…</div>}>
      <CompaniesContent />
    </Suspense>
  );
}
