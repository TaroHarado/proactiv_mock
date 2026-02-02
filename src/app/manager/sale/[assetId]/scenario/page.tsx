"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SALE_SCENARIOS, getAuditState } from "@/data/mock";
import { ArrowLeft, Check, TrendingUp, Calendar, Wallet } from "lucide-react";

export default function SaleScenarioPage() {
  const params = useParams();
  const router = useRouter();
  const assetId = params.assetId as string;
  const auditState = getAuditState(assetId);
  const assetName = auditState?.order?.assetName ?? "Актив";

  const handleSelect = (scenarioId: string) => {
    router.push(`/manager/sale/${assetId}/options?scenario=${scenarioId}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/manager/orders/card/${assetId}`}>
          <Button variant="ghost" size="sm" className="gap-1 text-[#2563eb]">
            <ArrowLeft className="h-4 w-4" />
            Назад
          </Button>
        </Link>
        <h1 className="text-2xl font-bold text-[#0f172a]">Выбор сценария продажи</h1>
      </div>

      <Card className="rounded-2xl border border-[#e2e8f0] bg-white p-4">
        <p className="text-sm text-[#64748b]">
          <span className="font-medium text-[#0f172a]">{assetName}</span>
        </p>
      </Card>

      <p className="text-sm text-[#64748b]">
        Предпродажной подготовки не было. Выберите сценарий — система рекомендует по ROE.
      </p>

      <div className="grid gap-4 md:grid-cols-3">
        {SALE_SCENARIOS.map((s) => (
          <Card
            key={s.id}
            className={`rounded-2xl border bg-white shadow-[0_1px_3px_0_rgb(0_0_0_/_.05)] ${
              s.recommended ? "border-[#2563eb] ring-1 ring-[#2563eb]/20" : "border-[#e2e8f0]"
            }`}
          >
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{s.label}</CardTitle>
                {s.recommended && (
                  <Badge variant="default" className="gap-1">
                    <TrendingUp className="h-3 w-3" />
                    Рекомендуем
                  </Badge>
                )}
              </div>
              <p className="text-sm text-[#64748b]">{s.description}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 text-[#0f172a]">
                <TrendingUp className="h-4 w-4 text-[#2563eb]" />
                <span className="font-semibold">ROE {s.roePercent}%</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-[#64748b]">
                <Calendar className="h-4 w-4" />
                Снижение срока экспозиции: {s.exposureDaysReduction} дн.
              </div>
              <div className="flex items-center gap-2 text-sm text-[#64748b]">
                <Wallet className="h-4 w-4" />
                OPEX: {s.opexAmount.toLocaleString("ru")} ₽
              </div>
              <p className="text-sm font-medium text-[#0f172a]">
                Целевая цена: {s.targetPrice.toLocaleString("ru")} ₽
              </p>
              <Button
                variant={s.recommended ? "primary" : "secondary"}
                className="w-full gap-1"
                onClick={() => handleSelect(s.id)}
              >
                <Check className="h-4 w-4" />
                Выбрать
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
