// Мок-данные для личного кабинета менеджера. Позже заменить на API.

export type ExecutorType = "self_employed" | "ip" | "ooo";
export type OrderStatus = "new" | "in_progress" | "on_review" | "completed" | "rejected";
export type TaskStatus = "new" | "in_progress" | "waiting_clarification" | "done";
export type TaskType =
  | "check_report"
  | "rate_quality"
  | "documents_act"
  | "invoice_customer"
  | "calculate_materials"
  | "invoice_executor"
  | "invoice_to_accountant"
  | "publish_auto_ru"
  | "publish_avito"
  | "publish_drom"
  | "process_show_request"
  | "approve_buyer_access"
  | "fix_deal_option"
  | "complete_sale";

export interface Executor {
  id: string;
  name: string;
  email: string;
  type: ExecutorType;
  rating: number;
  ratingTrend: "up" | "down" | "stable";
  completedOrders: Record<string, number>;
  activeOrders: number;
  rejectionRate: number;
  isProblematic: boolean;
}

export type ServiceType =
  | "inspection"
  | "audit"
  | "maintenance"
  | "sale";

export interface Order {
  id: string;
  assetName: string;
  assetVin: string;
  assetYear: number;
  assetMileage: number;
  address: string;
  city: string;
  service: string;
  serviceType: ServiceType;
  amount: number;
  status: OrderStatus;
  daysPending?: number;
  rejectionsCount?: number;
  executorId?: string;
  executorName?: string;
  priority?: "high" | "normal" | "low";
  slaOverdue?: boolean;
}

export interface Task {
  id: string;
  orderId: string;
  type: TaskType;
  typeLabel: string;
  assetName: string;
  service: string;
  dueDate?: string;
  priority: "high" | "normal" | "low";
  status: TaskStatus;
  checklist?: { id: string; label: string; done: boolean }[];
  attachments?: { name: string; size: string }[];
}

export interface Publication {
  id: string;
  orderId: string;
  assetName: string;
  autoRu: string | null;
  avito: string | null;
  drom: string | null;
  published: boolean;
}

export interface Showing {
  id: string;
  orderId: string;
  assetName: string;
  buyerName: string;
  contact: string;
  status: "pending" | "approved" | "rejected";
  requestedAt: string;
}

export interface FinanceRow {
  id: string;
  orderId: string;
  assetName: string;
  amount: number;
  document: string | null;
  paymentStatus: "pending" | "paid" | "confirmed";
  assignee: "manager" | "accountant";
  side: "executor" | "customer";
}

const executorTypeLabels: Record<ExecutorType, string> = {
  self_employed: "Самозанятый",
  ip: "ИП",
  ooo: "ООО",
};

export function getExecutorTypeLabel(t: ExecutorType) {
  return executorTypeLabels[t];
}

export const mockExecutors: Executor[] = [
  {
    id: "ex1",
    name: "Андрей Андреев",
    email: "andrey@example.com",
    type: "ip",
    rating: 4.8,
    ratingTrend: "up",
    completedOrders: { audit: 12, inspection: 25, service: 8, sale: 3 },
    activeOrders: 2,
    rejectionRate: 2,
    isProblematic: false,
  },
  {
    id: "ex2",
    name: "Петр Петров",
    email: "petr@example.com",
    type: "self_employed",
    rating: 4.2,
    ratingTrend: "down",
    completedOrders: { audit: 5, inspection: 18, service: 2, sale: 0 },
    activeOrders: 1,
    rejectionRate: 12,
    isProblematic: true,
  },
  {
    id: "ex3",
    name: "ООО «Осмотр плюс»",
    email: "info@osmotr.ru",
    type: "ooo",
    rating: 4.9,
    ratingTrend: "stable",
    completedOrders: { audit: 30, inspection: 45, service: 15, sale: 10 },
    activeOrders: 4,
    rejectionRate: 1,
    isProblematic: false,
  },
  {
    id: "ex4",
    name: "Мария Сергеева",
    email: "maria@example.com",
    type: "ip",
    rating: 4.7,
    ratingTrend: "up",
    completedOrders: { audit: 10, inspection: 20, service: 5, sale: 4 },
    activeOrders: 3,
    rejectionRate: 4,
    isProblematic: false,
  },
  {
    id: "ex5",
    name: "ООО «Быстрый осмотр»",
    email: "office@fastcheck.ru",
    type: "ooo",
    rating: 4.1,
    ratingTrend: "stable",
    completedOrders: { audit: 8, inspection: 30, service: 6, sale: 1 },
    activeOrders: 5,
    rejectionRate: 9,
    isProblematic: false,
  },
];

const baseOrders: Order[] = [
  {
    id: "ord1",
    assetName: "Toyota Land Cruiser 200",
    assetVin: "JTM34HH5768HBJK456",
    assetYear: 2018,
    assetMileage: 86000,
    address: "Москва, 119002, ул. Арбат, 22/2",
    city: "Москва",
    service: "Проактивная инспекция",
    serviceType: "inspection",
    amount: 4200000,
    status: "new",
    daysPending: 3,
    rejectionsCount: 2,
    priority: "high",
  },
  {
    id: "ord2",
    assetName: "KamAZ 5490",
    assetVin: "X9K5490123456789",
    assetYear: 2020,
    assetMileage: 120000,
    address: "Санкт-Петербург, Невский пр., 100",
    city: "Санкт-Петербург",
    service: "Технико-финансовый аудит",
    serviceType: "audit",
    amount: 1850000,
    status: "in_progress",
    executorId: "ex1",
    executorName: "Андрей Андреев",
  },
  {
    id: "ord3",
    assetName: "Hyundai Porter",
    assetVin: "Z94CB41AAGR323020",
    assetYear: 2019,
    assetMileage: 56000,
    address: "Москва, Тверской б-р, 26A",
    city: "Москва",
    service: "Техническое обслуживание и ремонт",
    serviceType: "maintenance",
    amount: 950000,
    status: "on_review",
    executorId: "ex2",
    executorName: "Петр Петров",
    slaOverdue: true,
  },
  {
    id: "ord4",
    assetName: "Toyota Land Cruiser 200",
    assetVin: "JTM34HH5768HBJK457",
    assetYear: 2019,
    assetMileage: 65000,
    address: "Москва, 117105, Варшавское ш., 1",
    city: "Москва",
    service: "Продажа под ключ",
    serviceType: "sale",
    amount: 4300000,
    status: "in_progress",
    executorId: "ex3",
    executorName: "ООО «Осмотр плюс»",
  },
  {
    id: "ord5",
    assetName: "Scania R-series",
    assetVin: "YS2R4X20002000000",
    assetYear: 2017,
    assetMileage: 400000,
    address: "Екатеринбург, ул. Мира, 10",
    city: "Екатеринбург",
    service: "Предпродажная подготовка",
    serviceType: "maintenance",
    amount: 1150000,
    status: "new",
    priority: "normal",
  },
];

// 50 заказов: базовые + автосгенерированные копии
export const mockOrders: Order[] = [
  ...baseOrders,
  ...Array.from({ length: 45 }, (_, index) => {
    const template = baseOrders[index % baseOrders.length];
    const statusCycle: OrderStatus[] = ["new", "in_progress", "on_review"];
    const status = statusCycle[index % statusCycle.length];
    const priorityCycle: Array<"high" | "normal" | "low"> = [
      "high",
      "normal",
      "low",
    ];
    const priority = priorityCycle[index % priorityCycle.length];
    return {
      ...template,
      id: `ord_extra_${index + 1}`,
      assetName: `${template.assetName} #${index + 1}`,
      status,
      priority,
      daysPending:
        status === "new" ? ((index % 7) + 1) : template.daysPending,
      rejectionsCount:
        status === "new" ? (index % 3) : template.rejectionsCount,
      slaOverdue: status === "on_review" && index % 4 === 0,
    };
  }),
];

export const mockTasks: Task[] = [
  {
    id: "t1",
    orderId: "ord3",
    type: "check_report",
    typeLabel: "Проверить отчёт и оценить качество",
    assetName: "Hyundai Porter",
    service: "Техническое обслуживание и ремонт",
    dueDate: "2025-02-05",
    priority: "high",
    status: "in_progress",
    checklist: [
      { id: "c1", label: "Проверить полноту отчёта (фото, геометки, дефекты)", done: true },
      { id: "c2", label: "Принять или отправить на доработку", done: false },
      { id: "c3", label: "Поставить оценку качества 1–5", done: false },
    ],
    attachments: [{ name: "otchet_remont.pdf", size: "2.1 MB" }],
  },
  {
    id: "t2",
    orderId: "ord2",
    type: "calculate_materials",
    typeLabel: "Рассчитать стоимость материалов/запчастей",
    assetName: "KamAZ 5490",
    service: "Технико-финансовый аудит",
    dueDate: "2025-02-08",
    priority: "normal",
    status: "new",
    checklist: [
      { id: "c1", label: "Запросить цены у поставщиков", done: false },
      { id: "c2", label: "Внести итоговую оценку стоимости по позициям", done: false },
    ],
  },
  {
    id: "t3",
    orderId: "ord1",
    type: "publish_auto_ru",
    typeLabel: "Разместить объявление на Auto.ru",
    assetName: "Toyota Land Cruiser 200",
    service: "Продажа под ключ",
    priority: "high",
    status: "new",
    checklist: [
      { id: "c1", label: "Разместить объявление на Auto.ru", done: false },
      { id: "c2", label: "Прикрепить ссылку к карточке", done: false },
    ],
  },
];

export const mockPublications: Publication[] = [
  {
    id: "pub1",
    orderId: "ord1",
    assetName: "Toyota Land Cruiser 200",
    autoRu: null,
    avito: null,
    drom: null,
    published: false,
  },
];

export const mockShowings: Showing[] = [
  {
    id: "sh1",
    orderId: "ord1",
    assetName: "Toyota Land Cruiser 200",
    buyerName: "Сидоров Сидор",
    contact: "+7 999 123-45-67",
    status: "pending",
    requestedAt: "2025-02-01T14:00:00",
  },
];

export const mockFinance: FinanceRow[] = [
  {
    id: "fin1",
    orderId: "ord2",
    assetName: "KamAZ 5490",
    amount: 15000,
    document: "akt_inspekciya.pdf",
    paymentStatus: "pending",
    assignee: "manager",
    side: "executor",
  },
  {
    id: "fin2",
    orderId: "ord3",
    assetName: "Hyundai Porter",
    amount: 45000,
    document: null,
    paymentStatus: "pending",
    assignee: "accountant",
    side: "customer",
  },
];

export const dashboardMetrics = {
  assetsTotal: 50,
  assetsInWork: 32,
  period: "последний месяц",
  newOrders: 18,
  inProgress: 20,
  onReview: 12,
  slaOverdue: 5,
  executorsAvgRating: 4.6,
  topExecutors: ["Андрей Андреев", "ООО «Осмотр плюс»", "Мария Сергеева"],
  problemExecutors: ["Петр Петров", "ООО «Быстрый осмотр»", "Иван Отказов"],
  marketRejectionRate: 9,
};

// ——— Моки для личного кабинета исполнителя ———

export type ExecutorOrderStatus =
  | "access_pending"
  | "in_progress"
  | "on_review"
  | "on_rework"
  | "completed";

export type RatingCategory = "top" | "good" | "normal" | "low";

export interface ExecutorUser {
  id: string;
  name: string;
  email: string;
  type: ExecutorType;
  rating: number;
  ratingCategory: RatingCategory;
  qualityScore: number;
  responseSpeedScore: number; // 1–5 по правилу 90 мин
  selectionCoeff: number; // % отказов
  firstTimeAcceptRate: number; // % принятых с первого раза
  avgResponseMinutes: number;
  completedThisMonth: number;
  completedByType: { audit: number; inspection: number; maintenance: number; sale: number };
}

export interface BoardOrderCard {
  id: string;
  serviceType: ServiceType;
  serviceLabel: string;
  address: string;
  city: string;
  payoutPercent: 60 | 70; // 60% обычный, 70% после перерасчёта
  orderAmount: number;
  payoutAmount: number;
  priority: "high" | "normal";
  minutesPending: number;
  rejectionsCount: number;
  requiresAccessAgreement: boolean;
  exclusiveForTop: boolean; // первые 90 мин только для Top
}

export interface ExecutorActiveOrder {
  id: string;
  assetName: string;
  serviceType: ServiceType;
  serviceLabel: string;
  status: ExecutorOrderStatus;
  statusLabel: string;
  address: string;
  accessAgreed: boolean | null;
  deadline?: string;
}

export interface ExecutorCompletedOrder {
  id: string;
  completedAt: string;
  serviceLabel: string;
  assetName: string;
  firstTimeAccepted: boolean;
  amount: number;
}

export interface ExecutorAccrual {
  id: string;
  orderId: string;
  assetName: string;
  amount: number;
  completedAt: string;
}

export interface PayoutRequest {
  id: string;
  amount: number;
  status: "processing" | "approved" | "rejected";
  createdAt: string;
  comment?: string;
}

export interface ExecutorNotification {
  id: string;
  title: string;
  text: string;
  time: string;
  type: "new_order" | "access_confirmed" | "rework" | "accepted" | "payout";
}

export const executorUser: ExecutorUser = {
  id: "ex1",
  name: "Андрей Андреев",
  email: "andrey@example.com",
  type: "ip",
  rating: 4.8,
  ratingCategory: "top",
  qualityScore: 4.9,
  responseSpeedScore: 5,
  selectionCoeff: 2,
  firstTimeAcceptRate: 92,
  avgResponseMinutes: 45,
  completedThisMonth: 8,
  completedByType: { audit: 2, inspection: 4, maintenance: 2, sale: 0 },
};

export const boardOrdersMock: BoardOrderCard[] = [
  {
    id: "b1",
    serviceType: "inspection",
    serviceLabel: "Проактивная инспекция",
    address: "Москва, 119002, ул. Арбат, 22/2",
    city: "Москва",
    payoutPercent: 60,
    orderAmount: 15000,
    payoutAmount: 9000,
    priority: "high",
    minutesPending: 195,
    rejectionsCount: 3,
    requiresAccessAgreement: true,
    exclusiveForTop: false,
  },
  {
    id: "b2",
    serviceType: "audit",
    serviceLabel: "Технико-финансовый аудит",
    address: "Санкт-Петербург, Невский пр., 100",
    city: "Санкт-Петербург",
    payoutPercent: 70,
    orderAmount: 20000,
    payoutAmount: 14000,
    priority: "normal",
    minutesPending: 120,
    rejectionsCount: 0,
    requiresAccessAgreement: true,
    exclusiveForTop: true,
  },
  {
    id: "b3",
    serviceType: "maintenance",
    serviceLabel: "Обслуживание и ремонт",
    address: "Москва, Тверской б-р, 26A",
    city: "Москва",
    payoutPercent: 60,
    orderAmount: 25000,
    payoutAmount: 15000,
    priority: "normal",
    minutesPending: 45,
    rejectionsCount: 0,
    requiresAccessAgreement: false,
    exclusiveForTop: true,
  },
];

export const executorActiveOrdersMock: ExecutorActiveOrder[] = [
  {
    id: "ord2",
    assetName: "KamAZ 5490",
    serviceType: "audit",
    serviceLabel: "Технико-финансовый аудит",
    status: "access_pending",
    statusLabel: "Ожидаем согласования доступа заказчиком",
    address: "Санкт-Петербург, Невский пр., 100",
    accessAgreed: null,
    deadline: "2025-02-10",
  },
  {
    id: "ord4",
    assetName: "Toyota Land Cruiser 200",
    serviceType: "sale",
    serviceLabel: "Продажа под ключ",
    status: "in_progress",
    statusLabel: "В работе",
    address: "Москва, Варшавское ш., 1",
    accessAgreed: true,
    deadline: "2025-02-15",
  },
];

export const executorCompletedOrdersMock: ExecutorCompletedOrder[] = [
  {
    id: "c1",
    completedAt: "2025-01-28",
    serviceLabel: "Проактивная инспекция",
    assetName: "Hyundai Porter",
    firstTimeAccepted: true,
    amount: 12000,
  },
  {
    id: "c2",
    completedAt: "2025-01-20",
    serviceLabel: "Технико-финансовый аудит",
    assetName: "Scania R-series",
    firstTimeAccepted: false,
    amount: 14000,
  },
];

export const executorAccrualsMock: ExecutorAccrual[] = [
  { id: "acc1", orderId: "c1", assetName: "Hyundai Porter", amount: 12000, completedAt: "2025-01-28" },
  { id: "acc2", orderId: "c2", assetName: "Scania R-series", amount: 14000, completedAt: "2025-01-20" },
];

export const payoutRequestsMock: PayoutRequest[] = [
  { id: "pr1", amount: 35000, status: "processing", createdAt: "2025-02-01" },
  { id: "pr2", amount: 20000, status: "approved", createdAt: "2025-01-25" },
];

export const executorNotificationsMock: ExecutorNotification[] = [
  { id: "en1", title: "Новые заказы на доске", text: "Доступно 2 заказа в зоне эксклюзива (Top).", time: "10 мин назад", type: "new_order" },
  { id: "en2", title: "Доступ согласован", text: "По заказу KamAZ 5490 заказчик подтвердил доступ. Можно выезжать.", time: "1 ч назад", type: "access_confirmed" },
  { id: "en3", title: "Отправлено на доработку", text: "Hyundai Porter: добавьте фото толщиномера по крыше.", time: "2 ч назад", type: "rework" },
];

function ratingCategoryLabel(c: RatingCategory): string {
  switch (c) {
    case "top": return "Top";
    case "good": return "Good";
    case "normal": return "Normal";
    case "low": return "Low";
    default: return "";
  }
}
export function getRatingCategoryLabel(c: RatingCategory) {
  return ratingCategoryLabel(c);
}
