"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { boardOrdersMock } from "@/data/mock";
import { Clock, MapPin, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

function formatMinutes(m: number) {
  if (m < 60) return `${m} мин`;
  const h = Math.floor(m / 60);
  const rest = m % 60;
  return rest ? `${h} ч ${rest} мин` : `${h} ч`;
}

export default function ExecutorBoardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#0f172a]">Доска заказов</h1>
      <p className="text-sm text-[#64748b]">
        Новые заказы. Первые 90 минут — эксклюзив для рейтинга Top (4.5–5.0). Высокий приоритет (+10% к оплате) — заказ завис или много отказов.
      </p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {boardOrdersMock.map((order) => (
          <Card
            key={order.id}
            className={cn(
              "overflow-hidden transition-shadow hover:shadow-md",
              order.priority === "high" && "border-[#fef3c7] bg-[#fffbeb]"
            )}
          >
            <CardHeader className="pb-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <Badge
                  variant={order.priority === "high" ? "warning" : "secondary"}
                >
                  {order.priority === "high" ? "Высокий приоритет (+10%)" : "Обычный"}
                </Badge>
                {order.exclusiveForTop && (
                  <span className="text-xs text-[#2563eb] font-medium">Эксклюзив Top</span>
                )}
              </div>
              <h3 className="font-semibold text-[#0f172a]">{order.serviceLabel}</h3>
              <div className="flex items-center gap-1 text-sm text-[#64748b]">
                <MapPin className="h-4 w-4 shrink-0" />
                {order.address}
              </div>
              {order.requiresAccessAgreement && (
                <p className="text-xs text-[#64748b]">Требуется согласование доступа заказчиком</p>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                <span className="text-[#64748b]">Выплата исполнителю</span>
                <span className="font-semibold text-[#0f172a]">
                  {order.payoutAmount.toLocaleString("ru")} ₽ ({order.payoutPercent}%)
                </span>
              </div>
              <div className="flex items-center gap-1 text-sm text-[#64748b]">
                <Clock className="h-4 w-4 shrink-0" />
                Висит: {formatMinutes(order.minutesPending)} · Отказов: {order.rejectionsCount}
              </div>
              <div className="flex flex-wrap gap-2 pt-2">
                <Button variant="primary" size="sm" className="flex-1 sm:flex-none">
                  Принять
                </Button>
                <Button variant="secondary" size="sm">Отказаться</Button>
                <Button variant="ghost" size="sm" className="gap-1">
                  <MessageCircle className="h-4 w-4" />
                  Задать вопрос менеджеру
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
