"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { executorUser } from "@/data/mock";
import { Check } from "lucide-react";

type VerificationStatus = "unverified" | "pending" | "verified";

interface PassportForm {
  series: string;
  number: string;
  issuedBy: string;
  issueDate: string;
  subdivisionCode: string;
}

interface BankForm {
  account20: string;
  bankName: string;
  bik9: string;
  corrAccount20: string;
}

interface ConsentsForm {
  consent1: boolean;
  consent2: boolean;
  consent3: boolean;
  consent4: boolean;
}

interface FormState {
  passport: PassportForm;
  bank: BankForm;
  consents: ConsentsForm;
  smsCode: string;
}

const STORAGE_KEY_STATUS = "executorVerificationStatus";
const STORAGE_KEY_PROFILE = "executorSelfEmployedProfile";

function loadInitialStatus(): VerificationStatus {
  if (typeof window === "undefined") {
    return executorUser.verificationStatus ?? (executorUser.isVerified ? "verified" : "unverified");
  }
  const stored = window.localStorage.getItem(STORAGE_KEY_STATUS);
  if (stored === "unverified" || stored === "pending" || stored === "verified") {
    return stored;
  }
  return executorUser.verificationStatus ?? (executorUser.isVerified ? "verified" : "unverified");
}

function loadInitialForm(): FormState {
  if (typeof window !== "undefined") {
    const stored = window.localStorage.getItem(STORAGE_KEY_PROFILE);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as FormState;
        return parsed;
      } catch {
        // ignore parse errors
      }
    }
  }

  return {
    passport: {
      series: "",
      number: "",
      issuedBy: "",
      issueDate: "",
      subdivisionCode: "",
    },
    bank: {
      account20: "",
      bankName: "",
      bik9: "",
      corrAccount20: "",
    },
    consents: {
      consent1: false,
      consent2: false,
      consent3: false,
      consent4: false,
    },
    smsCode: "",
  };
}

function isDigits(value: string, length: number) {
  return new RegExp(`^\\d{${length}}$`).test(value);
}

export default function ExecutorOnboardingPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [status, setStatus] = useState<VerificationStatus>(() => loadInitialStatus());
  const [form, setForm] = useState<FormState>(() => loadInitialForm());
  const [smsSent, setSmsSent] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (status === "verified") {
      router.replace("/executor");
    }
  }, [status, mounted, router]);

  useEffect(() => {
    if (!mounted) return;
    try {
      window.localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(form));
    } catch {
      // ignore
    }
  }, [form, mounted]);

  const errors = useMemo(() => {
    const e: Partial<Record<keyof BankForm | "smsCode", string>> = {};

    if (!isDigits(form.bank.account20, 20)) {
      e.account20 = "Счёт должен содержать 20 цифр";
    }
    if (!form.bank.bankName.trim()) {
      e.bankName = "Укажите наименование банка";
    }
    if (!isDigits(form.bank.bik9, 9)) {
      e.bik9 = "БИК должен содержать 9 цифр";
    }
    if (!isDigits(form.bank.corrAccount20, 20)) {
      e.corrAccount20 = "Корр. счёт должен содержать 20 цифр";
    }

    if (!isDigits(form.smsCode, 6)) {
      e.smsCode = "Код из SMS должен содержать 6 цифр";
    }

    return e;
  }, [form]);

  const allConsentsChecked =
    form.consents.consent1 &&
    form.consents.consent2 &&
    form.consents.consent3 &&
    form.consents.consent4;

  const isValid = useMemo(() => {
    if (Object.keys(errors).length > 0) return false;
    if (!allConsentsChecked) return false;
    return true;
  }, [errors, allConsentsChecked]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    try {
      window.localStorage.setItem(STORAGE_KEY_STATUS, "verified");
      window.localStorage.setItem(
        STORAGE_KEY_PROFILE,
        JSON.stringify(form)
      );
    } catch {
      // ignore
    }

    setStatus("verified");
    router.replace("/executor");
  };

  const phoneMasked = executorUser.phoneMasked ?? executorUser.phone ?? ""; 

  const handleEsiaMock = () => {
    try {
      window.localStorage.setItem(STORAGE_KEY_STATUS, "verified");
    } catch {
      // ignore
    }
    setStatus("verified");
    router.replace("/executor");
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#f8f9fb] px-4 py-6 sm:px-6">
      <div className="mx-auto max-w-4xl">
        <Card className="rounded-2xl bg-white">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-[#0f172a]">
              Анкета самозанятого исполнителя
            </CardTitle>
            <p className="mt-1 text-sm text-[#64748b]">
              Для работы на платформе подтвердите свою личность и реквизиты для выплат.
              В реальной системе основной способ — вход через ЕСИА Госуслуг.
            </p>
          </CardHeader>
          <CardContent>
            <form className="space-y-8" onSubmit={handleSubmit}>
              <section>
                <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-[#bfdbfe] bg-[#eff6ff] p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-[#1d4ed8]">
                      Быстрая верификация через ЕСИА
                    </p>
                    <p className="mt-1 text-xs text-[#475569]">
                      Моковый сценарий: в реальном кабинете вы перейдёте на Госуслуги,
                      подтвердите личность, а платформа получит только подтверждённый статус НПД.
                    </p>
                  </div>
                  <Button
                    type="button"
                    className="rounded-full px-6"
                    onClick={handleEsiaMock}
                  >
                    Войти через ЕСИА
                  </Button>
                </div>
              </section>

              <section className="space-y-4">
                <h2 className="text-lg font-semibold text-[#0f172a]">
                  Банковские реквизиты
                </h2>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-[#0f172a]">
                    Расчётный счёт (20 цифр)
                  </label>
                  <Input
                    inputMode="numeric"
                    maxLength={20}
                    value={form.bank.account20}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        bank: {
                          ...prev.bank,
                          account20: e.target.value.replace(/\D/g, "").slice(0, 20),
                        },
                      }))
                    }
                  />
                  {errors.account20 && (
                    <p className="text-xs text-[#dc2626]">{errors.account20}</p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-[#0f172a]">
                    Наименование банка
                  </label>
                  <Input
                    value={form.bank.bankName}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        bank: { ...prev.bank, bankName: e.target.value },
                      }))
                    }
                  />
                  {errors.bankName && (
                    <p className="text-xs text-[#dc2626]">{errors.bankName}</p>
                  )}
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-[#0f172a]">
                      БИК (9 цифр)
                    </label>
                    <Input
                      inputMode="numeric"
                      maxLength={9}
                      value={form.bank.bik9}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          bank: {
                            ...prev.bank,
                            bik9: e.target.value.replace(/\D/g, "").slice(0, 9),
                          },
                        }))
                      }
                    />
                    {errors.bik9 && (
                      <p className="text-xs text-[#dc2626]">{errors.bik9}</p>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-[#0f172a]">
                      Корреспондентский счёт (20 цифр)
                    </label>
                    <Input
                      inputMode="numeric"
                      maxLength={20}
                      value={form.bank.corrAccount20}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          bank: {
                            ...prev.bank,
                            corrAccount20: e.target.value.replace(/\D/g, "").slice(0, 20),
                          },
                        }))
                      }
                    />
                    {errors.corrAccount20 && (
                      <p className="text-xs text-[#dc2626]">
                        {errors.corrAccount20}
                      </p>
                    )}
                  </div>
                </div>
              </section>

              <section className="space-y-4">
                <h2 className="text-lg font-semibold text-[#0f172a]">
                  Согласия
                </h2>
                <div className="space-y-3">
                  <ConsentCheckbox
                    checked={form.consents.consent1}
                    onChange={(checked) =>
                      setForm((prev) => ({
                        ...prev,
                        consents: { ...prev.consents, consent1: checked },
                      }))
                    }
                  >
                    Даю согласие ООО «ПроАктив» на обработку моих персональных данных,
                    включая паспортные данные и ИНН, в целях регистрации на платформе,
                    заключения договоров, проверки статуса НПД и выплаты вознаграждения.{" "}
                    <a
                      href="#"
                      className="text-[#2563eb] underline-offset-2 hover:underline"
                    >
                      Политика конфиденциальности
                    </a>
                    .
                  </ConsentCheckbox>

                  <ConsentCheckbox
                    checked={form.consents.consent2}
                    onChange={(checked) =>
                      setForm((prev) => ({
                        ...prev,
                        consents: { ...prev.consents, consent2: checked },
                      }))
                    }
                  >
                    Даю согласие на автоматическую проверку моего статуса налогоплательщика
                    НПД через API ФНС России при каждом входе в систему и перед каждой
                    выплатой вознаграждения в соответствии с НК РФ.
                  </ConsentCheckbox>

                  <ConsentCheckbox
                    checked={form.consents.consent3}
                    onChange={(checked) =>
                      setForm((prev) => ({
                        ...prev,
                        consents: { ...prev.consents, consent3: checked },
                      }))
                    }
                  >
                    Подтверждаю, что ООО «ПроАктив» не является моим налоговым агентом, и я
                    самостоятельно исчисляю и уплачиваю налог на профессиональный доход
                    через приложение «Мой налог».
                  </ConsentCheckbox>

                  <ConsentCheckbox
                    checked={form.consents.consent4}
                    onChange={(checked) =>
                      setForm((prev) => ({
                        ...prev,
                        consents: { ...prev.consents, consent4: checked },
                      }))
                    }
                  >
                    Я принимаю условия Публичной оферты (Агентского договора) и подтверждаю,
                    что все оказываемые мной услуги будут оформляться отдельными
                    Договорами-заданиями, генерируемыми платформой.
                  </ConsentCheckbox>
                </div>
              </section>

              <section className="space-y-4">
                <h2 className="text-lg font-semibold text-[#0f172a]">
                  SMS подтверждение
                </h2>
                <p className="text-sm text-[#64748b]">
                  Введите код из SMS, отправленный на номер {phoneMasked}.
                </p>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <div className="flex-1 space-y-1.5">
                    <label className="text-sm font-medium text-[#0f172a]">
                      Код из SMS
                    </label>
                    <Input
                      inputMode="numeric"
                      maxLength={6}
                      value={form.smsCode}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          smsCode: e.target.value.replace(/\D/g, "").slice(0, 6),
                        }))
                      }
                    />
                    {errors.smsCode && (
                      <p className="text-xs text-[#dc2626]">{errors.smsCode}</p>
                    )}
                  </div>
                  <div className="sm:self-end">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => setSmsSent(true)}
                    >
                      Отправить код
                    </Button>
                  </div>
                </div>
                {smsSent && (
                  <p className="text-xs text-[#16a34a]">
                    Код отправлен.
                  </p>
                )}
              </section>

              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={!isValid}
                  className="w-full sm:w-auto px-8 rounded-full bg-[#0075F3] hover:bg-[#005fd0]"
                >
                  Завершить регистрацию
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ConsentCheckbox({
  checked,
  onChange,
  children,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  children: React.ReactNode;
}) {
  return (
    <label className="flex items-start gap-3 rounded-2xl bg-[#f8fafc] px-3 py-3">
      <button
        type="button"
        className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-[6px] border-0 bg-transparent p-0 focus:outline-none"
        onClick={(e) => {
          e.preventDefault();
          onChange(!checked);
        }}
        aria-pressed={checked}
      >
        <span
          className={
            "flex h-7 w-7 items-center justify-center rounded-[6px] border " +
            (checked
              ? "bg-[#0075F3] border-[#0075F3]"
              : "bg-white border-[#cbd5e1]")
          }
        >
          {checked && <Check className="h-4 w-4 text-white" aria-hidden />}
        </span>
      </button>
      <span className="text-sm leading-snug text-[#0f172a]">
        {children}
      </span>
    </label>
  );
}

