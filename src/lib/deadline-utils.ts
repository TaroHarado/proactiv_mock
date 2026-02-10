/**
 * Утилиты для работы с дедлайнами заказов
 */

export type DeadlineStatus = "ok" | "tomorrow" | "today" | "overdue";

export interface DeadlineInfo {
  status: DeadlineStatus;
  label: string;
  className: string;
  icon: string;
  daysUntil?: number;
  overdueDays?: number;
}

/**
 * Получить статус дедлайна относительно текущей даты
 */
export function getDeadlineStatus(dueDate: string): DeadlineInfo {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);
  
  const diffTime = due.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    // Просрочено
    const overdueDays = Math.abs(diffDays);
    return {
      status: "overdue",
      label: `Просрочено на ${overdueDays} ${overdueDays === 1 ? "день" : overdueDays < 5 ? "дня" : "дней"}`,
      className: "bg-[#fef2f2] text-[#991b1b] border-[#fecaca]",
      icon: "⚫",
      overdueDays,
    };
  } else if (diffDays === 0) {
    // Сегодня дедлайн
    return {
      status: "today",
      label: "Сегодня дедлайн",
      className: "bg-[#fef2f2] text-[#991b1b] border-[#fecaca]",
      icon: "🔴",
      daysUntil: 0,
    };
  } else if (diffDays === 1) {
    // Завтра дедлайн
    return {
      status: "tomorrow",
      label: "Завтра дедлайн",
      className: "bg-[#fffbeb] text-[#92400e] border-[#fef08a]",
      icon: "🟠",
      daysUntil: 1,
    };
  } else {
    // Есть время
    return {
      status: "ok",
      label: "Есть время",
      className: "bg-[#f0fdf4] text-[#166534] border-[#bbf7d0]",
      icon: "✅",
      daysUntil: diffDays,
    };
  }
}

/**
 * Форматировать дату для отображения (например: "13 фев")
 */
export function formatDueDate(dueDate: string): string {
  const date = new Date(dueDate);
  const day = date.getDate();
  const monthNames = [
    "янв", "фев", "мар", "апр", "май", "июн",
    "июл", "авг", "сен", "окт", "ноя", "дек"
  ];
  return `${day} ${monthNames[date.getMonth()]}`;
}
