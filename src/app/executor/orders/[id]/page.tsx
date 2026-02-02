"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { executorActiveOrdersMock } from "@/data/mock";
import { ArrowLeft, MessageCircle, Upload, CheckCircle } from "lucide-react";

export default function ExecutorOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const order = executorActiveOrdersMock.find((o) => o.id === id);

  if (!order) {
    return (
      <div className="space-y-6">
        <p className="text-[#64748b]">Заказ не найден.</p>
        <Link href="/executor/orders">
          <Button variant="secondary">К списку</Button>
        </Link>
      </div>
    );
  }

  const isAudit = order.serviceType === "audit";
  const isMaintenance = order.serviceType === "maintenance";

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
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
        <Badge variant="secondary">{order.serviceLabel}</Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Статус</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="font-medium text-[#0f172a]">{order.statusLabel}</p>
          {order.status === "access_pending" && (
            <p className="mt-2 text-sm text-[#64748b]">
              По заявке назначен исполнитель. Заказчик должен подтвердить доступ. Выезд возможен после согласования.
            </p>
          )}
          {order.accessAgreed && (
            <p className="mt-2 flex items-center gap-2 text-sm text-[#16a34a]">
              <CheckCircle className="h-4 w-4" />
              Доступ согласован
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Чек-лист</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isAudit && (
            <>
              <p className="text-sm text-[#64748b]">
                Блок 1: Идентификация и фотографирование актива. Блок 2: Визуальная фиксация экстерьера/интерьера + измерения. Блок 3: Техническое состояние + компьютерная диагностика.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <span className="h-4 w-4 rounded border border-[#e2e8f0]" />
                  Блок 1 — идентификация, обзорные фото, VIN
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-4 w-4 rounded border border-[#e2e8f0]" />
                  Блок 2 — дефекты, толщиномер, шины
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-4 w-4 rounded border border-[#e2e8f0]" />
                  Блок 3 — АКБ, подкапотное, загрузить файл диагностики
                </li>
              </ul>
              <Button variant="primary" size="sm" className="gap-1">
                <Upload className="h-4 w-4" />
                Загрузить отчёт диагностики
              </Button>
            </>
          )}
          {isMaintenance && (
            <>
              <p className="text-sm text-[#64748b]">
                Чек-лист задач из аудита. Выполняйте сверху вниз. На каждую задачу: фото / комментарий / видео.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <span className="h-4 w-4 rounded border border-[#e2e8f0]" />
                  Замена масла ДВС
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-4 w-4 rounded border border-[#e2e8f0]" />
                  Проверка тормозной системы
                </li>
              </ul>
              <Button variant="primary" size="sm">Предотчет</Button>
            </>
          )}
          {!isAudit && !isMaintenance && (
            <p className="text-sm text-[#64748b]">Выполните шаги по типу услуги.</p>
          )}
        </CardContent>
      </Card>

      <div className="flex gap-2">
        <Button variant="primary">Сдать на проверку</Button>
        <Button variant="secondary" className="gap-1">
          <MessageCircle className="h-4 w-4" />
          Написать менеджеру
        </Button>
      </div>
    </div>
  );
}
