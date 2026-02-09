"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { AssetTypeIcon } from "@/components/ui/asset-type-icon";
import {
  stockAssetsMock,
  customerEmployeesMock,
  customerAssetsInWorkMock,
  customerAssetsRealizedMock,
  CUSTOMER_ASSET_TYPE_LABELS,
  type CustomerAssetType,
} from "@/data/mock";
import { Package, Upload, Plus } from "lucide-react";

const stockOnly = stockAssetsMock.filter((a) => (a.portfolioStatus ?? "stock") === "stock");
const inWork = stockAssetsMock.filter((a) => a.portfolioStatus === "in_work");
const realized = customerAssetsRealizedMock;

export default function CustomerStockPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"assets" | "in_work" | "realized">("assets");
  const [selectionMode, setSelectionMode] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [assignEmployeeOpen, setAssignEmployeeOpen] = useState(false);
  const [filters, setFilters] = useState({ vin: "", type: "", brand: "", city: "", employeeId: "" });

  const list = activeTab === "assets" ? stockOnly : activeTab === "in_work" ? inWork : [];
  const filteredList =
    activeTab === "assets"
      ? stockOnly.filter((a) => {
          if (filters.vin && !a.vin.toLowerCase().includes(filters.vin.toLowerCase())) return false;
          if (filters.type && a.type !== filters.type) return false;
          if (filters.brand && !(a.brand ?? a.name).toLowerCase().includes(filters.brand.toLowerCase())) return false;
          if (filters.city && !a.city.toLowerCase().includes(filters.city.toLowerCase())) return false;
          if (filters.employeeId && a.employeeId !== filters.employeeId) return false;
          return true;
        })
      : list;

  const toggle = (id: string) => {
    if (activeTab !== "assets") return;
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectAll = () => {
    if (activeTab !== "assets") return;
    if (selected.size === filteredList.length) setSelected(new Set());
    else setSelected(new Set(filteredList.map((a) => a.id)));
  };

  const handleOrderService = () => {
    if (selected.size === 0) return;
    if (selected.size === 1) router.push(`/customer/orders/create?assets=${Array.from(selected)[0]}`);
    else router.push(`/customer/orders/create?assets=${Array.from(selected).join(",")}`);
  };

  const handleDelete = () => {
    setDeleteConfirmOpen(false);
    setSelected(new Set());
    setSelectionMode(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-[#0f172a]">Активы</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-1">
            <Upload className="h-4 w-4" /> Загрузить сток
          </Button>
          <Link href="/customer/stock/add">
            <Button variant="outline" size="sm" className="gap-1">
              <Plus className="h-4 w-4" /> Добавить актив
            </Button>
          </Link>
          {activeTab === "assets" && (
            <>
              {!selectionMode ? (
                <Button size="sm" variant="outline" onClick={() => setSelectionMode(true)}>
                  Выбрать
                </Button>
              ) : (
                <>
                  <Button size="sm" variant="outline" onClick={() => { setSelectionMode(false); setSelected(new Set()); }}>
                    Отменить выбор
                  </Button>
                  {selected.size > 0 && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-[#64748b]">Выбрано: {selected.size}</span>
                      <Select
                        className="w-44"
                        defaultValue=""
                        onChange={(e) => {
                          const v = e.target.value;
                          if (v === "order") handleOrderService();
                          if (v === "assign") setAssignEmployeeOpen(true);
                          if (v === "realized") { /* перенести в реализованные */ }
                          if (v === "delete") setDeleteConfirmOpen(true);
                          e.target.value = "";
                        }}
                      >
                        <option value="">Выбрать действие</option>
                        <option value="order">Заказать услугу</option>
                        <option value="assign">Назначить сотрудника</option>
                        <option value="realized">Перенести в реализованные</option>
                        <option value="delete">Удалить активы</option>
                      </Select>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>

      {/* Вкладки */}
      <div className="flex gap-1 rounded-xl border border-[#e2e8f0] bg-white p-0.5">
        {(["assets", "in_work", "realized"] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => { setActiveTab(tab); setSelected(new Set()); setSelectionMode(false); }}
            className={`rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
              activeTab === tab ? "bg-[#2563eb] text-white" : "text-[#64748b] hover:bg-[#f1f5f9] hover:text-[#0f172a]"
            }`}
          >
            {tab === "assets" && `Активы (${stockOnly.length})`}
            {tab === "in_work" && `В работе (${inWork.length})`}
            {tab === "realized" && `Реализованные (${realized.length})`}
          </button>
        ))}
      </div>

      {/* Фильтры (только для вкладки Активы) */}
      {activeTab === "assets" && (
        <Card className="rounded-2xl border-[#e2e8f0] bg-white">
          <CardContent className="pt-6">
            <div className="flex flex-wrap gap-3 items-end">
              <div>
                <label className="block text-xs text-[#64748b] mb-1">VIN</label>
                <Input placeholder="Поиск по VIN" value={filters.vin} onChange={(e) => setFilters((f) => ({ ...f, vin: e.target.value }))} className="w-40" />
              </div>
              <div>
                <label className="block text-xs text-[#64748b] mb-1">Тип</label>
                <Select value={filters.type} onChange={(e) => setFilters((f) => ({ ...f, type: e.target.value }))} className="w-48">
                  <option value="">Все</option>
                  {(Object.entries(CUSTOMER_ASSET_TYPE_LABELS) as [CustomerAssetType, string][]).map(([k, l]) => (
                    <option key={k} value={k}>{l}</option>
                  ))}
                </Select>
              </div>
              <div>
                <label className="block text-xs text-[#64748b] mb-1">Марка</label>
                <Input placeholder="Марка" value={filters.brand} onChange={(e) => setFilters((f) => ({ ...f, brand: e.target.value }))} className="w-32" />
              </div>
              <div>
                <label className="block text-xs text-[#64748b] mb-1">Город</label>
                <Input placeholder="Город" value={filters.city} onChange={(e) => setFilters((f) => ({ ...f, city: e.target.value }))} className="w-36" />
              </div>
              <div>
                <label className="block text-xs text-[#64748b] mb-1">Ответственный</label>
                <Select value={filters.employeeId} onChange={(e) => setFilters((f) => ({ ...f, employeeId: e.target.value }))} className="w-48">
                  <option value="">Все</option>
                  {customerEmployeesMock.map((e) => (
                    <option key={e.id} value={e.id}>{e.fullName}</option>
                  ))}
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Таблица активов */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Package className="h-4 w-4" />
            {activeTab === "assets" && "Реестр активов (общий список)"}
            {activeTab === "in_work" && "Активы в работе"}
            {activeTab === "realized" && "Реализованные активы"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {activeTab === "assets" && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#e2e8f0] text-left text-[#64748b]">
                    {selectionMode && <th className="pb-2 pr-2 w-10"><input type="checkbox" checked={selected.size === filteredList.length && filteredList.length > 0} onChange={selectAll} className="rounded" /></th>}
                    <th className="pb-2 pr-2 w-10">Тип</th>
                    <th className="pb-2 pr-4">Марка</th>
                    <th className="pb-2 pr-4">Модель</th>
                    <th className="pb-2 pr-4">Год</th>
                    <th className="pb-2 pr-4">Пробег/моточсы</th>
                    <th className="pb-2 pr-4">VIN</th>
                    <th className="pb-2 pr-4">Цена, ₽</th>
                    <th className="pb-2 pr-4">Экспозиция</th>
                    <th className="pb-2 pr-4">Город</th>
                    <th className="pb-2">Сотрудник</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredList.map((a) => (
                    <tr
                      key={a.id}
                      className={`border-b border-[#e2e8f0] ${selectionMode && selected.has(a.id) ? "bg-[#eff6ff]" : ""} ${selectionMode ? "cursor-pointer" : ""}`}
                      onClick={() => selectionMode && toggle(a.id)}
                    >
                      {selectionMode && (
                        <td className="py-2 pr-2" onClick={(e) => e.stopPropagation()}>
                          <input type="checkbox" checked={selected.has(a.id)} onChange={() => toggle(a.id)} className="rounded" />
                        </td>
                      )}
                      <td className="py-2 pr-2 text-[#64748b]">
                        {a.type ? (
                          <div className="flex items-center gap-1.5">
                            <AssetTypeIcon type={a.type} />
                            <span className="hidden sm:inline text-xs">
                              {CUSTOMER_ASSET_TYPE_LABELS[a.type].split(" ")[0]}
                            </span>
                          </div>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="py-2 pr-4 font-medium text-[#0f172a]">{a.brand ?? a.name.split(" ")[0]}</td>
                      <td className="py-2 pr-4">{a.model ?? a.name.split(" ").slice(1).join(" ")}</td>
                      <td className="py-2 pr-4">{a.year}</td>
                      <td className="py-2 pr-4">{a.mileage ?? a.motohours ?? "—"}</td>
                      <td className="py-2 pr-4 text-[#64748b] font-mono text-xs">{a.vin}</td>
                      <td className="py-2 pr-4">{a.price != null ? (a.price / 1000).toFixed(0) + "k" : "—"}</td>
                      <td className="py-2 pr-4">{a.exposureDays != null ? `${a.exposureDays} дн.` : "—"}</td>
                      <td className="py-2 pr-4">{a.city}</td>
                      <td className="py-2 text-[#64748b]">{customerEmployeesMock.find((e) => e.id === a.employeeId)?.fullName ?? "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {activeTab === "in_work" && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#e2e8f0] text-left text-[#64748b]">
                    <th className="pb-2 pr-4">Актив</th>
                    <th className="pb-2 pr-4">Услуга</th>
                    <th className="pb-2 pr-4">Этап</th>
                    <th className="pb-2 pr-4">Сотрудник</th>
                    <th className="pb-2">Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {customerAssetsInWorkMock.map((a) => (
                    <tr key={a.assetId} className="border-b border-[#e2e8f0]">
                      <td className="py-2 pr-4 font-medium text-[#0f172a]">{a.assetName}</td>
                      <td className="py-2 pr-4">{a.serviceLabel}</td>
                      <td className="py-2 pr-4">
                        {a.stageLabel}
                        {a.needsCustomerAction && <Badge className="ml-1 bg-[#f59e0b]">{a.actionLabel}</Badge>}
                      </td>
                      <td className="py-2 pr-4">{a.employeeName ?? "—"}</td>
                      <td className="py-2">
                        <Link href={`/customer/orders/${a.orderId}`}>
                          <Button variant="ghost" size="sm">Заказ</Button>
                        </Link>
                        <Button variant="ghost" size="sm">Назначить сотрудника</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {activeTab === "realized" && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#e2e8f0] text-left text-[#64748b]">
                    <th className="pb-2 pr-4">Актив</th>
                    <th className="pb-2 pr-4">Город</th>
                    <th className="pb-2 pr-4">Сотрудник</th>
                    <th className="pb-2 pr-4">Снижение экспозиции</th>
                    <th className="pb-2 pr-4">ROI</th>
                    <th className="pb-2">Дата</th>
                  </tr>
                </thead>
                <tbody>
                  {realized.map((a) => (
                    <tr key={a.assetId} className="border-b border-[#e2e8f0]">
                      <td className="py-2 pr-4 font-medium text-[#0f172a]">{a.assetName}</td>
                      <td className="py-2 pr-4">{a.city}</td>
                      <td className="py-2 pr-4">{a.employeeName ?? "—"}</td>
                      <td className="py-2 pr-4 text-[#16a34a]">−{a.exposureReductionDays} дн.</td>
                      <td className="py-2 pr-4">{a.roiPercent}%</td>
                      <td className="py-2">{a.realizedAt}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Модальное подтверждение удаления */}
      {deleteConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-base">Удалить активы?</CardTitle>
              <p className="text-sm text-[#64748b]">Вы точно хотите удалить выбранные активы?</p>
            </CardHeader>
            <CardContent className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setDeleteConfirmOpen(false)}>Отмена</Button>
              <Button variant="primary" className="bg-[#dc2626] hover:bg-[#b91c1c]" onClick={handleDelete}>Удалить</Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Назначить сотрудника (заглушка) */}
      {assignEmployeeOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Назначить сотрудника</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setAssignEmployeeOpen(false)}>Закрыть</Button>
            </CardHeader>
            <CardContent>
              <Select className="w-full">
                <option value="">Выберите сотрудника</option>
                {customerEmployeesMock.map((e) => (
                  <option key={e.id} value={e.id}>{e.fullName}</option>
                ))}
              </Select>
              <Button className="mt-4" size="sm" onClick={() => setAssignEmployeeOpen(false)}>Сохранить</Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
