"use client";

import { useState } from "react";
import { Sheet } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { FileSignature, Shield, Key } from "lucide-react";
import type { EdoSignMethod } from "@/data/mock";

interface EdoSignModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  documentType: "contract" | "act";
  availableMethods: EdoSignMethod[];
  onConfirm: (method: EdoSignMethod) => void;
  onCancel: () => void;
}

const SIGN_METHOD_LABELS: Record<EdoSignMethod, string> = {
  pep: "ПЭП (Простая электронная подпись)",
  kep: "УКЭП (Усиленная квалифицированная электронная подпись)",
};

const SIGN_METHOD_DESCRIPTIONS: Record<EdoSignMethod, string> = {
  pep: "Быстрая подпись через SMS-код. Подходит для большинства документов.",
  kep: "Подпись с использованием сертификата через СБИС. Максимальная юридическая значимость.",
};

export function EdoSignModal({
  open,
  onOpenChange,
  documentType,
  availableMethods,
  onConfirm,
  onCancel,
}: EdoSignModalProps) {
  const [selectedMethod, setSelectedMethod] = useState<EdoSignMethod | null>(null);

  const documentTitle = documentType === "contract" ? "Договор-задание" : "Акт выполненных работ";

  const handleConfirm = () => {
    if (selectedMethod) {
      onConfirm(selectedMethod);
      setSelectedMethod(null);
    }
  };

  const handleCancel = () => {
    setSelectedMethod(null);
    onCancel();
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange} title={`Подписать: ${documentTitle}`}>
      <div className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm text-[#64748b]">
            Выберите способ подписания документа через систему СБИС:
          </p>
        </div>

        <div className="space-y-3">
          {availableMethods.includes("pep") && (
            <button
              onClick={() => setSelectedMethod("pep")}
              className={`w-full flex items-start gap-3 rounded-xl border-2 p-4 text-left transition-all ${
                selectedMethod === "pep"
                  ? "border-[#0075F3] bg-[#eff6ff]"
                  : "border-[#e2e8f0] bg-white hover:border-[#cbd5e1]"
              }`}
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#eff6ff]">
                <Shield className={`h-5 w-5 ${selectedMethod === "pep" ? "text-[#0075F3]" : "text-[#64748b]"}`} />
              </div>
              <div className="flex-1">
                <p className={`text-sm font-medium ${selectedMethod === "pep" ? "text-[#0075F3]" : "text-[#0f172a]"}`}>
                  {SIGN_METHOD_LABELS.pep}
                </p>
                <p className="mt-1 text-xs text-[#64748b]">
                  {SIGN_METHOD_DESCRIPTIONS.pep}
                </p>
              </div>
            </button>
          )}

          {availableMethods.includes("kep") && (
            <button
              onClick={() => setSelectedMethod("kep")}
              className={`w-full flex items-start gap-3 rounded-xl border-2 p-4 text-left transition-all ${
                selectedMethod === "kep"
                  ? "border-[#0075F3] bg-[#eff6ff]"
                  : "border-[#e2e8f0] bg-white hover:border-[#cbd5e1]"
              }`}
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#eff6ff]">
                <Key className={`h-5 w-5 ${selectedMethod === "kep" ? "text-[#0075F3]" : "text-[#64748b]"}`} />
              </div>
              <div className="flex-1">
                <p className={`text-sm font-medium ${selectedMethod === "kep" ? "text-[#0075F3]" : "text-[#0f172a]"}`}>
                  {SIGN_METHOD_LABELS.kep}
                </p>
                <p className="mt-1 text-xs text-[#64748b]">
                  {SIGN_METHOD_DESCRIPTIONS.kep}
                </p>
              </div>
            </button>
          )}
        </div>

        {selectedMethod && (
          <div className="rounded-xl border border-[#e0f2fe] bg-[#f0f9ff] p-3">
            <p className="text-sm text-[#0369a1]">
              ℹ️ После подтверждения вы будете перенаправлены в систему СБИС для завершения подписания.
            </p>
          </div>
        )}

        <div className="flex gap-2 pt-4">
          <Button variant="primary" onClick={handleConfirm} disabled={!selectedMethod}>
            Подтвердить
          </Button>
          <Button variant="secondary" onClick={handleCancel}>
            Отмена
          </Button>
        </div>
      </div>
    </Sheet>
  );
}
