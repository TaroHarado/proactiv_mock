import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-[#e2e8f0] bg-white px-6 py-8">
      <div className="mx-auto flex max-w-6xl flex-wrap items-start justify-between gap-8">
        <div className="flex flex-col gap-4">
          <Link href="/manager" className="flex items-center gap-2">
            <img
              src="/logo.png"
              alt="ПроАктив"
              className="h-9 w-auto object-contain"
            />
          </Link>
          <div className="flex gap-2">
            <a
              href="#"
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#f1f5f9] text-[#64748b] hover:bg-[#e2e8f0]"
              aria-label="ВКонтакте"
            >
              VK
            </a>
            <a
              href="#"
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#f1f5f9] text-[#64748b] hover:bg-[#e2e8f0]"
              aria-label="Telegram"
            >
              TG
            </a>
          </div>
        </div>
        <div className="text-sm text-[#64748b] max-w-xs">
          <p>© ООО «ПроАктив» (ИНН: 9715521505)</p>
          <p className="mt-1">Адрес: 117549, г. Москва, ул. Костромская, д. 14А</p>
          <p className="mt-1">Сотрудничество: info@проактив.рф</p>
        </div>
        <nav className="flex flex-col gap-2 text-sm">
          <Link href="#" className="text-[#64748b] hover:text-[#2563eb]">
            Партнёрам
          </Link>
          <Link href="#" className="text-[#64748b] hover:text-[#2563eb]">
            О нас
          </Link>
          <Link href="#" className="text-[#64748b] hover:text-[#2563eb]">
            Оферта
          </Link>
          <Link href="#" className="text-[#64748b] hover:text-[#2563eb]">
            Конфиденциальность
          </Link>
          <Link href="#" className="text-[#64748b] hover:text-[#2563eb]">
            Пользовательское соглашение
          </Link>
        </nav>
      </div>
    </footer>
  );
}
