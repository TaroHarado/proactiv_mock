"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { executorActiveOrdersMock } from "@/data/mock";
import Link from "next/link";
import { ChevronRight, MessageCircle } from "lucide-react";

const statusVariant: Record<string, "default" | "secondary" | "warning" | "outline"> = {
  access_pending: "warning",
  in_progress: "default",
  on_review: "secondary",
  on_rework: "warning",
  completed: "outline",
};

export default function ExecutorOrdersPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#0f172a]">Мои активные заказы</h1>

      <Card>
        <CardContent className="p-0">
          <ul className="divide-y divide-[#e2e8f0]">
            {executorActiveOrdersMock.map((o) => (
              <li
                key={o.id}
                className="flex flex-wrap items-center justify-between gap-4 p-4 hover:bg-[#f8f9fb] transition-colors"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-[#0f172a]">{o.assetName}</p>
                  <p className="text-sm text-[#64748b]">{o.serviceLabel}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <Badge variant={statusVariant[o.status] ?? "secondary"}>
                      {o.statusLabel}
                    </Badge>
                    {o.status === "access_pending" && (
                      <span className="text-xs text-[#64748b]">
                        Выезд возможен после подтверждения доступа
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Link href={`/executor/orders/${o.id}`}>
                    <Button variant="primary" size="sm" className="gap-1">
                      Открыть
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button variant="secondary" size="sm" className="gap-1">
                    <MessageCircle className="h-4 w-4" />
                    Чат с менеджером
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
