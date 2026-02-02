"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileSearch } from "lucide-react";

export default function ManagerInspectionNewPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#0f172a]">Инспекция</h1>
      <Card className="rounded-2xl border-[#e2e8f0] bg-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <FileSearch className="h-5 w-5 text-[#2563eb]" />
            Заказ инспекции — функционал заказчика
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-[#64748b]">
            Создание заявки на инспекцию выполняется в кабинете заказчика. Менеджер
            работает с уже созданными заказами: назначает исполнителей, проверяет
            отчёты, ведёт задачи в очереди.
          </p>
          <Link href="/customer/stock">
            <Button variant="outline" size="sm">
              Перейти в кабинет заказчика (активы)
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
