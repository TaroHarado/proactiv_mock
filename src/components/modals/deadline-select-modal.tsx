"use client";

import { useState } from "react";
import { Sheet } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";

interface DeadlineSelectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (dueDate: string) => void;
  onCancel: () => void;
}

export function DeadlineSelectModal({
  open,
  onOpenChange,
  onConfirm,
  onCancel,
}: DeadlineSelectModalProps) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const today = new Date();
  const dateOptions = Array.from({ length: 4 }, (_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    return date;
  });

  const formatDate = (date: Date) => {
    const day = date.getDate();
    const monthNames = [
      "янв",
      "фев",
      "мар",
      "апр",
      "май",
      "июн",
      "июл",
      "авг",
      "сен",
      "окт",
      "ноя",
      "дек",
    ];
    return `${day} ${monthNames[date.getMonth()]}`;
  };

  const formatDateFull = (date: Date) => {
    return date.toISOString().split("T")[0];
  };

  const getDayLabel = (index: number) => {
    if (index === 0) return "Сегодня";
    return `+${index} ${index === 1 ? "день" : "дня"}`;
  };

  const handleConfirm = () => {
    if (selectedDate) {
      onConfirm(selectedDate);
      setSelectedDate(null);
    }
  };

  const handleCancel = () => {
    setSelectedDate(null);
    onCancel();
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange} title="Когда приедете выполнять заказ?">
      <div className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm text-[#64748b]">
            Выберите дату. Доступно: сегодня и ближайшие 3 дня.
          </p>
          <p className="text-xs text-[#64748b]">
            Дедлайн закрепится в заказе.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {dateOptions.map((date, index) => {
            const dateStr = formatDateFull(date);
            const isSelected = selectedDate === dateStr;
            return (
              <button
                key={index}
                onClick={() => setSelectedDate(dateStr)}
                className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all ${
                  isSelected
                    ? "border-[#0075F3] bg-[#eff6ff]"
                    : "border-[#e2e8f0] bg-white hover:border-[#cbd5e1]"
                }`}
              >
                <Calendar
                  className={`h-6 w-6 ${isSelected ? "text-[#0075F3]" : "text-[#64748b]"}`}
                />
                <div className="text-center">
                  <p
                    className={`text-sm font-medium ${
                      isSelected ? "text-[#0075F3]" : "text-[#0f172a]"
                    }`}
                  >
                    {getDayLabel(index)}
                  </p>
                  <p className="text-xs text-[#64748b]">({formatDate(date)})</p>
                </div>
              </button>
            );
          })}
        </div>

        {selectedDate && (
          <div className="rounded-xl border border-[#fbbf24] bg-[#fffbeb] p-3">
            <p className="text-sm text-[#92400e]">
              ℹ️{" "}
              {selectedDate === formatDateFull(today)
                ? "Рекомендуем выехать до 18:00, чтобы успеть."
                : "При просрочке рейтинг снижается автоматически."}
            </p>
          </div>
        )}

        <div className="flex gap-2 pt-4">
          <Button variant="primary" onClick={handleConfirm} disabled={!selectedDate}>
            Подтвердить
          </Button>
          <Button variant="secondary" onClick={handleCancel}>
            Отмена
          </Button>
        </div>
      </div>
    </Sheet>
  );
}
