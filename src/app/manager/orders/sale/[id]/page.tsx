"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { getSaleOrderById } from "@/data/mock";
import { ArrowLeft, ExternalLink, AlertTriangle, CheckCircle } from "lucide-react";
import { useState } from "react";

const PLATFORMS = [
  { key: "avito" as const, label: "Avito" },
  { key: "autoRu" as const, label: "Auto.ru" },
  { key: "drom" as const, label: "Drom" },
];

export default function SaleOrderCardPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const order = getSaleOrderById(id);
  const [finalPrice, setFinalPrice] = useState<number | "">(order?.finalPrice ?? "");

  if (!order) {
    return (
      <div className="space-y-6">
        <p className="text-[#64748b]">Заказ не найден.</p>
        <Button variant="secondary" onClick={() => router.back()}>
          Назад
        </Button>
      </div>
    );
  }

  const statusLabels: Record<string, string> = {
    awaiting_publication: "Ожидает публикации",
    in_sale: "В продаже",
    sold: "Реализован",
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.back()} className="gap-1 text-[#2563eb]">
          <ArrowLeft className="h-4 w-4" />
          Назад
        </Button>
        <h1 className="text-2xl font-bold text-[#0f172a]">{order.assetName}</h1>
        <Badge variant="secondary">Продажа под ключ</Badge>
        <Badge
          variant={
            order.status === "sold"
              ? "success"
              : order.status === "in_sale"
                ? "default"
                : "outline"
          }
        >
          {statusLabels[order.status] ?? order.statusLabel}
        </Badge>
      </div>

      <Card className="rounded-2xl border border-[#e2e8f0] bg-white shadow-[0_1px_3px_0_rgb(0_0_0_/_.05)]">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Параметры продажи</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>
            <span className="text-[#64748b]">Целевая цена:</span> {order.targetPrice.toLocaleString("ru")} ₽
          </p>
          <p>
            <span className="text-[#64748b]">Порог торга:</span> {order.tradeThreshold.toLocaleString("ru")} ₽
          </p>
          <p>
            <span className="text-[#64748b]">Минимальная цена:</span> {order.minPrice.toLocaleString("ru")} ₽
          </p>
          <p>
            <span className="text-[#64748b]">ПТС:</span> {order.ptsUploaded ? "Загружен" : "—"}
          </p>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border border-[#e2e8f0] bg-white shadow-[0_1px_3px_0_rgb(0_0_0_/_.05)]">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Публикация на площадках</CardTitle>
          <p className="text-sm text-[#64748b]">
            Ссылка №1 (публичная) — обязательная. Ссылка №2 (кабинет/доступ) — опционально. После первой публичной ссылки статус «В продаже».
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {PLATFORMS.map(({ key, label }) => {
            const p = order[key];
            return (
              <div key={key} className="rounded-xl border border-[#e2e8f0] bg-[#f8f9fb] p-4">
                <p className="font-medium text-[#0f172a]">{label}</p>
                <div className="mt-2 grid gap-2 text-sm sm:grid-cols-2">
                  <div>
                    <span className="text-[#64748b]">Ссылка №1:</span>{" "}
                    {p?.link1 ? (
                      <a href={p.link1} target="_blank" rel="noopener noreferrer" className="text-[#2563eb] hover:underline">
                        {p.link1.slice(0, 40)}…
                      </a>
                    ) : (
                      <span className="text-[#94a3b8]">—</span>
                    )}
                  </div>
                  <div>
                    <span className="text-[#64748b]">Ссылка №2:</span>{" "}
                    {p?.link2 ?? <span className="text-[#94a3b8]">н/д</span>}
                  </div>
                </div>
                {p?.link1 && (
                  <div className="mt-2 flex flex-wrap gap-2 text-xs text-[#64748b]">
                    {p.views != null && <span>Просмотры: {p.views}</span>}
                    {p.likes != null && <span>Лайки: {p.likes}</span>}
                    {p.calls != null && <span>Звонки: {p.calls}</span>}
                    {p.messages != null && <span>Сообщения: {p.messages}</span>}
                    {p.price != null && <span>Цена: {p.price.toLocaleString("ru")} ₽</span>}
                    {p.adStatus && <span>Статус: {p.adStatus}</span>}
                    {p.updatedAt && <span>Обновлено: {p.updatedAt}</span>}
                    {p.metricsAvailable === false && (
                      <span className="flex items-center gap-1 text-[#92400e]">
                        <AlertTriangle className="h-3 w-3" />
                        Метрики н/д
                      </span>
                    )}
                  </div>
                )}
                {!p?.link1 && (
                  <Link href="/manager/tasks">
                    <Button variant="outline" size="sm" className="mt-2">
                      Добавить ссылку (задача менеджеру)
                    </Button>
                  </Link>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>

      {order.status === "in_sale" && (
        <Card className="rounded-2xl border border-[#e2e8f0] bg-white shadow-[0_1px_3px_0_rgb(0_0_0_/_.05)]">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Завершение продажи</CardTitle>
            <p className="text-sm text-[#64748b]">
              Менеджер вручную подтверждает факт продажи: вводит финальную цену. Актив уходит в «Реализованные».
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#0f172a]">Финальная цена продажи, ₽</label>
              <Input
                type="number"
                value={finalPrice}
                onChange={(e) => setFinalPrice(e.target.value ? Number(e.target.value) : "")}
                className="mt-1 max-w-[200px]"
                placeholder="2650000"
              />
            </div>
            <Button variant="primary" className="gap-1">
              <CheckCircle className="h-4 w-4" />
              Зафиксировать продажу
            </Button>
          </CardContent>
        </Card>
      )}

      {order.status === "sold" && order.finalPrice != null && (
        <Card className="rounded-2xl border border-[#dcfce7] bg-[#f0fdf4] p-4">
          <p className="flex items-center gap-2 font-medium text-[#166534]">
            <CheckCircle className="h-5 w-5" />
            Реализовано. Финальная цена: {order.finalPrice.toLocaleString("ru")} ₽
          </p>
          <p className="mt-1 text-sm text-[#64748b]">Заказчик видит финальный результат.</p>
        </Card>
      )}
    </div>
  );
}
