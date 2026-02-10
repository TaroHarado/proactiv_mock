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
import { InspectionWizard } from "@/components/inspection/inspection-wizard";
import { MaintenanceWizard } from "@/components/maintenance/maintenance-wizard";
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
    return inspectionOrder ? <InspectionWizard order={inspectionOrder} /> : null;
  }

  if (isMaintenance) {
    return (
      <MaintenanceWizard
        order={order as any}
        prepOrder={prepOrder ?? undefined}
        prepChecklist={prepChecklist}
      />
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
      <Card className="rounded-2xl border border-[#e2e8f0] bg-white p-4">
        <p className="text-sm text-[#64748b]">Выполните шаги по типу услуги.</p>
      </Card>
      <Button variant="secondary" className="gap-1">
        <MessageCircle className="h-4 w-4" />
        Написать менеджеру
      </Button>
    </div>
  );
}
