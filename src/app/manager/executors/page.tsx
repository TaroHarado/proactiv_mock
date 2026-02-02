"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { mockExecutors, getExecutorTypeLabel } from "@/data/mock";
import {
  Search,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react";
import Link from "next/link";

export default function ExecutorsPage() {
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "self_employed" | "ip" | "ooo">("all");
  const [sortBy, setSortBy] = useState<"rating" | "completed">("rating");

  const filtered = useMemo(() => {
    let items = mockExecutors;

    if (typeFilter !== "all") {
      items = items.filter((e) => e.type === typeFilter);
    }

    if (query.trim()) {
      const q = query.trim().toLowerCase();
      items = items.filter((e) => e.name.toLowerCase().includes(q));
    }

    items = [...items].sort((a, b) => {
      if (sortBy === "rating") {
        return b.rating - a.rating;
      }
      const aTotal =
        (a.completedOrders.audit ?? 0) +
        (a.completedOrders.inspection ?? 0) +
        (a.completedOrders.service ?? 0) +
        (a.completedOrders.sale ?? 0);
      const bTotal =
        (b.completedOrders.audit ?? 0) +
        (b.completedOrders.inspection ?? 0) +
        (b.completedOrders.service ?? 0) +
        (b.completedOrders.sale ?? 0);
      return bTotal - aTotal;
    });

    return items;
  }, [query, typeFilter, sortBy]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#0f172a]">Исполнители</h1>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748b]" />
              <Input
                placeholder="Поиск по имени..."
                className="pl-9"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <select
                className="h-10 rounded-xl border border-[#e2e8f0] bg-white px-3 text-sm text-[#0f172a]"
                value={typeFilter}
                onChange={(e) =>
                  setTypeFilter(e.target.value as typeof typeFilter)
                }
              >
                <option value="all">Все типы</option>
                <option value="self_employed">Самозанятый</option>
                <option value="ip">ИП</option>
                <option value="ooo">ООО</option>
              </select>
              <select
                className="h-10 rounded-xl border border-[#e2e8f0] bg-white px-3 text-sm text-[#0f172a]"
                value={sortBy}
                onChange={(e) =>
                  setSortBy(e.target.value as typeof sortBy)
                }
              >
                <option value="rating">По рейтингу</option>
                <option value="completed">По кол-ву заказов</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#e2e8f0] bg-[#f8f9fb] text-left text-[#64748b]">
                  <th className="p-3 sm:p-4 font-medium">Исполнитель</th>
                  <th className="p-3 sm:p-4 font-medium">Рейтинг</th>
                  <th className="p-3 sm:p-4 font-medium">Выполнено заказов</th>
                  <th className="p-3 sm:p-4 font-medium">Активные заказы</th>
                  <th className="p-3 sm:p-4 font-medium">% отказов</th>
                  <th className="p-3 sm:p-4 font-medium">Флаг</th>
                  <th className="p-3 sm:p-4 font-medium w-40">Действия</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((ex) => (
                  <tr
                    key={ex.id}
                    className="border-b border-[#e2e8f0] hover:bg-[#f8f9fb] transition-colors"
                  >
                    <td className="p-3 sm:p-4">
                      <div>
                        <p className="font-medium text-[#0f172a]">{ex.name}</p>
                        <p className="text-xs text-[#64748b]">
                          {getExecutorTypeLabel(ex.type)}
                        </p>
                      </div>
                    </td>
                    <td className="p-3 sm:p-4">
                      <div className="flex items-center gap-1">
                        <span className="font-medium text-[#0f172a]">
                          {ex.rating}
                        </span>
                        {ex.ratingTrend === "up" && (
                          <TrendingUp className="h-4 w-4 text-[#16a34a]" />
                        )}
                        {ex.ratingTrend === "down" && (
                          <TrendingDown className="h-4 w-4 text-[#dc2626]" />
                        )}
                        {ex.ratingTrend === "stable" && (
                          <Minus className="h-4 w-4 text-[#64748b]" />
                        )}
                      </div>
                    </td>
                    <td className="p-3 sm:p-4 text-[#64748b]">
                      Аудит: {ex.completedOrders.audit}, Инспекция:{" "}
                      {ex.completedOrders.inspection}, ТО:{" "}
                      {ex.completedOrders.service}, Продажа:{" "}
                      {ex.completedOrders.sale}
                    </td>
                    <td className="p-3 sm:p-4 font-medium text-[#0f172a]">
                      {ex.activeOrders}
                    </td>
                    <td className="p-3 sm:p-4 text-[#64748b]">
                      {ex.rejectionRate}%
                    </td>
                    <td className="p-3 sm:p-4">
                      {ex.isProblematic && (
                        <Badge variant="destructive">Проблемный</Badge>
                      )}
                    </td>
                    <td className="p-3 sm:p-4">
                      <Link href={`/manager/executors/${ex.id}`}>
                        <Button variant="primary" size="sm" className="gap-1">
                          Открыть кабинет
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
