"use client";

import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { cn } from "@/lib/utils";

export type PeriodPreset = "day" | "week" | "month" | "quarter" | "year" | "all";

interface GlobalFiltersProps {
  showPeriod?: boolean;
  showCompany?: boolean;
  showServiceType?: boolean;
  showStatus?: boolean;
  showExecutor?: boolean;
  showManager?: boolean;
  showPriority?: boolean;
  showSlaOverdue?: boolean;
  showCustomRange?: boolean;
  className?: string;
}

const PERIOD_OPTIONS: { value: PeriodPreset; label: string }[] = [
  { value: "day", label: "День" },
  { value: "week", label: "Неделя" },
  { value: "month", label: "Месяц" },
  { value: "quarter", label: "Квартал" },
  { value: "year", label: "Год" },
  { value: "all", label: "Всё время" },
];

export function GlobalFilters({
  showPeriod = true,
  showCompany = true,
  showServiceType = true,
  showStatus = true,
  showExecutor = true,
  showManager = true,
  showPriority = true,
  showSlaOverdue = true,
  showCustomRange = true,
  className,
}: GlobalFiltersProps) {
  const [period, setPeriod] = useState<PeriodPreset>("month");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  return (
    <div className={cn("flex flex-wrap items-center gap-3 rounded-2xl border border-[#e2e8f0] bg-white p-4", className)}>
      {showPeriod && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-[#64748b]">Период:</span>
          <Select
            value={period}
            onChange={(e) => setPeriod(e.target.value as PeriodPreset)}
            className="w-[140px]"
          >
            {PERIOD_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </Select>
        </div>
      )}
      {showCustomRange && showPeriod && (
        <div className="flex items-center gap-2">
          <Input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="w-[140px]"
          />
          <span className="text-[#64748b]">—</span>
          <Input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="w-[140px]"
          />
        </div>
      )}
      {showCompany && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-[#64748b]">Компания:</span>
          <Select className="w-[180px]">
            <option value="">Все</option>
            <option value="co1">ООО Лизинг Альфа</option>
            <option value="co2">АО ТрансЛогист</option>
            <option value="co3">ИП Петров</option>
          </Select>
        </div>
      )}
      {showServiceType && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-[#64748b]">Услуга:</span>
          <Select className="w-[140px]">
            <option value="">Все</option>
            <option value="inspection">Инспекция</option>
            <option value="audit">Аудит</option>
            <option value="maintenance">Обслуживание и ремонт</option>
            <option value="sale">Под ключ</option>
          </Select>
        </div>
      )}
      {showStatus && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-[#64748b]">Статус:</span>
          <Select className="w-[160px]">
            <option value="">Все</option>
            <option value="new">Новые</option>
            <option value="in_progress">В работе</option>
            <option value="on_review">На проверке</option>
            <option value="on_rework">На доработке</option>
            <option value="completed">Завершено</option>
          </Select>
        </div>
      )}
      {showExecutor && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-[#64748b]">Исполнитель:</span>
          <Select className="w-[160px]">
            <option value="">Все</option>
            <option value="ex1">Андрей Андреев</option>
            <option value="ex2">Петр Петров</option>
          </Select>
        </div>
      )}
      {showManager && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-[#64748b]">Менеджер:</span>
          <Select className="w-[160px]">
            <option value="">Все</option>
            <option value="m1">Менеджер 1</option>
          </Select>
        </div>
      )}
      {showPriority && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-[#64748b]">Приоритет:</span>
          <Select className="w-[120px]">
            <option value="">Все</option>
            <option value="high">Высокий</option>
            <option value="normal">Обычный</option>
          </Select>
        </div>
      )}
      {showSlaOverdue && (
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" className="rounded border-[#e2e8f0]" />
          <span className="text-[#64748b]">Просрочено по SLA</span>
        </label>
      )}
    </div>
  );
}
