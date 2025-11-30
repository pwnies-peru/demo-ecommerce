"use client";
import { useEffect, useState } from "react";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import "../css/euclid-circular-a-font.css";
import "../css/style.css";

import { AutoLogin } from "@/components/Auth/AutoLogin";
import { CartLoader } from "@/components/Cart/CartLoader";
import PermanentCartSidebar from "@/components/Common/PermanentCartSidebar";
import PreviewSliderModal from "@/components/Common/PreviewSlider";
import QuickViewModal from "@/components/Common/QuickViewModal";
import { ReduxProvider } from "@/redux/provider";
import { AuthProvider } from "../context/AuthContext";
import { CartModalProvider } from "../context/CartSidebarModalContext";
import { PreviewSliderProvider } from "../context/PreviewSliderContext";
import { ModalProvider } from "../context/QuickViewModalContext";

import PreLoader from "@/components/Common/PreLoader";
import ScrollToTop from "@/components/Common/ScrollToTop";

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
                  <CartModalProvider>
                    <ModalProvider>
                      <PreviewSliderProvider>
                        <PermanentCartSidebar />
                        <Header />
                        <div className="pr-[200px]">
                          {children}
                        </div>
                        <Footer />

                        <QuickViewModal />
                        <PreviewSliderModal />
                      </PreviewSliderProvider>
                    </ModalProvider>
                  </CartModalProvider>
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
