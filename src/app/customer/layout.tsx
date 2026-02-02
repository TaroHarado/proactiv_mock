import { Topbar } from "@/components/layout/topbar";
import { Footer } from "@/components/layout/footer";
import { CustomerNav } from "@/components/layout/customer-nav";

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-[#f8f9fb]">
      <Topbar />
      <main className="flex-1 px-4 py-4 sm:px-6 sm:py-6">
        <div className="mx-auto max-w-7xl">
          <CustomerNav />
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}
