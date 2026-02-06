"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { executorCompletedOrdersMock } from "@/data/mock";
import { FileText, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function ExecutorHistoryPage() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[var(--black)]">История / Выполненные</h1>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[var(--app-bg)] text-left text-[var(--gray-icon)]">
                  <th className="p-3 sm:p-4 font-medium">Дата</th>
                  <th className="p-3 sm:p-4 font-medium">Услуга</th>
                  <th className="p-3 sm:p-4 font-medium">Актив</th>
                  <th className="p-3 sm:p-4 font-medium">Принято с первого раза</th>
                  <th className="p-3 sm:p-4 font-medium">Начисление</th>
                  <th className="p-3 sm:p-4 font-medium w-10"></th>
                  <th className="p-3 sm:p-4 font-medium w-24"></th>
                </tr>
              </thead>
              <tbody>
                {executorCompletedOrdersMock.map((o) => (
                  <tr
                    key={o.id}
                    onClick={() => router.push(`/executor/orders/${o.id}`)}
                    className="border-b border-[var(--border)] hover:bg-[var(--app-bg)] transition-colors cursor-pointer"
                  >
                    <td className="p-3 sm:p-4 text-[var(--black)]">{o.completedAt}</td>
                    <td className="p-3 sm:p-4 text-[var(--gray-icon)]">{o.serviceLabel}</td>
                    <td className="p-3 sm:p-4 font-medium text-[var(--black)]">{o.assetName}</td>
                    <td className="p-3 sm:p-4">
                      {o.firstTimeAccepted ? (
                        <Badge variant="success">Да</Badge>
                      ) : (
                        <Badge variant="secondary">Были доработки</Badge>
                      )}
                    </td>
                    <td className="p-3 sm:p-4 font-medium text-[var(--black)]">
                      {o.amount.toLocaleString("ru")} ₽
                    </td>
                    <td className="p-3 sm:p-4" onClick={(e) => e.stopPropagation()}>
                      <Link href={`/executor/orders/${o.id}`}>
                        <Button variant="ghost" size="sm" className="gap-1">
                          <ChevronRight className="h-4 w-4" />
                          Открыть
                        </Button>
                      </Link>
                    </td>
                    <td className="p-3 sm:p-4" onClick={(e) => e.stopPropagation()}>
                      {o.reportUrl ? (
                        <a href={o.reportUrl} target="_blank" rel="noopener noreferrer">
                          <Button variant="ghost" size="sm" className="gap-1">
                            <FileText className="h-4 w-4" />
                            Отчёт
                          </Button>
                        </a>
                      ) : (
                        <span className="text-[var(--gray-icon)] text-xs">—</span>
                      )}
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
