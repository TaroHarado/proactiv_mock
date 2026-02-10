"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  executorMonthlyEarningsMock,
  executorAccrualsPaidMock,
  executorEdoDocsMock,
} from "@/data/mock";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from "recharts";

export default function ExecutorFinancePage() {
  const data = executorMonthlyEarningsMock;
  const lastIndex = data.length - 1;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[var(--black)]">Финансы и ЭДО</h1>

      {/* Заработок по месяцам */}
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

      {/* Оплачено по заказам */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Оплачено по заказам</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ul className="divide-y divide-[var(--border)]">
            {executorAccrualsPaidMock.map((a) => (
              <li
                key={a.id}
                className="flex flex-wrap items-center justify-between gap-4 p-4 hover:bg-[var(--app-bg)] transition-colors"
              >
                <div>
                  <p className="font-medium text-[var(--black)]">{a.assetName}</p>
                  <p className="text-sm text-[var(--gray-icon)]">{a.date}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={a.status === "paid" ? "success" : "secondary"}>
                    {a.status === "paid" ? "Оплачено" : "В обработке"}
                  </Badge>
                  <p className="font-semibold text-[var(--black)]">
                    {a.amount.toLocaleString("ru")} ₽
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* ЭДО (СБИС) */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Подписанные документы ЭДО (СБИС)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-[var(--gray-icon)]">
            Договоры-задания и акты выполненных работ, подписанные в системе электронного документооборота.
          </p>
          <ul className="space-y-3">
            {executorEdoDocsMock.map((doc) => (
              <li
                key={doc.id}
                className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-[var(--border)] bg-[var(--app-bg)] p-4"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-[var(--black)]">
                      {doc.type === "act" ? "Акт" : "УПД"}
                      {doc.description ? ` — ${doc.description}` : ""}
                    </p>
                    <Badge variant="success">Подписан</Badge>
                  </div>
                  <p className="text-xs text-[var(--gray-icon)] mt-1">
                    Подписано: {new Date(doc.lastUpdate).toLocaleString("ru-RU")}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    // TODO: Скачать документ
                  }}
                >
                  Скачать
                </Button>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
