"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  getAuditState,
  getAuditCompletedForAsset,
  prepOrdersMock,
  getSaleOrderByAssetId,
} from "@/data/mock";
import { ArrowLeft } from "lucide-react";
import { useEffect } from "react";

export default function SaleStartPage() {
  const params = useParams();
  const router = useRouter();
  const assetId = params.assetId as string;
  const auditCompleted = getAuditCompletedForAsset(assetId);
  const auditState = getAuditState(assetId);
  const prepOrder = prepOrdersMock.find((o) => o.assetId === assetId && o.status === "completed");
  const saleOrder = getSaleOrderByAssetId(assetId);

  useEffect(() => {
    if (saleOrder) {
      router.replace(`/manager/orders/sale/${saleOrder.id}`);
      return;
    }
    if (!auditCompleted) return;
    if (prepOrder) {
      router.replace(`/manager/sale/${assetId}/options?fromPrep=1`);
    } else {
      router.replace(`/manager/sale/${assetId}/scenario`);
    }
  }, [assetId, auditCompleted, prepOrder, saleOrder, router]);

  if (!auditCompleted) {
    return (
      <div className="space-y-6">
        <Link href={`/manager/orders/card/${assetId}`}>
          <Button variant="ghost" size="sm" className="gap-1 text-[#2563eb]">
            <ArrowLeft className="h-4 w-4" />
            Назад
          </Button>
        </Link>
        <Card className="rounded-2xl border border-[#e2e8f0] bg-white p-6">
          <CardTitle className="text-base">Сначала нужен аудит</CardTitle>
          <CardContent className="pt-4">
            <p className="text-sm text-[#64748b]">
              Для продажи под ключ по этому активу сначала выполняется аудит. После завершения аудита вы сможете выбрать сценарий и параметры продажи.
            </p>
            <Link href="/manager/orders/new">
              <Button variant="primary" className="mt-4">К заказам</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-12 text-[#64748b]">
      Перенаправление…
    </div>
  );
}
