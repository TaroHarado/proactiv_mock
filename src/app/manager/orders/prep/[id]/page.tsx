"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getPrepOrderById } from "@/data/mock";
import { ArrowLeft, CheckCircle, User, Clock } from "lucide-react";

export default function PrepOrderCardPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const order = getPrepOrderById(id);

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
    access_pending: "Ожидаем согласования доступа",
    in_progress: "В работе",
    on_review: "На проверке менеджером",
    completed: "Выполнен",
    on_rework: "На доработке",
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="gap-1 text-[#2563eb]"
        >
          <ArrowLeft className="h-4 w-4" />
          Назад
        </Button>
        <h1 className="text-2xl font-bold text-[#0f172a]">{order.assetName}</h1>
        <Badge variant="secondary">Обслуживание и ремонт</Badge>
        <Badge variant="outline">{order.packageLabel}</Badge>
        <Badge
          variant={
            order.status === "completed"
              ? "success"
              : order.status === "on_review"
                ? "warning"
                : "secondary"
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
          <p>
            <span className="text-[#64748b]">VIN:</span> {order.assetVin}
          </p>
          <p>
            <span className="text-[#64748b]">Адрес:</span> {order.address}
          </p>
          <p>
            <span className="text-[#64748b]">Пакет:</span> {order.packageLabel}
          </p>
        </CardContent>
      </Card>

      {order.accessAgreed === null && (
        <Card className="rounded-2xl border border-[#fef3c7] bg-[#fffbeb] shadow-[0_1px_3px_0_rgb(0_0_0_/_.05)]">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2 text-[#92400e]">
              <User className="h-5 w-5" />
              Согласование доступа
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-[#0f172a]">
              Назначен исполнитель <strong>{order.executorName}</strong>
              {order.executorPassportNote && (
                <span className="block mt-1 text-[#64748b]">{order.executorPassportNote}</span>
              )}
            </p>
            <p className="text-sm text-[#64748b]">
              Нажмите «Готово», когда доступ к активу согласован. После этого исполнитель сможет приступить к работам.
            </p>
            {order.accessPendingHours != null && order.accessPendingHours > 3 && (
              <p className="flex items-center gap-2 text-sm text-[#92400e]">
                <Clock className="h-4 w-4" />
                Ожидаем согласования более {order.accessPendingHours} ч
              </p>
            )}
            <Button variant="primary" className="gap-1">
              <CheckCircle className="h-4 w-4" />
              Готово
            </Button>
          </CardContent>
        </Card>
      )}

      {order.accessAgreed === true && (
        <Card className="rounded-2xl border border-[#dcfce7] bg-[#f0fdf4] p-4">
          <p className="flex items-center gap-2 text-sm font-medium text-[#166534]">
            <CheckCircle className="h-4 w-4" />
            Доступ согласован. Исполнитель приступил к работам.
          </p>
        </Card>
      )}

      {order.status === "completed" && (
        <>
          <Card className="rounded-2xl border border-[#e2e8f0] bg-white p-4">
            <CardTitle className="text-base">Результат</CardTitle>
            <CardContent className="pt-2">
              <p className="text-sm text-[#64748b]">
                Выполненные пункты, комментарии и вложения доступны в отчёте после принятия менеджером.
              </p>
            </CardContent>
          </Card>
          <Link href={`/manager/sale/${order.assetId}/start`}>
            <Button variant="secondary" className="gap-1">
              Перейти к продаже под ключ
            </Button>
          </Link>
        </>
      )}
    </div>
  );
}
