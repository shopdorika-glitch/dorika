import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { getCategories } from "@/lib/queries";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const categories = await getCategories();

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar categories={categories} />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
