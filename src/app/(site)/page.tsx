import Home from "@/components/Home";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mercadillo Libre | Tu tienda en línea",
  description: "Mercadillo Libre, lo mejor en compras en línea.",
  // other metadata
};

export default function HomePage() {
  return (
    <>
      <Home />
    </>
  );
}
