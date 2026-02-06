"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { executorUser, getRatingCategoryLabel } from "@/data/mock";
import { ShieldCheck, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

type ContractorScope = "npd" | "ip_ooo";

export default function ExecutorProfilePage() {
  const initialScope: ContractorScope =
    executorUser.contractorType === "npd" ? "npd" : "ip_ooo";
  const [scope, setScope] = useState<ContractorScope>(initialScope);
  const isNpd = scope === "npd";

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#0f172a]">Профиль и документы</h1>

      {/* Сфера: ползунок выбора Самозанятый / ИП·ООО */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Сфера</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-[#64748b] mb-3">
            Выберите тип контрагента — от этого зависит набор полей и документов.
          </p>
          <div
            role="group"
            aria-label="Тип контрагента"
            className="inline-flex rounded-xl border border-[#e2e8f0] bg-[#f1f5f9] p-1"
          >
            <button
              type="button"
              onClick={() => setScope("npd")}
              className={cn(
                "rounded-lg px-4 py-2.5 text-sm font-medium transition-colors",
                isNpd
                  ? "bg-[#2563eb] text-white shadow-sm"
                  : "text-[#64748b] hover:text-[#0f172a]"
              )}
            >
              Самозанятый (НПД)
            </button>
            <button
              type="button"
              onClick={() => setScope("ip_ooo")}
              className={cn(
                "rounded-lg px-4 py-2.5 text-sm font-medium transition-colors",
                !isNpd
                  ? "bg-[#2563eb] text-white shadow-sm"
                  : "text-[#64748b] hover:text-[#0f172a]"
              )}
            >
              ИП / ООО
            </button>
          </div>
        </CardContent>
      </Card>

      {/* ——— НПД: Данные исполнителя ——— */}
      {isNpd && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Данные исполнителя</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-medium text-[#0f172a]">{executorUser.name}</p>
              {executorUser.inn && (
                <span className="text-sm text-[#64748b]">ИНН {executorUser.inn}</span>
              )}
            </div>
            <div className="flex flex-wrap gap-4 text-sm">
              <span className="text-[#64748b]">Почта: {executorUser.email}</span>
              {executorUser.phone && (
                <span className="text-[#64748b]">Телефон: {executorUser.phone}</span>
              )}
            </div>
            <Badge variant="secondary">Статус: НПД самозанятый</Badge>
            <div className="grid gap-2 text-sm">
              {executorUser.education && (
                <p><span className="text-[#64748b]">Образование: </span>{executorUser.education}</p>
              )}
              {executorUser.specialization && (
                <p><span className="text-[#64748b]">Специализация: </span>{executorUser.specialization}</p>
              )}
              {executorUser.experienceYears != null && (
                <p><span className="text-[#64748b]">Опыт: </span>{executorUser.experienceYears} лет</p>
              )}
              {!executorUser.education && !executorUser.specialization && executorUser.experienceYears == null && (
                <p className="text-[#64748b]">Образование, специализация и опыт можно добавить в настройках.</p>
              )}
            </div>
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
      )}

      {/* ——— ИП/ООО: Данные исполнителя ——— */}
      {!isNpd && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Данные исполнителя</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-medium text-[#0f172a]">
                {executorUser.companyName ?? executorUser.name}
              </p>
              {executorUser.inn && (
                <span className="text-sm text-[#64748b]">ИНН {executorUser.inn}</span>
              )}
            </div>
            <Badge variant="secondary">Подрядчик ООО/ИП</Badge>
            <div className="rounded-xl bg-[#f8f9fb] p-3 text-sm">
              <p className="font-medium text-[#0f172a] mb-1">О компании / ИП</p>
              <p className="text-[#64748b]">
                {executorUser.companyName
                  ? `Исполнитель — ${executorUser.companyName}. Контакт: ${executorUser.email}${executorUser.phone ? `, ${executorUser.phone}` : ""}.`
                  : "Краткое описание деятельности (заглушка)."}
              </p>
            </div>
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
      )}

      {/* Верификация — только для НПД */}
      {isNpd && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <ShieldCheck className="h-5 w-5" />
              Данные о верификации аккаунта
            </CardTitle>
          </CardHeader>
          <CardContent>
            {executorUser.isVerified ? (
              <div className="space-y-2">
                <p className="text-sm text-[#0f172a]">
                  Верификация пройдена
                  {executorUser.verificationMethod === "esia" && " через ЕСИА — паспортные данные не запрашиваются."}
                  {executorUser.verificationMethod === "passport" && " по паспортным данным."}
                </p>
                {executorUser.verificationMethod === "passport" && (
                  <div className="rounded-xl bg-[#f8f9fb] p-3 text-sm mt-2">
                    <p className="font-medium text-[#0f172a] mb-1">Паспортные данные</p>
                    <p className="text-[#64748b]">
                      Серия, номер, кем выдан (отображаются после проверки; заглушка для демо).
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-[#64748b]">
                  Подтвердите личность для доступа к заказам и выплатам.
                </p>
                <Button variant="primary" size="sm" className="gap-2">
                  <ShieldCheck className="h-4 w-4" />
                  Пройти верификацию
                </Button>
                <div className="flex flex-wrap gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => {}}>
                    Через ЕСИА
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => {}}>
                    Паспорт
                  </Button>
                </div>
                <p className="text-xs text-[#64748b]">Кнопки пока заглушки.</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Реквизиты — общий блок с возможностью корректировки */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Реквизиты исполнителя
          </CardTitle>
        </CardHeader>
        <CardContent>
          {executorUser.requisites ? (
            <p className="text-sm text-[#0f172a] whitespace-pre-wrap">{executorUser.requisites}</p>
          ) : (
            <p className="text-sm text-[#64748b]">Реквизиты не указаны.</p>
          )}
          <p className="mt-2 text-xs text-[#64748b]">
            Редактирование реквизитов с уведомлением нас или автоматической сменой в формах и подписании (заглушка — в проде будет форма).
          </p>
        </CardContent>
      </Card>

      {/* Документы */}
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
