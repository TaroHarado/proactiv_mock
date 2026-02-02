"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import { useState } from "react";

export default function ExecutorSupportPage() {
  const [message, setMessage] = useState("");

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#0f172a]">Поддержка / Чат с менеджером</h1>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Переписка с менеджером
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-xl border border-[#e2e8f0] bg-[#f8f9fb] p-4">
            <div className="flex gap-3">
              <div className="h-8 w-8 rounded-full bg-[#e2e8f0] shrink-0" />
              <div>
                <p className="text-xs text-[#64748b]">Менеджер, 01.02.2025</p>
                <p className="text-sm">По заказу KamAZ 5490 доступ согласован. Можете выезжать.</p>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Введите сообщение..."
              className="min-h-[80px] w-full rounded-xl border border-[#e2e8f0] bg-white px-3 py-2 text-sm placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
            />
            <Button variant="primary" className="shrink-0">Отправить</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
