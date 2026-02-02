"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { mockTasks, mockOrders } from "@/data/mock";
import {
  Search,
  Filter,
  ChevronRight,
  Check,
  MessageCircle,
  Clock,
  Paperclip,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const taskStatusLabels: Record<string, string> = {
  new: "Новая",
  in_progress: "В работе",
  waiting_clarification: "Ждёт уточнения",
  done: "Выполнено",
};

const priorityLabels: Record<string, string> = {
  high: "Высокий",
  normal: "Обычный",
  low: "Низкий",
};

export default function TaskInboxPage() {
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(
    mockTasks[0]?.id ?? null
  );
  const [comment, setComment] = useState("");
  const [typeFilter, setTypeFilter] = useState<
    "all" | "report" | "materials" | "publications" | "documents"
  >("all");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "new" | "in_progress" | "done"
  >("all");

  const filteredTasks = mockTasks.filter((task) => {
    if (statusFilter !== "all" && task.status !== statusFilter) return false;

    if (typeFilter === "report") {
      return (
        task.type === "check_report" ||
        task.type === "rate_quality"
      );
    }
    if (typeFilter === "materials") {
      return task.type === "calculate_materials";
    }
    if (typeFilter === "publications") {
      return (
        task.type === "publish_auto_ru" ||
        task.type === "publish_avito" ||
        task.type === "publish_drom"
      );
    }
    if (typeFilter === "documents") {
      return (
        task.type === "documents_act" ||
        task.type === "invoice_customer" ||
        task.type === "invoice_executor" ||
        task.type === "invoice_to_accountant"
      );
    }
    return true;
  });

  const selectedTask = filteredTasks.find((t) => t.id === selectedTaskId) ?? filteredTasks[0];
  const order = selectedTask
    ? mockOrders.find((o) => o.id === selectedTask.orderId)
    : null;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#0f172a]">Очередь задач</h1>

      <div className="grid gap-6 lg:grid-cols-[1fr_400px] xl:grid-cols-[1fr_480px]">
        {/* Список задач */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="relative w-56">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748b]" />
                  <Input placeholder="Поиск по заказу..." className="pl-9" />
                </div>
                <Button variant="secondary" size="sm" className="gap-1">
                  <Filter className="h-4 w-4" />
                  Фильтры
                </Button>
              </div>
              <div className="flex gap-2">
                <select
                  className="h-10 rounded-xl border border-[#e2e8f0] bg-white px-3 text-sm"
                  value={typeFilter}
                  onChange={(e) =>
                    setTypeFilter(e.target.value as typeof typeFilter)
                  }
                >
                  <option value="all">Тип задачи: все</option>
                  <option value="report">Проверить отчёт</option>
                  <option value="materials">Рассчитать материалы</option>
                  <option value="publications">Разместить объявления</option>
                  <option value="documents">Документы / расчёты</option>
                </select>
                <select
                  className="h-10 rounded-xl border border-[#e2e8f0] bg-white px-3 text-sm"
                  value={statusFilter}
                  onChange={(e) =>
                    setStatusFilter(e.target.value as typeof statusFilter)
                  }
                >
                  <option value="all">Статус: все</option>
                  <option value="new">Новая</option>
                  <option value="in_progress">В работе</option>
                  <option value="done">Выполнено</option>
                </select>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-[#e2e8f0]">
              {filteredTasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => setSelectedTaskId(task.id)}
                  className={cn(
                    "flex cursor-pointer items-center justify-between gap-4 p-4 transition-colors hover:bg-[#f8f9fb]",
                    selectedTaskId === task.id && "bg-[#eff6ff]"
                  )}
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-[#0f172a]">
                      {task.typeLabel}
                    </p>
                    <p className="text-sm text-[#64748b]">
                      {task.assetName} · {task.service}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <Badge
                        variant={
                          task.status === "done"
                            ? "success"
                            : task.status === "in_progress"
                              ? "default"
                              : "secondary"
                        }
                      >
                        {taskStatusLabels[task.status]}
                      </Badge>
                      <span className="text-xs text-[#64748b]">
                        {priorityLabels[task.priority]}
                      </span>
                      {task.dueDate && (
                        <span className="text-xs text-[#64748b] flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {task.dueDate}
                        </span>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="primary"
                    size="sm"
                    className="shrink-0 gap-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedTaskId(task.id);
                    }}
                  >
                    Открыть
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Панель деталей задачи */}
        {selectedTask && (
          <div className="lg:sticky lg:top-24 lg:self-start">
            <Card className="overflow-hidden">
              <CardHeader className="border-b border-[#e2e8f0] pb-4">
                <CardTitle className="text-base">{selectedTask.typeLabel}</CardTitle>
                <p className="text-sm text-[#64748b]">
                  {selectedTask.assetName} · {selectedTask.service}
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge variant="secondary">
                    {taskStatusLabels[selectedTask.status]}
                  </Badge>
                  <Badge variant="outline">
                    {priorityLabels[selectedTask.priority]}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-4 space-y-6">
                {order && (
                  <div className="rounded-xl bg-[#f8f9fb] p-4 text-sm">
                    <p className="font-medium text-[#0f172a]">Карточка заказа</p>
                    <p className="text-[#64748b]">VIN: {order.assetVin}</p>
                    <p className="text-[#64748b]">Адрес: {order.address}</p>
                    <Link href={`/manager/orders/card/${order.id}`}>
                      <Button variant="secondary" size="sm" className="mt-2">Открыть карточку заказа</Button>
                    </Link>
                  </div>
                )}

                {selectedTask.checklist && selectedTask.checklist.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-[#0f172a] mb-2">
                      Что нужно сделать
                    </p>
                    <ul className="space-y-2">
                      {selectedTask.checklist.map((item) => (
                        <li
                          key={item.id}
                          className={cn(
                            "flex items-center gap-2 text-sm",
                            item.done ? "text-[#64748b] line-through" : "text-[#0f172a]"
                          )}
                        >
                          {item.done ? (
                            <Check className="h-4 w-4 shrink-0 text-[#16a34a]" />
                          ) : (
                            <div className="h-4 w-4 shrink-0 rounded border border-[#e2e8f0]" />
                          )}
                          {item.label}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedTask.attachments && selectedTask.attachments.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-[#0f172a] mb-2 flex items-center gap-1">
                      <Paperclip className="h-4 w-4" />
                      Вложения
                    </p>
                    <ul className="space-y-1 text-sm text-[#2563eb]">
                      {selectedTask.attachments.map((a) => (
                        <li key={a.name}>
                          <a href="#" className="hover:underline">
                            {a.name} ({a.size})
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div>
                  <label className="text-sm font-medium text-[#0f172a] block mb-2">
                    Комментарий менеджера
                  </label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Добавить комментарий..."
                    className="w-full min-h-[80px] rounded-xl border border-[#e2e8f0] bg-white px-3 py-2 text-sm placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
                  />
                </div>

                <div className="flex flex-wrap gap-2 pt-2 border-t border-[#e2e8f0]">
                  <Button variant="primary" size="sm" className="gap-1">
                    <Check className="h-4 w-4" />
                    Выполнено
                  </Button>
                  <Button variant="secondary" size="sm" className="gap-1">
                    На доработку
                  </Button>
                  <Button variant="secondary" size="sm" className="gap-1">
                    <MessageCircle className="h-4 w-4" />
                    Нужно уточнение
                  </Button>
                  <Button variant="ghost" size="sm">
                    Отложить
                  </Button>
                  <Button variant="outline" size="sm">
                    Эскалировать бухгалтеру
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
