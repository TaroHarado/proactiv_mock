"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, FileText } from "lucide-react";
import { useState } from "react";

export default function SaleParamsPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const assetId = params.assetId as string;
  const fromPrep = searchParams.get("fromPrep") === "1";
  const scenarioId = searchParams.get("scenario") ?? "";
  const optionType = (searchParams.get("option") === "fix_and_percent" ? "fix_and_percent" : "percent_only") as "percent_only" | "fix_and_percent";

  const targetPrice = 2650000;
  const [tradeThreshold, setTradeThreshold] = useState(50000);
  const minPrice = targetPrice - tradeThreshold;
  const [ptsUploaded, setPtsUploaded] = useState(false);

  const handleLaunch = () => {
    router.push("/manager/orders/sale/sale2");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" className="gap-1 text-[#2563eb]" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
          Назад
        </Button>
        <h1 className="text-2xl font-bold text-[#0f172a]">Параметры продажи</h1>
      </div>

      <Card className="rounded-2xl border border-[#e2e8f0] bg-white shadow-[0_1px_3px_0_rgb(0_0_0_/_.05)]">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Целевая цена</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-semibold text-[#0f172a]">{targetPrice.toLocaleString("ru")} ₽</p>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border border-[#e2e8f0] bg-white shadow-[0_1px_3px_0_rgb(0_0_0_/_.05)]">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Порог торга</CardTitle>
          <p className="text-sm text-[#64748b]">Минимально допустимое снижение цены (может быть 0)</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#0f172a]">Порог торга, ₽</label>
            <Input
              type="number"
              value={tradeThreshold}
              onChange={(e) => setTradeThreshold(Number(e.target.value) || 0)}
              className="mt-1 max-w-[200px]"
            />
          </div>
          <p className="text-sm font-medium text-[#0f172a]">
            Минимально допустимая цена: <span className="text-[#2563eb]">{minPrice.toLocaleString("ru")} ₽</span>
          </p>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border border-[#e2e8f0] bg-white shadow-[0_1px_3px_0_rgb(0_0_0_/_.05)]">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">ПТС (обязательный шаг)</CardTitle>
          <p className="text-sm text-[#64748b]">Загрузите ПТС. После загрузки документ будет зафиксирован в карточке.</p>
        </CardHeader>
        <CardContent>
          <button
            type="button"
            onClick={() => setPtsUploaded(!ptsUploaded)}
            className="flex h-20 w-32 items-center justify-center gap-2 rounded-xl border border-dashed border-[#e2e8f0] bg-[#f8f9fb] hover:border-[#2563eb] hover:bg-[#eff6ff]"
          >
            <FileText className="h-8 w-8 text-[#94a3b8]" />
            {ptsUploaded ? "Загружено" : "Загрузить"}
          </button>
        </CardContent>
      </Card>

      <Button
        variant="primary"
        size="lg"
        className="w-full sm:w-auto"
        disabled={!ptsUploaded}
        onClick={handleLaunch}
      >
        Запустить продажу под ключ / Отправить на публикацию
      </Button>
    </div>
  );
}
