"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  PREP_PACKAGES,
  getAuditState,
  getAuditCompletedForAsset,
  prepOrdersMock,
  type PrepPackage,
} from "@/data/mock";
import { ArrowLeft, Check, TrendingUp, Calendar, Wallet } from "lucide-react";

export default function PrepSelectPage() {
  const params = useParams();
  const router = useRouter();
  const assetId = params.assetId as string;
  const auditState = getAuditState(assetId);
  const auditCompleted = getAuditCompletedForAsset(assetId);

  const assetName = auditState?.order?.assetName ?? "Актив";
  const assetVin = auditState?.order?.assetVin ?? "";

  const handleOrder = (pkg: PrepPackage) => {
    const existing = prepOrdersMock.find((o) => o.assetId === assetId);
    if (existing) {
      router.push(`/manager/orders/prep/${existing.id}`);
      return;
    }
    router.push(`/manager/orders/prep/prep1`);
  };

  if (!auditState && !auditCompleted) {
    return (
      <div className="space-y-6">
        <Link href="/manager/orders/new">
          <Button variant="ghost" size="sm" className="gap-1 text-[#2563eb]">
            <ArrowLeft className="h-4 w-4" />
            Назад
          </Button>
        </Link>
        <Card className="rounded-2xl border border-[#e2e8f0] bg-white p-6">
          <CardTitle className="text-base">Сначала нужен аудит</CardTitle>
          <CardContent className="pt-4">
            <p className="text-sm text-[#64748b]">
              Для заказа «Обслуживание и ремонт» по этому активу сначала выполняется аудит.
              После завершения аудита вы сможете выбрать пакет предпродажной подготовки.
            </p>
            <Link href="/manager/orders/new">
              <Button variant="primary" className="mt-4">
                К заказам
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/manager/orders/card/${assetId}`}>
          <Button variant="ghost" size="sm" className="gap-1 text-[#2563eb]">
            <ArrowLeft className="h-4 w-4" />
            Назад
          </Button>
        </Link>
        <h1 className="text-2xl font-bold text-[#0f172a]">Выбор варианта предпродажной подготовки</h1>
      </div>

      <Card className="rounded-2xl border border-[#e2e8f0] bg-white p-4">
        <p className="text-sm text-[#64748b]">
          <span className="font-medium text-[#0f172a]">{assetName}</span>
          {assetVin ? ` · VIN ${assetVin}` : ""}
        </p>
      </Card>

      <p className="text-sm text-[#64748b]">
        Заказчик видит только 3 пакета. Система рекомендует пакет по ROE (главный показатель).
      </p>

      <div className="grid gap-4 md:grid-cols-3">
        {PREP_PACKAGES.map((pkg) => (
          <Card
            key={pkg.id}
            className={`rounded-2xl border bg-white shadow-[0_1px_3px_0_rgb(0_0_0_/_.05)] ${
              pkg.recommended ? "border-[#2563eb] ring-1 ring-[#2563eb]/20" : "border-[#e2e8f0]"
            }`}
          >
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{pkg.label}</CardTitle>
                {pkg.recommended && (
                  <Badge variant="default" className="gap-1">
                    <TrendingUp className="h-3 w-3" />
                    Рекомендуем
                  </Badge>
                )}
              </div>
              <p className="text-sm text-[#64748b]">{pkg.description}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 text-[#0f172a]">
                <TrendingUp className="h-4 w-4 text-[#2563eb]" />
                <span className="font-semibold">ROE {pkg.roePercent}%</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-[#64748b]">
                <Calendar className="h-4 w-4" />
                Снижение срока экспозиции: {pkg.exposureDaysReduction} дн.
              </div>
              <div className="flex items-center gap-2 text-sm text-[#64748b]">
                <Wallet className="h-4 w-4" />
                Средние расходы OPEX: {pkg.opexAmount.toLocaleString("ru")} ₽
              </div>
              <Button
                variant={pkg.recommended ? "primary" : "secondary"}
                className="w-full gap-1"
                onClick={() => handleOrder(pkg)}
              >
                <Check className="h-4 w-4" />
                Заказать
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
