"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { mockOrders } from "@/data/mock";
import {
  getAuditState,
  type Order,
  type AuditState,
  type InternalEstimateBlock4,
  type CommercialOfferBlock5,
} from "@/data/mock";
import { ArrowLeft, MessageSquare, FileText, History, Eye, Calculator, Send } from "lucide-react";
import { useState, useEffect } from "react";

type TabId = "chat" | "history" | "documents" | "report" | "estimate" | "kp";

function mapAuditStatusToOrder(
  s: AuditState["order"]["status"]
): Order["status"] {
  if (s === "on_review") return "on_review";
  if (s === "completed") return "completed";
  if (
    s === "in_progress" ||
    s === "access_pending" ||
    s === "no_access" ||
    s === "on_rework"
  )
    return "in_progress";
  return "new";
}

export default function OrderCardPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = params.id as string;
  const orderFromMock = mockOrders.find((o) => o.id === id);
  const auditState = getAuditState(id);

  const order: Order | null = orderFromMock ?? (auditState
    ? {
        id: auditState.order.id,
        assetName: auditState.order.assetName,
        assetVin: auditState.order.assetVin,
        assetYear: 0,
        assetMileage: 0,
        address: auditState.order.address,
        city: auditState.order.city,
        service: auditState.order.serviceLabel,
        serviceType: "audit",
        amount: 0,
        status: mapAuditStatusToOrder(auditState.order.status),
        executorId: undefined,
        executorName: undefined,
      }
    : null);

  const isAudit = order?.serviceType === "audit" || !!auditState;
  const tabFromUrl = searchParams.get("tab");
  const initialTab: TabId =
    tabFromUrl === "report" || tabFromUrl === "estimate" || tabFromUrl === "kp"
      ? tabFromUrl
      : isAudit
        ? "report"
        : "chat";
  const [activeTab, setActiveTab] = useState<TabId>(initialTab);
  useEffect(() => {
    const t = searchParams.get("tab");
    if (t === "report" || t === "estimate" || t === "kp") setActiveTab(t);
  }, [searchParams]);
  const [qaScore, setQaScore] = useState(auditState?.managerQA?.qualityScore ?? 0);
  const [qaComment, setQaComment] = useState(auditState?.managerQA?.qaComment ?? "");
  const [block4Local, setBlock4Local] = useState<InternalEstimateBlock4 | null>(
    auditState?.block4 ?? null
  );
  const [block5Local, setBlock5Local] = useState<CommercialOfferBlock5 | null>(
    auditState?.block5 ?? null
  );

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

  const baseTabs: { id: TabId; label: string; icon: React.ReactNode }[] = [
    { id: "chat", label: "Сообщения", icon: <MessageSquare className="h-4 w-4" /> },
    { id: "history", label: "История", icon: <History className="h-4 w-4" /> },
    { id: "documents", label: "Документы", icon: <FileText className="h-4 w-4" /> },
  ];

  const auditTabs: { id: TabId; label: string; icon: React.ReactNode }[] = [
    { id: "report", label: "Отчёт (блоки 1–3)", icon: <Eye className="h-4 w-4" /> },
    { id: "estimate", label: "Оценочная ведомость (внутреннее)", icon: <Calculator className="h-4 w-4" /> },
    { id: "kp", label: "КП для заказчика", icon: <Send className="h-4 w-4" /> },
    ...baseTabs,
  ];

  const tabs = isAudit ? auditTabs : baseTabs;

  const b4 = block4Local ?? auditState?.block4;
  const b5 = block5Local ?? auditState?.block5;

  const auditResultSentToCustomer = isAudit && (order.status === "completed" || !!b5?.sentToCustomer);

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
        <Badge
          variant={
            order.status === "new"
              ? "secondary"
              : order.status === "in_progress"
                ? "default"
                : "outline"
          }
        >
          {order.status === "new" && "Новый"}
          {order.status === "in_progress" && "В работе"}
          {order.status === "on_review" && "На проверке"}
          {order.status === "completed" && "Завершён"}
        </Badge>
        {isAudit && (
          <Badge variant="secondary">Аудит</Badge>
        )}
      </div>

      {auditResultSentToCustomer && (
        <Card className="rounded-2xl border border-[#e2e8f0] bg-white shadow-[0_1px_3px_0_rgb(0_0_0_/_.05)]">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Результат аудита</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-[#64748b] mb-4">
              Аудит завершён. Выберите дальнейшее действие:
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href={`/manager/prep/${id}/select`}>
                <Button variant="primary" className="gap-1">
                  Обслуживание и ремонт
                </Button>
              </Link>
              <Link href={`/manager/sale/${id}/start`}>
                <Button variant="secondary" className="gap-1">
                  Продажа под ключ
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Информация об активе</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>
            <span className="text-[#64748b]">VIN:</span> {order.assetVin || "—"}
          </p>
          <p>
            <span className="text-[#64748b]">Адрес:</span> {order.address}
          </p>
          <p>
            <span className="text-[#64748b]">Услуга:</span> {order.service}
          </p>
          <p>
            <span className="text-[#64748b]">Сумма:</span>{" "}
            {order.amount ? `${order.amount.toLocaleString("ru")} ₽` : "—"}
          </p>
          {order.executorName && (
            <p>
              <span className="text-[#64748b]">Исполнитель:</span>{" "}
              <Link
                href={`/manager/executors/${order.executorId}`}
                className="text-[#2563eb] hover:underline"
              >
                {order.executorName}
              </Link>
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <div className="flex flex-wrap border-b border-[#e2e8f0]">
          {tabs.map(({ id: tabId, label, icon }) => (
            <button
              key={tabId}
              type="button"
              onClick={() => setActiveTab(tabId)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === tabId
                  ? "border-b-2 border-[#2563eb] text-[#2563eb]"
                  : "text-[#64748b] hover:text-[#0f172a]"
              }`}
            >
              {icon}
              {label}
            </button>
          ))}
        </div>
        <CardContent className="p-6">
          {activeTab === "report" && isAudit && auditState && (
            <div className="space-y-6">
              <Badge variant="secondary">Виден заказчику</Badge>
              <section>
                <h3 className="text-sm font-semibold text-[#0f172a]">Блок 1 — Идентификация и фото</h3>
                <p className="mt-1 text-xs text-[#64748b]">VIN-фото, обзорные 6 фото</p>
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
                  <p className="mt-1 text-xs text-[#64748b]">Дефектов нет</p>
                ) : (
                  <ul className="mt-2 space-y-2">
                    {auditState.block2.defects.map((d) => (
                      <li key={d.id} className="rounded-xl border border-[#e2e8f0] p-2 text-sm">
                        {d.zoneLabel} — {d.defectTypeLabel}, влияние: {d.impact}, полевой: {d.fieldFixable ? "да" : "нет"}
                      </li>
                    ))}
                  </ul>
                )}
                <p className="mt-2 text-xs text-[#64748b]">Толщиномер: панели и точки. Шины: протектор, давление.</p>
              </section>
              <section>
                <h3 className="text-sm font-semibold text-[#0f172a]">Блок 3 — Техсостояние и диагностика</h3>
                <p className="mt-1 text-xs text-[#64748b]">
                  Запуск:{" "}
                  {auditState.block3.startsOnOwn === "yes"
                    ? "да"
                    : auditState.block3.startsOnOwn === "no"
                      ? "нет"
                      : auditState.block3.startsOnOwn === "booster"
                        ? "с помощью бустера"
                        : "не указано"}
                  {auditState.block3.underhoodIssues.length > 0 && `, проблемы подкапотного: ${auditState.block3.underhoodIssues.length}`}
                  , файл: {auditState.block3.diagFile ? "загружен" : "—"}
                </p>
                <div className="mt-2">
                  <p className="text-xs font-medium text-[#0f172a]">Общий комментарий по техническому состоянию:</p>
                  <p className="mt-1 text-xs text-[#64748b]">{auditState.block3.diagComment || "—"}</p>
                </div>
              </section>
              <div className="rounded-xl border border-[#e2e8f0] bg-[#f8f9fb] p-4">
                <p className="mb-2 text-sm font-medium text-[#0f172a]">Оценка качества исполнителя (1–5, шаг 0.1)</p>
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
                <p className="mt-2 text-sm font-medium text-[#0f172a]">Комментарий при возврате на доработку</p>
                <Input
                  className="mt-1"
                  placeholder="Обязателен при возврате"
                  value={qaComment}
                  onChange={(e) => setQaComment(e.target.value)}
                />
                <div className="mt-4 flex gap-2">
                  <Button variant="primary">Принять</Button>
                  <Button variant="secondary">Вернуть на доработку</Button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "estimate" && isAudit && (
            <div className="space-y-4">
              <Badge variant="destructive">Внутренний</Badge>
              <p className="text-sm text-[#64748b]">
                Оценочная ведомость: неполевые дефекты, работы по нормо-часам, материалы. Заказчик не видит.
              </p>
              {b4 && (
                <>
                  <ul className="space-y-2">
                    {b4.items.map((item) => (
                      <li key={item.id} className="flex items-center justify-between rounded-xl border border-[#e2e8f0] px-3 py-2 text-sm">
                        <span>{item.label}</span>
                        <span className="text-[#64748b]">
                          {item.type === "material" ? (
                            <Input
                              type="number"
                              className="w-24 text-right"
                              value={item.amount ?? ""}
                              onChange={() => {}}
                              placeholder="₽"
                            />
                          ) : (
                            `${item.amount?.toLocaleString("ru") ?? "—"} ₽`
                          )}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <p className="font-medium text-[#0f172a]">
                    Внутренняя смета: работы {(b4.totalWork ?? 0).toLocaleString("ru")} ₽ + материалы {(b4.totalMaterials ?? 0).toLocaleString("ru")} ₽
                  </p>
                  <Button variant="primary" size="sm">Сохранить ведомость (блок 4)</Button>
                </>
              )}
              {!b4 && (
                <p className="text-sm text-[#64748b]">Ведомость будет доступна после принятия отчёта.</p>
              )}
            </div>
          )}

          {activeTab === "kp" && isAudit && (
            <div className="space-y-4">
              <Badge variant="secondary">Виден заказчику</Badge>
              {b5 && (
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
                    <ul className="mt-2 space-y-1">
                      {b5.workListForCustomer.map((w) => (
                        <li key={w.id} className="text-sm text-[#64748b]">• {w.label}</li>
                      ))}
                    </ul>
                  </div>
                  <Button variant="primary" className="gap-1">
                    <Send className="h-4 w-4" />
                    Отправить заказчику (UI + email)
                  </Button>
                </>
              )}
              {!b5 && (
                <p className="text-sm text-[#64748b]">КП будет доступно после сохранения ведомости (блок 4).</p>
              )}
            </div>
          )}

          {activeTab === "chat" && (
            <div className="space-y-4">
              <p className="text-sm text-[#64748b]">
                Чат-лента сообщений менеджер ↔ исполнитель / менеджер ↔ заказчик
              </p>
              <div className="rounded-xl border border-[#e2e8f0] bg-[#f8f9fb] p-4">
                <div className="flex gap-3">
                  <div className="h-8 w-8 rounded-full bg-[#e2e8f0]" />
                  <div>
                    <p className="text-xs text-[#64748b]">Исполнитель, 01.02.2025</p>
                    <p className="text-sm">Отчёт прикреплён, прошу проверить.</p>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Input placeholder="Введите сообщение..." className="flex-1" />
                <Button variant="primary">Отправить</Button>
              </div>
            </div>
          )}
          {activeTab === "history" && (
            <div className="space-y-2 text-sm text-[#64748b]">
              <p>Лог действий по заказу. Заглушка для API.</p>
              <ul className="list-inside list-disc space-y-1">
                <li>01.02.2025 — Отчёт загружен исполнителем</li>
                <li>30.01.2025 — Заказ назначен на исполнителя</li>
                <li>28.01.2025 — Заказ создан</li>
              </ul>
            </div>
          )}
          {activeTab === "documents" && (
            <div className="space-y-2 text-sm">
              <p className="text-[#64748b]">Список файлов</p>
              <ul className="space-y-1">
                <li>
                  <a href="#" className="text-[#2563eb] hover:underline">
                    otchet_inspekciya.pdf (2.4 MB)
                  </a>
                </li>
                <li>
                  <a href="#" className="text-[#2563eb] hover:underline">
                    akt_sbis.pdf (0.5 MB)
                  </a>
                </li>
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      {!isAudit && (
        <div className="flex gap-2">
          <Button variant="secondary">Поднять приоритет</Button>
          <Button variant="secondary">Назначить исполнителя</Button>
        </div>
      )}
    </div>
  );
}
