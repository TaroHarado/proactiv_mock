"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  executorAccrualsMock,
  payoutRequestsMock,
} from "@/data/mock";
import { Send, TrendingUp } from "lucide-react";

export default function ExecutorFinancePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#0f172a]">Финансы</h1>

      {/* Заглушка диаграммы */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Заработок по месяцам</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48 rounded-xl bg-[#f8f9fb] flex items-center justify-center text-[#64748b] text-sm">
            <span className="flex items-center gap-2">
              <TrendingUp className="h-6 w-6" />
              График (заглушка)
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Начисления */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Начисления по заказам</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ul className="divide-y divide-[#e2e8f0]">
            {executorAccrualsMock.map((a) => (
              <li
                key={a.id}
                className="flex flex-wrap items-center justify-between gap-4 p-4 hover:bg-[#f8f9fb] transition-colors"
              >
                <div>
                  <p className="font-medium text-[#0f172a]">{a.assetName}</p>
                  <p className="text-sm text-[#64748b]">{a.completedAt}</p>
                </div>
                <p className="font-semibold text-[#0f172a]">
                  {a.amount.toLocaleString("ru")} ₽
                </p>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Заявки на вывод */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Заявки на вывод</CardTitle>
          <Button variant="primary" size="sm" className="gap-1">
            <Send className="h-4 w-4" />
            Запросить вывод
          </Button>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {payoutRequestsMock.map((pr) => (
              <li
                key={pr.id}
                className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-[#e2e8f0] bg-[#f8f9fb] p-4"
              >
                <div>
                  <p className="font-medium text-[#0f172a]">
                    {pr.amount.toLocaleString("ru")} ₽
                  </p>
                  <p className="text-xs text-[#64748b]">{pr.createdAt}</p>
                  {pr.comment && (
                    <p className="mt-1 text-sm text-[#64748b]">{pr.comment}</p>
                  )}
                </div>
                <Badge
                  variant={
                    pr.status === "approved"
                      ? "success"
                      : pr.status === "rejected"
                        ? "destructive"
                        : "secondary"
                  }
                >
                  {pr.status === "processing" && "В обработке"}
                  {pr.status === "approved" && "Подтверждено"}
                  {pr.status === "rejected" && "Отклонено"}
                </Badge>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
