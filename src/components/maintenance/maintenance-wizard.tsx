"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import type { ExecutorActiveOrder, PrepChecklistItem, PrepOrder, MaintenanceMaterial } from "@/data/mock";
import { maintenanceMaterialsMock } from "@/data/mock";
import { Sheet } from "@/components/ui/sheet";
import {
  ArrowLeft,
  Camera,
  CheckCircle,
  FileText,
  MessageCircle,
  Package,
} from "lucide-react";

interface MaintenanceWizardProps {
  order: ExecutorActiveOrder;
  prepOrder?: PrepOrder | null;
  prepChecklist?: PrepChecklistItem[];
}

type Step = "step0" | "materials" | "tasks" | "final";

interface LocalTask {
  id: string;
  label: string;
  done: boolean;
  comment: string;
  photos: string[];
}

interface LocalMaterial extends MaintenanceMaterial {
  photo?: string;
}

export function MaintenanceWizard({
  order,
  prepOrder,
  prepChecklist = [],
}: MaintenanceWizardProps) {
  const [step, setStep] = useState<Step>("step0");
  const [accessYes, setAccessYes] = useState<boolean | null>(
    prepOrder?.accessAgreed ?? null
  );
  const [noAccessComment, setNoAccessComment] = useState("");
  
  const initialTasks = useMemo<LocalTask[]>(() => {
    if (prepChecklist.length > 0) {
      return prepChecklist.map((t) => ({
        id: t.id,
        label: t.label,
        done: t.done,
        comment: t.comment ?? "",
        photos: t.photos ?? [],
      }));
    }
    // fallback простой чек-лист для обычного обслуживания
    return [
      {
        id: "m1",
        label: "Замена масла ДВС и фильтра",
        done: false,
        comment: "",
        photos: [],
      },
      {
        id: "m2",
        label: "Проверка тормозной системы",
        done: false,
        comment: "",
        photos: [],
      },
      {
        id: "m3",
        label: "Осмотр ходовой части и фиксация замечаний",
        done: false,
        comment: "",
        photos: [],
      },
    ];
  }, [prepChecklist]);

  const [tasks, setTasks] = useState<LocalTask[]>(initialTasks);
  const [materials, setMaterials] = useState<LocalMaterial[]>(
    maintenanceMaterialsMock.map(m => ({ ...m }))
  );
  const [generalNotes, setGeneralNotes] = useState("");
  const [resultComment, setResultComment] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [bannerVisible, setBannerVisible] = useState(false);

  const allMaterialsReceived = materials.every((m) => m.received);
  const allTasksDone = tasks.length > 0 && tasks.every((t) => t.done);
  const canSubmit = accessYes === true && allMaterialsReceived && allTasksDone && resultComment.trim().length > 0;

  const isFromAudit = !!prepOrder;

  return (
    <div className="space-y-6">
      {bannerVisible && (
        <div className="rounded-xl border border-[#bbf7d0] bg-[#f0fdf4] px-4 py-3 flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-[#166534]">
              Результат обслуживания отправлен на проверку менеджеру
            </p>
            <p className="mt-1 text-xs text-[#16a34a]">
              Демонстрационный режим: статус заказа в данных не меняется.
            </p>
          </div>
          <button
            type="button"
            className="text-xs text-[#16a34a] hover:text-[#15803d]"
            onClick={() => setBannerVisible(false)}
          >
            Закрыть
          </button>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-4">
        <Link href="/executor/orders">
          <Button variant="ghost" size="sm" className="gap-1 text-[#2563eb]">
            <ArrowLeft className="h-4 w-4" />
            Назад
          </Button>
        </Link>
        <h1 className="text-2xl font-bold text-[#0f172a]">{order.assetName}</h1>
        <Badge variant="secondary">Обслуживание и ремонт</Badge>
        <Badge variant={order.status === "on_review" ? "warning" : "outline"}>
          {order.statusLabel}
        </Badge>
      </div>

      {/* Статус и доступ */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Статус и доступ</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <p className="font-medium text-[#0f172a]">{order.address}</p>
          <div>
            <p className="text-sm text-[#64748b] mb-2">
              Доступ к активу получен?
            </p>
            <div className="flex gap-2">
              <Button
                variant={accessYes === true ? "primary" : "secondary"}
                size="sm"
                onClick={() => {
                  setAccessYes(true);
                  setStep("materials");
                }}
              >
                Да
              </Button>
              <Button
                variant={accessYes === false ? "primary" : "secondary"}
                size="sm"
                onClick={() => setAccessYes(false)}
              >
                Нет
              </Button>
            </div>
            {accessYes === false && (
              <div className="mt-2 space-y-2">
                <p className="text-xs text-[#64748b]">
                  Без доступа обслуживание выполнить нельзя. Опишите, что произошло, и
                  свяжитесь с менеджером или заказчиком для согласования выезда.
                </p>
                <Input
                  placeholder="Например: объект закрыт, нет доступа к ТС, заказчик перенёс дату..."
                  value={noAccessComment}
                  onChange={(e) => setNoAccessComment(e.target.value)}
                  className="text-xs"
                />
                <Button variant="secondary" size="sm" className="gap-1">
                  <MessageCircle className="h-4 w-4" />
                  Написать менеджеру
                </Button>
              </div>
            )}
            {accessYes === true && (
              <p className="mt-2 flex items-center gap-2 text-xs text-[#16a34a]">
                <CheckCircle className="h-4 w-4" />
                Доступ подтверждён, можно приступать к работам.
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Блок получения материалов */}
      {accessYes && step === "materials" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Package className="h-5 w-5 text-[#0075F3]" />
              Получение запчастей и материалов
            </CardTitle>
            <p className="mt-1 text-sm text-[#64748b]">
              Отметьте полученные материалы и добавьте фото для подтверждения.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-3">
              {materials.map((material, idx) => (
                <li
                  key={material.id}
                  className="flex items-start gap-3 rounded-xl border border-[#e2e8f0] bg-[#f8f9fb] p-3"
                >
                  <button
                    type="button"
                    className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-[6px] border border-[#cbd5e1] bg-white"
                    onClick={() =>
                      setMaterials((prev) =>
                        prev.map((m, i) =>
                          i === idx ? { ...m, received: !m.received } : m
                        )
                      )
                    }
                  >
                    {material.received && (
                      <CheckCircle className="h-4 w-4 text-[#16a34a]" />
                    )}
                  </button>
                  <div className="min-w-0 flex-1 space-y-2">
                    <div>
                      <p
                        className={`text-sm font-medium ${
                          material.received
                            ? "text-[#64748b] line-through"
                            : "text-[#0f172a]"
                        }`}
                      >
                        {material.name}
                      </p>
                      <p className="text-xs text-[#64748b]">
                        Количество: {material.quantity}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        className="flex h-12 w-16 items-center justify-center rounded-lg border border-dashed border-[#e2e8f0] bg-white hover:border-[#0075F3] transition-colors"
                        onClick={() => {
                          // TODO: загрузка фото
                        }}
                      >
                        <Camera className="h-5 w-5 text-[#94a3b8]" />
                      </button>
                      {material.photo && (
                        <div className="text-xs text-[#16a34a] flex items-center gap-1">
                          <CheckCircle className="h-3 w-3" />
                          Фото добавлено
                        </div>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="flex gap-2 pt-2">
              <Button
                variant="primary"
                size="sm"
                disabled={!allMaterialsReceived}
                onClick={() => setStep("tasks")}
              >
                Далее — Выполнение работ
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Блок выполнения работ */}
      {accessYes && (step === "tasks" || step === "final") && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Обслуживание — чек-лист работ
            </CardTitle>
            <p className="mt-1 text-sm text-[#64748b]">
              Выполняйте задачи сверху вниз. Для каждой задачи отметьте выполнение,
              добавьте несколько фото и комментарий.
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {step === "tasks" && (
              <section className="space-y-4">
                <ul className="space-y-3">
                  {tasks.map((task, idx) => (
                    <li
                      key={task.id}
                      className="flex items-start gap-3 rounded-xl border border-[#e2e8f0] bg-[#f8f9fb] p-3"
                    >
                      <button
                        type="button"
                        className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-[6px] border border-[#cbd5e1] bg-white"
                        onClick={() =>
                          setTasks((prev) =>
                            prev.map((t, i) =>
                              i === idx ? { ...t, done: !t.done } : t
                            )
                          )
                        }
                      >
                        {task.done && (
                          <CheckCircle className="h-4 w-4 text-[#16a34a]" />
                        )}
                      </button>
                      <div className="min-w-0 flex-1 space-y-2">
                        <p
                          className={`text-sm font-medium ${
                            task.done
                              ? "text-[#64748b] line-through"
                              : "text-[#0f172a]"
                          }`}
                        >
                          {task.label}
                        </p>
                        <div className="space-y-2">
                          <div className="flex flex-wrap gap-2">
                            {task.photos.map((photo, photoIdx) => (
                              <div
                                key={photoIdx}
                                className="relative flex h-12 w-16 items-center justify-center rounded-lg border border-[#0075F3] bg-[#eff6ff]"
                              >
                                <CheckCircle className="h-4 w-4 text-[#0075F3]" />
                              </div>
                            ))}
                            <button
                              type="button"
                              className="flex h-12 w-16 items-center justify-center rounded-lg border border-dashed border-[#e2e8f0] bg-white hover:border-[#0075F3] transition-colors"
                              onClick={() => {
                                setTasks((prev) =>
                                  prev.map((t, i) =>
                                    i === idx
                                      ? { ...t, photos: [...t.photos, `photo_${Date.now()}`] }
                                      : t
                                  )
                                );
                              }}
                            >
                              <Camera className="h-5 w-5 text-[#94a3b8]" />
                            </button>
                          </div>
                          <Input
                            placeholder="Комментарий к выполнению задачи"
                            className="text-sm"
                            value={task.comment}
                            onChange={(e) =>
                              setTasks((prev) =>
                                prev.map((t, i) =>
                                  i === idx
                                    ? { ...t, comment: e.target.value }
                                    : t
                                )
                              )
                            }
                          />
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
                
                {/* Общее поле для заметок */}
                <div className="space-y-2 pt-4 border-t border-[#e2e8f0]">
                  <label className="text-sm font-medium text-[#0f172a]">
                    Общие заметки по работам (опционально)
                  </label>
                  <textarea
                    placeholder="Здесь вы можете указать любые дополнительные замечания, трудности, рекомендации или особенности выполнения работ..."
                    className="w-full rounded-xl border border-[#e2e8f0] bg-white px-3 py-2 text-sm text-[#0f172a] placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#0075F3] min-h-[100px]"
                    value={generalNotes}
                    onChange={(e) => setGeneralNotes(e.target.value)}
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    variant="primary"
                    size="sm"
                    disabled={!allTasksDone}
                    onClick={() => setStep("final")}
                  >
                    Перейти к итогам
                  </Button>
                </div>
              </section>
            )}

            {step === "final" && (
              <section className="space-y-3">
                <p className="text-sm font-medium text-[#0f172a]">
                  Итоги обслуживания
                </p>
                <p className="text-xs text-[#64748b]">
                  Кратко опишите результат работ: что сделано, есть ли незакрытые
                  замечания, рекомендации менеджеру/заказчику.
                </p>
                <Input
                  placeholder="Например: выполнена замена масла и фильтра, выявлен люфт в рулевой тяге..."
                  value={resultComment}
                  onChange={(e) => setResultComment(e.target.value)}
                />
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setStep("tasks")}
                  >
                    Назад к задачам
                  </Button>
                </div>
              </section>
            )}

            <div className="flex flex-wrap gap-2 pt-4 border-t border-[#e2e8f0]">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPreviewOpen(true)}
              >
                Предпросмотр
              </Button>
              <Button
                variant="primary"
                size="sm"
                disabled={!canSubmit}
                onClick={() => {
                  if (!canSubmit) return;
                  setBannerVisible(true);
                }}
              >
                Сдать / Отправить на проверку
              </Button>
              <Button variant="secondary" size="sm" className="gap-1">
                <MessageCircle className="h-4 w-4" />
                Написать менеджеру
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Sheet
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        title="Предпросмотр отчёта по обслуживанию"
      >
        <div className="space-y-4 pb-6 text-sm">
          <Badge variant="secondary">
            {isFromAudit ? "По аудиту" : "Стандартное обслуживание"}
          </Badge>
          <section>
            <h3 className="text-sm font-semibold text-[#0f172a]">
              Доступ и заказ
            </h3>
            <p className="mt-1 text-xs text-[#64748b]">
              Доступ к активу:{" "}
              {accessYes == null ? "не указано" : accessYes ? "да" : "нет"}.
            </p>
            <p className="mt-1 text-xs text-[#64748b]">
              Адрес: {order.address}
            </p>
          </section>
          <section>
            <h3 className="text-sm font-semibold text-[#0f172a]">
              Материалы и запчасти
            </h3>
            <ul className="mt-1 space-y-1 text-xs text-[#64748b]">
              {materials.map((m) => (
                <li key={m.id}>
                  {m.received ? "✓" : "○"} {m.name} ({m.quantity})
                  {m.photo && " — фото добавлено"}
                </li>
              ))}
            </ul>
          </section>
          <section>
            <h3 className="text-sm font-semibold text-[#0f172a]">
              Чек-лист работ
            </h3>
            <ul className="mt-1 space-y-1 text-xs text-[#64748b]">
              {tasks.map((t) => (
                <li key={t.id}>
                  {t.done ? "✓" : "○"} {t.label}
                  {t.photos.length > 0 && ` (фото: ${t.photos.length})`}
                  {t.comment && ` — ${t.comment}`}
                </li>
              ))}
            </ul>
          </section>
          {generalNotes && (
            <section>
              <h3 className="text-sm font-semibold text-[#0f172a]">
                Общие заметки
              </h3>
              <p className="mt-1 text-xs text-[#64748b] whitespace-pre-wrap">
                {generalNotes}
              </p>
            </section>
          )}
          <section>
            <h3 className="text-sm font-semibold text-[#0f172a]">
              Итоговый комментарий
            </h3>
            <p className="mt-1 text-xs text-[#64748b]">
              {resultComment || "—"}
            </p>
          </section>
        </div>
      </Sheet>
    </div>
  );
}

