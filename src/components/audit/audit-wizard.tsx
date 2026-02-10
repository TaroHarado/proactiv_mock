"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Sheet } from "@/components/ui/sheet";
import { AssetTypeIcon } from "@/components/ui/asset-type-icon";
import {
  getAuditState,
  getDefaultAuditState,
  type AuditState,
  type AuditOrder,
  type AuditBlock1,
  type AuditBlock2,
  type AuditBlock3,
  type AuditDefect,
  type UnderhoodIssue,
  type AuditAssetType,
  type SpecialChassis,
  DEFECT_ZONES_LCV,
  DEFECT_ZONES_KT,
  DEFECT_ZONES_SPECIAL,
  DEFECT_TYPE_LABELS,
  THICKNESS_PANELS_LCV,
  THICKNESS_PANELS_KT,
  type DefectType,
  type DefectImpact,
} from "@/data/mock";
import {
  ArrowLeft,
  MessageCircle,
  FileText,
  CheckCircle,
  XCircle,
  Camera,
  Plus,
  Eye,
  X,
} from "lucide-react";

const ASSET_TYPE_LABELS: Record<AuditAssetType, string> = {
  passenger: "Легковые автомобили",
  lcv: "Легкий коммерческий транспорт",
  truck: "Грузовой транспорт",
  special: "Спецтехника и спецтранспорт",
  trailer: "Прицепы и полуприцепы",
};

const IMPACT_LABELS: Record<DefectImpact, string> = {
  low: "Низкая",
  medium: "Средняя",
  high: "Высокая",
};

function getDefectZones(assetType?: AuditAssetType): string[] {
  if (assetType === "truck") return DEFECT_ZONES_KT;
  if (assetType === "special") return DEFECT_ZONES_SPECIAL;
  return DEFECT_ZONES_LCV;
}

function getThicknessPanels(assetType?: AuditAssetType): { id: string; label: string }[] {
  // Толщиномер только для легковых и LCV
  if (assetType === "passenger" || assetType === "lcv") {
    return THICKNESS_PANELS_LCV.map((l, i) => ({ id: `t${i}`, label: l }));
  }
  return [];
}

interface AuditWizardProps {
  orderId: string;
  order: { assetName: string; assetVin?: string; address: string; city: string; status: string; statusLabel: string; accessAgreed: boolean | null; accessPendingHours?: number };
}

export function AuditWizard({ orderId, order: orderInfo }: AuditWizardProps) {
  const initial = useMemo(() => {
    const fromMock = getAuditState(orderId);
    if (fromMock) return fromMock;
    return getDefaultAuditState(orderId, {
      assetName: orderInfo.assetName,
      assetVin: orderInfo.assetVin,
      address: orderInfo.address,
      city: orderInfo.city,
    });
  }, [orderId, orderInfo.assetName, orderInfo.address, orderInfo.city, orderInfo.assetVin]);

  const [state, setState] = useState<AuditState>(initial);
  const [currentStep, setCurrentStep] = useState<"step0" | "block1" | "block2" | "block3">(
    initial.step0Access === "pending" ? "step0" : "block1"
  );
  const [previewOpen, setPreviewOpen] = useState(false);
  const [defectSheetOpen, setDefectSheetOpen] = useState(false);
  const [editingDefect, setEditingDefect] = useState<AuditDefect | null>(null);
  const [underhoodIssueFormOpen, setUnderhoodIssueFormOpen] = useState(false);
  const [submittedBannerVisible, setSubmittedBannerVisible] = useState(false);

  const order = state.order;
  const block1 = state.block1;
  const block2 = state.block2;
  const block3 = state.block3;
  const isReadOnly = order.status === "on_review" || order.status === "completed";
  const blocksValid =
    block1.vinPlatePhoto &&
    block1.overviewPhotos.every((p) => p.photo) &&
    (block2.assetType !== undefined) &&
    block3.diagFile &&
    (block3.diagComment?.trim().length ?? 0) > 0;

  const setOrder = (o: Partial<AuditOrder>) =>
    setState((s) => ({ ...s, order: { ...s.order, ...o } }));
  const setBlock1 = (b: Partial<AuditBlock1>) =>
    setState((s) => ({ ...s, block1: { ...s.block1, ...b } }));
  const setBlock2 = (b: Partial<AuditBlock2>) =>
    setState((s) => ({ ...s, block2: { ...s.block2, ...b } }));
  const setBlock3 = (b: Partial<AuditBlock3>) =>
    setState((s) => ({ ...s, block3: { ...s.block3, ...b } }));

  const overviewProgress = block1.overviewPhotos.filter((p) => p.photo).length;
  const block1Progress = block1.vinPlatePhoto ? overviewProgress : 0;
  const block1Percent = block1.vinPlatePhoto ? Math.round((overviewProgress / 6) * 100) : 0;

  return (
    <div className="space-y-6">
      {submittedBannerVisible && (
        <div className="rounded-xl border border-[#bbf7d0] bg-[#f0fdf4] px-4 py-3 flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-[#166534]">
              Отчёт отправлен на проверку менеджеру
            </p>
            <p className="mt-1 text-xs text-[#16a34a]">
              Это демонстрационный режим: статус заказа в данных не меняется.
            </p>
          </div>
          <button
            type="button"
            className="text-xs text-[#16a34a] hover:text-[#15803d]"
            onClick={() => setSubmittedBannerVisible(false)}
          >
            Закрыть
          </button>
        </div>
      )}
      <div className="flex items-center gap-4">
        <Link href="/executor/orders">
          <Button variant="ghost" size="sm" className="gap-1 text-[#2563eb]">
            <ArrowLeft className="h-4 w-4" />
            Назад
          </Button>
        </Link>
        <div className="flex items-center gap-2">
          {order.assetType && <AssetTypeIcon type={order.assetType} />}
          <h1 className="text-2xl font-bold text-[#0f172a]">{order.assetName}</h1>
        </div>
        <Badge variant="secondary">{order.serviceLabel}</Badge>
        <Badge variant={order.status === "on_review" ? "warning" : "default"}>{order.statusLabel}</Badge>
      </div>

      {/* Хедер заказа: актив, VIN, адрес, согласование доступа */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Заказ</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-[#0f172a]">
            <span className="text-[#64748b]">Марка/модель:</span> {order.assetName}
          </p>
          <p className="text-sm text-[#0f172a]">
            <span className="text-[#64748b]">VIN:</span> {order.assetVin || "—"}
          </p>
          <p className="text-sm text-[#0f172a]">
            <span className="text-[#64748b]">Адрес:</span> {order.address}
          </p>
          {order.accessAgreed === null && (
            <div className="rounded-xl border border-[#fef3c7] bg-[#fffbeb] p-3">
              <p className="text-sm font-medium text-[#92400e]">
                Выезд возможен после подтверждения доступа
              </p>
              <p className="mt-1 text-sm text-[#64748b]">
                Статус: Ожидаем согласования доступа
              </p>
              {order.accessPendingHours != null && (
                <p className="mt-1 text-xs text-[#64748b]">
                  Ожидаем {order.accessPendingHours} ч
                </p>
              )}
            </div>
          )}
          {order.accessAgreed === true && (
            <p className="flex items-center gap-2 text-sm text-[#16a34a]">
              <CheckCircle className="h-4 w-4" />
              Доступ согласован
            </p>
          )}
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" size="sm" className="gap-1">
              <MessageCircle className="h-4 w-4" />
              Чат с менеджером
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-1"
              disabled={!block1.vinPlatePhoto || overviewProgress < 6}
              onClick={() => setPreviewOpen(true)}
            >
              <Eye className="h-4 w-4" />
              Открыть предпросмотр отчёта
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Шаг 0 — Доступ к активу */}
      {state.step0Access === "pending" && currentStep === "step0" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Доступ к активу</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-[#64748b]">Доступ к активу получен?</p>
            <div className="flex gap-2">
              <Button
                variant="primary"
                onClick={() => {
                  setState((s) => ({ ...s, step0Access: "yes" }));
                  setCurrentStep("block1");
                }}
              >
                Да
              </Button>
              <Button
                variant="secondary"
                onClick={() => setState((s) => ({ ...s, step0Access: "no_access" }))}
              >
                Нет
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {state.step0Access === "no_access" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Нет доступа</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="flex items-center gap-2 text-[#64748b]">
              <XCircle className="h-4 w-4" />
              Нет доступа. Дальнейшие блоки заблокированы.
            </p>
            <div className="space-y-3 rounded-xl border border-[#e2e8f0] p-4">
              <label className="block text-sm font-medium text-[#0f172a]">
                Комментарий почему нет доступа (обяз.)
              </label>
              <Input
                placeholder="Причина отсутствия доступа"
                value={state.step0Comment ?? ""}
                onChange={(e) => setState((s) => ({ ...s, step0Comment: e.target.value }))}
              />
              <p className="text-xs text-[#64748b]">Опционально: загрузка фото подтверждения</p>
              <Button variant="primary" size="sm">
                Зафиксировать как нет доступа
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Блок 1 — Идентификация и фотографирование */}
      {state.step0Access === "yes" && currentStep === "block1" && !isReadOnly && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base">Блок 1 — Идентификация и фотографирование</CardTitle>
              <p className="mt-1 text-sm text-[#64748b]">
                Блок 1/3 · заполнено {block1Percent}%
              </p>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <p className="mb-2 text-sm font-medium text-[#0f172a]">1.1 Сверка идентификаторов</p>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setBlock1({ vinPlatePhoto: block1.vinPlatePhoto ? undefined : "ok" })}
                    className="flex h-20 w-28 flex-shrink-0 items-center justify-center rounded-xl border border-dashed border-[#e2e8f0] bg-[#f8f9fb] hover:border-[#2563eb] hover:bg-[#eff6ff]"
                  >
                    {block1.vinPlatePhoto ? (
                      <CheckCircle className="h-8 w-8 text-[#16a34a]" />
                    ) : (
                      <Camera className="h-8 w-8 text-[#94a3b8]" />
                    )}
                  </button>
                  <span className="text-sm text-[#64748b]">Фото VIN-таблички</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setBlock1({ vinFramePhoto: block1.vinFramePhoto ? undefined : "ok" })}
                    className="flex h-20 w-28 flex-shrink-0 items-center justify-center rounded-xl border border-dashed border-[#e2e8f0] bg-[#f8f9fb] hover:border-[#2563eb] hover:bg-[#eff6ff]"
                  >
                    {block1.vinFramePhoto ? <CheckCircle className="h-8 w-8 text-[#16a34a]" /> : <Camera className="h-8 w-8 text-[#94a3b8]" />}
                  </button>
                  <span className="text-sm text-[#64748b]">Фото VIN/номер на раме</span>
                </div>
                <Input
                  placeholder="Комментарий по идентификации"
                  value={block1.identificationComment ?? ""}
                  onChange={(e) => setBlock1({ identificationComment: e.target.value })}
                />
              </div>
            </div>
            <div>
              <p className="mb-2 text-sm font-medium text-[#0f172a]">1.3 Фотографии салона</p>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {block1.interiorPhotos.map((p, idx) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() =>
                      setBlock1({
                        interiorPhotos: block1.interiorPhotos.map((x, i) =>
                          i === idx ? { ...x, photo: x.photo ? undefined : "ok" } : x
                        ),
                      })
                    }
                    className="rounded-xl border border-[#e2e8f0] bg-white p-2 text-left hover:border-[#2563eb] hover:bg-[#f8fafc]"
                  >
                    <div className="flex aspect-video items-center justify-center rounded-lg bg-[#f8f9fb]">
                      {p.photo ? (
                        <CheckCircle className="h-8 w-8 text-[#16a34a]" />
                      ) : (
                        <Camera className="h-6 w-6 text-[#94a3b8]" />
                      )}
                    </div>
                    <p className="mt-1 text-xs font-medium text-[#0f172a]">{p.label}</p>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-2 text-sm font-medium text-[#0f172a]">1.2 Обзорные фото (обязательные 6)</p>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {block1.overviewPhotos.map((p, idx) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() =>
                      setBlock1({
                        overviewPhotos: block1.overviewPhotos.map((x, i) =>
                          i === idx
                            ? { ...x, photo: x.photo ? undefined : "ok", hasGeo: x.photo ? x.hasGeo : true, hasTime: x.photo ? x.hasTime : true }
                            : x
                        ),
                      })
                    }
                    className="rounded-xl border border-[#e2e8f0] bg-white p-2 text-left hover:border-[#2563eb] hover:bg-[#f8fafc]"
                  >
                    <div className="flex aspect-video items-center justify-center rounded-lg bg-[#f8f9fb]">
                      {p.photo ? <CheckCircle className="h-8 w-8 text-[#16a34a]" /> : <Camera className="h-6 w-6 text-[#94a3b8]" />}
                    </div>
                    <p className="mt-1 text-xs font-medium text-[#0f172a]">{p.label}</p>
                    <div className="mt-1 flex gap-1">
                      <Badge variant="outline" className="text-[10px]">
                        {p.hasGeo ? "геометка OK" : "нет геометки"}
                      </Badge>
                      <Badge variant="outline" className="text-[10px]">
                        {p.hasTime ? "время OK" : "нет времени"}
                      </Badge>
                    </div>
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" size="sm">
                Сохранить блок 1
              </Button>
              <Button
                variant="primary"
                size="sm"
                disabled={!block1.vinPlatePhoto || overviewProgress < 6}
                onClick={() => setCurrentStep("block2")}
              >
                Перейти к блоку 2
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Блок 2 — Визуальная фиксация состояния и измерения */}
      {state.step0Access === "yes" && currentStep === "block2" && !isReadOnly && (
        <Block2UI
          block2={block2}
          setBlock2={setBlock2}
          defectSheetOpen={defectSheetOpen}
          setDefectSheetOpen={setDefectSheetOpen}
          editingDefect={editingDefect}
          setEditingDefect={setEditingDefect}
          onNext={() => setCurrentStep("block3")}
        />
      )}

      {/* Блок 3 — Техническое состояние + диагностика */}
      {state.step0Access === "yes" && currentStep === "block3" && !isReadOnly && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Блок 3 — Техническое состояние и диагностика</CardTitle>
            <p className="mt-1 text-sm text-[#64748b]">Блок 3/3</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <p className="mb-2 text-sm font-medium text-[#0f172a]">3.1 Запуск и АКБ</p>
              <p className="text-sm text-[#64748b]">Актив заводится?</p>
              <div className="mt-2 flex gap-2">
                <Button
                  variant={block3.startsOnOwn === "yes" ? "primary" : "secondary"}
                  size="sm"
                  onClick={() => setBlock3({ startsOnOwn: "yes" })}
                >
                  Да
                </Button>
                <Button
                  variant={block3.startsOnOwn === "no" ? "primary" : "secondary"}
                  size="sm"
                  onClick={() => setBlock3({ startsOnOwn: "no" })}
                >
                  Нет
                </Button>
                <Button
                  variant={block3.startsOnOwn === "booster" ? "primary" : "secondary"}
                  size="sm"
                  onClick={() => setBlock3({ startsOnOwn: "booster" })}
                >
                  С помощью бустера
                </Button>
              </div>
              {(block3.startsOnOwn === "no" || block3.startsOnOwn === "booster") && (
                <div className="mt-3 space-y-3">
                  <div className="space-y-2">
                    <p className="text-sm text-[#0f172a]">Требуется замена АКБ?</p>
                    <div className="flex gap-2">
                      <Button
                        variant={block3.batteryReplaceRequired === true ? "primary" : "secondary"}
                        size="sm"
                        onClick={() => setBlock3({ batteryReplaceRequired: true })}
                      >
                        Да
                      </Button>
                      <Button
                        variant={block3.batteryReplaceRequired === false ? "primary" : "secondary"}
                        size="sm"
                        onClick={() => setBlock3({ batteryReplaceRequired: false })}
                      >
                        Нет
                      </Button>
                    </div>
                  </div>
                  {block3.batteryReplaceRequired === true && (
                    <div>
                      <label className="block text-sm text-[#0f172a] mb-1">
                        Вольтаж АКБ (V)
                      </label>
                      <Input
                        type="number"
                        step="0.1"
                        placeholder="Например, 11.5"
                        className="w-32"
                        value={block3.batteryVoltage ?? ""}
                        onChange={(e) => setBlock3({ batteryVoltage: e.target.value ? Number(e.target.value) : undefined })}
                      />
                    </div>
                  )}
                </div>
              )}
              <div className="mt-3">
                <p className="text-sm text-[#0f172a] mb-2">Пробег / мото-часы</p>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Значение"
                    className="flex-1"
                    value={block3.mileageValue ?? ""}
                    onChange={(e) => setBlock3({ mileageValue: e.target.value ? Number(e.target.value) : undefined })}
                  />
                  <Select
                    className="w-40"
                    value={block3.mileageUnit ?? "km"}
                    onChange={(e) => setBlock3({ mileageUnit: e.target.value as "km" | "mh" })}
                  >
                    <option value="km">км</option>
                    <option value="mh">мото-часы</option>
                  </Select>
                </div>
              </div>
              {block3.startsOnOwn === "yes" && (
                <div className="mt-3">
                  <p className="text-sm text-[#0f172a] mb-2">Фото приборной панели с заведенным двигателем</p>
                  <button
                    type="button"
                    onClick={() => setBlock3({ dashboardPhoto: block3.dashboardPhoto ? undefined : "ok" })}
                    className="flex h-20 w-28 items-center justify-center rounded-xl border border-dashed border-[#e2e8f0] bg-[#f8f9fb] hover:border-[#2563eb] hover:bg-[#eff6ff]"
                  >
                    {block3.dashboardPhoto ? (
                      <CheckCircle className="h-8 w-8 text-[#16a34a]" />
                    ) : (
                      <Camera className="h-8 w-8 text-[#94a3b8]" />
                    )}
                  </button>
                </div>
              )}
            </div>
            <div>
              <p className="mb-2 text-sm font-medium text-[#0f172a]">3.2 Подкапотное пространство / течи / шумы</p>
              <p className="text-sm text-[#64748b] mb-2">Фото подкапотного пространства</p>
              <button
                type="button"
                onClick={() => setBlock3({ underhoodPhoto: block3.underhoodPhoto ? undefined : "ok" })}
                className="flex h-20 w-28 items-center justify-center rounded-xl border border-dashed border-[#e2e8f0] bg-[#f8f9fb] hover:border-[#2563eb] hover:bg-[#eff6ff]"
              >
                {block3.underhoodPhoto ? (
                  <CheckCircle className="h-8 w-8 text-[#16a34a]" />
                ) : (
                  <Camera className="h-8 w-8 text-[#94a3b8]" />
                )}
              </button>
              <p className="mt-4 text-sm text-[#64748b] mb-2">Есть ли течи рабочих жидкостей и посторонние шумы?</p>
              <div className="space-y-2">
                {block3.underhoodIssues.map((issue) => (
                  <div key={issue.id} className="flex items-center justify-between rounded-lg border border-[#e2e8f0] bg-white p-3">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-[#0f172a]">
                        {issue.type === "leak" ? "Течь" : "Шум"}: {issue.name}
                      </p>
                      <p className="text-xs text-[#64748b]">
                        Устр. в полевых: {issue.fieldFixable ? "да" : "нет"}
                        {issue.normHours != null && `, ${issue.normHours} н/ч`}
                        {issue.parts && `, запчасти: ${issue.parts}`}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setBlock3({
                          underhoodIssues: block3.underhoodIssues.filter((d) => d.id !== issue.id),
                        });
                      }}
                      className="ml-2 text-[#ef4444] hover:text-[#dc2626]"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                ))}
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setUnderhoodIssueFormOpen(true)}
                >
                  + Добавить течь / шум
                </Button>
              </div>
            </div>
            <div>
              <p className="mb-2 text-sm font-medium text-[#0f172a]">3.3 Компьютерная диагностика</p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setBlock3({ diagFile: block3.diagFile ? undefined : "diag.pdf" })}
                  className="flex h-16 w-32 flex-shrink-0 items-center justify-center rounded-xl border border-dashed border-[#e2e8f0] bg-[#f8f9fb] hover:border-[#2563eb] hover:bg-[#eff6ff]"
                >
                  {block3.diagFile ? <FileText className="h-8 w-8 text-[#16a34a]" /> : <FileText className="h-8 w-8 text-[#94a3b8]" />}
                </button>
                <span className="text-sm text-[#64748b]">Файл диагностики (обяз.)</span>
              </div>
            </div>
            <div>
              <p className="mb-2 text-sm font-medium text-[#0f172a]">3.4 Общий комментарий по техническому состоянию актива</p>
              <Input
                placeholder="Комментарий по техническому состоянию (обяз.)"
                value={block3.diagComment ?? ""}
                onChange={(e) => setBlock3({ diagComment: e.target.value })}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="secondary" size="sm">Сохранить блок 3</Button>
              <Button variant="outline" size="sm" onClick={() => setPreviewOpen(true)}>
                Предпросмотр отчёта
              </Button>
              <Button
                variant="primary"
                size="sm"
                disabled={!blocksValid}
                onClick={() => {
                  if (!blocksValid) return;
                  setSubmittedBannerVisible(true);
                }}
              >
                Сдать / Отправить на проверку
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Навигация между блоками (если не step0 и не no_access) */}
      {state.step0Access === "yes" && !isReadOnly && (
        <Card>
          <CardContent className="flex flex-wrap gap-2 pt-6">
            <Button variant="outline" size="sm" onClick={() => setCurrentStep("block1")}>Блок 1</Button>
            <Button variant="outline" size="sm" onClick={() => setCurrentStep("block2")}>Блок 2</Button>
            <Button variant="outline" size="sm" onClick={() => setCurrentStep("block3")}>Блок 3</Button>
          </CardContent>
        </Card>
      )}

      {/* Предпросмотр отчёта (Executor Preview) */}
      <Sheet open={previewOpen} onOpenChange={setPreviewOpen} title="Предпросмотр отчёта">
        <div className="space-y-6 pb-8">
          <Badge variant="secondary">Виден заказчику</Badge>
          <section>
            <h3 className="text-sm font-semibold text-[#0f172a]">Блок 1 — Идентификация и фото</h3>
            <p className="mt-1 text-xs text-[#64748b]">VIN-фото, обзорные 6 фото</p>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {block1.overviewPhotos.map((p) => (
                <div key={p.id} className="rounded-lg border border-[#e2e8f0] bg-[#f8f9fb] p-2">
                  <div className="aspect-video rounded bg-[#e2e8f0]" />
                  <p className="mt-1 text-xs font-medium text-[#0f172a]">{p.label}</p>
                </div>
              ))}
            </div>
          </section>
          <section>
            <h3 className="text-sm font-semibold text-[#0f172a]">Блок 2 — Визуальная фиксация состояния</h3>
            {block2.defects.length === 0 ? (
              <p className="mt-1 text-xs text-[#64748b]">Дефектов нет</p>
            ) : (
              <ul className="mt-2 space-y-2">
                {block2.defects.map((d) => (
                  <li key={d.id} className="rounded-xl border border-[#e2e8f0] p-2 text-sm">
                    <span className="font-medium">{d.zoneLabel}</span> — {d.defectTypeLabel}, влияние: {d.impact}, устранимо в полевых: {d.fieldFixable ? "да" : "нет"}
                  </li>
                ))}
              </ul>
            )}
            {block2.thicknessPanels.length > 0 && (
              <>
                <h4 className="mt-3 text-xs font-medium text-[#0f172a]">Толщиномер</h4>
                <div className="mt-1 space-y-1">
                  {block2.thicknessPanels.map((panel) => (
                    <div key={panel.id} className="text-xs text-[#0f172a]">
                      <span className="font-medium">{panel.label}: </span>
                      {(["p1", "p2"] as const)
                        .map((k) => (panel.points as Record<string, string>)[k] || "—")
                        .map((val, idx) => `P${idx + 1}=${val}`)
                        .join(", ")}
                    </div>
                  ))}
                </div>
              </>
            )}
            <h4 className="mt-2 text-xs font-medium text-[#0f172a]">Шины</h4>
            {block2.tires.length === 0 ? (
              <p className="text-xs text-[#64748b]">Данные по шинам не заполнены.</p>
            ) : (
              <ul className="mt-1 space-y-1 text-xs text-[#0f172a]">
                {block2.tires.map((t) => (
                  <li key={t.id}>
                    <span className="font-medium">{t.label}:</span>{" "}
                    протектор {t.treadMm != null ? `${t.treadMm} мм` : "—"}, давление{" "}
                    {t.pressureBar != null ? `${t.pressureBar} bar` : "—"}
                  </li>
                ))}
              </ul>
            )}
          </section>
          <section>
            <h3 className="text-sm font-semibold text-[#0f172a]">Блок 3 — Техсостояние и диагностика</h3>
            <p className="mt-1 text-xs text-[#64748b]">
              Запуск:{" "}
              {block3.startsOnOwn === "yes"
                ? "да"
                : block3.startsOnOwn === "no"
                  ? "нет"
                  : block3.startsOnOwn === "booster"
                    ? "с помощью бустера"
                    : "не указано"}
              {block3.batteryVoltage != null && `, вольтаж АКБ: ${block3.batteryVoltage} V`}
              {block3.batteryReplaceRequired !== undefined &&
                `, требуется замена АКБ: ${block3.batteryReplaceRequired ? "да" : "нет"}`}
            </p>
            {(block3.mileageValue != null || block3.mileageUnit) && (
              <p className="mt-1 text-xs text-[#64748b]">
                Пробег / мото-часы:{" "}
                {block3.mileageValue != null ? block3.mileageValue : "—"}{" "}
                {block3.mileageUnit === "mh" ? "м/ч" : "км"}
              </p>
            )}
            {block3.underhoodIssues.length > 0 && (
              <div className="mt-2">
                <p className="text-xs font-medium text-[#0f172a]">Подкапотное / течи / шумы:</p>
                <ul className="mt-1 space-y-1 text-xs text-[#64748b]">
                  {block3.underhoodIssues.map((issue) => (
                    <li key={issue.id}>
                      {issue.type === "leak" ? "Течь" : "Шум"}: {issue.name}
                      {issue.fieldFixable && issue.normHours && `, ${issue.normHours} н/ч`}
                      {issue.parts && `, запчасти: ${issue.parts}`}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <p className="mt-2 text-xs text-[#64748b]">
              Файл диагностики: {block3.diagFile ? "загружен" : "—"}
            </p>
            <div className="mt-2">
              <p className="text-xs font-medium text-[#0f172a]">Общий комментарий по техническому состоянию:</p>
              <p className="mt-1 text-xs text-[#64748b]">{block3.diagComment || "—"}</p>
            </div>
          </section>
        </div>
      </Sheet>

      {/* Sheet добавления течи/шума */}
      <UnderhoodIssueFormSheet
        open={underhoodIssueFormOpen}
        onOpenChange={setUnderhoodIssueFormOpen}
        onSave={(issue) => {
          setBlock3({ underhoodIssues: [...block3.underhoodIssues, issue] });
          setUnderhoodIssueFormOpen(false);
        }}
        onCancel={() => setUnderhoodIssueFormOpen(false)}
      />

      {/* Sheet добавления/редактирования дефекта */}
      <DefectFormSheet
        open={defectSheetOpen}
        onOpenChange={setDefectSheetOpen}
        defect={editingDefect}
        zones={getDefectZones(block2.assetType)}
        onSave={(d) => {
          if (editingDefect) {
            setBlock2({
              defects: block2.defects.map((x) => (x.id === d.id ? d : x)),
            });
          } else {
            setBlock2({ defects: [...block2.defects, d] });
          }
          setEditingDefect(null);
          setDefectSheetOpen(false);
        }}
        onCancel={() => {
          setEditingDefect(null);
          setDefectSheetOpen(false);
        }}
      />
    </div>
  );
}

function Block2UI({
  block2,
  setBlock2,
  defectSheetOpen,
  setDefectSheetOpen,
  editingDefect,
  setEditingDefect,
  onNext,
}: {
  block2: AuditBlock2;
  setBlock2: (b: Partial<AuditBlock2>) => void;
  defectSheetOpen: boolean;
  setDefectSheetOpen: (v: boolean) => void;
  editingDefect: AuditDefect | null;
  setEditingDefect: (d: AuditDefect | null) => void;
  onNext: () => void;
}) {
  const zones = getDefectZones(block2.assetType);
  const thicknessPanelsList = useMemo(
    () =>
      block2.assetType
        ? getThicknessPanels(block2.assetType).map((p) => ({
            ...p,
            points: block2.thicknessPanels.find((t) => t.label === p.label)?.points ?? {},
          }))
        : [],
    [block2.assetType, block2.thicknessPanels]
  );
  const thicknessRequired = !block2.thicknessOptional && block2.assetType && block2.assetType !== "trailer";
  const thicknessFilled =
    !thicknessRequired ||
    block2.thicknessPanels.every((t) =>
      ["p1", "p2", "p3", "p4", "p5"].every((k) => (t.points as Record<string, string>)[k])
    );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Блок 2 — Визуальная фиксация состояния и измерения</CardTitle>
        <p className="mt-1 text-sm text-[#64748b]">Блок 2/3</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <p className="mb-2 text-sm font-medium text-[#0f172a]">2.1 Тип актива и конфигурация</p>
          <Select
            value={block2.assetType ?? ""}
            onChange={(e) => {
              const v = e.target.value as AuditAssetType | "";
              if (!v) return;
              const panels = getThicknessPanels(v).map((p) => ({ id: p.id, label: p.label, points: {} }));
              let tires: { id: string; label: string }[] = [];
              if (v === "passenger" || v === "lcv") {
                tires = [{ id: "w1", label: "Перед лев" }, { id: "w2", label: "Перед прав" }, { id: "w3", label: "Зад лев" }, { id: "w4", label: "Зад прав" }];
              }
              if (v === "truck") {
                const axes = 3;
                tires = Array.from({ length: axes * 2 }, (_, i) => ({
                  id: `w${i + 1}`,
                  label: `Ось ${Math.floor(i / 2) + 1} ${i % 2 === 0 ? "лев" : "прав"}`,
                }));
                setBlock2({
                  assetType: v,
                  axesCount: 3,
                  thicknessPanels: panels,
                  tires,
                  specialChassis: undefined,
                });
                return;
              }
              setBlock2({
                assetType: v,
                thicknessPanels: panels,
                tires,
                specialChassis: undefined,
              });
            }}
          >
            <option value="">Выберите тип</option>
            {Object.entries(ASSET_TYPE_LABELS).map(([k, l]) => (
              <option key={k} value={k}>{l}</option>
            ))}
          </Select>
          {block2.assetType === "truck" && (
            <Select
              className="mt-2"
              value={String(block2.axesCount ?? 3)}
              onChange={(e) => {
                const axes = Number(e.target.value) as 2 | 3 | 4;
                const tires = Array.from({ length: axes * 2 }, (_, i) => ({
                  id: `w${i + 1}`,
                  label: `Ось ${Math.floor(i / 2) + 1} ${i % 2 === 0 ? "лев" : "прав"}`,
                }));
                setBlock2({ axesCount: axes, tires });
              }}
            >
              <option value="2">2 оси</option>
              <option value="3">3 оси</option>
              <option value="4">4 оси</option>
            </Select>
          )}
          {block2.assetType === "trailer" && (
            <Select
              className="mt-2"
              value={String(block2.axesCount ?? 2)}
              onChange={(e) => setBlock2({ axesCount: Number(e.target.value) as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 })}
            >
              <option value="1">1 ось</option>
              <option value="2">2 оси</option>
              <option value="3">3 оси</option>
              <option value="4">4 оси</option>
              <option value="5">5 осей</option>
              <option value="6">6 осей</option>
              <option value="7">7 осей</option>
              <option value="8">8 осей</option>
            </Select>
          )}
          {block2.assetType === "special" && (
            <Select
              className="mt-2"
              value={block2.specialChassis ?? ""}
              onChange={(e) =>
                setBlock2({
                  specialChassis: e.target.value as SpecialChassis,
                  tires: e.target.value === "tracked" ? [] : block2.tires,
                  trackReadings: e.target.value === "tracked" ? [{ id: "tr1", label: "Гусеницы", done: false }, { id: "tr2", label: "Катки", done: false }, { id: "tr3", label: "Ведущая звезда", done: false }] : undefined,
                })
              }
            >
              <option value="">Выберите тип ходовой</option>
              <option value="wheeled">Колёсная</option>
              <option value="tracked">Гусеничная</option>
            </Select>
          )}
        </div>

        <div>
          <p className="mb-2 text-sm font-medium text-[#0f172a]">2.2 Есть повреждения/дефекты?</p>
          <div className="flex gap-2">
            <Button variant={block2.hasDefects ? "primary" : "secondary"} size="sm" onClick={() => setBlock2({ hasDefects: true })}>Да</Button>
            <Button variant={!block2.hasDefects ? "primary" : "secondary"} size="sm" onClick={() => setBlock2({ hasDefects: false })}>Нет</Button>
          </div>
          {block2.hasDefects && (
            <div className="mt-3">
              {block2.defects.map((d) => (
                <div key={d.id} className="mb-2 flex items-center justify-between rounded-xl border border-[#e2e8f0] p-3">
                  <span className="text-sm">{d.zoneLabel} — {d.defectTypeLabel}, impact: {d.impact}</span>
                  <div className="flex gap-1">
                    <Badge variant={d.isNonField ? "destructive" : "secondary"}>{d.isNonField ? "неполевой" : "полевой"}</Badge>
                    <Button variant="ghost" size="sm" onClick={() => { setEditingDefect(d); setDefectSheetOpen(true); }}>Изм.</Button>
                  </div>
                </div>
              ))}
              <Button variant="outline" size="sm" className="gap-1" onClick={() => { setEditingDefect(null); setDefectSheetOpen(true); }}>
                <Plus className="h-4 w-4" />
                Добавить дефект
              </Button>
            </div>
          )}
        </div>

        {block2.assetType && (block2.assetType === "passenger" || block2.assetType === "lcv") && thicknessPanelsList.length > 0 && (
          <div>
            <p className="mb-2 text-sm font-medium text-[#0f172a]">
              2.4 Толщиномер
            </p>
            <p className="text-xs text-[#64748b]">Каждая панель — 2 точки (левая и правая)</p>
            {thicknessPanelsList.map((panel) => (
              <div key={panel.id} className="mt-2 rounded-xl border border-[#e2e8f0] p-3">
                <p className="text-sm font-medium text-[#0f172a] mb-2">{panel.label}</p>
                <div className="flex gap-2">
                  {(["p1", "p2"] as const).map((k) => (
                    <div key={k} className="flex flex-col gap-1">
                      <label className="text-xs font-medium text-[#64748b]">{k.toUpperCase()}</label>
                      <Input
                        className="h-10 w-20"
                        placeholder="мм"
                        value={(panel.points as Record<string, string>)[k] ?? ""}
                        onChange={(e) => {
                          const nextPoints = { ...(panel.points as Record<string, string>), [k]: e.target.value };
                          const nextPanels = block2.thicknessPanels.map((t) =>
                            t.label === panel.label ? { ...t, points: nextPoints } : t
                          );
                          setBlock2({ thicknessPanels: nextPanels });
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {block2.specialChassis === "tracked" && block2.trackReadings && (
          <div>
            <p className="mb-2 text-sm font-medium text-[#0f172a]">Ходовая (гусеницы/катки)</p>
            {block2.trackReadings.map((tr) => (
              <div key={tr.id} className="flex items-center justify-between rounded-xl border border-[#e2e8f0] p-2">
                <span className="text-sm">{tr.label}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#64748b]">фото</span>
                  <input type="checkbox" checked={tr.done} readOnly className="rounded" />
                </div>
              </div>
            ))}
          </div>
        )}

        {block2.tires.length > 0 && (
          <div>
            <p className="mb-2 text-sm font-medium text-[#0f172a]">2.5 Шины и давление</p>
            <p className="mb-1 text-xs text-[#64748b]">
              Для каждой позиции укажите остаток протектора и давление в шине.
            </p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {block2.tires.map((tire, idx) => (
                <div key={tire.id} className="rounded-xl border border-[#e2e8f0] p-3 space-y-2">
                  <p className="text-xs font-medium text-[#0f172a]">{tire.label}</p>
                  <div className="flex items-center gap-2">
                    <span className="w-24 text-[11px] text-[#64748b]">Протектор (мм)</span>
                    <Input
                      type="number"
                      min={0}
                      step="0.1"
                      className="h-8 w-20 text-xs"
                      placeholder="мм"
                      value={tire.treadMm ?? ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        const next = [...block2.tires];
                        next[idx] = {
                          ...next[idx],
                          treadMm: value === "" ? undefined : Number(value),
                        };
                        setBlock2({ tires: next });
                      }}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-24 text-[11px] text-[#64748b]">Давление (bar)</span>
                    <Input
                      type="number"
                      min={0}
                      step="0.1"
                      className="h-8 w-20 text-xs"
                      placeholder="bar"
                      value={tire.pressureBar ?? ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        const next = [...block2.tires];
                        next[idx] = {
                          ...next[idx],
                          pressureBar: value === "" ? undefined : Number(value),
                        };
                        setBlock2({ tires: next });
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <Button variant="secondary" size="sm">Сохранить блок 2</Button>
          <Button
            variant="primary"
            size="sm"
            disabled={!block2.assetType || (thicknessRequired && !thicknessFilled)}
            onClick={onNext}
          >
            Перейти к блоку 3
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function DefectFormSheet({
  open,
  onOpenChange,
  defect,
  zones,
  onSave,
  onCancel,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  defect: AuditDefect | null;
  zones: string[];
  onSave: (d: AuditDefect) => void;
  onCancel: () => void;
}) {
  const [zone, setZone] = useState(defect?.zone ?? zones[0] ?? "");
  const [defectType, setDefectType] = useState<DefectType>(defect?.defectType ?? "paint_damage");
  const [comment, setComment] = useState(defect?.comment ?? "");
  const [impact, setImpact] = useState<DefectImpact>(defect?.impact ?? "low");
  const [fieldFixable, setFieldFixable] = useState(defect?.fieldFixable ?? false);
  const [normHours, setNormHours] = useState(String(defect?.normHours ?? ""));
  const [materialsNeeded, setMaterialsNeeded] = useState(defect?.materialsNeeded ?? false);
  const [materialsComment, setMaterialsComment] = useState(defect?.materialsComment ?? "");

  const handleSave = () => {
    onSave({
      id: defect?.id ?? `d${Date.now()}`,
      zone,
      zoneLabel: zone,
      defectType,
      defectTypeLabel: DEFECT_TYPE_LABELS[defectType],
      comment,
      impact,
      fieldFixable,
      normHours: fieldFixable ? (normHours ? Number(normHours) : undefined) : undefined,
      materialsNeeded: fieldFixable ? materialsNeeded : undefined,
      materialsComment: fieldFixable && materialsNeeded ? materialsComment : undefined,
      isNonField: !fieldFixable,
    });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange} title={defect ? "Редактировать дефект" : "Добавить дефект"}>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-[#0f172a]">Зона</label>
          <Select value={zone} onChange={(e) => setZone(e.target.value)}>
            {zones.map((z) => (
              <option key={z} value={z}>{z}</option>
            ))}
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium text-[#0f172a]">Тип дефекта</label>
          <Select value={defectType} onChange={(e) => setDefectType(e.target.value as DefectType)}>
            {Object.entries(DEFECT_TYPE_LABELS).map(([k, l]) => (
              <option key={k} value={k}>{l}</option>
            ))}
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium text-[#0f172a]">Фото дефекта с линейкой (обяз.)</label>
          <div className="mt-1 h-20 w-28 rounded-xl border border-dashed border-[#e2e8f0] bg-[#f8f9fb]" />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#0f172a]">Комментарий (обяз.)</label>
          <Input value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Комментарий" />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#0f172a]">Влияние на товарную привлекательность</label>
          <Select value={impact} onChange={(e) => setImpact(e.target.value as DefectImpact)}>
            {Object.entries(IMPACT_LABELS).map(([k, l]) => (
              <option key={k} value={k}>{l}</option>
            ))}
          </Select>
        </div>
        <div>
          <p className="text-sm font-medium text-[#0f172a]">Устранимо в полевых условиях?</p>
          <div className="flex gap-2 mt-1">
            <Button variant={fieldFixable ? "primary" : "secondary"} size="sm" onClick={() => setFieldFixable(true)}>Да</Button>
            <Button variant={!fieldFixable ? "primary" : "secondary"} size="sm" onClick={() => setFieldFixable(false)}>Нет</Button>
          </div>
          {fieldFixable && (
            <div className="mt-3 space-y-2">
              <label className="block text-sm">Нормо-часы на устранение</label>
              <Input type="number" value={normHours} onChange={(e) => setNormHours(e.target.value)} />
              <p className="text-sm">Нужны материалы/детали?</p>
              <div className="flex gap-2">
                <Button variant={materialsNeeded ? "primary" : "secondary"} size="sm" onClick={() => setMaterialsNeeded(true)}>Да</Button>
                <Button variant={!materialsNeeded ? "primary" : "secondary"} size="sm" onClick={() => setMaterialsNeeded(false)}>Нет</Button>
              </div>
              {materialsNeeded && (
                <Input placeholder="Что именно нужно (без цены)" value={materialsComment} onChange={(e) => setMaterialsComment(e.target.value)} className="mt-2" />
              )}
            </div>
          )}
        </div>
        <div className="flex gap-2 pt-4">
          <Button variant="primary" onClick={handleSave}>Сохранить</Button>
          <Button variant="secondary" onClick={onCancel}>Отмена</Button>
        </div>
      </div>
    </Sheet>
  );
}

function UnderhoodIssueFormSheet({
  open,
  onOpenChange,
  onSave,
  onCancel,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSave: (issue: UnderhoodIssue) => void;
  onCancel: () => void;
}) {
  const [type, setType] = useState<"leak" | "noise">("leak");
  const [name, setName] = useState("");
  const [fieldFixable, setFieldFixable] = useState(false);
  const [normHours, setNormHours] = useState("");
  const [parts, setParts] = useState("");

  const handleSave = () => {
    onSave({
      id: `uh${Date.now()}`,
      type,
      name,
      fieldFixable,
      normHours: normHours ? Number(normHours) : undefined,
      parts: parts.trim() || undefined,
    });
    setType("leak");
    setName("");
    setFieldFixable(false);
    setNormHours("");
    setParts("");
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange} title="Добавить течь / шум">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-[#0f172a] mb-2">Тип</label>
          <div className="flex gap-2">
            <Button variant={type === "leak" ? "primary" : "secondary"} size="sm" onClick={() => setType("leak")}>
              Течь
            </Button>
            <Button variant={type === "noise" ? "primary" : "secondary"} size="sm" onClick={() => setType("noise")}>
              Шум
            </Button>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-[#0f172a]">Название (обяз.)</label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Например: Разрушение ЛКП, impact low"
          />
        </div>
        <div>
          <p className="text-sm font-medium text-[#0f172a]">Устранимо в полевых условиях?</p>
          <div className="flex gap-2 mt-1">
            <Button variant={fieldFixable ? "primary" : "secondary"} size="sm" onClick={() => setFieldFixable(true)}>
              Да
            </Button>
            <Button variant={!fieldFixable ? "primary" : "secondary"} size="sm" onClick={() => setFieldFixable(false)}>
              Нет
            </Button>
          </div>
          {fieldFixable && (
            <div className="mt-3 space-y-2">
              <label className="block text-sm">Нормо-часы</label>
              <Input type="number" value={normHours} onChange={(e) => setNormHours(e.target.value)} />
              <label className="block text-sm">Запчасти (если требуются)</label>
              <Input
                placeholder="Описание запчастей"
                value={parts}
                onChange={(e) => setParts(e.target.value)}
              />
            </div>
          )}
        </div>
        <div className="flex gap-2 pt-4">
          <Button variant="primary" onClick={handleSave} disabled={!name.trim()}>
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
