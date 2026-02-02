"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { mockOrders, ServiceType } from "@/data/mock";
import { Search, Filter, ChevronRight, MessageSquare } from "lucide-react";
import Link from "next/link";

const baseOrders = mockOrders.filter((o) => o.status === "in_progress");

export default function OrdersInProgressPage() {
  const [query, setQuery] = useState("");
  const [serviceFilter, setServiceFilter] = useState<"all" | ServiceType>("all");
  const [cityFilter, setCityFilter] = useState<"all" | string>("all");

  const cities = useMemo(
    () => Array.from(new Set(baseOrders.map((o) => o.city))),
    []
  );

  const orders = useMemo(
    () =>
      baseOrders.filter((o) => {
        if (serviceFilter !== "all" && o.serviceType !== serviceFilter)
          return false;
        if (cityFilter !== "all" && o.city !== cityFilter) return false;
        if (query.trim()) {
          const q = query.trim().toLowerCase();
          const inAsset =
            o.assetName.toLowerCase().includes(q) ||
            o.assetVin.toLowerCase().includes(q);
          if (!inAsset) return false;
        }
        return true;
      }),
    [serviceFilter, cityFilter, query]
  );

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748b]" />
              <Input
                placeholder="Поиск по VIN или модели..."
                className="pl-9"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <Button
              variant="secondary"
              size="sm"
              className="mt-1 w-full justify-center gap-1 sm:mt-0 sm:w-auto"
            >
              <Filter className="h-4 w-4" />
              Фильтры
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            <select
              className="h-10 rounded-xl border border-[#e2e8f0] bg-white px-3 text-sm"
              value={serviceFilter}
              onChange={(e) =>
                setServiceFilter(
                  e.target.value === "all"
                    ? "all"
                    : (e.target.value as ServiceType)
                )
              }
            >
              <option value="all">Услуга: все</option>
              <option value="audit">Аудит</option>
              <option value="inspection">Инспекция</option>
              <option value="maintenance">Обслуживание и ремонт</option>
              <option value="sale">Продажа под ключ</option>
            </select>
            <select
              className="h-10 rounded-xl border border-[#e2e8f0] bg-white px-3 text-sm"
              value={cityFilter}
              onChange={(e) =>
                setCityFilter(
                  e.target.value === "all" ? "all" : e.target.value
                )
              }
            >
              <option value="all">Город: все</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#e2e8f0] bg-[#f8f9fb] text-left text-[#64748b]">
                <th className="p-3 sm:p-4 font-medium">Заказ / актив</th>
                <th className="p-3 sm:p-4 font-medium">Услуга</th>
                <th className="p-3 sm:p-4 font-medium">Адрес / город</th>
                <th className="p-3 sm:p-4 font-medium">Исполнитель</th>
                <th className="p-3 sm:p-4 font-medium w-48">Действия</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr
                  key={o.id}
                  className="border-b border-[#e2e8f0] hover:bg-[#f8f9fb] transition-colors"
                >
                  <td className="p-3 sm:p-4">
                    <div>
                      <p className="font-medium text-[#0f172a]">
                        {o.assetName}
                      </p>
                      <p className="text-xs text-[#64748b]">
                        {o.assetVin.slice(0, 8)}… ·{" "}
                        {o.amount.toLocaleString("ru")} ₽
                      </p>
                    </div>
                  </td>
                  <td className="p-3 sm:p-4 text-[#64748b]">{o.service}</td>
                  <td className="p-3 sm:p-4 text-[#64748b]">{o.city}</td>
                  <td className="p-3 sm:p-4 font-medium text-[#0f172a]">
                    {o.executorName ?? "—"}
                  </td>
                  <td className="p-3 sm:p-4">
                    <div className="flex flex-wrap gap-2">
                      <Link href={`/manager/orders/card/${o.id}`}>
                        <Button variant="primary" size="sm" className="gap-1">
                          Открыть
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button variant="secondary" size="sm" className="gap-1">
                        <MessageSquare className="h-4 w-4" />
                        Сообщение
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
