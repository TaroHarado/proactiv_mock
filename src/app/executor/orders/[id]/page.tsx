"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { executorActiveOrdersMock, getSaleOrderById, getBoardOrderById, getCompletedOrderById } from "@/data/mock";
import { getAuditState, getPrepOrderById, getPrepChecklist, getInspectionOrderById } from "@/data/mock";
import { AuditWizard } from "@/components/audit/audit-wizard";
import { ArrowLeft, MessageCircle, CheckCircle, Camera, FileText, ChevronDown, ChevronUp, MapPin, Clock } from "lucide-react";

export default function ExecutorOrderDetailPage() {
  const params = useParams();
  const id = params.id as string;
  // Продажа под ключ ведётся только менеджером (публикация, прикрепление ссылок). У исполнителя таких заказов нет.
  const saleOrder = getSaleOrderById(id);
  const order = executorActiveOrdersMock.find((o) => o.id === id && o.serviceType !== "sale");
  const auditState = getAuditState(id);
  const prepOrder = getPrepOrderById(id);
  const prepChecklist = prepOrder ? getPrepChecklist(id) : [];
  const [preReportOpen, setPreReportOpen] = useState(false);
  const [activeAccess, setActiveAccess] = useState(prepOrder?.accessAgreed ?? false);

  if (saleOrder) {
    return (
      <div className="space-y-6">
        <p className="text-[#64748b]">
          Заказ «Продажа под ключ» ведётся менеджером: публикация объявлений и прикрепление ссылок. В кабинете исполнителя такие заказы не отображаются.
        </p>
        <Link href="/executor/orders">
          <Button variant="secondary">К списку заказов</Button>
        </Link>
      </div>
    );
  }

  if (!order) {
    const boardOrder = getBoardOrderById(id);
    const completedOrder = getCompletedOrderById(id);

    if (boardOrder) {
      return (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-4">
            <Link href="/executor/board">
              <Button variant="ghost" size="sm" className="gap-1 text-[var(--blue-50)]">
                <ArrowLeft className="h-4 w-4" />
                Назад к доске
              </Button>
            </Link>
            <Badge variant="secondary">Просмотр с доски</Badge>
          </div>
          <Card className={boardOrder.isFollowUpForSameExecutor ? "overflow-hidden border-[#2563eb]/40 bg-[#eff6ff]" : "overflow-hidden"}>
            <CardHeader>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                {boardOrder.isFollowUpForSameExecutor && (
                  <Badge variant="default">Ваш заказ</Badge>
                )}
              </div>
              <CardTitle className="text-lg">{boardOrder.serviceLabel}</CardTitle>
              <div className="flex items-center gap-1 text-sm text-[var(--gray-icon)]">
                <MapPin className="h-4 w-4 shrink-0" />
                {boardOrder.address}
              </div>
              {boardOrder.requiresAccessAgreement && (
                <p className="text-xs text-[var(--gray-icon)]">Требуется согласование доступа заказчиком</p>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                <span className="text-[var(--gray-icon)]">Выплата исполнителю</span>
                <span className="font-semibold text-[var(--black)]">
                  {boardOrder.payoutAmount.toLocaleString("ru")} ₽
                </span>
              </div>
              <div className="flex items-center gap-1 text-sm text-[var(--gray-icon)]">
                <Clock className="h-4 w-4 shrink-0" />
                Висит: {boardOrder.minutesPending < 60 ? `${boardOrder.minutesPending} мин` : `${Math.floor(boardOrder.minutesPending / 60)} ч`} · Отказов: {boardOrder.rejectionsCount}
              </div>
              <p className="text-sm text-[var(--gray-icon)]">
                Режим ознакомления. Чтобы принять заказ, вернитесь на доску и нажмите «Принять».
              </p>
              <Link href="/executor/board">
                <Button variant="primary">На доску заказов</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      );
    }

    if (completedOrder) {
      return (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-4">
            <Link href="/executor/history">
              <Button variant="ghost" size="sm" className="gap-1 text-[var(--blue-50)]">
                <ArrowLeft className="h-4 w-4" />
                В историю
              </Button>
            </Link>
            <Badge variant="outline">Завершён</Badge>
          </div>
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle className="text-lg">{completedOrder.serviceLabel}</CardTitle>
              <p className="text-sm text-[var(--black)] font-medium">{completedOrder.assetName}</p>
              <p className="text-sm text-[var(--gray-icon)]">Выполнено: {completedOrder.completedAt}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                <span className="text-[var(--gray-icon)]">Принято с первого раза</span>
                {completedOrder.firstTimeAccepted ? (
                  <Badge variant="success">Да</Badge>
                ) : (
                  <Badge variant="secondary">Были доработки</Badge>
                )}
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                <span className="text-[var(--gray-icon)]">Начисление</span>
                <span className="font-semibold text-[var(--black)]">
                  {completedOrder.amount.toLocaleString("ru")} ₽
                </span>
              </div>
              {completedOrder.reportUrl && (
                <a href={completedOrder.reportUrl} target="_blank" rel="noopener noreferrer">
                  <Button variant="secondary" size="sm" className="gap-1">
                    <FileText className="h-4 w-4" />
                    Отчёт
                  </Button>
                </a>
              )}
              <Link href="/executor/history">
                <Button variant="primary">К истории</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <p className="text-[var(--gray-icon)]">Заказ не найден.</p>
        <Link href="/executor/orders">
          <Button variant="secondary">К списку</Button>
        </Link>
      </div>
    );
  }

  const isAudit = order.serviceType === "audit";
  const isMaintenance = order.serviceType === "maintenance";
  const isPrep = !!prepOrder;
  const inspectionOrder = getInspectionOrderById(id);
  const isInspection = order.serviceType === "inspection" && !!inspectionOrder;

  if (isAudit) {
    return (
      <AuditWizard
        orderId={id}
        order={{
          assetName: order.assetName,
          assetVin: auditState?.order.assetVin,
          address: order.address,
          city: auditState?.order.city ?? "",
          status: order.status,
          statusLabel: order.statusLabel,
          accessAgreed: order.accessAgreed,
          accessPendingHours: (order as { accessPendingHours?: number }).accessPendingHours,
        }}
      />
    );
  }

  const allDone = prepChecklist.length > 0 && prepChecklist.every((i) => i.done);

  if (isInspection) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/executor/orders">
            <Button variant="ghost" size="sm" className="gap-1 text-[#2563eb]">
              <ArrowLeft className="h-4 w-4" />
              Назад
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-[#0f172a]">{order.assetName}</h1>
          <Badge variant="secondary">{order.serviceLabel}</Badge>
        </div>
        <Card className="rounded-2xl border border-[#e2e8f0] bg-white shadow-[0_1px_3px_0_rgb(0_0_0_/_.05)]">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Статус</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-medium text-[#0f172a]">{order.statusLabel}</p>
            {order.accessAgreed && (
              <p className="mt-2 flex items-center gap-2 text-sm text-[#16a34a]">
                <CheckCircle className="h-4 w-4" />
                Доступ согласован
              </p>
            )}
          </CardContent>
        </Card>
        <Card className="rounded-2xl border border-[#e2e8f0] bg-white shadow-[0_1px_3px_0_rgb(0_0_0_/_.05)]">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Инспекция — 3 блока</CardTitle>
            <p className="text-sm text-[#64748b]">
              Старт: доступ получен? Блок 1: идентификация + 6 обзорных + VIN фото. Блок 2: дефекты по схеме (тип + оси/ходовая для спецтехники). Блок 3: техчек (запуск, приборка, одометр, подкапотное, течи) с фото.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-xl border border-[#e2e8f0] bg-[#f8f9fb] p-3">
              <p className="text-sm font-medium text-[#0f172a]">Блок 1 — Идентификация и фото</p>
              <p className="text-xs text-[#64748b]">VIN-фото, 6 обзорных фото</p>
              <div className="mt-2 flex gap-2">
                <div className="h-16 w-20 rounded-lg border border-dashed border-[#e2e8f0] bg-white flex items-center justify-center">
                  <Camera className="h-6 w-6 text-[#94a3b8]" />
                </div>
                <div className="grid grid-cols-3 gap-1">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="h-12 w-14 rounded border border-dashed border-[#e2e8f0] bg-white flex items-center justify-center">
                      <Camera className="h-4 w-4 text-[#94a3b8]" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="rounded-xl border border-[#e2e8f0] bg-[#f8f9fb] p-3">
              <p className="text-sm font-medium text-[#0f172a]">Блок 2 — Дефекты по схеме</p>
              <p className="text-xs text-[#64748b]">Тип актива, оси/ходовая для спецтехники. Упрощённо как в аудите.</p>
            </div>
            <div className="rounded-xl border border-[#e2e8f0] bg-[#f8f9fb] p-3">
              <p className="text-sm font-medium text-[#0f172a]">Блок 3 — Техчек</p>
              <p className="text-xs text-[#64748b]">Запуск, приборка, одометр, подкапотное, течи с фото.</p>
            </div>
            <div className="flex gap-2 pt-2">
              <Button variant="outline" size="sm">Предпросмотр</Button>
              <Button variant="primary">Завершить</Button>
              <Button variant="secondary" className="gap-1">
                <MessageCircle className="h-4 w-4" />
                Написать менеджеру
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/executor/orders">
          <Button variant="ghost" size="sm" className="gap-1 text-[#2563eb]">
            <ArrowLeft className="h-4 w-4" />
            Назад
          </Button>
        </Link>
        <h1 className="text-2xl font-bold text-[#0f172a]">{order.assetName}</h1>
        <Badge variant="secondary">{order.serviceLabel}</Badge>
      </div>

      <Card className="rounded-2xl border border-[#e2e8f0] bg-white shadow-[0_1px_3px_0_rgb(0_0_0_/_.05)]">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Статус</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="font-medium text-[#0f172a]">{order.statusLabel}</p>
          {isPrep && (
            <p className="text-sm text-[#64748b]">
              Актив получен: {activeAccess ? "да" : "нет"}
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

      {isPrep && (
        <Card className="rounded-2xl border border-[#e2e8f0] bg-white shadow-[0_1px_3px_0_rgb(0_0_0_/_.05)]">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Чек-лист (задачи из аудита)</CardTitle>
            <p className="text-sm text-[#64748b]">
              Выполняйте сверху вниз. На каждую задачу: фото, комментарий, при необходимости видео.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-3">
              {prepChecklist.map((item) => (
                <li
                  key={item.id}
                  className="flex items-start gap-3 rounded-xl border border-[#e2e8f0] bg-[#f8f9fb] p-3"
                >
                  <span
                    className={`mt-0.5 h-5 w-5 shrink-0 rounded border ${
                      item.done ? "border-[#16a34a] bg-[#16a34a]" : "border-[#e2e8f0]"
                    }`}
                  >
                    {item.done && <CheckCircle className="h-3 w-3 text-white" />}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className={`text-sm font-medium ${item.done ? "text-[#64748b] line-through" : "text-[#0f172a]"}`}>
                      {item.label}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <div className="flex h-12 w-16 items-center justify-center rounded-lg border border-dashed border-[#e2e8f0] bg-white">
                        <Camera className="h-5 w-5 text-[#94a3b8]" />
                      </div>
                      <Input
                        placeholder="Комментарий"
                        className="max-w-xs text-sm"
                        defaultValue={item.comment}
                      />
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            {prepChecklist.length === 0 && (
              <p className="text-sm text-[#64748b]">Чек-лист подтягивается из аудита. Задач пока нет.</p>
            )}

            <div className="border-t border-[#e2e8f0] pt-4">
              <Button
                variant="outline"
                size="sm"
                className="gap-1"
                onClick={() => setPreReportOpen(!preReportOpen)}
              >
                {preReportOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                Предотчет
              </Button>
              {preReportOpen && (
                <div className="mt-3 rounded-xl border border-[#e2e8f0] bg-[#f8f9fb] p-4">
                  <p className="text-sm font-medium text-[#0f172a]">Все задачи и статусы</p>
                  <ul className="mt-2 space-y-1 text-sm text-[#64748b]">
                    {prepChecklist.map((i) => (
                      <li key={i.id}>
                        {i.done ? "✓" : "○"} {i.label}
                        {i.comment && ` — ${i.comment}`}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-2 text-sm text-[#64748b]">Все комментарии и вложения (фото/видео)</p>
                  <div className="mt-2 flex gap-2">
                    <div className="flex h-14 w-14 items-center justify-center rounded-lg border border-dashed border-[#e2e8f0] bg-white">
                      <FileText className="h-6 w-6 text-[#94a3b8]" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {isMaintenance && !isPrep && (
        <Card className="rounded-2xl border border-[#e2e8f0] bg-white shadow-[0_1px_3px_0_rgb(0_0_0_/_.05)]">
          <CardHeader>
            <CardTitle className="text-base">Чек-лист</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
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
          </CardContent>
        </Card>
      )}

      {!isAudit && !isMaintenance && (
        <Card className="rounded-2xl border border-[#e2e8f0] bg-white p-4">
          <p className="text-sm text-[#64748b]">Выполните шаги по типу услуги.</p>
        </Card>
      )}

      <div className="flex gap-2">
        {isPrep && (
          <Button variant="primary" disabled={!allDone}>
            Завершить
          </Button>
        )}
        {!isPrep && isMaintenance && (
          <Button variant="primary">Сдать на проверку</Button>
        )}
        {!isAudit && (
          <Button variant="secondary" className="gap-1">
            <MessageCircle className="h-4 w-4" />
            Написать менеджеру
          </Button>
        )}
      </div>
    </div>
  );
}
