"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import {
  managerTasksMock,
  getPrepOrderById,
  getSaleOrderById,
  getInspectionOrderById,
  MANAGER_TASK_TYPE_LABELS,
  type ManagerTask,
  type ManagerTaskType,
  type ManagerTaskStatus,
  type ServiceType,
} from "@/data/mock";
import { Search, ChevronRight, Clock } from "lucide-react";

const STATUS_LABELS: Record<ManagerTaskStatus, string> = {
  new: "Новая",
  in_progress: "В работе",
  done: "Выполнено",
  waiting_clarification: "Нужны уточнения",
};

const PRIORITY_LABELS: Record<string, string> = {
  high: "Высокий",
  normal: "Обычный",
};

export default function ManagerTasksPage() {
  const [serviceFilter, setServiceFilter] = useState<ServiceType | "all">("all");
  const [typeFilter, setTypeFilter] = useState<ManagerTaskType | "all">("all");
  const [statusFilter, setStatusFilter] = useState<ManagerTaskStatus | "all" | "active">("active");
  const [priorityFilter, setPriorityFilter] = useState<"high" | "normal" | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTasks = useMemo(() => {
    let list = managerTasksMock;
    if (serviceFilter !== "all") {
      list = list.filter((t) => t.serviceType === serviceFilter);
    }
    if (typeFilter !== "all") {
      list = list.filter((t) => t.type === typeFilter);
    }
    if (statusFilter === "active") {
      list = list.filter((t) => t.status === "new" || t.status === "in_progress");
    } else if (statusFilter !== "all") {
      list = list.filter((t) => t.status === statusFilter);
    }
    if (priorityFilter !== "all") {
      list = list.filter((t) => t.priority === priorityFilter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter(
        (t) =>
          t.assetName.toLowerCase().includes(q) ||
          (t.assetVin ?? "").toLowerCase().includes(q) ||
          t.orderId.toLowerCase().includes(q) ||
          t.serviceLabel.toLowerCase().includes(q)
      );
    }
    return list;
  }, [serviceFilter, typeFilter, statusFilter, priorityFilter, searchQuery]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#0f172a]">Очередь задач</h1>

      <Card className="rounded-2xl border border-[#e2e8f0] bg-white shadow-[0_1px_3px_0_rgb(0_0_0_/_.05)]">
        <CardHeader className="pb-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative w-56">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748b]" />
              <Input
                placeholder="Поиск по VIN / активу / ID..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select
              className="w-44"
              value={serviceFilter}
              onChange={(e) => setServiceFilter(e.target.value as ServiceType | "all")}
            >
              <option value="all">Услуга: все</option>
              <option value="audit">Аудит</option>
              <option value="inspection">Инспекция</option>
              <option value="maintenance">Обслуживание и ремонт</option>
              <option value="sale">Продажа под ключ</option>
            </Select>
            <Select
              className="w-56"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as ManagerTaskType | "all")}
            >
              <option value="all">Тип задачи: все</option>
              {Object.entries(MANAGER_TASK_TYPE_LABELS).map(([k, l]) => (
                <option key={k} value={k}>{l}</option>
              ))}
            </Select>
            <Select
              className="w-44"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as ManagerTaskStatus | "all" | "active")}
            >
              <option value="active">Новые + В работе</option>
              <option value="all">Статус: все</option>
              <option value="new">Новая</option>
              <option value="in_progress">В работе</option>
              <option value="done">Выполнено</option>
              <option value="waiting_clarification">Нужны уточнения</option>
            </Select>
            <Select
              className="w-32"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value as "high" | "normal" | "all")}
            >
              <option value="all">Приоритет</option>
              <option value="high">High</option>
              <option value="normal">Normal</option>
            </Select>
          </div>
          <p className="mt-2 text-xs text-[#64748b]">
            По умолчанию: Новые + В работе. Всего: {filteredTasks.length}
          </p>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-[#e2e8f0]">
            {filteredTasks.length === 0 ? (
              <div className="p-8 text-center text-[#64748b]">
                Нет задач по выбранным фильтрам.
              </div>
            ) : (
              filteredTasks.map((task) => (
                <TaskRow key={task.id} task={task} />
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function TaskRow({ task }: { task: ManagerTask }) {
  const prepOrder = getPrepOrderById(task.orderId);
  const saleOrder = getSaleOrderById(task.orderId);
  const inspectionOrder = getInspectionOrderById(task.orderId);
  const orderUrl = prepOrder
    ? `/manager/orders/prep/${task.orderId}`
    : saleOrder
      ? `/manager/orders/sale/${task.orderId}`
      : inspectionOrder
        ? `/manager/orders/inspection/${task.orderId}`
        : `/manager/orders/card/${task.orderId}?tab=${task.orderTab}`;

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 p-4 transition-colors hover:bg-[#f8f9fb]">
      <Link href={`/manager/tasks/${task.id}`} className="min-w-0 flex-1">
        <p className="font-medium text-[#0f172a]">{task.typeLabel}</p>
        <p className="text-sm text-[#64748b]">
          {task.assetName}
          {task.assetVin ? ` · ${task.assetVin}` : ""} · {task.serviceLabel}
        </p>
        <p className="text-xs text-[#64748b] mt-0.5">Заказ: {task.orderId}</p>
        <div className="mt-2 flex flex-wrap gap-2">
          <Badge
            variant={
              task.status === "done"
                ? "success"
                : task.status === "in_progress"
                  ? "default"
                  : task.status === "waiting_clarification"
                    ? "warning"
                    : "secondary"
            }
          >
            {STATUS_LABELS[task.status]}
          </Badge>
          <Badge variant={task.priority === "high" ? "destructive" : "outline"}>
            {PRIORITY_LABELS[task.priority]}
          </Badge>
          <span className="flex items-center gap-1 text-xs text-[#64748b]">
            <Clock className="h-3 w-3" />
            {task.dueLabel}
          </span>
        </div>
        {task.shortDescription && (
          <p className="mt-1 text-xs text-[#64748b]">{task.shortDescription}</p>
        )}
      </Link>
      <div className="flex shrink-0 items-center gap-2">
        <Link href={orderUrl}>
          <Button variant="secondary" size="sm">
            Открыть заказ
          </Button>
        </Link>
        <Link href={`/manager/tasks/${task.id}`}>
          <Button variant="primary" size="sm" className="gap-1">
            Открыть
            <ChevronRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
