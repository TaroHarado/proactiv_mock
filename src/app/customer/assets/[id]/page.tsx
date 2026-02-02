"use client";

import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { stockAssetsMock, customerOrdersMock } from "@/data/mock";

export default function CustomerAssetDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const asset = stockAssetsMock.find((a) => a.id === id);

  if (!asset) {
    return (
      <div className="space-y-4">
        <p className="text-[#64748b]">Актив не найден.</p>
        <Link href="/customer/stock">
          <Button variant="outline">К активам</Button>
        </Link>
      </div>
    );
  }

  const ordersForAsset = customerOrdersMock.filter((o) =>
    o.assetIds.includes(asset.id)
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/customer/stock">
          <Button variant="outline" size="sm">
            ← Активы
          </Button>
        </Link>
        <h1 className="text-2xl font-bold text-[#0f172a]">{asset.name}</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Данные актива</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm">
            <span className="text-[#64748b]">VIN:</span> {asset.vin}
          </p>
          <p className="text-sm">
            <span className="text-[#64748b]">Год:</span> {asset.year}
          </p>
          <p className="text-sm">
            <span className="text-[#64748b]">Тип:</span> {asset.typeLabel}
          </p>
          <p className="text-sm">
            <span className="text-[#64748b]">Адрес:</span> {asset.address},{" "}
            {asset.city}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Заказы по этому активу</CardTitle>
        </CardHeader>
        <CardContent>
          {ordersForAsset.length === 0 ? (
            <p className="text-sm text-[#64748b]">Заказов пока нет.</p>
          ) : (
            <ul className="space-y-2">
              {ordersForAsset.map((o) => (
                <li key={o.id}>
                  <Link
                    href={`/customer/orders/${o.id}`}
                    className="text-[#2563eb] hover:underline"
                  >
                    {o.serviceLabel} — {o.statusLabel}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Link href={`/customer/orders/create?assets=${asset.id}`}>
        <Button>Заказать аудит</Button>
      </Link>
    </div>
  );
}
