"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mockExecutors, getExecutorTypeLabel } from "@/data/mock";
import { ArrowLeft } from "lucide-react";

export default function ExecutorProfilePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const executor = mockExecutors.find((e) => e.id === id);

  if (!executor) {
    return (
      <div className="space-y-6">
        <p className="text-[#64748b]">Исполнитель не найден.</p>
        <Link href="/manager/executors">
          <Button variant="secondary">К списку</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="gap-1 text-[#2563eb]"
        >
          <ArrowLeft className="h-4 w-4" />
          Назад
        </Button>
        <h1 className="text-2xl font-bold text-[#0f172a]">
          Кабинет исполнителя: {executor.name}
        </h1>
        <Badge variant="secondary">{getExecutorTypeLabel(executor.type)}</Badge>
        {executor.isProblematic && (
          <Badge variant="destructive">Проблемный</Badge>
        )}
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-[#64748b]">
              Рейтинг
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-[#0f172a]">{executor.rating}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-[#64748b]">
              Активные заказы
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-[#0f172a]">
              {executor.activeOrders}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-[#64748b]">
              % отказов
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-[#0f172a]">
              {executor.rejectionRate}%
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>История оценок качества (служебное)</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-[#64748b]">
            Здесь менеджер видит историю оценок по заказам. Заглушка для
            интеграции с API.
          </p>
          <div className="mt-4 rounded-xl border border-[#e2e8f0] p-4 text-sm">
            <div className="flex justify-between border-b border-[#e2e8f0] pb-2">
              <span>Заказ / Услуга</span>
              <span>Оценка</span>
            </div>
            <div className="flex justify-between py-2 text-[#64748b]">
              <span>KamAZ 5490 — Аудит</span>
              <span>4.8</span>
            </div>
            <div className="flex justify-between py-2 text-[#64748b]">
              <span>Hyundai Porter — ТО и ремонт</span>
              <span>4.2</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Активные заказы (как у исполнителя)</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-[#64748b]">
            Список активных заказов исполнителя — тот же вид, что видит
            исполнитель в своём кабинете.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
