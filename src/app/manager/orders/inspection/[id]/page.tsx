"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getInspectionOrderById } from "@/data/mock";
import { ArrowLeft, CheckCircle, Eye } from "lucide-react";

export default function InspectionOrderCardPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const order = getInspectionOrderById(id);

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
    new: "Новый",
    access_pending: "Ожидаем доступа",
    in_progress: "В работе",
    on_review: "На проверке менеджером",
    completed: "Завершён",
    on_rework: "На доработке",
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.back()} className="gap-1 text-[#2563eb]">
          <ArrowLeft className="h-4 w-4" />
          Назад
        </Button>
        <h1 className="text-2xl font-bold text-[#0f172a]">{order.brandModel}</h1>
        <Badge variant="secondary">Инспекция</Badge>
        <Badge
          variant={
            order.status === "completed"
              ? "success"
              : order.status === "on_review"
                ? "warning"
                : "outline"
          }
        >
          {statusLabels[order.status] ?? order.statusLabel}
        </Badge>
      </div>

      <Card className="rounded-2xl border border-[#e2e8f0] bg-white shadow-[0_1px_3px_0_rgb(0_0_0_/_.05)]">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Информация о заказе</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p><span className="text-[#64748b]">Тип актива:</span> {order.assetTypeLabel}</p>
          <p><span className="text-[#64748b]">VIN:</span> {order.vin}</p>
          <p><span className="text-[#64748b]">Договор:</span> {order.contractNumber}</p>
          <p><span className="text-[#64748b]">Адрес:</span> {order.address}</p>
          <p><span className="text-[#64748b]">Контакт:</span> {order.contact}, {order.phone}</p>
          <p><span className="text-[#64748b]">Стоимость:</span> {order.costTotal.toLocaleString("ru")} ₽</p>
          {order.executorName && (
            <p><span className="text-[#64748b]">Исполнитель:</span> {order.executorName}</p>
          )}
        </CardContent>
      </Card>

      {order.status === "completed" && (
        <Card className="rounded-2xl border border-[#e2e8f0] bg-white p-4">
          <CardTitle className="text-base flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Отчёт инспекции
          </CardTitle>
          <CardContent className="pt-2">
            <p className="text-sm text-[#64748b]">
              Блок 1: идентификация + 6 обзорных + VIN фото. Блок 2: дефекты по схеме (тип актива, оси/ходовая для спецтехники). Блок 3: техчек (запуск, приборка, одометр, подкапотное, течи) с фото.
            </p>
            <p className="mt-2 text-sm font-medium text-[#0f172a]">Отчёт доступен заказчику.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
