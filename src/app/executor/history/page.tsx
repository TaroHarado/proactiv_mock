"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { executorCompletedOrdersMock } from "@/data/mock";
import { FileText, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function ExecutorHistoryPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#0f172a]">История / Выполненные</h1>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#e2e8f0] bg-[#f8f9fb] text-left text-[#64748b]">
                  <th className="p-3 sm:p-4 font-medium">Дата</th>
                  <th className="p-3 sm:p-4 font-medium">Услуга</th>
                  <th className="p-3 sm:p-4 font-medium">Актив</th>
                  <th className="p-3 sm:p-4 font-medium">Принято с первого раза</th>
                  <th className="p-3 sm:p-4 font-medium">Начисление</th>
                  <th className="p-3 sm:p-4 font-medium w-24"></th>
                </tr>
              </thead>
              <tbody>
                {executorCompletedOrdersMock.map((o) => (
                  <tr
                    key={o.id}
                    className="border-b border-[#e2e8f0] hover:bg-[#f8f9fb] transition-colors"
                  >
                    <td className="p-3 sm:p-4 text-[#0f172a]">{o.completedAt}</td>
                    <td className="p-3 sm:p-4 text-[#64748b]">{o.serviceLabel}</td>
                    <td className="p-3 sm:p-4 font-medium text-[#0f172a]">{o.assetName}</td>
                    <td className="p-3 sm:p-4">
                      {o.firstTimeAccepted ? (
                        <Badge variant="success">Да</Badge>
                      ) : (
                        <Badge variant="secondary">Были доработки</Badge>
                      )}
                    </td>
                    <td className="p-3 sm:p-4 font-medium text-[#0f172a]">
                      {o.amount.toLocaleString("ru")} ₽
                    </td>
                    <td className="p-3 sm:p-4">
                      <Button variant="ghost" size="sm" className="gap-1">
                        <FileText className="h-4 w-4" />
                        Отчёт
                      </Button>
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
