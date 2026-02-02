"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { adminCompaniesMock } from "@/data/mock";
import { Building2, ExternalLink, FileText } from "lucide-react";

export default function AdminCompanyDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const company = adminCompaniesMock.find((c) => c.id === id);

  if (!company) {
    return (
      <div className="space-y-4">
        <p className="text-[#64748b]">Компания не найдена.</p>
        <Link href="/admin/companies">
          <Button variant="outline">К списку</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-4">
        <Link href="/admin/companies">
          <Button variant="outline" size="sm">← Компании</Button>
        </Link>
        <h1 className="text-2xl font-bold text-[#0f172a]">{company.name}</h1>
        {company.isAtRisk && <Badge className="bg-[#f59e0b]">В риске</Badge>}
        {company.isCooling && <Badge variant="secondary">Затухает</Badge>}
        <Link href="/customer">
          <Button size="sm" className="gap-1">
            <ExternalLink className="h-4 w-4" /> Открыть как заказчик
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Сводка
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm"><span className="text-[#64748b]">Статус:</span> {company.statusLabel}</p>
          <p className="text-sm"><span className="text-[#64748b]">Заказов за период:</span> {company.ordersCount}</p>
          <p className="text-sm"><span className="text-[#64748b]">Последняя активность:</span> {company.lastActivityAt}</p>
          <p className="text-sm"><span className="text-[#64748b]">Последний заказ:</span> {company.lastOrderCreatedAt}</p>
          <p className="text-sm"><span className="text-[#64748b]">Выручка за период:</span> {company.revenuePeriod.toLocaleString("ru-RU")} ₽</p>
          {company.riskReasons.length > 0 && (
            <p className="text-sm text-[#f59e0b]">Причины риска: {company.riskReasons.join("; ")}</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Заказы по типам</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-1 text-sm">
            {Object.entries(company.ordersByType).map(([type, count]) => (
              <li key={type}>{type}: {count}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Текущие заказы</CardTitle>
          <p className="text-sm text-[#64748b]">В работе / на проверке / на доработке</p>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-[#64748b]">(Список подгружается по компании.)</p>
          <Link href="/admin/orders">
            <Button variant="outline" size="sm" className="mt-2">Все заказы</Button>
          </Link>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Незакрытые документы/оплаты</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-[#64748b]">(При наличии — список.)</p>
        </CardContent>
      </Card>
    </div>
  );
}
