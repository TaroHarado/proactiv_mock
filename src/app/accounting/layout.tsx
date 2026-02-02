import { Topbar } from "@/components/layout/topbar";
import { Footer } from "@/components/layout/footer";
import { AccountingNav } from "@/components/layout/accounting-nav";

export default function AccountingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-[#f8f9fb]">
      <Topbar />
      <main className="flex-1 px-4 py-4 sm:px-6 sm:py-6">
        <div className="mx-auto max-w-7xl">
          <AccountingNav />
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}
