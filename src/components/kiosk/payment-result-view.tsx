"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { finalizeSuccessfulPayment } from "@/lib/payment/checkout";
import {
  clearPendingCheckout,
  readPendingCheckout
} from "@/lib/payment/pending-storage";
import { useStoreSnapshot } from "@/lib/store/use-store-snapshot";
import { formatWon } from "@/lib/utils";

type PaymentState =
  | { phase: "loading" }
  | { phase: "success"; amount: number; paymentId: string }
  | { phase: "failure"; message: string };

export function PaymentResultView() {
  const params = useSearchParams();
  const { createOrder } = useStoreSnapshot("kiosk");
  const [state, setState] = useState<PaymentState>({ phase: "loading" });
  const hasResolved = useRef(false);

  useEffect(() => {
    if (hasResolved.current) {
      return;
    }

    const orderId = params.get("orderId");
    const paymentKey = params.get("paymentKey");
    const amount = params.get("amount");
    const code = params.get("code");
    const message = params.get("message");

    if (!orderId) {
      setState({
        phase: "failure",
        message: "결제 결과를 식별할 주문 번호가 없습니다."
      });
      return;
    }

    const pendingCheckout = readPendingCheckout(orderId);

    if (!pendingCheckout) {
      setState({
        phase: "failure",
        message: "대기 중인 결제 정보를 찾지 못했습니다."
      });
      return;
    }

    if (!paymentKey || !amount) {
      setState({
        phase: "failure",
        message:
          message ?? code ?? "결제가 취소되었거나 완료 정보가 누락되었습니다."
      });
      return;
    }

    hasResolved.current = true;

    (async () => {
      try {
        const finalized = finalizeSuccessfulPayment(pendingCheckout, {
          paymentKey,
          orderId,
          amount
        });

        await createOrder(pendingCheckout.items, {
          status: finalized.status,
          paymentId: finalized.paymentId,
          orderId: finalized.orderId
        });
        clearPendingCheckout(orderId);
        setState({
          phase: "success",
          amount: finalized.amount,
          paymentId: finalized.paymentId
        });
      } catch (error) {
        setState({
          phase: "failure",
          message:
            error instanceof Error
              ? error.message
              : "결제 완료 처리 중 오류가 발생했습니다."
        });
      }
    })();
  }, [createOrder, params]);

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-3xl rounded-[2rem] border border-white/10 bg-white/[0.03] p-8">
        {state.phase === "loading" ? (
          <div className="space-y-3">
            <p className="text-sm uppercase tracking-[0.24em] text-cyan-200">
              Payment Result
            </p>
            <h1 className="text-3xl font-semibold">결제 결과를 확인하는 중입니다.</h1>
          </div>
        ) : null}

        {state.phase === "success" ? (
          <div className="space-y-5">
            <p className="text-sm uppercase tracking-[0.24em] text-emerald-200">
              Paid
            </p>
            <h1 className="text-3xl font-semibold">결제가 완료되었습니다.</h1>
            <p className="text-sm leading-6 text-slate-300">
              결제 금액 {formatWon(state.amount)} / paymentKey {state.paymentId}
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/kiosk"
                className="rounded-2xl bg-cyan-400 px-4 py-3 font-medium text-slate-950"
              >
                키오스크로 돌아가기
              </Link>
              <Link
                href="/kds"
                className="rounded-2xl border border-white/15 px-4 py-3 text-white"
              >
                주방 대기열 보기
              </Link>
            </div>
          </div>
        ) : null}

        {state.phase === "failure" ? (
          <div className="space-y-5">
            <p className="text-sm uppercase tracking-[0.24em] text-rose-200">
              Failed
            </p>
            <h1 className="text-3xl font-semibold">결제를 완료하지 못했습니다.</h1>
            <p className="text-sm leading-6 text-slate-300">{state.message}</p>
            <Link
              href="/kiosk"
              className="inline-flex rounded-2xl border border-white/15 px-4 py-3 text-white"
            >
              키오스크로 돌아가기
            </Link>
          </div>
        ) : null}
      </div>
    </main>
  );
}
