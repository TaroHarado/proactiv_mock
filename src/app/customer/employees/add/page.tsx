"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users } from "lucide-react";

export default function CustomerAddEmployeePage() {
  const router = useRouter();
  const [surname, setSurname] = useState("");
  const [name, setName] = useState("");
  const [patronymic, setPatronymic] = useState("");
  const [email, setEmail] = useState("");
  const [limit, setLimit] = useState("");
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!surname.trim() || !name.trim() || !patronymic.trim() || !email.trim() || !limit.trim()) return;
    setSaved(true);
    setTimeout(() => router.push("/customer"), 1500);
  };

  const valid = surname.trim() && name.trim() && patronymic.trim() && email.trim() && limit.trim() && Number(limit) > 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/customer">
          <Button variant="outline" size="sm">← Портфель</Button>
        </Link>
        <h1 className="text-2xl font-bold text-[#0f172a]">Добавить сотрудника</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Users className="h-4 w-4" />
            Форма добавления сотрудника
          </CardTitle>
          <p className="text-sm text-[#64748b]">После сохранения сотрудник появится в таблице и станет доступен для назначения на активы. Письмо-приглашение отправится автоматически.</p>
        </CardHeader>
        <CardContent>
          {saved ? (
            <p className="text-[#16a34a] font-medium">Сотрудник добавлен. Письмо-приглашение отправлено на {email}. Перенаправление на портфель…</p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
              <div>
                <label className="block text-sm font-medium text-[#0f172a] mb-1">Фамилия *</label>
                <Input value={surname} onChange={(e) => setSurname(e.target.value)} placeholder="Иванов" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#0f172a] mb-1">Имя *</label>
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Иван" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#0f172a] mb-1">Отчество *</label>
                <Input value={patronymic} onChange={(e) => setPatronymic(e.target.value)} placeholder="Иванович" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#0f172a] mb-1">Email *</label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="ivanov@company.ru" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#0f172a] mb-1">Лимит, ₽ *</label>
                <Input type="number" value={limit} onChange={(e) => setLimit(e.target.value)} placeholder="5000000" min={1} required />
                <p className="mt-1 text-xs text-[#64748b]">Сумма, которую сотрудник может тратить в рамках бюджета</p>
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={!valid}>Сохранить</Button>
                <Link href="/customer">
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
