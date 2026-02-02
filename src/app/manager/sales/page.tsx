"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { mockPublications, mockShowings } from "@/data/mock";
import { Search, Filter, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { id: "publications" as const, label: "Публикации" },
  { id: "showings" as const, label: "Показы" },
];

export default function SalesPage() {
  const [activeTab, setActiveTab] = useState<"publications" | "showings">(
    "publications"
  );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#0f172a]">
        Продажа под ключ: публикации и показы
      </h1>

      <div className="flex gap-1 border-b border-[#e2e8f0]">
        {tabs.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            onClick={() => setActiveTab(id)}
            className={cn(
              "rounded-t-xl px-4 py-2.5 text-sm font-medium transition-colors",
              activeTab === id
                ? "bg-[#2563eb] text-white"
                : "text-[#64748b] hover:bg-[#f1f5f9] hover:text-[#0f172a]"
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {activeTab === "publications" && (
        <Card>
          <CardHeader className="pb-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="relative w-56">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748b]" />
                  <Input placeholder="Поиск по активу..." className="pl-9" />
                </div>
                <Button variant="secondary" size="sm" className="gap-1">
                  <Filter className="h-4 w-4" />
                  Фильтры
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#e2e8f0] bg-[#f8f9fb] text-left text-[#64748b]">
                    <th className="p-4 font-medium">Актив</th>
                    <th className="p-4 font-medium">Auto.ru</th>
                    <th className="p-4 font-medium">Avito</th>
                    <th className="p-4 font-medium">Drom</th>
                    <th className="p-4 font-medium">Статус</th>
                  </tr>
                </thead>
                <tbody>
                  {mockPublications.map((pub) => (
                    <tr
                      key={pub.id}
                      className="border-b border-[#e2e8f0] hover:bg-[#f8f9fb] transition-colors"
                    >
                      <td className="p-4 font-medium text-[#0f172a]">
                        {pub.assetName}
                      </td>
                      <td className="p-4">
                        {pub.autoRu ? (
                          <a
                            href={pub.autoRu}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#2563eb] hover:underline flex items-center gap-1"
                          >
                            Ссылка <ExternalLink className="h-3 w-3" />
                          </a>
                        ) : (
                          <span className="text-[#64748b]">—</span>
                        )}
                      </td>
                      <td className="p-4">
                        {pub.avito ? (
                          <a
                            href={pub.avito}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#2563eb] hover:underline flex items-center gap-1"
                          >
                            Ссылка <ExternalLink className="h-3 w-3" />
                          </a>
                        ) : (
                          <span className="text-[#64748b]">—</span>
                        )}
                      </td>
                      <td className="p-4">
                        {pub.drom ? (
                          <a
                            href={pub.drom}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#2563eb] hover:underline flex items-center gap-1"
                          >
                            Ссылка <ExternalLink className="h-3 w-3" />
                          </a>
                        ) : (
                          <span className="text-[#64748b]">—</span>
                        )}
                      </td>
                      <td className="p-4">
                        {pub.published ? (
                          <Badge variant="success">Опубликовано</Badge>
                        ) : (
                          <Badge variant="secondary">Не опубликовано</Badge>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === "showings" && (
        <Card>
          <CardHeader className="pb-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="relative w-56">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748b]" />
                <Input placeholder="Поиск по заявке..." className="pl-9" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#e2e8f0] bg-[#f8f9fb] text-left text-[#64748b]">
                    <th className="p-4 font-medium">Актив</th>
                    <th className="p-4 font-medium">Покупатель</th>
                    <th className="p-4 font-medium">Контакт</th>
                    <th className="p-4 font-medium">Дата заявки</th>
                    <th className="p-4 font-medium">Статус</th>
                  </tr>
                </thead>
                <tbody>
                  {mockShowings.map((sh) => (
                    <tr
                      key={sh.id}
                      className="border-b border-[#e2e8f0] hover:bg-[#f8f9fb] transition-colors"
                    >
                      <td className="p-4 font-medium text-[#0f172a]">
                        {sh.assetName}
                      </td>
                      <td className="p-4 text-[#64748b]">{sh.buyerName}</td>
                      <td className="p-4 text-[#64748b]">{sh.contact}</td>
                      <td className="p-4 text-[#64748b]">
                        {new Date(sh.requestedAt).toLocaleDateString("ru")}
                      </td>
                      <td className="p-4">
                        {sh.status === "pending" && (
                          <Badge variant="warning">Ожидает согласования</Badge>
                        )}
                        {sh.status === "approved" && (
                          <Badge variant="success">Согласовано</Badge>
                        )}
                        {sh.status === "rejected" && (
                          <Badge variant="destructive">Отклонено</Badge>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
