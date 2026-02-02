"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  getManagerTaskById,
  getAuditState,
  getPrepOrderById,
  getPrepChecklist,
  getSaleOrderById,
  getInspectionOrderById,
  type ManagerTask,
  type ManagerTaskType,
  type InternalEstimateBlock4,
  type CommercialOfferBlock5,
} from "@/data/mock";
import { ArrowLeft, ExternalLink, Check, MessageCircle, Send, Clock } from "lucide-react";
import { useState } from "react";

const STATUS_LABELS_MAP: Record<string, string> = {
  new: "Новая",
  in_progress: "В работе",
  done: "Выполнено",
  waiting_clarification: "Нужны уточнения",
};

const PRIORITY_LABELS_MAP: Record<string, string> = {
  high: "Высокий",
  normal: "Обычный",
};

export default function ManagerTaskDetailPage() {
  const params = useParams();
  const router = useRouter();
  const taskId = params.taskId as string;
  const task = getManagerTaskById(taskId);
  const [qaScore, setQaScore] = useState(0);
  const [qaComment, setQaComment] = useState("");
  const [clarificationComment, setClarificationComment] = useState("");

  if (!task) {
    return (
      <div className="space-y-6">
        <p className="text-[#64748b]">Задача не найдена.</p>
        <Link href="/manager/tasks">
          <Button variant="secondary">К очереди задач</Button>
        </Link>
      </div>
    );
  }

  const prepOrder = getPrepOrderById(task.orderId);
  const saleOrder = getSaleOrderById(task.orderId);
  const inspectionOrder = getInspectionOrderById(task.orderId);
  const orderUrl = prepOrder
    ? `/manager/orders/prep/${task.orderId}`
    : saleOrder
      ? `/manager/orders/sale/${task.orderId}`
      : inspectionOrder
        ? `/manager/orders/inspection/${task.orderId}`
        : `/manager/orders/card/${task.orderId}?tab=${task.orderTab}`;
  const auditState = getAuditState(task.orderId);
  const prepChecklist = prepOrder ? getPrepChecklist(task.orderId) : [];
  const b4 = auditState?.block4;
  const b5 = auditState?.block5;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.back()} className="gap-1 text-[#2563eb]">
          <ArrowLeft className="h-4 w-4" />
          Назад
        </Button>
        <h1 className="text-2xl font-bold text-[#0f172a]">{task.typeLabel}</h1>
        <Badge variant={task.status === "done" ? "success" : task.status === "in_progress" ? "default" : "secondary"}>
          {STATUS_LABELS_MAP[task.status]}
        </Badge>
        <Badge variant={task.priority === "high" ? "destructive" : "outline"}>
          {PRIORITY_LABELS_MAP[task.priority]}
        </Badge>
        <span className="flex items-center gap-1 text-sm text-[#64748b]">
          <Clock className="h-4 w-4" />
          {task.dueLabel}
        </span>
      </div>

      <Card className="rounded-2xl border border-[#e2e8f0] bg-white shadow-[0_1px_3px_0_rgb(0_0_0_/_.05)]">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Заказ</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm text-[#0f172a]">
            <span className="text-[#64748b]">Актив:</span> {task.assetName}
          </p>
          <p className="text-sm text-[#0f172a]">
            <span className="text-[#64748b]">Услуга:</span> {task.serviceLabel}
          </p>
          <p className="text-sm text-[#0f172a]">
            <span className="text-[#64748b]">ID заказа:</span> {task.orderId}
          </p>
          <Link href={orderUrl}>
            <Button variant="primary" size="sm" className="gap-1 mt-2">
              <ExternalLink className="h-4 w-4" />
              Открыть заказ
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Контент по типу задачи */}
      <TaskContent
        task={task}
        auditState={auditState}
        prepOrder={prepOrder}
        prepChecklist={prepChecklist}
        saleOrder={saleOrder}
        inspectionOrder={inspectionOrder}
        b4={b4}
        b5={b5}
        qaScore={qaScore}
        setQaScore={setQaScore}
        qaComment={qaComment}
        setQaComment={setQaComment}
        clarificationComment={clarificationComment}
        setClarificationComment={setClarificationComment}
        orderUrl={orderUrl}
      />
    </div>
  );
}

function TaskContent({
  task,
  auditState,
  prepOrder,
  prepChecklist,
  saleOrder,
  inspectionOrder,
  b4,
  b5,
  qaScore,
  setQaScore,
  qaComment,
  setQaComment,
  clarificationComment,
  setClarificationComment,
  orderUrl,
}: {
  task: ManagerTask;
  auditState: ReturnType<typeof getAuditState>;
  prepOrder: ReturnType<typeof getPrepOrderById>;
  prepChecklist: { id: string; label: string; done: boolean; comment?: string }[];
  saleOrder: ReturnType<typeof getSaleOrderById>;
  inspectionOrder: ReturnType<typeof getInspectionOrderById>;
  b4: InternalEstimateBlock4 | undefined;
  b5: CommercialOfferBlock5 | undefined;
  qaScore: number;
  setQaScore: (v: number) => void;
  qaComment: string;
  setQaComment: (v: string) => void;
  clarificationComment: string;
  setClarificationComment: (v: string) => void;
  orderUrl: string;
}) {
  const type = task.type as ManagerTaskType;

  // Prep: проверить результат предпродажной подготовки
  if (type === "prep_check_result" && prepOrder) {
    return (
      <Card className="rounded-2xl border border-[#e2e8f0] bg-white shadow-[0_1px_3px_0_rgb(0_0_0_/_.05)]">
        <CardHeader>
          <CardTitle className="text-base">Результат предпродажной подготовки</CardTitle>
          <p className="text-sm text-[#64748b]">
            Все задачи, комментарии и вложения от исполнителя.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <ul className="space-y-2">
            {prepChecklist.map((item) => (
              <li key={item.id} className="flex items-center gap-2 rounded-xl border border-[#e2e8f0] px-3 py-2 text-sm">
                <span className={item.done ? "text-[#16a34a]" : "text-[#64748b]"}>
                  {item.done ? "✓" : "○"}
                </span>
                <span className={item.done ? "line-through text-[#64748b]" : "font-medium text-[#0f172a]"}>{item.label}</span>
                {item.comment && <span className="text-[#64748b]">— {item.comment}</span>}
              </li>
            ))}
          </ul>
          <p className="text-sm text-[#64748b]">Вложения (фото/видео) — в отчёте исполнителя.</p>
          <div className="rounded-xl border border-[#e2e8f0] bg-[#f8f9fb] p-4">
            <p className="mb-2 text-sm font-medium text-[#0f172a]">Комментарий при возврате на доработку (обязателен)</p>
            <Input
              placeholder="Причина возврата"
              value={qaComment}
              onChange={(e) => setQaComment(e.target.value)}
              className="mt-1"
            />
            <div className="mt-4 flex flex-wrap gap-2">
              <Button variant="primary" className="gap-1">
                <Check className="h-4 w-4" />
                Принять
              </Button>
              <Button variant="secondary" className="gap-1">
                На доработку
              </Button>
              <Link href={orderUrl}>
                <Button variant="outline" size="sm">Открыть заказ</Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // 1) Проверить отчёт аудита (блоки 1–3)
  if (type === "audit_check_report" && auditState) {
    return (
      <Card className="rounded-2xl border border-[#e2e8f0] bg-white shadow-[0_1px_3px_0_rgb(0_0_0_/_.05)]">
        <CardHeader>
          <CardTitle className="text-base">Предпросмотр блоков 1–3</CardTitle>
          <Badge variant="secondary">Виден заказчику</Badge>
        </CardHeader>
        <CardContent className="space-y-6">
          <section>
            <h3 className="text-sm font-semibold text-[#0f172a]">Блок 1 — Идентификация и фото</h3>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {auditState.block1.overviewPhotos.map((p) => (
                <div key={p.id} className="rounded-lg border border-[#e2e8f0] bg-[#f8f9fb] p-2">
                  <div className="aspect-video rounded bg-[#e2e8f0]" />
                  <p className="mt-1 text-xs font-medium text-[#0f172a]">{p.label}</p>
                </div>
              ))}
            </div>
          </section>
          <section>
            <h3 className="text-sm font-semibold text-[#0f172a]">Блок 2 — Дефекты, толщиномер, шины</h3>
            {auditState.block2.defects.length === 0 ? (
              <p className="text-xs text-[#64748b]">Дефектов нет</p>
            ) : (
              <ul className="mt-2 space-y-2">
                {auditState.block2.defects.map((d) => (
                  <li key={d.id} className="rounded-xl border border-[#e2e8f0] p-2 text-sm">
                    {d.zoneLabel} — {d.defectTypeLabel}, влияние: {d.impact}
                  </li>
                ))}
              </ul>
            )}
          </section>
          <section>
            <h3 className="text-sm font-semibold text-[#0f172a]">Блок 3 — Техсостояние и диагностика</h3>
            <p className="text-xs text-[#64748b]">{auditState.block3.diagComment || "—"}</p>
          </section>
          <div className="rounded-xl border border-[#e2e8f0] bg-[#f8f9fb] p-4">
            <p className="mb-2 text-sm font-medium text-[#0f172a]">Оценка качества исполнителя 1–5 (шаг 0.1) — обязательно</p>
            <Input
              type="number"
              min={1}
              max={5}
              step={0.1}
              value={qaScore || ""}
              onChange={(e) => setQaScore(Number(e.target.value))}
              placeholder="4.5"
              className="w-24"
            />
            <p className="mt-2 text-sm font-medium text-[#0f172a]">Комментарий при возврате (обязателен при возврате)</p>
            <Input
              className="mt-1"
              placeholder="Причина возврата на доработку"
              value={qaComment}
              onChange={(e) => setQaComment(e.target.value)}
            />
            <div className="mt-4 flex flex-wrap gap-2">
              <Button variant="primary" className="gap-1">
                <Check className="h-4 w-4" />
                Принять
              </Button>
              <Button variant="secondary" className="gap-1">
                Вернуть на доработку
              </Button>
              <Link href={orderUrl}>
                <Button variant="outline" size="sm">Открыть заказ</Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // 2) Рассчитать стоимость материалов/деталей (блок 4)
  if (type === "audit_calculate_materials") {
    return (
      <Card className="rounded-2xl border border-[#e2e8f0] bg-white shadow-[0_1px_3px_0_rgb(0_0_0_/_.05)]">
        <CardHeader>
          <CardTitle className="text-base">Оценочная ведомость (внутреннее)</CardTitle>
          <Badge variant="destructive">Внутренний</Badge>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-[#64748b]">
            Предзаполненный список материалов/деталей «по потребности» из аудита. Введите стоимость по каждой позиции.
          </p>
          {b4 ? (
            <>
              <ul className="space-y-2">
                {b4.items.map((item) => (
                  <li key={item.id} className="flex items-center justify-between rounded-xl border border-[#e2e8f0] px-3 py-2 text-sm">
                    <span>{item.label}</span>
                    <Input
                      type="number"
                      className="w-28 text-right"
                      placeholder="₽"
                      defaultValue={item.amount}
                    />
                  </li>
                ))}
              </ul>
              <p className="font-medium text-[#0f172a]">
                Внутренняя смета: работы {(b4.totalWork ?? 0).toLocaleString("ru")} ₽ + материалы {(b4.totalMaterials ?? 0).toLocaleString("ru")} ₽
              </p>
              <div className="flex gap-2">
                <Button variant="primary" className="gap-1">
                  <Check className="h-4 w-4" />
                  Сохранить ведомость (блок 4)
                </Button>
                <Link href={orderUrl}>
                  <Button variant="outline" size="sm">Открыть заказ</Button>
                </Link>
              </div>
            </>
          ) : (
            <p className="text-sm text-[#64748b]">Ведомость будет доступна после принятия отчёта. <Link href={orderUrl} className="text-[#2563eb] hover:underline">Открыть заказ</Link></p>
          )}
        </CardContent>
      </Card>
    );
  }

  // 3) Сформировать/пересчитать КП (блок 5)
  if (type === "audit_form_kp") {
    return (
      <Card className="rounded-2xl border border-[#e2e8f0] bg-white shadow-[0_1px_3px_0_rgb(0_0_0_/_.05)]">
        <CardHeader>
          <CardTitle className="text-base">КП для заказчика</CardTitle>
          <Badge variant="secondary">Виден заказчику</Badge>
        </CardHeader>
        <CardContent className="space-y-4">
          {b5 ? (
            <>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <Card>
                  <CardContent className="pt-4">
                    <p className="text-xs text-[#64748b]">Сценарий</p>
                    <p className="font-medium text-[#0f172a]">{b5.scenarioLabel} ({b5.scenario})</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4">
                    <p className="text-xs text-[#64748b]">SIS / After Repair</p>
                    <p className="font-medium text-[#0f172a]">{b5.sisPrice != null ? `${(b5.sisPrice / 1e6).toFixed(1)} млн ₽` : "—"} / {b5.arvPrice != null ? `${(b5.arvPrice / 1e6).toFixed(1)} млн ₽` : "—"}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4">
                    <p className="text-xs text-[#64748b]">ROI %</p>
                    <p className="font-medium text-[#0f172a]">{b5.roiPercent ?? "—"}%</p>
                  </CardContent>
                </Card>
              </div>
              <div>
                <p className="text-sm font-medium text-[#0f172a]">Список работ (без внутренних цен)</p>
                <ul className="mt-2 space-y-1 text-sm text-[#64748b]">
                  {b5.workListForCustomer.map((w) => (
                    <li key={w.id}>• {w.label}</li>
                  ))}
                </ul>
              </div>
              <div className="flex gap-2">
                <Button variant="secondary" size="sm">Пересчитать (мок)</Button>
                <Button variant="primary" className="gap-1">
                  <Check className="h-4 w-4" />
                  Подтвердить КП
                </Button>
                <Link href={orderUrl}>
                  <Button variant="outline" size="sm">Открыть заказ</Button>
                </Link>
              </div>
            </>
          ) : (
            <p className="text-sm text-[#64748b]">КП будет доступно после сохранения ведомости. <Link href={orderUrl} className="text-[#2563eb] hover:underline">Открыть заказ</Link></p>
          )}
        </CardContent>
      </Card>
    );
  }

  // 4) Отправить результат заказчику
  if (type === "audit_send_customer") {
    return (
      <Card className="rounded-2xl border border-[#e2e8f0] bg-white shadow-[0_1px_3px_0_rgb(0_0_0_/_.05)]">
        <CardHeader>
          <CardTitle className="text-base">Предпросмотр «как увидит заказчик»</CardTitle>
          <Badge variant="secondary">Виден заказчику</Badge>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-[#64748b]">
            Отчёт (блоки 1–3), список работ, КП без внутренних цен. Заказчик получит уведомление (мок).
          </p>
          <div className="flex gap-2">
            <Button variant="primary" className="gap-1">
              <Send className="h-4 w-4" />
              Отправить заказчику (UI + email)
            </Button>
            <Link href={orderUrl}>
              <Button variant="outline" size="sm">Открыть заказ</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Sale: публикация на площадках
  if ((type === "publish_avito" || type === "publish_auto_ru" || type === "publish_drom") && saleOrder) {
    const platformLabel = type === "publish_avito" ? "Avito" : type === "publish_auto_ru" ? "Auto.ru" : "Drom";
    return (
      <Card className="rounded-2xl border border-[#e2e8f0] bg-white shadow-[0_1px_3px_0_rgb(0_0_0_/_.05)]">
        <CardHeader>
          <CardTitle className="text-base">Опубликовать на {platformLabel}</CardTitle>
          <p className="text-sm text-[#64748b]">
            Ссылка №1 (публичная) — обязательная. Ссылка №2 (кабинет/доступ) — опционально.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input placeholder="Ссылка №1 (публичная)" className="w-full" />
          <Input placeholder="Ссылка №2 (опционально)" className="w-full" />
          <div className="flex gap-2">
            <Button variant="primary">Сохранить ссылку</Button>
            <Link href={orderUrl}>
              <Button variant="outline" size="sm">Открыть заказ</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Sale: зафиксировать продажу
  if (type === "sale_fix_final_price" && saleOrder) {
    return (
      <Card className="rounded-2xl border border-[#e2e8f0] bg-white shadow-[0_1px_3px_0_rgb(0_0_0_/_.05)]">
        <CardHeader>
          <CardTitle className="text-base">Зафиксировать продажу</CardTitle>
          <p className="text-sm text-[#64748b]">
            Введите финальную цену продажи. Актив уйдёт в «Реализованные», заказчик увидит результат.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input type="number" placeholder="Финальная цена, ₽" className="max-w-[200px]" />
          <div className="flex gap-2">
            <Button variant="primary" className="gap-1">
              <Check className="h-4 w-4" />
              Зафиксировать продажу
            </Button>
            <Link href={orderUrl}>
              <Button variant="outline" size="sm">Открыть заказ</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Inspection: проверить отчёт инспекции
  if (type === "inspection_check_report" && inspectionOrder) {
    return (
      <Card className="rounded-2xl border border-[#e2e8f0] bg-white shadow-[0_1px_3px_0_rgb(0_0_0_/_.05)]">
        <CardHeader>
          <CardTitle className="text-base">Отчёт инспекции</CardTitle>
          <p className="text-sm text-[#64748b]">
            Блок 1: идентификация + 6 обзорных + VIN фото. Блок 2: дефекты по схеме. Блок 3: техчек (запуск, приборка, одометр, подкапотное, течи) с фото.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-xl border border-[#e2e8f0] bg-[#f8f9fb] p-4">
            <p className="mb-2 text-sm font-medium text-[#0f172a]">Комментарий при возврате на доработку (обязателен)</p>
            <Input
              placeholder="Причина возврата"
              value={qaComment}
              onChange={(e) => setQaComment(e.target.value)}
              className="mt-1"
            />
            <div className="mt-4 flex flex-wrap gap-2">
              <Button variant="primary" className="gap-1">
                <Check className="h-4 w-4" />
                Принять
              </Button>
              <Button variant="secondary" className="gap-1">
                На доработку
              </Button>
              <Link href={orderUrl}>
                <Button variant="outline" size="sm">Открыть заказ</Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Sale: метрики не обновляются / объявление снято
  if ((type === "sale_check_metrics" || type === "sale_ad_removed") && saleOrder) {
    return (
      <Card className="rounded-2xl border border-[#e2e8f0] bg-white shadow-[0_1px_3px_0_rgb(0_0_0_/_.05)]">
        <CardHeader>
          <CardTitle className="text-base">{task.typeLabel}</CardTitle>
          <p className="text-sm text-[#64748b]">
            {type === "sale_check_metrics"
              ? "Данные давно не обновлялись — проверьте ссылку и доступ к метрикам."
              : "Объявление не найдено или снято — требуется действие."}
          </p>
        </CardHeader>
        <CardContent>
          <Link href={orderUrl}>
            <Button variant="primary">Открыть заказ</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  // Остальные типы: заглушка + Открыть заказ
  return (
    <Card className="rounded-2xl border border-[#e2e8f0] bg-white shadow-[0_1px_3px_0_rgb(0_0_0_/_.05)]">
      <CardHeader>
        <CardTitle className="text-base">{task.typeLabel}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {task.shortDescription && (
          <p className="text-sm text-[#64748b]">{task.shortDescription}</p>
        )}
        <div>
          <label className="text-sm font-medium text-[#0f172a] block mb-2">Комментарий (при «Нужно уточнение»)</label>
          <Input
            placeholder="Введите комментарий..."
            value={clarificationComment}
            onChange={(e) => setClarificationComment(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="primary" size="sm" className="gap-1">
            <Check className="h-4 w-4" />
            Пометить выполнено
          </Button>
          <Button variant="secondary" size="sm" className="gap-1">
            <MessageCircle className="h-4 w-4" />
            Нужно уточнение
          </Button>
          <Link href={orderUrl}>
            <Button variant="outline" size="sm">Открыть заказ</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
