"use client";
import { useEffect, useState } from "react";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import "../css/euclid-circular-a-font.css";
import "../css/style.css";

import { AIFlowTrigger } from "@/components/AI/AIFlowTrigger";
import { AutoLogin } from "@/components/Auth/AutoLogin";
import { CartLoader } from "@/components/Cart/CartLoader";
import { CartSidebarVisibility } from "@/components/Common/CartSidebarVisibility";
import PreviewSliderModal from "@/components/Common/PreviewSlider";
import QuickViewModal from "@/components/Common/QuickViewModal";
import { ReduxProvider } from "@/redux/provider";
import { AuthProvider } from "../context/AuthContext";
import { CartModalProvider } from "../context/CartSidebarModalContext";
import { PreviewSliderProvider } from "../context/PreviewSliderContext";
import { ProductsProvider } from "../context/ProductsContext";
import { ModalProvider } from "../context/QuickViewModalContext";

import PreLoader from "@/components/Common/PreLoader";
import ScrollToTop from "@/components/Common/ScrollToTop";
import { usePathname } from "next/navigation";

function MainContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isCartPage = pathname === '/cart';
  
  return (
    <div className={isCartPage ? '' : 'pr-[200px]'}>
      {children}
    </div>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState<boolean>(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        {!mounted ? (
          // Server-side render: show preloader
          <PreLoader />
        ) : loading ? (
          // Client-side: show preloader during loading
          <PreLoader />
        ) : (
          // Client-side: show app
          <>
            <AuthProvider>
              <AutoLogin>
                <ReduxProvider>
                  <CartLoader />
                  <ProductsProvider>
                    <CartModalProvider>
                      <ModalProvider>
                        <PreviewSliderProvider>
                          <CartSidebarVisibility />
                          <Header />
                          <MainContent>
                            {children}
                          </MainContent>
                          <Footer />

                          <QuickViewModal />
                          <PreviewSliderModal />
                        </PreviewSliderProvider>
                      </ModalProvider>
                    </CartModalProvider>
                    <AIFlowTrigger />
                  </ProductsProvider>
                </ReduxProvider>
              </AutoLogin>
            </AuthProvider>
            <ScrollToTop />
          </>
        )}
      </body>
    </html>
  );
}
