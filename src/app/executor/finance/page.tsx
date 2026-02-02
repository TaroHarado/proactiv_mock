"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  executorAccrualsMock,
  payoutRequestsMock,
  executorMonthlyEarningsMock,
} from "@/data/mock";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from "recharts";
import { Send } from "lucide-react";

export default function ExecutorFinancePage() {
  const data = executorMonthlyEarningsMock;
  const lastIndex = data.length - 1;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[var(--black)]">Финансы</h1>

      {/* Заработок по месяцам — реальный график */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Заработок по месяцам</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[240px] min-h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%" minHeight={240}>
              <BarChart data={data} margin={{ top: 8, right: 8, left: 8, bottom: 4 }}>
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => (v >= 1000 ? `${v / 1000}k` : String(v))}
                />
                <Tooltip
                  formatter={(v: number | undefined) => [
                    v != null ? `${v.toLocaleString("ru-RU")} ₽` : "",
                    "Заработок",
                  ]}
                  contentStyle={{ borderRadius: 12 }}
                />
                <Bar dataKey="amount" radius={[4, 4, 0, 0]} maxBarSize={36}>
                  {data.map((_, index) => (
                    <Cell
                      key={index}
                      fill={
                        index === lastIndex
                          ? "var(--blue-50)"
                          : "var(--border)"
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Начисления */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Начисления по заказам</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ul className="divide-y divide-[var(--border)]">
            {executorAccrualsMock.map((a) => (
              <li
                key={a.id}
                className="flex flex-wrap items-center justify-between gap-4 p-4 hover:bg-[var(--app-bg)] transition-colors"
              >
                <div>
                  <p className="font-medium text-[var(--black)]">{a.assetName}</p>
                  <p className="text-sm text-[var(--gray-icon)]">{a.completedAt}</p>
                </div>
                <p className="font-semibold text-[var(--black)]">
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
                className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-[var(--border)] bg-[var(--app-bg)] p-4"
              >
                <div>
                  <p className="font-medium text-[var(--black)]">
                    {pr.amount.toLocaleString("ru")} ₽
                  </p>
                  <p className="text-xs text-[var(--gray-icon)]">{pr.createdAt}</p>
                  {pr.comment && (
                    <p className="mt-1 text-sm text-[var(--gray-icon)]">{pr.comment}</p>
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
