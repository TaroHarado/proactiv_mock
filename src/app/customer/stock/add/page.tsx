"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { CUSTOMER_ASSET_TYPE_LABELS, customerEmployeesMock, type CustomerAssetType } from "@/data/mock";
import { Package } from "lucide-react";

export default function CustomerStockAddPage() {
  const router = useRouter();
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [vin, setVin] = useState("");
  const [type, setType] = useState<CustomerAssetType | "">("");
  const [year, setYear] = useState("");
  const [mileage, setMileage] = useState("");
  const [motohours, setMotohours] = useState("");
  const [exposureDays, setExposureDays] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [price, setPrice] = useState("");
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!brand.trim() || !model.trim() || !vin.trim() || !type || !year.trim() || !city.trim()) return;
    setSaved(true);
    setTimeout(() => router.push("/customer/stock"), 1500);
  };

  const valid =
    brand.trim() &&
    model.trim() &&
    vin.trim() &&
    type &&
    year.trim() &&
    city.trim();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/customer/stock">
          <Button variant="outline" size="sm">← Активы</Button>
        </Link>
        <h1 className="text-2xl font-bold text-[#0f172a]">Добавить актив вручную</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Package className="h-4 w-4" />
            Данные актива
          </CardTitle>
          <p className="text-sm text-[#64748b]">Марка, модель, VIN, тип, город, пробег/моточасы, срок экспозиции, адрес. После сохранения актив появится в стоке.</p>
        </CardHeader>
        <CardContent>
          {saved ? (
            <p className="text-[#16a34a] font-medium">Актив добавлен в сток. Перенаправление…</p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-[#0f172a] mb-1">Марка *</label>
                  <Input value={brand} onChange={(e) => setBrand(e.target.value)} placeholder="Toyota" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#0f172a] mb-1">Модель *</label>
                  <Input value={model} onChange={(e) => setModel(e.target.value)} placeholder="Camry" required />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#0f172a] mb-1">VIN *</label>
                <Input value={vin} onChange={(e) => setVin(e.target.value)} placeholder="JTDBT923001234567" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#0f172a] mb-1">Тип транспорта *</label>
                <Select value={type} onChange={(e) => setType(e.target.value as CustomerAssetType | "")} required>
                  <option value="">Выберите тип</option>
                  {(Object.entries(CUSTOMER_ASSET_TYPE_LABELS) as [CustomerAssetType, string][]).map(([k, l]) => (
                    <option key={k} value={k}>{l}</option>
                  ))}
                </Select>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-[#0f172a] mb-1">Год выпуска *</label>
                  <Input type="number" value={year} onChange={(e) => setYear(e.target.value)} placeholder="2020" min={1990} max={2030} required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#0f172a] mb-1">Пробег / моточасы</label>
                  <Input type="number" value={mileage} onChange={(e) => setMileage(e.target.value)} placeholder="Пробег (км)" />
                  <Input type="number" value={motohours} onChange={(e) => setMotohours(e.target.value)} placeholder="Моточасы (для спецтехники)" className="mt-2" />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-[#0f172a] mb-1">Срок экспозиции, дн.</label>
                  <Input type="number" value={exposureDays} onChange={(e) => setExposureDays(e.target.value)} placeholder="30" min={0} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#0f172a] mb-1">Цена (оценка компании), ₽</label>
                  <Input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="2000000" min={0} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#0f172a] mb-1">Город *</label>
                <Input value={city} onChange={(e) => setCity(e.target.value)} placeholder="Москва" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#0f172a] mb-1">Адрес местонахождения</label>
                <Input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="ул. Примерная, 1" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#0f172a] mb-1">Ответственный сотрудник</label>
                <Select value={employeeId} onChange={(e) => setEmployeeId(e.target.value)}>
                  <option value="">Не назначен</option>
                  {customerEmployeesMock.map((e) => (
                    <option key={e.id} value={e.id}>{e.fullName}</option>
                  ))}
                </Select>
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={!valid}>Сохранить</Button>
                <Link href="/customer/stock">
                  <Button type="button" variant="outline">Отмена</Button>
                </Link>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
