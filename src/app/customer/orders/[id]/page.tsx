"use client";

import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  customerOrdersMock,
  stockAssetsMock,
} from "@/data/mock";

export default function CustomerOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const order = customerOrdersMock.find((o) => o.id === id);

  if (!order) {
    return (
      <div className="space-y-4">
        <p className="text-[#64748b]">Заказ не найден.</p>
        <Link href="/customer/orders">
          <Button variant="outline">К списку заказов</Button>
        </Link>
      </div>
    );
  }

  const needsAccessConfirm = order.status === "access_pending" && !order.accessAgreed;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/customer/orders">
          <Button variant="outline" size="sm">
            ← Заказы
          </Button>
        </Link>
        <h1 className="text-2xl font-bold text-[#0f172a]">
          Заказ {order.id} — {order.serviceLabel}
        </h1>
        <Badge
          className={
            order.status === "completed"
              ? "bg-[#16a34a]"
              : order.status === "access_pending"
              ? "bg-[#f59e0b]"
              : "bg-[#2563eb]"
          }
        >
          {order.statusLabel}
        </Badge>
      </div>

      {/* Согласование доступа (G3) */}
      {needsAccessConfirm && order.executorName && (
        <Card className="border-[#f59e0b] bg-[#fffbeb]">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              Ожидаем согласования доступа
            </CardTitle>
            <p className="text-sm text-[#64748b]">
              По заявке назначен {order.executorName}.
              {order.executorPassportNote && ` ${order.executorPassportNote}.`}{" "}
              Необходимо предоставить доступ. Нажмите «Готово», когда доступ
              согласован.
            </p>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => {
                // Мок: помечаем доступ согласованным
                router.refresh();
              }}
            >
              Готово
            </Button>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Состав заказа</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm">
            <span className="text-[#64748b]">Активы:</span>{" "}
            {order.assetNames.join(", ")}
          </p>
          <p className="text-sm">
            <span className="text-[#64748b]">Адрес:</span> {order.address},{" "}
            {order.city}
          </p>
          {order.executorName && (
            <p className="text-sm">
              <span className="text-[#64748b]">Исполнитель:</span>{" "}
              {order.executorName}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Заказчик видит отчёт (блоки 1–3) и КП (блок 5), НЕ видит блок 4 */}
      <Card>
        <CardHeader>
          <CardTitle>Отчёт аудита (блоки 1–3)</CardTitle>
          <p className="text-sm text-[#64748b]">
            Идентификация, визуальная фиксация, техсостояние и диагностика.
          </p>
        </CardHeader>
        <CardContent>
          {order.status === "completed" || order.status === "on_review" ? (
            <p className="text-sm text-[#0f172a]">
              Отчёт доступен. (Мок: содержимое отчёта подгружается с API.)
            </p>
          ) : (
            <p className="text-sm text-[#64748b]">
              Отчёт будет доступен после сдачи исполнителем и проверки
              менеджером.
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>КП для заказчика (блок 5)</CardTitle>
          <p className="text-sm text-[#64748b]">
            Коммерческое предложение: список работ и итоговая сумма. Внутренние
            цены (блок 4) не отображаются.
          </p>
        </CardHeader>
        <CardContent>
          {order.status === "completed" ? (
            <p className="text-sm text-[#0f172a]">
              КП сформировано. (Мок: список работ и сумма подгружаются с API.)
            </p>
          ) : (
            <p className="text-sm text-[#64748b]">
              КП будет сформировано менеджером после проверки отчёта и внесения
              стоимости материалов.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
