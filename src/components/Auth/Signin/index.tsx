'use client'

import Breadcrumb from "@/components/Common/Breadcrumb";
import Link from "next/link";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Sign-in page is disabled in demo mode
 * Users are automatically logged in on app start
 */
const Signin = () => {
  const router = useRouter();

  useEffect(() => {
    // Redirect to home page - users are already logged in
    router.push('/');
  }, [router]);

  return (
    <>
      <Breadcrumb title={"Acceso"} pages={["Signin"]} />
      <section className="overflow-hidden py-20 bg-gray-2">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="max-w-[570px] w-full mx-auto rounded-xl bg-white shadow-1 p-4 sm:p-7.5 xl:p-11">
            <div className="text-center">
              <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue border-r-transparent mb-4"></div>
              <h3 className="font-semibold text-xl text-dark mb-2">
                Redirigiendo...
              </h3>
              <p className="text-dark-4">
                🎭 Modo Demo: Ya estás conectado automáticamente
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Signin;
