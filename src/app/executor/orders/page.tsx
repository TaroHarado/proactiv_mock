"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { executorActiveOrdersMock, type EdoSignMethod } from "@/data/mock";
import Link from "next/link";
import { ChevronRight, MessageCircle, Info, FileSignature } from "lucide-react";
import { getDeadlineStatus, formatDueDate } from "@/lib/deadline-utils";
import { EdoSignModal } from "@/components/modals/edo-sign-modal";

// Продажа под ключ — только у менеджера (публикация, прикрепление ссылок). У исполнителя таких заказов не показываем.
const executorOrders = executorActiveOrdersMock.filter((o) => o.serviceType !== "sale");

const statusVariant: Record<string, "default" | "secondary" | "warning" | "outline"> = {
  needs_contract_sign: "warning",
  access_pending: "warning",
  in_progress: "default",
  on_review: "secondary",
  needs_act_sign: "default",
  on_rework: "warning",
  completed: "outline",
};

export default function ExecutorOrdersPage() {
  const [signingOrder, setSigningOrder] = useState<typeof executorOrders[0] | null>(null);
  const [edoModalOpen, setEdoModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#0f172a]">Мои активные заказы</h1>

      <Card>
        <CardContent className="p-0">
          <ul className="divide-y divide-[#e2e8f0]">
            {executorOrders.map((o) => (
              <li
                key={o.id}
                className="flex flex-wrap items-center justify-between gap-4 p-4 hover:bg-[#f8f9fb] transition-colors"
              >
                <div className="min-w-0 flex-1 space-y-2">
                  <div>
                    <p className="font-medium text-[#0f172a]">{o.assetName}</p>
                    <p className="text-sm text-[#64748b]">{o.serviceLabel}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant={statusVariant[o.status] ?? "secondary"}>
                      {o.statusLabel}
                    </Badge>
                    {o.status === "access_pending" && (
                      <span className="text-xs text-[#64748b]">
                        Выезд возможен после подтверждения доступа
                      </span>
                    )}
                    {o.status === "needs_contract_sign" && (
                      <span className="text-xs text-[#0075F3]">
                        Подпишите договор-задание через ПЭП или КЭП (СБИС)
                      </span>
                    )}
                    {o.status === "needs_act_sign" && (
                      <span className="text-xs text-[#16a34a]">
                        Подпишите акт выполненных работ через ПЭП или КЭП (СБИС)
                      </span>
                    )}
                  </div>
                  {o.dueDate && (
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-[#0f172a]">
                          Сдать до: {formatDueDate(o.dueDate)}
                        </p>
                        {(() => {
                          const deadlineInfo = getDeadlineStatus(o.dueDate);
                          return (
                            <span
                              className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium ${deadlineInfo.className}`}
                            >
                              {deadlineInfo.icon} {deadlineInfo.label}
                            </span>
                          );
                        })()}
                      </div>
                      {getDeadlineStatus(o.dueDate).status === "ok" && (
                        <div className="group relative inline-flex items-center gap-1">
                          <Info className="h-3 w-3 text-[#64748b]" />
                          <span className="text-xs text-[#64748b]">
                            При просрочке рейтинг снижается автоматически
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {(o.status === "needs_contract_sign" || o.status === "needs_act_sign") && (
                    <Button
                      variant="primary"
                      size="sm"
                      className="gap-1"
                      onClick={() => {
                        setSigningOrder(o);
                        setEdoModalOpen(true);
                      }}
                    >
                      <FileSignature className="h-4 w-4" />
                      Подписать
                    </Button>
                  )}
                  <Link href={`/executor/orders/${o.id}`}>
                    <Button variant={o.status === "needs_contract_sign" || o.status === "needs_act_sign" ? "outline" : "primary"} size="sm" className="gap-1">
                      Открыть
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button variant="secondary" size="sm" className="gap-1">
                    <MessageCircle className="h-4 w-4" />
                    Чат с менеджером
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {signingOrder && (
        <EdoSignModal
          open={edoModalOpen}
          onOpenChange={setEdoModalOpen}
          documentType={signingOrder.status === "needs_contract_sign" ? "contract" : "act"}
          availableMethods={signingOrder.edoSignMethods || ["pep", "kep"]}
          onConfirm={(method: EdoSignMethod) => {
            console.log(`Подписание документа методом: ${method}`);
            // TODO: здесь будет редирект в СБИС или API-вызов
            setEdoModalOpen(false);
            setSigningOrder(null);
          }}
          onCancel={() => {
            setEdoModalOpen(false);
            setSigningOrder(null);
          }}
        />
      )}
    </div>
  );
}
