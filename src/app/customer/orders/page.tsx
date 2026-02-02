"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { customerOrdersMock } from "@/data/mock";

function CustomerOrdersContent() {
  const searchParams = useSearchParams();
  const highlight = searchParams.get("highlight");

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#0f172a]">Заказы услуг</h1>

      <div className="space-y-4">
        {customerOrdersMock.map((order) => (
          <Link key={order.id} href={`/customer/orders/${order.id}`}>
            <Card
              className={`cursor-pointer hover:shadow-md transition-shadow ${
                highlight === order.id ? "ring-2 ring-[#2563eb]" : ""
              }`}
            >
              <CardHeader className="pb-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <CardTitle className="text-base">
                    {order.assetNames.join(", ")} — {order.serviceLabel}
                  </CardTitle>
                  <Badge
                    className={
                      order.status === "completed"
                        ? "bg-[#16a34a]"
                        : order.status === "access_pending"
                        ? "bg-[#f59e0b]"
                        : "bg-[#2563eb]"
                    }
                  >
                    {order.statusLabel}
                  </Badge>
                </div>
                <p className="text-sm text-[#64748b]">
                  {order.address} · {order.city}
                </p>
              </CardHeader>
              <CardContent>
                {order.executorName && (
                  <p className="text-sm text-[#0f172a]">
                    Исполнитель: {order.executorName}
                  </p>
                )}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function CustomerOrdersPage() {
  return (
    <Suspense fallback={<div className="text-[#64748b] p-4">Загрузка…</div>}>
      <CustomerOrdersContent />
    </Suspense>
  );
}
