import { Suspense } from "react";

import { PaymentResultView } from "@/components/kiosk/payment-result-view";

export default function KioskPaymentResultPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
          <div className="mx-auto max-w-3xl rounded-[2rem] border border-white/10 bg-white/[0.03] p-8">
            <p className="text-sm uppercase tracking-[0.24em] text-cyan-200">
              Payment Result
            </p>
            <h1 className="mt-3 text-3xl font-semibold">
              결제 결과를 확인하는 중입니다.
            </h1>
          </div>
        </main>
      }
    >
      <PaymentResultView />
    </Suspense>
  );
}
