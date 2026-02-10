"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Sheet } from "@/components/ui/sheet";
import type { InspectionOrder } from "@/data/mock";
import {
  DEFECT_ZONES_LCV,
  DEFECT_TYPE_LABELS,
  type DefectType,
  type DefectImpact,
} from "@/data/mock";
import {
  ArrowLeft,
  Camera,
  CheckCircle,
  FileText,
  MessageCircle,
  Plus,
  X,
} from "lucide-react";
import { Select } from "@/components/ui/select";

interface InspectionDefect {
  id: string;
  zone: string;
  defectType: DefectType;
  impact: DefectImpact;
  comment: string;
}

const IMPACT_LABELS: Record<DefectImpact, string> = {
  low: "Низкая",
  medium: "Средняя",
  high: "Высокая",
};

interface InspectionWizardProps {
  order: InspectionOrder;
}

type Step = "step0" | "block1" | "block2" | "block3";

export function InspectionWizard({ order }: InspectionWizardProps) {
  const [step, setStep] = useState<Step>("step0");
  const [accessYes, setAccessYes] = useState<boolean | null>(null);
  const [noAccessComment, setNoAccessComment] = useState("");
  const [vinPhoto, setVinPhoto] = useState(false);
  const [overviewPhotos, setOverviewPhotos] = useState<boolean[]>(
    Array.from({ length: 6 }, () => false)
  );
  const [interiorAccess, setInteriorAccess] = useState<boolean | null>(null);
  const [interiorPhotos, setInteriorPhotos] = useState<boolean[]>(
    Array.from({ length: 4 }, () => false)
  );
  const [hasDefects, setHasDefects] = useState<boolean | null>(null);
  const [defects, setDefects] = useState<InspectionDefect[]>([]);
  const [defectSheetOpen, setDefectSheetOpen] = useState(false);
  const [editingDefect, setEditingDefect] = useState<InspectionDefect | null>(null);
  const [startsOnOwn, setStartsOnOwn] = useState<boolean | null>(null);
  const [mileage, setMileage] = useState<string>("");
  const [hasLeaks, setHasLeaks] = useState<boolean | null>(null);
  const [techComment, setTechComment] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [submittedBanner, setSubmittedBanner] = useState(false);

  const allOverviewDone = overviewPhotos.every(Boolean);
  const block1Done = vinPhoto && allOverviewDone;
  const interiorPhotosDone = interiorAccess === false || (interiorAccess === true && interiorPhotos.every(Boolean));
  const block2Done =
    hasDefects === false || (hasDefects === true && defects.length > 0);
  const block3Done =
    interiorAccess === false
      ? techComment.trim().length > 0
      : startsOnOwn !== null && hasLeaks !== null && techComment.trim().length > 0;

  const canSubmit = accessYes === true && block1Done && interiorPhotosDone && block2Done && block3Done;

  return (
    <div className="space-y-6">
      {submittedBanner && (
        <div className="rounded-xl border border-[#bbf7d0] bg-[#f0fdf4] px-4 py-3 flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-[#166534]">
              Отчёт инспекции отправлен на проверку менеджеру
            </p>
            <p className="mt-1 text-xs text-[#16a34a]">
              Демонстрационный режим: статус заказа в данных не меняется.
            </p>
          </div>
          <button
            type="button"
            className="text-xs text-[#16a34a] hover:text-[#15803d]"
            onClick={() => setSubmittedBanner(false)}
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
        <h1 className="text-2xl font-bold text-[#0f172a]">{order.brandModel}</h1>
        <Badge variant="secondary">Проактивная инспекция</Badge>
        <Badge
          variant={
            order.status === "completed"
              ? "success"
              : order.status === "on_review"
                ? "warning"
                : "outline"
          }
        >
          {order.statusLabel}
        </Badge>
      </div>

      {/* Статус и ввод доступа */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Статус и доступ</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <p className="font-medium text-[#0f172a]">{order.address}</p>
          <p className="text-[#64748b]">
            Контакт: {order.contact}, {order.phone}
          </p>
          <div className="pt-2">
            <p className="text-sm text-[#64748b] mb-2">
              Доступ к активу получен?
            </p>
            <div className="flex gap-2">
              <Button
                variant={accessYes === true ? "primary" : "secondary"}
                size="sm"
                onClick={() => {
                  setAccessYes(true);
                  setStep("block1");
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
                  Без доступа инспекцию выполнить нельзя. Опишите, что произошло, и
                  свяжитесь с менеджером или заказчиком для согласования выезда.
                </p>
                <Input
                  placeholder="Например: охрана не пустила на объект, нет ключей от ТС..."
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
                Доступ подтверждён, можно приступать к осмотру.
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {accessYes && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Услуга инспекция</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Блок 1 */}
            {step === "block1" && (
              <section className="space-y-3">
                <p className="text-sm font-medium text-[#0f172a]">
                  Блок 1 — Идентификация и фото
                </p>
                <p className="text-xs text-[#64748b]">
                  Сделайте VIN-фото и 6 обзорных фото по схеме.
                </p>
                <div className="flex flex-wrap gap-4">
                  <button
                    type="button"
                    onClick={() => setVinPhoto((v) => !v)}
                    className="flex h-20 w-28 flex-shrink-0 items-center justify-center rounded-xl border border-dashed border-[#e2e8f0] bg-[#f8f9fb] hover:border-[#2563eb] hover:bg-[#eff6ff]"
                  >
                    {vinPhoto ? (
                      <CheckCircle className="h-8 w-8 text-[#16a34a]" />
                    ) : (
                      <Camera className="h-8 w-8 text-[#94a3b8]" />
                    )}
                  </button>
                  <div className="grid grid-cols-3 gap-2">
                    {overviewPhotos.map((ok, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() =>
                          setOverviewPhotos((prev) =>
                            prev.map((v, i) => (i === idx ? !v : v))
                          )
                        }
                        className="flex h-16 w-20 items-center justify-center rounded-lg border border-dashed border-[#e2e8f0] bg-[#f8f9fb] hover:border-[#2563eb] hover:bg-[#eff6ff]"
                      >
                        {ok ? (
                          <CheckCircle className="h-6 w-6 text-[#16a34a]" />
                        ) : (
                          <Camera className="h-5 w-5 text-[#94a3b8]" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-[#e2e8f0]">
                  <p className="text-sm font-medium text-[#0f172a] mb-2">
                    Есть ли доступ внутрь автомобиля?
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant={interiorAccess === true ? "primary" : "secondary"}
                      size="sm"
                      onClick={() => setInteriorAccess(true)}
                    >
                      Да
                    </Button>
                    <Button
                      variant={interiorAccess === false ? "primary" : "secondary"}
                      size="sm"
                      onClick={() => setInteriorAccess(false)}
                    >
                      Нет
                    </Button>
                  </div>
                </div>
                {interiorAccess === true && (
                  <div className="mt-4 pt-4 border-t border-[#e2e8f0] space-y-3">
                    <p className="text-sm font-medium text-[#0f172a]">
                      Фотографирование салона (интерьера)
                    </p>
                    <p className="text-xs text-[#64748b]">
                      Сделайте 4 фотографии салона:
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        "Передняя панель во всю её длину",
                        "Приборная панель с отображением пробега",
                        "Передние кресла",
                        "Задние сидения"
                      ].map((label, idx) => (
                        <div key={idx} className="space-y-1">
                          <p className="text-xs text-[#64748b]">{label}</p>
                          <button
                            type="button"
                            onClick={() =>
                              setInteriorPhotos((prev) =>
                                prev.map((v, i) => (i === idx ? !v : v))
                              )
                            }
                            className="flex h-20 w-full items-center justify-center rounded-xl border border-dashed border-[#e2e8f0] bg-[#f8f9fb] hover:border-[#2563eb] hover:bg-[#eff6ff]"
                          >
                            {interiorPhotos[idx] ? (
                              <CheckCircle className="h-8 w-8 text-[#16a34a]" />
                            ) : (
                              <Camera className="h-6 w-6 text-[#94a3b8]" />
                            )}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {(interiorAccess === false || (interiorAccess === true && interiorPhotos.every(Boolean))) && (
                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => setStep("block2")}
                    >
                      Перейти к блоку 2
                    </Button>
                  </div>
                )}
              </section>
            )}

            {/* Блок 2 */}
            {step === "block2" && (
              <section className="space-y-3">
                <p className="text-sm font-medium text-[#0f172a]">
                  Блок 2 — Визуальная фиксация состояния
                </p>
                <p className="text-xs text-[#64748b]">
                  Отметьте, есть ли деформации, сколы, коррозия и другие дефекты по
                  основным зонам. При наличии опишите кратко характер дефектов.
                </p>
                <p className="text-sm text-[#0f172a]">Есть дефекты?</p>
                <div className="flex gap-2">
                  <Button
                    variant={hasDefects === true ? "primary" : "secondary"}
                    size="sm"
                    onClick={() => setHasDefects(true)}
                  >
                    Да
                  </Button>
                  <Button
                    variant={hasDefects === false ? "primary" : "secondary"}
                    size="sm"
                    onClick={() => setHasDefects(false)}
                  >
                    Нет
                  </Button>
                </div>
                {hasDefects && (
                  <div className="space-y-2">
                    {defects.map((defect) => (
                      <div
                        key={defect.id}
                        className="flex items-center justify-between rounded-xl border border-[#e2e8f0] bg-white p-3"
                      >
                        <div className="flex-1">
                          <p className="text-sm font-medium text-[#0f172a]">
                            {defect.zone} — {DEFECT_TYPE_LABELS[defect.defectType]}
                          </p>
                          <p className="text-xs text-[#64748b]">
                            Влияние: {IMPACT_LABELS[defect.impact]}
                            {defect.comment && ` • ${defect.comment}`}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setDefects((prev) => prev.filter((d) => d.id !== defect.id));
                          }}
                          className="ml-2 text-[#ef4444] hover:text-[#dc2626]"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1"
                      onClick={() => {
                        setEditingDefect(null);
                        setDefectSheetOpen(true);
                      }}
                    >
                      <Plus className="h-4 w-4" />
                      Добавить дефект
                    </Button>
                  </div>
                )}
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setStep("block1")}
                  >
                    Назад к блоку 1
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    disabled={!block2Done}
                    onClick={() => setStep("block3")}
                  >
                    Перейти к блоку 3
                  </Button>
                </div>
              </section>
            )}

            {/* Блок 3 */}
            {step === "block3" && (
              <section className="space-y-3">
                <p className="text-sm font-medium text-[#0f172a]">
                  Блок 3 — Техчек
                </p>
                <p className="text-xs text-[#64748b]">
                  {interiorAccess
                    ? "Проверка запуска, приборки, одометра, подкапотного пространства и течей."
                    : "Внешний осмотр без доступа внутрь автомобиля."}
                </p>
                {interiorAccess === false && (
                  <div className="rounded-xl border border-[#fbbf24] bg-[#fffbeb] p-3">
                    <p className="text-sm text-[#92400e]">
                      Доступ внутрь автомобиля отсутствует. Блоки запуска двигателя и подкапотного пространства пропущены.
                    </p>
                  </div>
                )}
                {interiorAccess === true && (
                  <>
                    <div className="space-y-2">
                      <p className="text-sm text-[#0f172a]">
                        Актив заводится самостоятельно?
                      </p>
                      <div className="flex gap-2">
                        <Button
                          variant={startsOnOwn === true ? "primary" : "secondary"}
                          size="sm"
                          onClick={() => setStartsOnOwn(true)}
                        >
                          Да
                        </Button>
                        <Button
                          variant={startsOnOwn === false ? "primary" : "secondary"}
                          size="sm"
                          onClick={() => setStartsOnOwn(false)}
                        >
                          Нет
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-[#0f172a]">Пробег / моточасы</p>
                      <Input
                        type="number"
                        placeholder="Например: 120000"
                        value={mileage}
                        onChange={(e) => setMileage(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-[#0f172a]">
                        Есть течи рабочих жидкостей?
                      </p>
                      <div className="flex gap-2">
                        <Button
                          variant={hasLeaks === true ? "primary" : "secondary"}
                          size="sm"
                          onClick={() => setHasLeaks(true)}
                        >
                          Да
                        </Button>
                        <Button
                          variant={hasLeaks === false ? "primary" : "secondary"}
                          size="sm"
                          onClick={() => setHasLeaks(false)}
                        >
                          Нет
                        </Button>
                      </div>
                    </div>
                  </>
                )}
                <div className="space-y-1">
                  <p className="text-sm text-[#0f172a]">Комментарий по техсостоянию</p>
                  <Input
                    placeholder={
                      interiorAccess
                        ? "Кратко опишите запуск, работу двигателя, приборку и подкапотное"
                        : "Кратко опишите внешнее состояние актива"
                    }
                    value={techComment}
                    onChange={(e) => setTechComment(e.target.value)}
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setStep("block2")}
                  >
                    Назад к блоку 2
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
                  setSubmittedBanner(true);
                }}
              >
                Сдать / Завершить инспекцию
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
        title="Предпросмотр отчёта инспекции"
      >
        <div className="space-y-4 pb-6 text-sm">
          <Badge variant="secondary">Проактивная инспекция</Badge>
          <section>
            <h3 className="text-sm font-semibold text-[#0f172a]">
              Блок 1 — Идентификация и фото
            </h3>
            <p className="mt-1 text-xs text-[#64748b]">
              VIN-фото: {vinPhoto ? "есть" : "нет"}; обзорные фото:{" "}
              {overviewPhotos.filter(Boolean).length} из 6.
            </p>
          </section>
          <section>
            <h3 className="text-sm font-semibold text-[#0f172a]">
              Блок 2 — Визуальная фиксация состояния
            </h3>
            <p className="mt-1 text-xs text-[#64748b]">
              Дефекты:{" "}
              {hasDefects == null
                ? "не указано"
                : hasDefects
                  ? "есть"
                  : "нет"}
            </p>
            {hasDefects && defects.length > 0 && (
              <ul className="mt-1 space-y-1 text-xs text-[#64748b]">
                {defects.map((d) => (
                  <li key={d.id}>
                    {d.zone} — {DEFECT_TYPE_LABELS[d.defectType]}, влияние: {IMPACT_LABELS[d.impact]}
                    {d.comment && ` (${d.comment})`}
                  </li>
                ))}
              </ul>
            )}
          </section>
          <section>
            <h3 className="text-sm font-semibold text-[#0f172a]">
              Блок 3 — Техчек
            </h3>
            <p className="mt-1 text-xs text-[#64748b]">
              Запуск:{" "}
              {startsOnOwn == null
                ? "не указано"
                : startsOnOwn
                  ? "да"
                  : "нет"}
              , течи:{" "}
              {hasLeaks == null
                ? "не указано"
                : hasLeaks
                  ? "да"
                  : "нет"}
              , пробег/мото-часы: {mileage || "—"}
            </p>
            <p className="mt-1 text-xs text-[#64748b]">
              Комментарий: {techComment || "—"}
            </p>
          </section>
        </div>
      </Sheet>

      {/* Sheet добавления дефекта */}
      <InspectionDefectFormSheet
        open={defectSheetOpen}
        onOpenChange={setDefectSheetOpen}
        onSave={(defect) => {
          setDefects((prev) => [...prev, defect]);
          setDefectSheetOpen(false);
        }}
        onCancel={() => setDefectSheetOpen(false)}
      />
    </div>
  );
}

function InspectionDefectFormSheet({
  open,
  onOpenChange,
  onSave,
  onCancel,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSave: (defect: InspectionDefect) => void;
  onCancel: () => void;
}) {
  const [zone, setZone] = useState(DEFECT_ZONES_LCV[0]);
  const [defectType, setDefectType] = useState<DefectType>("paint_damage");
  const [impact, setImpact] = useState<DefectImpact>("low");
  const [comment, setComment] = useState("");

  const handleSave = () => {
    onSave({
      id: `d${Date.now()}`,
      zone,
      defectType,
      impact,
      comment,
    });
    setZone(DEFECT_ZONES_LCV[0]);
    setDefectType("paint_damage");
    setImpact("low");
    setComment("");
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange} title="Добавить дефект">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-[#0f172a]">Зона</label>
          <Select value={zone} onChange={(e) => setZone(e.target.value)}>
            {DEFECT_ZONES_LCV.map((z) => (
              <option key={z} value={z}>
                {z}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium text-[#0f172a]">Тип дефекта</label>
          <Select
            value={defectType}
            onChange={(e) => setDefectType(e.target.value as DefectType)}
          >
            {Object.entries(DEFECT_TYPE_LABELS).map(([k, l]) => (
              <option key={k} value={k}>
                {l}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium text-[#0f172a]">
            Влияние на товарную привлекательность
          </label>
          <Select value={impact} onChange={(e) => setImpact(e.target.value as DefectImpact)}>
            {Object.entries(IMPACT_LABELS).map(([k, l]) => (
              <option key={k} value={k}>
                {l}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium text-[#0f172a]">
            Комментарий (опционально)
          </label>
          <Input
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Дополнительное описание"
          />
        </div>
        <div className="flex gap-2 pt-4">
          <Button variant="primary" onClick={handleSave}>
            Сохранить
          </Button>
          <Button variant="secondary" onClick={onCancel}>
            Отмена
          </Button>
        </div>
      </div>
    </Sheet>
  );
}

