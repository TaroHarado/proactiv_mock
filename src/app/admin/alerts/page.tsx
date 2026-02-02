"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { adminAlertsMock } from "@/data/mock";
import { AlertTriangle } from "lucide-react";

export default function AdminAlertsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#0f172a]">Панель тревог</h1>
      <p className="text-sm text-[#64748b]">Единая очередь «что горит»: заказ не взят &gt; 3 ч, доступ не согласован, проверка/доработка висит, скрейперы не обновлялись, незакрытые оплаты, компании в риске</p>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-[#f59e0b]" />
            Критичные события
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {adminAlertsMock.map((a) => (
              <li key={a.id} className="flex items-center justify-between rounded-xl border border-[#f59e0b] bg-[#fffbeb] px-4 py-3">
                <div>
                  <p className="font-medium text-[#0f172a]">{a.title}</p>
                  <p className="text-sm text-[#64748b]">{a.description}</p>
                  <p className="text-xs text-[#94a3b8] mt-1">{a.createdAt}</p>
                </div>
                <div className="flex gap-2">
                  {a.objectId && a.objectType === "order" && (
                    <Link href={`/manager/orders/card/${a.objectId}`}>
                      <Button variant="outline" size="sm">Заказ</Button>
                    </Link>
                  )}
                  {a.objectType === "company" && (
                    <Link href="/admin/companies">
                      <Button variant="outline" size="sm">Компании</Button>
                    </Link>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
