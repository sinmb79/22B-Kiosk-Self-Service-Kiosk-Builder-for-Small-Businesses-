import type { Category, MenuItem } from "@/lib/types";

export type SupportedLanguage = "ko" | "en" | "zh" | "ja";

const messages = {
  ko: {
    cart: "장바구니",
    reviewOrder: "주문 확인",
    noItemsYet: "아직 담긴 메뉴가 없습니다. 메뉴 카드를 눌러 주문을 시작하세요.",
    total: "합계",
    placeOrder: "주문 넣기",
    queueUnpaidOrder: "미결제 주문 접수",
    connection: "연결 상태",
    networkReady: "네트워크 준비됨",
    offline: "오프라인",
    onlineTitle: "온라인",
    offlineTitle: "오프라인 모드",
    onlineDetail: "실결제를 사용할 수 있고 키오스크 데이터가 즉시 동기화됩니다.",
    offlineDetail: "메뉴 탐색은 계속 가능하지만 카드 결제에는 네트워크 연결이 필요합니다.",
    paymentLive: "토스 실결제",
    paymentDemo: "데모 결제",
    openTossPayment: "토스 결제창 열기",
    completeDemoPayment: "데모 결제 완료",
    language: "언어",
    quantityUnit: "개",
    paymentLiveDescription: "실키가 설정되어 있으면 Toss 결제창으로 이동합니다.",
    paymentDemoDescription: "현재는 키가 없어 데모 결제로 주문을 바로 생성합니다."
  },
  en: {
    cart: "Cart",
    reviewOrder: "Review order",
    noItemsYet: "No items yet. Tap a menu card to start an order.",
    total: "Total",
    placeOrder: "Place order",
    queueUnpaidOrder: "Queue unpaid order",
    connection: "Connection",
    networkReady: "Network ready",
    offline: "Offline",
    onlineTitle: "Online",
    offlineTitle: "Offline mode",
    onlineDetail: "Live payment is available and kiosk data will sync immediately.",
    offlineDetail: "Menu browsing stays available, but card payment needs a network connection.",
    paymentLive: "Toss live",
    paymentDemo: "Demo checkout",
    openTossPayment: "Open Toss payment",
    completeDemoPayment: "Complete demo payment",
    language: "Language",
    quantityUnit: "ea",
    paymentLiveDescription: "A configured live key sends the guest to Toss payment.",
    paymentDemoDescription: "No live key is configured, so the demo payment flow will complete locally."
  },
  zh: {
    cart: "购物车",
    reviewOrder: "确认订单",
    noItemsYet: "购物车还是空的。点击菜单卡片开始点餐。",
    total: "合计",
    placeOrder: "提交订单",
    queueUnpaidOrder: "提交未付款订单",
    connection: "连接状态",
    networkReady: "网络正常",
    offline: "离线",
    onlineTitle: "在线",
    offlineTitle: "离线模式",
    onlineDetail: "可以使用正式支付，数据也会立即同步。",
    offlineDetail: "菜单浏览仍可继续，但刷卡支付需要网络连接。",
    paymentLive: "Toss 实时支付",
    paymentDemo: "演示支付",
    openTossPayment: "打开 Toss 支付",
    completeDemoPayment: "完成演示支付",
    language: "语言",
    quantityUnit: "份",
    paymentLiveDescription: "配置正式密钥后，将跳转到 Toss 支付页面。",
    paymentDemoDescription: "目前没有正式密钥，因此会直接使用演示支付。"
  },
  ja: {
    cart: "カート",
    reviewOrder: "注文内容を確認",
    noItemsYet: "まだ商品がありません。メニューカードを押して注文を始めてください。",
    total: "合計",
    placeOrder: "注文する",
    queueUnpaidOrder: "未決済注文を登録",
    connection: "接続状態",
    networkReady: "ネットワーク接続中",
    offline: "オフライン",
    onlineTitle: "オンライン",
    offlineTitle: "オフラインモード",
    onlineDetail: "本番決済が使え、キオスクデータもすぐ同期されます。",
    offlineDetail: "メニュー閲覧は可能ですが、カード決済にはネットワーク接続が必要です。",
    paymentLive: "Toss 本番決済",
    paymentDemo: "デモ決済",
    openTossPayment: "Toss 決済を開く",
    completeDemoPayment: "デモ決済を完了",
    language: "言語",
    quantityUnit: "点",
    paymentLiveDescription: "本番キーが設定されている場合は Toss 決済画面へ移動します。",
    paymentDemoDescription: "本番キーがないため、ローカルのデモ決済で処理します。"
  }
} satisfies Record<SupportedLanguage, Record<string, string>>;

const categoryNames: Record<
  string,
  Record<SupportedLanguage, string>
> = {
  coffee: {
    ko: "커피",
    en: "Coffee",
    zh: "咖啡",
    ja: "コーヒー"
  },
  tea: {
    ko: "차",
    en: "Tea",
    zh: "茶饮",
    ja: "ティー"
  },
  dessert: {
    ko: "디저트",
    en: "Dessert",
    zh: "甜点",
    ja: "デザート"
  }
};

export function getMessages(locale: string) {
  return messages[coerceLanguage(locale)];
}

export function getLocalizedItemName(item: MenuItem, locale: string) {
  const language = coerceLanguage(locale);

  if (language === "en") {
    return item.nameEn ?? item.name;
  }

  if (language === "zh") {
    return item.nameZh ?? item.name;
  }

  if (language === "ja") {
    return item.nameJa ?? item.name;
  }

  return item.name;
}

export function getLocalizedCategoryName(
  category: Pick<Category, "id" | "name">,
  locale: string
) {
  const language = coerceLanguage(locale);
  return categoryNames[category.id]?.[language] ?? category.name;
}

export function coerceLanguage(locale: string): SupportedLanguage {
  return locale === "en" || locale === "zh" || locale === "ja" ? locale : "ko";
}
