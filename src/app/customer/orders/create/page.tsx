"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useMemo, Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { stockAssetsMock } from "@/data/mock";

// Мок: базовая стоимость аудита за единицу (₽), логистика по зонам (МКАД/вне МКАД)
const AUDIT_BASE_RUB = 15000;
const LOGISTICS_MOSCOW_RUB = 3000;
const LOGISTICS_OTHER_RUB = 5000;

function CustomerOrderCreateContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const assetsParam = searchParams.get("assets") ?? "";
  const assetIds = useMemo(
    () => assetsParam.split(",").filter(Boolean),
    [assetsParam]
  );

  const selectedAssets = useMemo(
    () => stockAssetsMock.filter((a) => assetIds.includes(a.id)),
    [assetIds]
  );

  // Группировка по адресу: разные адреса → отдельные заказы
  const byAddress = useMemo(() => {
    const map: Record<string, typeof selectedAssets> = {};
    for (const a of selectedAssets) {
      const key = a.address;
      if (!map[key]) map[key] = [];
      map[key].push(a);
    }
    return map;
  }, [selectedAssets]);

  const [contacts, setContacts] = useState<Record<string, { contact: string; phone: string; comments: string }>>(() => {
    const init: Record<string, { contact: string; phone: string; comments: string }> = {};
    for (const addr of Object.keys(byAddress)) {
      init[addr] = { contact: "", phone: "", comments: "" };
    }
    return init;
  });

  if (selectedAssets.length === 0) {
    return (
      <div className="space-y-4">
        <p className="text-[#64748b]">
          Не выбрано ни одного актива. Выберите активы в разделе «Активы».
        </p>
        <Link href="/customer/stock">
          <Button variant="outline">К активам</Button>
        </Link>
      </div>
    );
  }

  const totalBase = selectedAssets.length * AUDIT_BASE_RUB;
  const addresses = Object.keys(byAddress);
  const totalLogistics = addresses.reduce(
    (sum, addr) =>
      sum +
      (addr.includes("Москва") ? LOGISTICS_MOSCOW_RUB : LOGISTICS_OTHER_RUB),
    0
  );
  const totalRub = totalBase + totalLogistics;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Мок: создание заказа и редирект в список
    router.push("/customer/orders");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/customer/stock">
          <Button variant="outline" size="sm">
            ← Активы
          </Button>
        </Link>
        <h1 className="text-2xl font-bold text-[#0f172a]">
          Оформление заказа: Аудит
        </h1>
      </div>

      <p className="text-sm text-[#64748b]">
        По разным адресам будут созданы отдельные заказы. Заполните контактные
        данные по каждой локации.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {Object.entries(byAddress).map(([address, assets]) => (
          <Card key={address}>
            <CardHeader>
              <CardTitle className="text-base">Локация: {address}</CardTitle>
              <p className="text-sm text-[#64748b]">
                Активов: {assets.map((a) => a.name).join(", ")}
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#0f172a] mb-1">
                  Контактное лицо
                </label>
                <Input
                  value={contacts[address]?.contact ?? ""}
                  onChange={(e) =>
                    setContacts((prev) => ({
                      ...prev,
                      [address]: {
                        ...prev[address],
                        contact: e.target.value,
                        phone: prev[address]?.phone ?? "",
                        comments: prev[address]?.comments ?? "",
                      },
                    }))
                  }
                  placeholder="ФИО"
                  className="max-w-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#0f172a] mb-1">
                  Телефон
                </label>
                <Input
                  type="tel"
                  value={contacts[address]?.phone ?? ""}
                  onChange={(e) =>
                    setContacts((prev) => ({
                      ...prev,
                      [address]: {
                        ...prev[address],
                        phone: e.target.value,
                        contact: prev[address]?.contact ?? "",
                        comments: prev[address]?.comments ?? "",
                      },
                    }))
                  }
                  placeholder="+7 …"
                  className="max-w-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#0f172a] mb-1">
                  Комментарии (удобное время, доступ и т.д.)
                </label>
                <Input
                  value={contacts[address]?.comments ?? ""}
                  onChange={(e) =>
                    setContacts((prev) => ({
                      ...prev,
                      [address]: {
                        ...prev[address],
                        comments: e.target.value,
                        contact: prev[address]?.contact ?? "",
                        phone: prev[address]?.phone ?? "",
                      },
                    }))
                  }
                  placeholder="Текст"
                  className="max-w-md"
                />
              </div>
            </CardContent>
          </Card>
        ))}

        <Card className="bg-[#f8f9fb]">
          <CardHeader>
            <CardTitle className="text-base">Стоимость</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-[#0f172a]">
              База (аудит): {selectedAssets.length} × {AUDIT_BASE_RUB.toLocaleString("ru-RU")} ₽ ={" "}
              {totalBase.toLocaleString("ru-RU")} ₽
            </p>
            <p className="text-sm text-[#0f172a]">
              Логистика: {addresses.length} адрес(ов) —{" "}
              {totalLogistics.toLocaleString("ru-RU")} ₽
            </p>
            <p className="text-lg font-semibold text-[#0f172a]">
              Итого: {totalRub.toLocaleString("ru-RU")} ₽ (с НДС)
            </p>
            <p className="text-sm text-[#64748b] mt-2">
              Стоимость технического аудита: {totalRub.toLocaleString("ru-RU")} ₽ (с
              НДС). Стоимость ТО/ремонта и продажи под ключ будет рассчитана
              после аудита.
            </p>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button type="submit">Создать заказ</Button>
          <Link href="/customer/stock">
            <Button type="button" variant="outline">
              Отмена
            </Button>
          </Link>
        </div>
      </form>
    </div>
  );
}

export default function CustomerOrderCreatePage() {
  return (
    <Suspense fallback={<div className="text-[#64748b] p-4">Загрузка…</div>}>
      <CustomerOrderCreateContent />
    </Suspense>
  );
}
