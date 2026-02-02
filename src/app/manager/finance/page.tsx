"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { mockFinance } from "@/data/mock";
import { Search, Filter, Send } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { id: "executors" as const, label: "Расчёты с исполнителями" },
  { id: "customers" as const, label: "Расчёты с заказчиками" },
];

const paymentStatusLabels: Record<string, string> = {
  pending: "Ожидает",
  paid: "Оплачено",
  confirmed: "Подтверждено",
};

export default function FinancePage() {
  const [activeTab, setActiveTab] = useState<"executors" | "customers">(
    "executors"
  );

  const rows = mockFinance.filter(
    (r) =>
      (activeTab === "executors" && r.side === "executor") ||
      (activeTab === "customers" && r.side === "customer")
  );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#0f172a]">
        Финансы и расчёты
      </h1>

      <div className="flex gap-1 border-b border-[#e2e8f0]">
        {tabs.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            onClick={() => setActiveTab(id)}
            className={cn(
              "rounded-t-xl px-4 py-2.5 text-sm font-medium transition-colors",
              activeTab === id
                ? "bg-[#2563eb] text-white"
                : "text-[#64748b] hover:bg-[#f1f5f9] hover:text-[#0f172a]"
            )}
          >
            {label}
          </button>
        ))}
      </div>

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
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#e2e8f0] bg-[#f8f9fb] text-left text-[#64748b]">
                  <th className="p-4 font-medium">Заказ / актив</th>
                  <th className="p-4 font-medium">Сумма</th>
                  <th className="p-4 font-medium">Документ</th>
                  <th className="p-4 font-medium">Статус оплаты</th>
                  <th className="p-4 font-medium">Кто должен сделать</th>
                  <th className="p-4 font-medium w-44">Действия</th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-[#64748b]">
                      Нет записей
                    </td>
                  </tr>
                ) : (
                  rows.map((r) => (
                    <tr
                      key={r.id}
                      className="border-b border-[#e2e8f0] hover:bg-[#f8f9fb] transition-colors"
                    >
                      <td className="p-4 font-medium text-[#0f172a]">
                        {r.assetName}
                      </td>
                      <td className="p-4 text-[#0f172a]">
                        {r.amount.toLocaleString("ru")} ₽
                      </td>
                      <td className="p-4 text-[#64748b]">
                        {r.document ?? "—"}
                      </td>
                      <td className="p-4">
                        <Badge
                          variant={
                            r.paymentStatus === "confirmed"
                              ? "success"
                              : r.paymentStatus === "paid"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {paymentStatusLabels[r.paymentStatus]}
                        </Badge>
                      </td>
                      <td className="p-4 text-[#64748b]">
                        {r.assignee === "manager"
                          ? "Менеджер"
                          : "Бухгалтер"}
                      </td>
                      <td className="p-4">
                        <Button
                          variant="primary"
                          size="sm"
                          className="gap-1"
                          onClick={() =>
                            alert(
                              "Задача бухгалтеру создана (симуляция). В реальном приложении здесь будет вызов API."
                            )
                          }
                        >
                          <Send className="h-4 w-4" />
                          Передать бухгалтеру
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
