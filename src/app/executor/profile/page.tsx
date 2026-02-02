"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { executorUser, getExecutorTypeLabel, getRatingCategoryLabel } from "@/data/mock";

export default function ExecutorProfilePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#0f172a]">Профиль и документы</h1>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Данные исполнителя</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-medium text-[#0f172a]">{executorUser.name}</p>
            <Badge variant="secondary">{getExecutorTypeLabel(executorUser.type)}</Badge>
          </div>
          <p className="text-sm text-[#64748b]">{executorUser.email}</p>
          <div className="grid gap-3 sm:grid-cols-2 text-sm">
            <div className="rounded-xl bg-[#f8f9fb] p-3">
              <span className="text-[#64748b]">Рейтинг</span>
              <p className="font-semibold text-[#0f172a]">{executorUser.rating}</p>
            </div>
            <div className="rounded-xl bg-[#f8f9fb] p-3">
              <span className="text-[#64748b]">Категория</span>
              <p className="font-semibold text-[#0f172a]">{getRatingCategoryLabel(executorUser.ratingCategory)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Документы</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-[#64748b]">
            Реквизиты, договор, акты. Заглушка для загрузки и просмотра документов.
          </p>
          <ul className="mt-4 space-y-2 text-sm text-[#2563eb]">
            <li><a href="#" className="hover:underline">Договор_Исполнитель.pdf</a></li>
            <li><a href="#" className="hover:underline">Реквизиты.pdf</a></li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
