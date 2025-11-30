import ShopDetails from "@/components/ShopDetails";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Detalles del Producto | Mercadillo Libre",
  description: "Ver detalles del producto",
};

// Enable dynamic routes
export const dynamic = 'force-dynamic';
export const dynamicParams = true;

interface ShopDetailsPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ShopDetailsPage({ params }: ShopDetailsPageProps) {
  const { slug } = await params;
  
  return (
    <main>
      <ShopDetails productSlug={slug} />
    </main>
  );
}

