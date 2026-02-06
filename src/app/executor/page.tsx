"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  executorUser,
  executorActiveOrdersMock,
  getRatingCategoryLabel,
} from "@/data/mock";
import { Info } from "lucide-react";

// Продажа под ключ — только у менеджера. У исполнителя показываем только инспекцию, аудит, обслуживание.
const executorOrders = executorActiveOrdersMock.filter((o) => o.serviceType !== "sale");

function RatingTooltip({
  open,
  onClose,
  anchorRef,
}: {
  open: boolean;
  onClose: () => void;
  anchorRef: React.RefObject<HTMLButtonElement | null>;
}) {
  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (anchorRef.current && !anchorRef.current.contains(e.target as Node)) {
        const popover = document.getElementById("rating-tooltip");
        if (popover && !popover.contains(e.target as Node)) onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open, onClose, anchorRef]);

  if (!open) return null;
  return (
    <div
      id="rating-tooltip"
      className="absolute left-0 top-full z-50 mt-2 w-[320px] max-h-[min(400px,60vh)] overflow-y-auto rounded-xl border border-[#e2e8f0] bg-white p-4 shadow-xl"
      style={{ background: "white" }}
    >
      <p className="mb-3 text-sm font-semibold text-[#0f172a]">Показатели, влияющие на рейтинг</p>
      <ul className="space-y-3 text-xs text-[#0f172a]">
        <li>
          <span className="font-medium">1. Оценка качества от Менеджера (Вес: высокий)</span>
          <p className="mt-0.5 text-[#64748b]">После проверки каждого выполненного задания наш менеджер выставляет оценку от 1 до 5 с шагом 0.1. Учитываются: полнота и аккуратность отчётов, соблюдение чек-листов, качество фото/видеофиксации.</p>
        </li>
        <li>
          <span className="font-medium">2. Скорость реакции (Вес: высокий)</span>
          <p className="mt-0.5 text-[#64748b]">Система замеряет, как быстро вы принимаете новые заявки в работу после их получения. Быстрая реакция повышает рейтинг и показывает вашу активность.</p>
        </li>
        <li>
          <span className="font-medium">3. Процент принятых заявок (Надёжность)</span>
          <p className="mt-0.5 text-[#64748b]">Рассчитывается отношение принятых вами заказов к количеству полученных предложений. Систематические отказы снижают показатель.</p>
        </li>
        <li>
          <span className="font-medium">4. Соблюдение сроков (Дисциплина)</span>
          <p className="mt-0.5 text-[#64748b]">Фиксируется, сдаёте ли вы работы точно в согласованный с заказчиком дедлайн. Учёт включает время на доработку, если она потребовалась.</p>
        </li>
        <li>
          <span className="font-medium">5. Отсутствие рекламаций (Доверие)</span>
          <p className="mt-0.5 text-[#64748b]">Учитываются жалобы от заказчиков или проблемы, выявленные менеджером при сдаче работы. Безупречное исполнение укрепляет доверие.</p>
        </li>
      </ul>
      <div className="mt-4 border-t border-[#e2e8f0] pt-3">
        <p className="mb-2 text-xs font-semibold text-[#0f172a]">Пример расчёта</p>
        <p className="text-xs text-[#64748b]">
          Качество (Кср), % рекламаций (Рср), Скорость отклика (Сср), Доля приоритетных заказов (Пср), Коэфф. выбора (В) → итоговый рейтинг.
        </p>
        <p className="mt-1 text-[11px] text-[#64748b]">
          Пример: 4.9×0.35 + 5×0.25 + 94×0.2 + (100−1.2)×0.1 + 35×0.05 + (100−2)×0.05 ≈ 4.8
        </p>
      </div>
      <div className="mt-4 border-t border-[#e2e8f0] pt-3">
        <p className="mb-2 text-xs font-semibold text-[#0f172a]">Почему высокий рейтинг — это выгодно?</p>
        <ul className="space-y-1 text-[11px] text-[#64748b]">
          <li>• Приоритет в «правиле 90 минут»: новые заявки в первые 90 минут видны только подрядчикам с высоким рейтингом (например, от 4.5).</li>
          <li>• Доступ к «горящим» и сложным заказам с повышенным тарифом.</li>
          <li>• Повышенное доверие заказчиков: в интерфейсе заказчика ваш рейтинг виден.</li>
          <li>• Статус надёжного партнёра: платформа инвестирует в долгосрочное сотрудничество.</li>
        </ul>
        <p className="mt-2 text-[11px] text-[#64748b]">Наша цель — создать честную и прозрачную систему. Чем лучше вы работаете, тем больше интересных задач и высоких доходов получаете.</p>
      </div>
    </div>
  );
}

export default function ExecutorDashboardPage() {
  const [ratingTooltipOpen, setRatingTooltipOpen] = useState(false);
  const ratingAnchorRef = useRef<HTMLButtonElement>(null);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[var(--black)]">Дашборд</h1>

      {/* A) Рейтинг */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg">Рейтинг</CardTitle>
            <div className="relative">
              <button
                ref={ratingAnchorRef}
                type="button"
                onClick={() => setRatingTooltipOpen((v) => !v)}
                className="flex h-6 w-6 items-center justify-center rounded-full text-[var(--gray-icon)] hover:bg-[var(--app-bg)] hover:text-[var(--blue-50)] transition-colors"
                aria-label="Как считается рейтинг"
              >
                <Info className="h-4 w-4" />
              </button>
              <RatingTooltip
                open={ratingTooltipOpen}
                onClose={() => setRatingTooltipOpen(false)}
                anchorRef={ratingAnchorRef}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="text-3xl font-bold text-[var(--black)]">
              {executorUser.rating}
            </div>
            <Badge
              variant={
                executorUser.ratingCategory === "elevated"
                  ? "default"
                  : executorUser.ratingCategory === "standard"
                    ? "success"
                    : "secondary"
              }
            >
              {getRatingCategoryLabel(executorUser.ratingCategory)}
            </Badge>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5 text-sm">
            <div className="rounded-xl bg-[var(--app-bg)] p-3">
              <span className="text-[var(--gray-icon)]">Качество (Кср)</span>
              <p className="font-semibold text-[var(--black)]">{executorUser.qualityScore}</p>
            </div>
            <div className="rounded-xl bg-[var(--app-bg)] p-3">
              <span className="text-[var(--gray-icon)]">% рекламаций (Рср)</span>
              <p className="font-semibold text-[var(--black)]">{executorUser.complaintsPercent}%</p>
            </div>
            <div className="rounded-xl bg-[var(--app-bg)] p-3">
              <span className="text-[var(--gray-icon)]">Скорость отклика (Сср)</span>
              <p className="font-semibold text-[var(--black)]">{executorUser.responseSpeedScore}</p>
            </div>
            <div className="rounded-xl bg-[var(--app-bg)] p-3">
              <span className="text-[var(--gray-icon)]">Доля приоритетных заказов (Пср)</span>
              <p className="font-semibold text-[var(--black)]">{executorUser.priorityOrdersShare}%</p>
            </div>
            <div className="rounded-xl bg-[var(--app-bg)] p-3">
              <span className="text-[var(--gray-icon)]">Коэфф. выбора (В)</span>
              <p className="font-semibold text-[var(--black)]">{executorUser.selectionCoeff}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* B) Быстрые показатели за период */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Показатели за месяц</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl bg-[var(--app-bg)] p-4">
              <p className="text-sm text-[var(--gray-icon)]">Выполнено заказов</p>
              <p className="text-2xl font-bold text-[var(--black)]">
                {executorUser.completedThisMonth}
              </p>
            </div>
            <div className="rounded-xl bg-[var(--app-bg)] p-4">
              <p className="text-sm text-[var(--gray-icon)]">По типам: инспекции / аудиты / обслуживание и ремонт</p>
              <p className="text-sm font-medium text-[var(--black)]">
                {executorUser.completedByType.inspection} / {executorUser.completedByType.audit} / {executorUser.completedByType.maintenance}
              </p>
            </div>
            <div className="rounded-xl bg-[var(--app-bg)] p-4">
              <p className="text-sm text-[var(--gray-icon)]">Принято с первого раза (без доработки)</p>
              <p className="text-2xl font-bold text-[#22c55e]">
                {executorUser.firstTimeAcceptRate}%
              </p>
            </div>
            <div className="rounded-xl bg-[var(--app-bg)] p-4">
              <p className="text-sm text-[var(--gray-icon)]">Среднее время отклика</p>
              <p className="text-2xl font-bold text-[var(--black)]">
                {executorUser.avgResponseMinutes} мин
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* C) Активные заказы */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Активные заказы</CardTitle>
          <Link href="/executor/orders">
            <Button variant="secondary" size="sm">Все</Button>
          </Link>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {executorOrders.slice(0, 3).map((o) => (
              <li
                key={o.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[var(--border)] bg-[var(--white)] p-4 hover:bg-[var(--app-bg)] transition-colors"
              >
                <div>
                  <p className="font-medium text-[var(--black)]">{o.assetName}</p>
                  <p className="text-sm text-[var(--gray-icon)]">{o.serviceLabel} · {o.statusLabel}</p>
                </div>
                <Link href={`/executor/orders/${o.id}`}>
                  <Button variant="primary" size="sm">Открыть</Button>
                </Link>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
