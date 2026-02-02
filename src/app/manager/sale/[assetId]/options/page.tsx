"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SALE_SCENARIOS, prepOrdersMock } from "@/data/mock";
import { ArrowLeft } from "lucide-react";

export default function SaleOptionsPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const assetId = params.assetId as string;
  const fromPrep = searchParams.get("fromPrep") === "1";
  const scenarioId = searchParams.get("scenario") as string | null;
  const prepOrder = prepOrdersMock.find((o) => o.assetId === assetId && o.status === "completed");
  const scenario = scenarioId ? SALE_SCENARIOS.find((s) => s.id === scenarioId) : null;
  const targetPrice = fromPrep && prepOrder ? 2650000 : scenario?.targetPrice ?? 2500000;

  const optionA = { type: "percent_only" as const, label: "Только процент", percent: 5, value: Math.round(targetPrice * 0.05) };
  const optionB = { type: "fix_and_percent" as const, label: "Фикс + процент", fix: 50000, percent: 3, value: 50000 + Math.round(targetPrice * 0.03) };

  const handleSelect = (type: "percent_only" | "fix_and_percent") => {
    router.push(`/manager/sale/${assetId}/params?fromPrep=${fromPrep ? "1" : ""}&scenario=${scenarioId ?? ""}&option=${type}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" className="gap-1 text-[#2563eb]" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
          Назад
        </Button>
        <h1 className="text-2xl font-bold text-[#0f172a]">Модуль продажи под ключ</h1>
      </div>

      <Card className="rounded-2xl border border-[#e2e8f0] bg-white p-4">
        <p className="text-sm text-[#64748b]">
          Целевая цена: <span className="font-medium text-[#0f172a]">{targetPrice.toLocaleString("ru")} ₽</span>
          {fromPrep && " (после предпродажной подготовки)"}
        </p>
      </Card>

      <p className="text-sm text-[#64748b]">Выберите вариант сотрудничества. Значения — мок от целевой цены.</p>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="rounded-2xl border border-[#e2e8f0] bg-white shadow-[0_1px_3px_0_rgb(0_0_0_/_.05)]">
          <CardHeader>
            <CardTitle className="text-base">Вариант A: Только процент</CardTitle>
            <p className="text-sm text-[#64748b]">{optionA.percent}% от цены продажи</p>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold text-[#0f172a]">{optionA.value.toLocaleString("ru")} ₽</p>
            <Button variant="primary" className="mt-4 w-full" onClick={() => handleSelect("percent_only")}>
              Выбрать
            </Button>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border border-[#e2e8f0] bg-white shadow-[0_1px_3px_0_rgb(0_0_0_/_.05)]">
          <CardHeader>
            <CardTitle className="text-base">Вариант B: Фикс + процент</CardTitle>
            <p className="text-sm text-[#64748b]">{optionB.fix.toLocaleString("ru")} ₽ + {optionB.percent}%</p>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold text-[#0f172a]">≈ {optionB.value.toLocaleString("ru")} ₽</p>
            <Button variant="secondary" className="mt-4 w-full" onClick={() => handleSelect("fix_and_percent")}>
              Выбрать
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
