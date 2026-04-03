import type { Category, KioskStore, MenuItem } from "@/lib/types";

const categories: Category[] = [
  { id: "coffee", name: "커피", emoji: "☕", sortOrder: 1 },
  { id: "tea", name: "티", emoji: "🍵", sortOrder: 2 },
  { id: "dessert", name: "디저트", emoji: "🥐", sortOrder: 3 }
];

const items: MenuItem[] = [
  {
    id: "americano",
    categoryId: "coffee",
    name: "아메리카노",
    nameEn: "Americano",
    price: 4500,
    description: "깔끔한 바디감과 고소한 마무리.",
    badge: "best",
    soldOut: false,
    sortOrder: 1
  },
  {
    id: "latte",
    categoryId: "coffee",
    name: "카페라떼",
    nameEn: "Caffe Latte",
    price: 5200,
    description: "진한 에스프레소와 우유의 균형.",
    badge: "recommended",
    soldOut: false,
    sortOrder: 2
  },
  {
    id: "grapefruit-tea",
    categoryId: "tea",
    name: "자몽티",
    nameEn: "Grapefruit Tea",
    price: 5400,
    description: "과육이 살아있는 시트러스 티.",
    badge: "new",
    soldOut: false,
    sortOrder: 3
  },
  {
    id: "salt-bread",
    categoryId: "dessert",
    name: "소금빵",
    nameEn: "Salt Bread",
    price: 3800,
    description: "겉은 바삭하고 속은 버터 풍미가 진한 시그니처.",
    badge: "popular",
    soldOut: false,
    sortOrder: 4
  }
];

export function createDefaultStore(): KioskStore {
  return {
    business: {
      name: "22B Demo Store",
      type: "cafe",
      greeting: "어서오세요. 오늘도 좋은 하루 되세요."
    },
    categories,
    items,
    templateId: "cafe-modern",
    customizations: {
      level: 1,
      colors: {
        primary: "#2563eb",
        accent: "#06b6d4"
      }
    },
    cart: [],
    orders: [],
    settings: {
      payment: {
        provider: "toss",
        merchantKey: "",
        clientKey: ""
      },
      accessibility: {
        largeText: false,
        highContrast: false,
        voiceGuide: false,
        simpleMode: false,
        autoTimeout: 60
      },
      languages: ["ko", "en", "zh", "ja"]
    },
    syncLog: []
  };
}
