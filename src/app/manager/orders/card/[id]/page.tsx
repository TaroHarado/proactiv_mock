"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mockOrders } from "@/data/mock";
import { ArrowLeft, MessageSquare, FileText, History } from "lucide-react";
import { useState } from "react";

type TabId = "chat" | "history" | "documents";

export default function OrderCardPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const order = mockOrders.find((o) => o.id === id);
  const [activeTab, setActiveTab] = useState<TabId>("chat");

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

  const tabs: { id: TabId; label: string; icon: React.ReactNode }[] = [
    { id: "chat", label: "Сообщения", icon: <MessageSquare className="h-4 w-4" /> },
    { id: "history", label: "История", icon: <History className="h-4 w-4" /> },
    { id: "documents", label: "Документы", icon: <FileText className="h-4 w-4" /> },
  ];

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
        </Badge>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Информация об активе</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>
            <span className="text-[#64748b]">VIN:</span> {order.assetVin}
          </p>
          <p>
            <span className="text-[#64748b]">Адрес:</span> {order.address}
          </p>
          <p>
            <span className="text-[#64748b]">Услуга:</span> {order.service}
          </p>
          <p>
            <span className="text-[#64748b]">Сумма:</span>{" "}
            {order.amount.toLocaleString("ru")} ₽
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
        <div className="flex border-b border-[#e2e8f0]">
          {tabs.map(({ id: tabId, label, icon }) => (
            <button
              key={tabId}
              type="button"
              onClick={() => setActiveTab(tabId)}
              className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors ${
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
                <input
                  type="text"
                  placeholder="Введите сообщение..."
                  className="flex-1 rounded-xl border border-[#e2e8f0] px-3 py-2 text-sm"
                />
                <Button variant="primary">Отправить</Button>
              </div>
            </div>
          )}
          {activeTab === "history" && (
            <div className="space-y-2 text-sm text-[#64748b]">
              <p>Лог действий по заказу. Заглушка для API.</p>
              <ul className="list-inside list-disc space-y-1">
                <li>01.02.2025 — Отчёт загружен исполнителем</li>
                <li>30.01.2025 — Заказ назначен на Петрова П.</li>
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
                    akt_sbис.pdf (0.5 MB)
                  </a>
                </li>
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex gap-2">
        <Button variant="secondary">Поднять приоритет</Button>
        <Button variant="secondary">Назначить исполнителя</Button>
      </div>
    </div>
  );
}
