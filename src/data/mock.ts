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

// Тестовые аудит-заказы для карточек менеджера и исполнителя
const auditOrdersForList: Order[] = [
  {
    id: "ord_audit_lcv",
    assetName: "Toyota Camry",
    assetVin: "JTDBT923001234567",
    assetYear: 2019,
    assetMileage: 56000,
    address: "Москва, ул. Тверская, 1",
    city: "Москва",
    service: "Технико-финансовый аудит",
    serviceType: "audit",
    amount: 0,
    status: "on_review",
    executorId: "ex1",
    executorName: "Андрей Андреев",
  },
  {
    id: "ord_audit_special",
    assetName: "Экскаватор CAT 320",
    assetVin: "CAT320XXXXX",
    assetYear: 2018,
    assetMileage: 0,
    address: "Екатеринбург, ул. Мира, 10",
    city: "Екатеринбург",
    service: "Технико-финансовый аудит",
    serviceType: "audit",
    amount: 0,
    status: "in_progress",
    executorId: "ex1",
    executorName: "Андрей Андреев",
  },
];

// 50 заказов: базовые + аудит для списка + автосгенерированные копии
export const mockOrders: Order[] = [
  ...baseOrders,
  ...auditOrdersForList,
  ...Array.from({ length: 43 }, (_, index) => {
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

export type RatingCategory = "elevated" | "standard" | "lowered";

export type VerificationMethod = "esia" | "passport" | null;

export type ContractorType = "npd" | "ip" | "ooo";

export interface ExecutorUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  type: ExecutorType;
  contractorType: ContractorType; // npd = самозанятый, ip | ooo = подрядчик
  companyName?: string; // для ИП/ООО
  inn?: string;
  requisites?: string;
  education?: string;
  specialization?: string;
  experienceYears?: number;
  rating: number;
  ratingCategory: RatingCategory;
  qualityScore: number;
  responseSpeedScore: number; // Cср, 1–5 по правилу 90 мин
  selectionCoeff: number; // B, коэффициент выбора / % отказов
  firstTimeAcceptRate: number; // % принятых с первого раза (надежность)
  acceptRate: number; // процент принятых заявок
  complaintsPercent: number; // Рср, % рекламаций
  reactionSpeed: number; // минуты до отклика
  priorityOrdersShare: number; // Пср, доля приоритетных заказов (0–100)
  avgResponseMinutes: number;
  completedThisMonth: number;
  completedByType: { audit: number; inspection: number; maintenance: number; sale: number };
  /** Текущий статус верификации аккаунта исполнителя */
  verificationStatus: "unverified" | "pending" | "verified";
  /** Маскированный телефон для SMS-блока */
  phoneMasked?: string;
  /** Короткий флаг для быстрой проверки (оставлен для обратной совместимости) */
  isVerified: boolean;
  verificationMethod: VerificationMethod;
  /** Анкета самозанятого (НПД), заполняемая на онбординге */
  selfEmployedProfile?: {
    passport: {
      series: string;
      number: string;
      issuedBy: string;
      issueDate: string;
      subdivisionCode: string;
    };
    bank: {
      account20: string;
      bankName: string;
      bik9: string;
      corrAccount20: string;
    };
    consents: {
      consent1: boolean;
      consent2: boolean;
      consent3: boolean;
      consent4: boolean;
    };
    smsCode: string;
  };
}

/** Начисление по заказу со статусом оплаты (для блока «Оплачено по заказам») */
export interface ExecutorAccrualPaid {
  id: string;
  orderId: string;
  assetName: string;
  amount: number;
  status: "processing" | "paid";
  date: string;
}

/** Документ ЭДО (СБИС): акт, УПД и т.д. */
export type EdoDocType = "act" | "upd";
export type EdoDocStatus = "sent" | "awaiting_signature" | "signed";
/** Доступные способы подписи: ПЭП (для НПД), КЭП СБИС */
export type EdoSignMethod = "pep" | "kep";

export interface ExecutorEdoDoc {
  id: string;
  type: EdoDocType;
  status: EdoDocStatus;
  signMethodsAvailable: EdoSignMethod[];
  lastUpdate: string;
  description?: string;
}

export interface BoardOrderCard {
  id: string;
  serviceType: ServiceType;
  serviceLabel: string;
  address: string;
  city: string;
  /** Информация по активу, чтобы на доске было понятно, по чему услуга */
  assetType?: CustomerAssetType;
  assetBrand?: string;
  assetModel?: string;
  assetYear?: number;
  assetMileageKm?: number;
  payoutPercent: 60 | 70; // 60% обычный, 70% после перерасчёта
  orderAmount: number;
  payoutAmount: number;
  priority: "high" | "normal";
  minutesPending: number;
  rejectionsCount: number;
  requiresAccessAgreement: boolean;
  exclusiveForTop: boolean; // повышенный приоритет доступа (ранний доступ к заявкам)
  /** Повторный заказ для того же исполнителя — показывать бейдж "Ваш заказ" и сортировать выше */
  isFollowUpForSameExecutor?: boolean;
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
  reportUrl?: string;
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
  phone: "+7 999 123-45-67",
  type: "self_employed",
  contractorType: "npd",
  companyName: "Самозанятый исполнитель",
  inn: "770712345678",
  requisites: "Расчётный счёт: 40702810100000001234, банк ПАО Сбербанк, БИК 044525225",
  rating: 4.8,
  ratingCategory: "elevated",
  qualityScore: 4.9,
  responseSpeedScore: 5,
  selectionCoeff: 2,
  firstTimeAcceptRate: 92,
  acceptRate: 94,
  complaintsPercent: 1.2,
  reactionSpeed: 45,
  priorityOrdersShare: 35,
  avgResponseMinutes: 45,
  completedThisMonth: 8,
  completedByType: { audit: 2, inspection: 4, maintenance: 2, sale: 0 },
  verificationStatus: "unverified",
  phoneMasked: "+7 *** *** ** 67",
  isVerified: false,
  verificationMethod: null,
};

/** Оплачено по заказам (статусы В обработке / Оплачено) */
export const executorAccrualsPaidMock: ExecutorAccrualPaid[] = [
  { id: "ap1", orderId: "c1", assetName: "Hyundai Porter", amount: 12000, status: "paid", date: "2025-01-28" },
  { id: "ap2", orderId: "c2", assetName: "Scania R-series", amount: 14000, status: "processing", date: "2025-01-20" },
  { id: "ap3", orderId: "ord2", assetName: "KamAZ 5490", amount: 9000, status: "processing", date: "2025-02-01" },
];

/** Документы ЭДО (заглушка СБИС) */
export const executorEdoDocsMock: ExecutorEdoDoc[] = [
  {
    id: "edo1",
    type: "act",
    status: "awaiting_signature",
    signMethodsAvailable: ["kep"],
    lastUpdate: "2025-02-01T12:00:00",
    description: "Акт выполненных работ № 45",
  },
  {
    id: "edo2",
    type: "upd",
    status: "sent",
    signMethodsAvailable: ["pep", "kep"],
    lastUpdate: "2025-01-28T10:00:00",
    description: "УПД от 28.01.2025",
  },
];

/** Профиль НПД для отображения второго варианта (можно переключить contractorType в моке на 'npd') */
export const executorUserNpdExample: Partial<ExecutorUser> = {
  contractorType: "npd",
  name: "Иванова Мария Петровна",
  inn: "770712345678",
  education: "Высшее, автотехника",
  specialization: "Технический осмотр ТС",
  experienceYears: 5,
  requisites: "НПД, самозанятый",
  isVerified: false,
  verificationMethod: null,
};

export const boardOrdersMock: BoardOrderCard[] = [
  {
    id: "b1",
    serviceType: "inspection",
    serviceLabel: "Проактивная инспекция",
    address: "Москва, 119002, ул. Арбат, 22/2",
    city: "Москва",
    assetType: "passenger",
    assetBrand: "Toyota",
    assetModel: "Camry",
    assetYear: 2019,
    assetMileageKm: 65000,
    payoutPercent: 60,
    orderAmount: 15000,
    payoutAmount: 9000,
    priority: "high",
    minutesPending: 195,
    rejectionsCount: 3,
    requiresAccessAgreement: true,
    exclusiveForTop: false,
    isFollowUpForSameExecutor: true,
  },
  {
    id: "b2",
    serviceType: "audit",
    serviceLabel: "Технико-финансовый аудит",
    address: "Санкт-Петербург, Невский пр., 100",
    city: "Санкт-Петербург",
    assetType: "truck",
    assetBrand: "KamAZ",
    assetModel: "5490",
    assetYear: 2018,
    assetMileageKm: 280000,
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
    assetType: "lcv",
    assetBrand: "Hyundai",
    assetModel: "Porter",
    assetYear: 2019,
    assetMileageKm: 120000,
    payoutPercent: 60,
    orderAmount: 25000,
    payoutAmount: 15000,
    priority: "normal",
    minutesPending: 45,
    rejectionsCount: 0,
    requiresAccessAgreement: false,
    exclusiveForTop: true,
    isFollowUpForSameExecutor: true,
  },
  {
    id: "b4",
    serviceType: "inspection",
    serviceLabel: "Проактивная инспекция",
    address: "Казань, ул. Баумана, 58",
    city: "Казань",
    assetType: "truck",
    assetBrand: "Mercedes-Benz",
    assetModel: "Actros",
    assetYear: 2019,
    assetMileageKm: 280000,
    payoutPercent: 60,
    orderAmount: 12000,
    payoutAmount: 7200,
    priority: "normal",
    minutesPending: 280,
    rejectionsCount: 1,
    requiresAccessAgreement: true,
    exclusiveForTop: false,
  },
  {
    id: "b5",
    serviceType: "audit",
    serviceLabel: "Технико-финансовый аудит",
    address: "Новосибирск, Красный пр., 77",
    city: "Новосибирск",
    assetType: "truck",
    assetBrand: "Volvo",
    assetModel: "FH 16",
    assetYear: 2020,
    assetMileageKm: 150000,
    payoutPercent: 70,
    orderAmount: 22000,
    payoutAmount: 15400,
    priority: "high",
    minutesPending: 65,
    rejectionsCount: 0,
    requiresAccessAgreement: true,
    // Заказ уже в высоком приоритете, но доступ не эксклюзивный
    exclusiveForTop: false,
  },
  {
    id: "b6",
    serviceType: "maintenance",
    serviceLabel: "Обслуживание и ремонт",
    address: "Екатеринбург, ул. Малышева, 36",
    city: "Екатеринбург",
    assetType: "special",
    assetBrand: "CAT",
    assetModel: "320",
    assetYear: 2018,
    payoutPercent: 60,
    orderAmount: 18000,
    payoutAmount: 10800,
    priority: "normal",
    minutesPending: 510,
    rejectionsCount: 2,
    requiresAccessAgreement: false,
    exclusiveForTop: false,
    isFollowUpForSameExecutor: true,
  },
  {
    id: "b7",
    serviceType: "inspection",
    serviceLabel: "Проактивная инспекция",
    address: "Нижний Новгород, ул. Рождественская, 6",
    city: "Нижний Новгород",
    assetType: "trailer",
    assetBrand: "Schmitz",
    assetModel: "S.KO",
    assetYear: 2018,
    payoutPercent: 60,
    orderAmount: 14000,
    payoutAmount: 8400,
    priority: "normal",
    minutesPending: 90,
    rejectionsCount: 0,
    requiresAccessAgreement: true,
    exclusiveForTop: false,
  },
  {
    id: "b8",
    serviceType: "audit",
    serviceLabel: "Технико-финансовый аудит",
    address: "Самара, ул. Куйбышева, 100",
    city: "Самара",
    assetType: "truck",
    assetBrand: "MAN",
    assetModel: "TGX",
    assetYear: 2020,
    payoutPercent: 70,
    orderAmount: 19000,
    payoutAmount: 13300,
    priority: "normal",
    minutesPending: 200,
    rejectionsCount: 0,
    requiresAccessAgreement: true,
    exclusiveForTop: true,
  },
  {
    id: "b9",
    serviceType: "maintenance",
    serviceLabel: "Обслуживание и ремонт",
    address: "Ростов-на-Дону, ул. Большая Садовая, 47",
    city: "Ростов-на-Дону",
    assetType: "truck",
    assetBrand: "Scania",
    assetModel: "R 450",
    assetYear: 2019,
    payoutPercent: 60,
    orderAmount: 28000,
    payoutAmount: 16800,
    priority: "normal",
    minutesPending: 30,
    rejectionsCount: 0,
    requiresAccessAgreement: false,
    exclusiveForTop: false,
  },
];

export function getBoardOrderById(id: string): BoardOrderCard | undefined {
  return boardOrdersMock.find((o) => o.id === id);
}

export const executorActiveOrdersMock: ExecutorActiveOrder[] = [
  // Аудит
  {
    id: "ord2",
    assetName: "KamAZ 5490",
    serviceType: "audit",
    serviceLabel: "Технико-финансовый аудит",
    status: "in_progress",
    statusLabel: "В работе",
    address: "Санкт-Петербург, Невский пр., 100",
    accessAgreed: true,
    deadline: "2025-02-10",
  },
  {
    id: "ord_audit_lcv",
    assetName: "Toyota Camry",
    serviceType: "audit",
    serviceLabel: "Технико-финансовый аудит",
    status: "on_review",
    statusLabel: "На проверке менеджером/QA",
    address: "Москва, ул. Тверская, 1",
    accessAgreed: true,
    deadline: "2025-02-12",
  },
  {
    id: "ord_audit_special",
    assetName: "Экскаватор CAT 320",
    serviceType: "audit",
    serviceLabel: "Технико-финансовый аудит",
    status: "access_pending",
    statusLabel: "Ожидаем согласования доступа заказчиком",
    address: "Екатеринбург, ул. Мира, 10",
    accessAgreed: null,
    deadline: "2025-02-14",
  },
  {
    id: "ord_audit_2",
    assetName: "Scania R 450",
    serviceType: "audit",
    serviceLabel: "Технико-финансовый аудит",
    status: "in_progress",
    statusLabel: "В работе",
    address: "Москва, ул. Ленина, 15",
    accessAgreed: true,
    deadline: "2025-02-16",
  },
  // Инспекция
  {
    id: "insp1",
    assetName: "Hyundai Porter",
    serviceType: "inspection",
    serviceLabel: "Проактивная инспекция",
    status: "on_review",
    statusLabel: "На проверке менеджером",
    address: "Москва, Тверской б-р, 26A",
    accessAgreed: true,
    deadline: "2025-02-05",
  },
  {
    id: "insp2",
    assetName: "Mercedes Actros",
    serviceType: "inspection",
    serviceLabel: "Проактивная инспекция",
    status: "in_progress",
    statusLabel: "В работе",
    address: "Казань, ул. Баумана, 8",
    accessAgreed: true,
    deadline: "2025-02-11",
  },
  {
    id: "insp3",
    assetName: "Volvo FH 16",
    serviceType: "inspection",
    serviceLabel: "Проактивная инспекция",
    status: "access_pending",
    statusLabel: "Ожидаем согласования доступа",
    address: "Нижний Новгород, ул. Рождественская, 1",
    accessAgreed: null,
    deadline: "2025-02-18",
  },
  // Обслуживание и ремонт
  {
    id: "prep2",
    assetName: "KamAZ 5490",
    serviceType: "maintenance",
    serviceLabel: "Обслуживание и ремонт",
    status: "in_progress",
    statusLabel: "В работе",
    address: "Санкт-Петербург, Невский пр., 100",
    accessAgreed: true,
    deadline: "2025-02-12",
  },
  {
    id: "prep3",
    assetName: "MAN TGX",
    serviceType: "maintenance",
    serviceLabel: "Обслуживание и ремонт",
    status: "in_progress",
    statusLabel: "В работе",
    address: "Самара, ул. Мичурина, 22",
    accessAgreed: true,
    deadline: "2025-02-14",
  },
  {
    id: "prep4",
    assetName: "DAF XF",
    serviceType: "maintenance",
    serviceLabel: "Обслуживание и ремонт",
    status: "access_pending",
    statusLabel: "Ожидаем согласования доступа",
    address: "Ростов-на-Дону, пр. Будённовский, 50",
    accessAgreed: null,
    deadline: "2025-02-20",
  },
  // Продажа под ключ — только у менеджера (публикация, прикрепление ссылок). У исполнителя таких заказов нет.
];

export const executorCompletedOrdersMock: ExecutorCompletedOrder[] = [
  {
    id: "c1",
    completedAt: "2025-01-28",
    serviceLabel: "Проактивная инспекция",
    assetName: "Hyundai Porter",
    firstTimeAccepted: true,
    amount: 12000,
    reportUrl: "#",
  },
  {
    id: "c2",
    completedAt: "2025-01-20",
    serviceLabel: "Технико-финансовый аудит",
    assetName: "Scania R-series",
    firstTimeAccepted: false,
    amount: 14000,
    reportUrl: "#",
  },
];

export function getCompletedOrderById(id: string): ExecutorCompletedOrder | undefined {
  return executorCompletedOrdersMock.find((o) => o.id === id);
}

export const executorAccrualsMock: ExecutorAccrual[] = [
  { id: "acc1", orderId: "c1", assetName: "Hyundai Porter", amount: 12000, completedAt: "2025-01-28" },
  { id: "acc2", orderId: "c2", assetName: "Scania R-series", amount: 14000, completedAt: "2025-01-20" },
];

export const payoutRequestsMock: PayoutRequest[] = [
  { id: "pr1", amount: 35000, status: "processing", createdAt: "2025-02-01" },
  { id: "pr2", amount: 20000, status: "approved", createdAt: "2025-01-25" },
];

/** Заработок исполнителя по месяцам (для графика в разделе «Финансы») */
export interface ExecutorMonthlyEarning {
  month: string;
  amount: number;
}

export const executorMonthlyEarningsMock: ExecutorMonthlyEarning[] = [
  { month: "Июн", amount: 42000 },
  { month: "Июл", amount: 58000 },
  { month: "Авг", amount: 51000 },
  { month: "Сент", amount: 67000 },
  { month: "Окт", amount: 72000 },
  { month: "Нояб", amount: 65000 },
  { month: "Дек", amount: 89000 },
  { month: "Янв", amount: 78000 },
  { month: "Фев", amount: 95000 },
];

export const executorNotificationsMock: ExecutorNotification[] = [
  { id: "en1", title: "Новые заказы на доске", text: "Доступно 2 заказа с повышенным приоритетом.", time: "10 мин назад", type: "new_order" },
  { id: "en2", title: "Доступ согласован", text: "По заказу KamAZ 5490 заказчик подтвердил доступ. Можно выезжать.", time: "1 ч назад", type: "access_confirmed" },
  { id: "en3", title: "Отправлено на доработку", text: "Hyundai Porter: добавьте фото толщиномера по крыше.", time: "2 ч назад", type: "rework" },
];

// ——— Уведомления по ролям (customer / manager / admin / accounting) ———

export interface RoleNotification {
  id: string;
  title: string;
  text: string;
  time: string;
}

export const customerNotificationsMock: RoleNotification[] = [
  { id: "cn1", title: "Назначен исполнитель", text: "По заявке на аудит Toyota Camry назначен Андрей Андреев. Подтвердите доступ.", time: "15 мин назад" },
  { id: "cn2", title: "КП готово", text: "По KamAZ 5490 сформировано коммерческое предложение. Просмотрите в карточке заказа.", time: "1 ч назад" },
  { id: "cn3", title: "Отчёт аудита принят", text: "Отчёт по Hyundai Porter принят менеджером. Ожидайте КП.", time: "3 ч назад" },
];

export const managerNotificationsMock: RoleNotification[] = [
  { id: "mn1", title: "Новый заказ без исполнителя", text: "Появился новый заказ на аудит без назначенного исполнителя.", time: "5 мин назад" },
  { id: "mn2", title: "Задача по SLA", text: "Проверка отчёта по Hyundai Porter просрочена по SLA.", time: "30 мин назад" },
  { id: "mn3", title: "Платёж от заказчика", text: "Поступила оплата по KamAZ 5490.", time: "1 ч назад" },
];

export const adminNotificationsMock: RoleNotification[] = [
  { id: "an1", title: "Новый пользователь", text: "Ожидает подтверждения регистрация бухгалтера.", time: "2 ч назад" },
  { id: "an2", title: "Роли", text: "Напоминание: проверить права доступа по ролям.", time: "1 дн назад" },
];

export const accountingNotificationsMock: RoleNotification[] = [
  { id: "acn1", title: "Акт к проведению", text: "Акт выполненных работ по заказу ord2 ожидает проведения.", time: "20 мин назад" },
  { id: "acn2", title: "Выплата исполнителю", text: "Заявка на выплату 35 000 ₽ от Андрея Андреева на согласовании.", time: "1 ч назад" },
];

// ——— Моки кабинета заказчика: сток активов и заказы ———

export type CustomerAssetType = "passenger" | "lcv" | "truck" | "special" | "trailer";

export interface StockAsset {
  id: string;
  name: string;
  vin: string;
  year: number;
  address: string;
  city: string;
  typeLabel: string;
  /** Тип для структуры портфеля */
  type?: CustomerAssetType;
  brand?: string;
  model?: string;
  mileage?: number;
  motohours?: number;
  price?: number;
  exposureDays?: number;
  employeeId?: string;
  /** stock | in_work | realized */
  portfolioStatus?: "stock" | "in_work" | "realized";
}

export interface CustomerOrder {
  id: string;
  assetIds: string[];
  assetNames: string[];
  address: string;
  city: string;
  serviceLabel: string;
  status: "draft" | "access_pending" | "in_progress" | "on_review" | "completed";
  statusLabel: string;
  totalBaseRub?: number;
  totalLogisticsRub?: number;
  accessAgreed?: boolean;
  executorName?: string;
  executorPassportNote?: string;
}

/** Подчинённый сотрудник главного заказчика */
export interface CustomerEmployee {
  id: string;
  surname: string;
  name: string;
  patronymic: string;
  fullName: string;
  email: string;
  limit: number;
  limitRemaining: number;
  assetsCount: number;
  assetsInWorkCount: number;
  avgExposureDays?: number;
  unreadNotificationsCount?: number;
}

/** Номинальный счёт компании */
export interface CustomerNominalAccount {
  balance: number;
  requisites: string;
  contractUrl?: string;
  reconciliationActUrl?: string;
}

/** Данные по месяцам для графиков дашборда заказчика */
export interface CustomerDashboardMonthPoint {
  month: string;
  avgCheck?: number;
  avgDuration?: number;
  value?: number;
}

/** KPI дашборда главного заказчика */
export interface CustomerDashboardKpi {
  assetsTotal: number;
  structureByType: { type: CustomerAssetType; label: string; count: number; percent: number }[];
  roiPercent: number;
  roiChangeVsLastMonth: number;
  opexPercent: number;
  opexChangeVsLastMonth: number;
  avgCheckRub: number;
  avgCheckChange: number;
  avgExposureDays: number;
  avgExposureChange: number;
  exposureReductionDays: number;
  portfolioValueRub: number;
  portfolioValueSold: number;
  realizedValueThisMonth: number;
  realizedPercentOfPortfolio: number;
  /** Месячные точки для графиков (Апр–Нояб и т.д.) */
  monthlyAvgCheck: CustomerDashboardMonthPoint[];
  monthlyAvgDuration: CustomerDashboardMonthPoint[];
  /** Доля «в портфеле» (остаток) и «продано» для полукруговой диаграммы (0–100) */
  assetValuePercentInPortfolio: number;
  assetValuePercentSold: number;
  dashboardYear: number;
  dashboardMonth: string;
}

/** Актив в работе (привязка к заказу/услуге) */
export interface CustomerAssetInWork {
  assetId: string;
  assetName: string;
  brand?: string;
  model?: string;
  vin: string;
  year: number;
  city: string;
  employeeId?: string;
  employeeName?: string;
  orderId: string;
  serviceLabel: string;
  stageLabel: string;
  needsCustomerAction?: boolean;
  actionLabel?: string;
}

/** Реализованный актив */
export interface CustomerAssetRealized {
  assetId: string;
  assetName: string;
  vin: string;
  year: number;
  city: string;
  employeeId?: string;
  employeeName?: string;
  exposureBeforeDays: number;
  exposureAfterDays: number;
  exposureReductionDays: number;
  roiPercent: number;
  realizedAt: string;
  photoUrl?: string;
}

export const CUSTOMER_ASSET_TYPE_LABELS: Record<CustomerAssetType, string> = {
  passenger: "Легковые автомобили",
  lcv: "Легкий коммерческий транспорт",
  truck: "Грузовой транспорт",
  trailer: "Прицепы и полуприцепы",
  special: "Спецтехника и спецтранспорт",
};

const _ast = (id: string, name: string, vin: string, year: number, address: string, city: string, typeLabel: string, type: CustomerAssetType, brand: string, model: string, mileage?: number, motohours?: number, price?: number, exposureDays?: number, employeeId?: string, portfolioStatus: "stock" | "in_work" | "realized" = "stock"): StockAsset => ({
  id,
  name,
  vin,
  year,
  address,
  city,
  typeLabel,
  type,
  brand,
  model,
  mileage,
  motohours,
  price,
  exposureDays,
  employeeId,
  portfolioStatus,
});

export const stockAssetsMock: StockAsset[] = [
  _ast("ast1", "Toyota Land Cruiser 200", "JTM34HH5768HBJK456", 2018, "Москва, ул. Арбат, 22/2", "Москва", "Легковой/LCV", "passenger", "Toyota", "Land Cruiser 200", 86000, undefined, 4200000, 45, "emp1", "in_work"),
  _ast("ast2", "KamAZ 5490", "X9K5490123456789", 2020, "Санкт-Петербург, Невский пр., 100", "Санкт-Петербург", "КТ", "truck", "KamAZ", "5490", 120000, undefined, 1850000, 30, "emp1", "in_work"),
  _ast("ast3", "Hyundai Porter", "Z94CB41AAGR323020", 2019, "Москва, Тверской б-р, 26A", "Москва", "Легковой/LCV", "lcv", "Hyundai", "Porter", 56000, undefined, 950000, 22, "emp2", "in_work"),
  _ast("ast4", "Toyota Camry", "JTDBT923001234567", 2019, "Москва, ул. Тверская, 1", "Москва", "Легковой/LCV", "passenger", "Toyota", "Camry", 65000, undefined, 2100000, 18, "emp2", "stock"),
  _ast("ast5", "Экскаватор CAT 320", "CAT320XXXXX", 2018, "Екатеринбург, ул. Мира, 10", "Екатеринбург", "Спецтехника", "special", "CAT", "320", undefined, 4200, 5800000, 60, undefined, "stock"),
  _ast("ast6", "Mercedes-Benz Actros", "WDB9632061L123456", 2019, "Казань, ул. Баумана, 8", "Казань", "КТ", "truck", "Mercedes-Benz", "Actros", 280000, undefined, 4500000, 35, "emp1", "stock"),
  _ast("ast7", "Volvo FH 16", "YV1LS56A1X1234567", 2020, "Нижний Новгород, ул. Рождественская, 1", "Нижний Новгород", "КТ", "truck", "Volvo", "FH 16", 150000, undefined, 5200000, 28, "emp2", "stock"),
  _ast("ast8", "ГАЗель Next", "X9LGA212000123456", 2021, "Москва, Варшавское ш., 125", "Москва", "LCV", "lcv", "ГАЗ", "ГАЗель Next", 42000, undefined, 1800000, 15, undefined, "stock"),
  _ast("ast9", "Ford Transit", "WF0XXXTTX1234567", 2020, "Самара, ул. Мичурина, 22", "Самара", "LCV", "lcv", "Ford", "Transit", 38000, undefined, 2200000, 20, "emp1", "stock"),
  _ast("ast10", "Schmitz Cargobull S.KO", "SCH1234567890123", 2018, "Ростов-на-Дону, пр. Будённовский, 50", "Ростов-на-Дону", "Прицеп", "trailer", "Schmitz", "Cargobull S.KO", undefined, undefined, 850000, 40, undefined, "stock"),
  _ast("ast11", "Hyundai HD78", "KMHNM81XPUU123456", 2019, "Воронеж, ул. Плехановская, 10", "Воронеж", "Грузовой", "truck", "Hyundai", "HD78", 95000, undefined, 3200000, 25, "emp2", "stock"),
  _ast("ast12", "MAN TGX", "WMA1234567890123", 2020, "Самара, ул. Мичурина, 22", "Самара", "КТ", "truck", "MAN", "TGX", 120000, undefined, 4800000, 32, "emp1", "stock"),
  _ast("ast13", "Scania R 450", "YS2R4X20002000001", 2019, "Москва, ул. Ленина, 15", "Москва", "КТ", "truck", "Scania", "R 450", 200000, undefined, 5500000, 38, undefined, "stock"),
  _ast("ast14", "DAF XF", "XLRTE47XS0E123456", 2018, "Краснодар, ул. Красная, 100", "Краснодар", "КТ", "truck", "DAF", "XF", 350000, undefined, 4200000, 55, "emp2", "stock"),
  _ast("ast15", "КамАЗ 65117 (шасси)", "X9K6511700001234", 2017, "Екатеринбург, ул. Мира, 10", "Екатеринбург", "КТ", "truck", "КамАЗ", "65117", 180000, undefined, 2100000, 70, undefined, "stock"),
  _ast("ast16", "Renault Logan", "VF1RFA00063612345", 2020, "Москва, ул. Тверская, 5", "Москва", "Легковой", "passenger", "Renault", "Logan", 35000, undefined, 950000, 12, "emp1", "stock"),
  _ast("ast17", "Lada Vesta", "XTA1112000Y123456", 2021, "Москва, Алтуфьевское ш., 1", "Москва", "Легковой", "passenger", "Lada", "Vesta", 28000, undefined, 1100000, 8, undefined, "stock"),
  _ast("ast18", "Kia Rio", "Z94C241AAGR323021", 2019, "Санкт-Петербург, Невский пр., 50", "Санкт-Петербург", "Легковой", "passenger", "Kia", "Rio", 62000, undefined, 1050000, 14, "emp2", "stock"),
  _ast("ast19", "Кран Liebherr LTM 1100", "LIEB1234567890", 2016, "Новосибирск, ул. Советская, 1", "Новосибирск", "Спецтехника", "special", "Liebherr", "LTM 1100", undefined, 8500, 28000000, 90, undefined, "stock"),
  _ast("ast20", "Бульдозер Shantui SD22", "SHAN2220123456", 2015, "Кемерово, ул. Кирова, 20", "Кемерово", "Спецтехника", "special", "Shantui", "SD22", undefined, 12000, 8500000, 120, "emp1", "stock"),
  _ast("ast21", "Прицеп Krone SDP 27", "KRON123456789012", 2019, "Воронеж, ул. Плехановская, 15", "Воронеж", "Прицеп", "trailer", "Krone", "SDP 27", undefined, undefined, 1200000, 45, undefined, "stock"),
  _ast("ast22", "УАЗ Патриот", "XTA212000Y1234567", 2020, "Москва, ул. Арбат, 10", "Москва", "LCV", "lcv", "УАЗ", "Патриот", 41000, undefined, 1650000, 19, "emp2", "stock"),
  _ast("ast23", "VW Crafter", "WV1ZZZ2HZPH012345", 2021, "Казань, ул. Баумана, 12", "Казань", "LCV", "lcv", "Volkswagen", "Crafter", 22000, undefined, 3200000, 10, undefined, "stock"),
  _ast("ast24", "Isuzu FRR 500", "MP1FSZUJP3L123456", 2018, "Ростов-на-Дону, пр. Будённовский, 30", "Ростов-на-Дону", "Грузовой", "truck", "Isuzu", "FRR 500", 145000, undefined, 2800000, 42, "emp1", "stock"),
  _ast("ast25", "Mitsubishi L200", "MMBJNK7403K123456", 2019, "Сочи, ул. Курортная, 5", "Сочи", "LCV", "lcv", "Mitsubishi", "L200", 52000, undefined, 2500000, 25, undefined, "stock"),
];

export const customerEmployeesMock: CustomerEmployee[] = [
  { id: "emp1", surname: "Иванов", name: "Иван", patronymic: "Иванович", fullName: "Иванов Иван Иванович", email: "ivanov@company.ru", limit: 5000000, limitRemaining: 3200000, assetsCount: 8, assetsInWorkCount: 3, avgExposureDays: 32, unreadNotificationsCount: 2 },
  { id: "emp2", surname: "Петрова", name: "Мария", patronymic: "Сергеевна", fullName: "Петрова Мария Сергеевна", email: "petrova@company.ru", limit: 3000000, limitRemaining: 1800000, assetsCount: 6, assetsInWorkCount: 2, avgExposureDays: 24, unreadNotificationsCount: 1 },
  { id: "emp3", surname: "Сидоров", name: "Алексей", patronymic: "Петрович", fullName: "Сидоров Алексей Петрович", email: "sidorov@company.ru", limit: 2000000, limitRemaining: 2000000, assetsCount: 0, assetsInWorkCount: 0, unreadNotificationsCount: 0 },
];

export const customerNominalAccountMock: CustomerNominalAccount = {
  balance: 12500000,
  requisites: "Реквизиты номинального счёта: ООО «Лизинг Альфа», ИНН 7701234567, счёт 40703810100000001234, банк ПАО Сбербанк",
  contractUrl: "#",
  reconciliationActUrl: "#",
};

const DASHBOARD_MONTHS = ["Апр", "Май", "Июн", "Июл", "Авг", "Сент", "Окт", "Нояб"];

export const customerDashboardKpiMock: CustomerDashboardKpi = {
  assetsTotal: 268,
  structureByType: [
    { type: "passenger", label: "Легковые автомобили", count: 36, percent: 12 },
    { type: "special", label: "Спецтехника и спецтранспорт", count: 45, percent: 15 },
    { type: "truck", label: "Грузовой транспорт", count: 51, percent: 17 },
    { type: "trailer", label: "Прицепы и полуприцепы", count: 60, percent: 20 },
    { type: "lcv", label: "Легкий коммерческий транспорт", count: 108, percent: 36 },
  ],
  roiPercent: 34,
  roiChangeVsLastMonth: 1.5,
  opexPercent: 14,
  opexChangeVsLastMonth: 2,
  avgCheckRub: 1034000,
  avgCheckChange: 104500,
  avgExposureDays: 64,
  avgExposureChange: 40,
  exposureReductionDays: 14,
  portfolioValueRub: 100460500,
  portfolioValueSold: 20180600,
  realizedValueThisMonth: 19700000,
  realizedPercentOfPortfolio: 20,
  monthlyAvgCheck: DASHBOARD_MONTHS.map((month, i) => ({
    month,
    avgCheck: 800000 + i * 40000 + (i === 7 ? 150000 : 0),
  })),
  monthlyAvgDuration: DASHBOARD_MONTHS.map((month, i) => ({
    month,
    avgDuration: 50 + i * 2 + (i === 7 ? 10 : 0),
  })),
  assetValuePercentInPortfolio: 81,
  assetValuePercentSold: 19,
  dashboardYear: 2026,
  dashboardMonth: "Декабрь",
};

export const customerAssetsInWorkMock: CustomerAssetInWork[] = [
  { assetId: "ast1", assetName: "Toyota Land Cruiser 200", brand: "Toyota", model: "Land Cruiser 200", vin: "JTM34HH5768HBJK456", year: 2018, city: "Москва", employeeId: "emp1", employeeName: "Иванов Иван Иванович", orderId: "co1", serviceLabel: "Технико-финансовый аудит", stageLabel: "Выезд/выполнение", needsCustomerAction: false },
  { assetId: "ast2", assetName: "KamAZ 5490", brand: "KamAZ", model: "5490", vin: "X9K5490123456789", year: 2020, city: "Санкт-Петербург", employeeId: "emp1", employeeName: "Иванов Иван Иванович", orderId: "co2", serviceLabel: "Технико-финансовый аудит", stageLabel: "Согласование доступа", needsCustomerAction: true, actionLabel: "Требуется согласование" },
  { assetId: "ast3", assetName: "Hyundai Porter", brand: "Hyundai", model: "Porter", vin: "Z94CB41AAGR323020", year: 2019, city: "Москва", employeeId: "emp2", employeeName: "Петрова Мария Сергеевна", orderId: "co3", serviceLabel: "Обслуживание и ремонт", stageLabel: "На проверке менеджера", needsCustomerAction: false },
];

export const customerAssetsRealizedMock: CustomerAssetRealized[] = [
  { assetId: "r1", assetName: "Scania R-series", vin: "YS2R4X20002000000", year: 2017, city: "Екатеринбург", employeeId: "emp1", employeeName: "Иванов Иван Иванович", exposureBeforeDays: 90, exposureAfterDays: 62, exposureReductionDays: 28, roiPercent: 22, realizedAt: "2025-01-15", photoUrl: undefined },
  { assetId: "r2", assetName: "Hyundai HD78", vin: "KMHNM81XPUU111111", year: 2018, city: "Воронеж", employeeId: "emp2", employeeName: "Петрова Мария Сергеевна", exposureBeforeDays: 75, exposureAfterDays: 58, exposureReductionDays: 17, roiPercent: 18, realizedAt: "2025-01-28", photoUrl: undefined },
];

export const customerOrdersMock: CustomerOrder[] = [
  { id: "co1", assetIds: ["ast1"], assetNames: ["Toyota Land Cruiser 200"], address: "Москва, ул. Арбат, 22/2", city: "Москва", serviceLabel: "Технико-финансовый аудит", status: "in_progress", statusLabel: "В работе", executorName: "Андрей Андреев", executorPassportNote: "Паспортные данные предоставлены" },
  { id: "co2", assetIds: ["ast2"], assetNames: ["KamAZ 5490"], address: "Санкт-Петербург, Невский пр., 100", city: "Санкт-Петербург", serviceLabel: "Технико-финансовый аудит", status: "access_pending", statusLabel: "Ожидаем согласования доступа", executorName: "Иван Иванов", executorPassportNote: "Паспортные данные в заявке", accessAgreed: false },
  { id: "co3", assetIds: ["ast3", "ast4"], assetNames: ["Hyundai Porter", "Toyota Camry"], address: "Москва, Тверской б-р, 26A", city: "Москва", serviceLabel: "Технико-финансовый аудит", status: "completed", statusLabel: "Завершён", totalBaseRub: 45000, totalLogisticsRub: 5000 },
];

/** Уведомления заказчика с категорией: согласование, выполнение услуги, доп. продажи */
export interface CustomerNotificationWithCategory extends RoleNotification {
  category: "agreement" | "completion" | "upsell";
}

export const customerNotificationsWithCategoryMock: CustomerNotificationWithCategory[] = [
  { id: "cn1", title: "Назначен исполнитель", text: "По заявке на аудит Toyota Camry назначен Андрей Андреев. Подтвердите доступ.", time: "15 мин назад", category: "agreement" },
  { id: "cn2", title: "КП готово", text: "По KamAZ 5490 сформировано коммерческое предложение. Просмотрите в карточке заказа.", time: "1 ч назад", category: "completion" },
  { id: "cn3", title: "Требуется согласование доступа", text: "По заказу KamAZ 5490 необходимо подтвердить доступ для исполнителя Ивана Иванова.", time: "2 ч назад", category: "agreement" },
  { id: "cn4", title: "Отчёт аудита принят", text: "Отчёт по Hyundai Porter принят менеджером. Ожидайте КП.", time: "3 ч назад", category: "completion" },
  { id: "cn5", title: "Доп. услуги по портфелю", text: "По 3 активам прошло более месяца с крайней услуги. Рекомендуем инспекцию или аудит.", time: "1 дн назад", category: "upsell" },
];

function ratingCategoryLabel(c: RatingCategory): string {
  switch (c) {
    case "elevated": return "Повышенный";
    case "standard": return "Стандартный";
    case "lowered": return "Пониженный";
    default: return "";
  }
}
export function getRatingCategoryLabel(c: RatingCategory) {
  return ratingCategoryLabel(c);
}

// ——— Аудит: моки и типы для UX-flow ———

export type AuditAssetType = "passenger" | "lcv" | "truck" | "special" | "trailer";
export type SpecialChassis = "wheeled" | "tracked";
export type DefectImpact = "low" | "medium" | "high";
export type DefectType =
  | "deformation"
  | "misalignment"
  | "crack"
  | "weld_failure"
  | "fastener_failure"
  | "poor_fit"
  | "paint_damage"
  | "cut"
  | "missing_part"
  | "other";

export interface AuditOrder {
  id: string;
  assetName: string;
  assetVin: string;
  address: string;
  city: string;
  serviceLabel: string;
  status: "access_pending" | "no_access" | "in_progress" | "on_review" | "on_rework" | "completed";
  statusLabel: string;
  accessAgreed: boolean | null;
  accessPendingHours?: number;
  assetType?: AuditAssetType;
  axesCount?: number; // 2|3|4 for KT, 1|2|3 for trailer
  specialChassis?: SpecialChassis;
}

export interface AuditBlock1 {
  vinPlatePhoto?: string; // url/placeholder
  vinFramePhoto?: string;
  vinFrameNotApplicable?: boolean;
  identificationComment?: string;
  overviewPhotos: { id: string; label: string; photo?: string; hasGeo?: boolean; hasTime?: boolean }[];
  interiorPhotos: { id: string; label: string; photo?: string }[];
}

export interface AuditDefect {
  id: string;
  zone: string;
  zoneLabel: string;
  defectType: DefectType;
  defectTypeLabel: string;
  photoWithRuler?: string;
  comment: string;
  impact: DefectImpact;
  fieldFixable: boolean;
  normHours?: number;
  materialsNeeded?: boolean;
  materialsComment?: string;
  isNonField?: boolean;
}

export interface ThicknessPanel {
  id: string;
  label: string;
  points: { p1?: string; p2?: string };
}

export interface TireReading {
  id: string;
  label: string;
  treadMm?: number;
  treadPhoto?: string;
  pressureBar?: number;
  pressurePhoto?: string;
}

export interface AuditBlock2 {
  assetType?: AuditAssetType;
  axesCount?: number;
  specialChassis?: SpecialChassis;
  thicknessOptional?: boolean; // спецтехника
  hasDefects: boolean;
  defects: AuditDefect[];
  thicknessPanels: ThicknessPanel[];
  tires: TireReading[];
  trackReadings?: { id: string; label: string; done: boolean; photo?: string }[];
}

export interface UnderhoodIssue {
  id: string;
  type: "leak" | "noise";
  name: string;
  fieldFixable: boolean;
  normHours?: number;
  parts?: string;
}

export interface AuditBlock3 {
  startsOnOwn: "yes" | "no" | "booster" | null;
  batteryVoltage?: number;
  batteryReplaceRequired?: boolean;
  dashboardPhoto?: string;
  odometerPhoto?: string;
  mileageValue?: number;
  mileageUnit?: "km" | "mh";
  underhoodPhoto?: string;
  underhoodIssues: UnderhoodIssue[];
  diagFile?: string;
  diagComment?: string;
}

export interface ManagerQA {
  qualityScore?: number;
  qaComment?: string;
  decision?: "accept" | "rework";
}

export interface InternalEstimateBlock4 {
  items: { id: string; label: string; type: "work" | "material"; amount?: number }[];
  totalWork?: number;
  totalMaterials?: number;
}

export interface CommercialOfferBlock5 {
  scenario: "A" | "B" | "V";
  scenarioLabel: string;
  roiPercent?: number;
  sisPrice?: number;
  arvPrice?: number;
  workListForCustomer: { id: string; label: string }[];
  sentToCustomer?: boolean;
}

export interface AuditState {
  order: AuditOrder;
  step0Access: "pending" | "yes" | "no_access";
  step0Comment?: string;
  block1: AuditBlock1;
  block2: AuditBlock2;
  block3: AuditBlock3;
  managerQA?: ManagerQA;
  block4?: InternalEstimateBlock4;
  block5?: CommercialOfferBlock5;
}

// Зоны дефектов по типу актива (подмножества для UI)
export const DEFECT_ZONES_LCV = [
  "капот", "крыша", "крышка багажника", "левое переднее крыло", "правое переднее крыло",
  "левая передняя дверь", "правая передняя дверь", "левое заднее крыло", "правое заднее крыло",
  "передний бампер", "задний бампер",
];
export const DEFECT_ZONES_KT = ["кабина", "капот", "крыша", "левая дверь", "правая дверь", "рама"];
export const DEFECT_ZONES_SPECIAL = ["кабина", "моторный отсек", "гидравлика", "стрела", "ковш", "рама", "ходовая"];

export const DEFECT_TYPE_LABELS: Record<DefectType, string> = {
  deformation: "Деформация кузовных деталей",
  misalignment: "Перекосы",
  crack: "Трещины",
  weld_failure: "Разрушение сварных соединений",
  fastener_failure: "Обрыв крепежных деталей",
  poor_fit: "Неплотное прилегание деталей",
  paint_damage: "Разрушение ЛКП/антикора",
  cut: "Порезы",
  missing_part: "Отсутствует элемент",
  other: "Иное",
};

// Панели толщиномера по типу (упрощённо)
export const THICKNESS_PANELS_LCV = ["капот", "крыша", "крышка багажника", "левое переднее крыло", "правое переднее крыло", "левая передняя дверь", "правая передняя дверь", "левое заднее крыло", "правое заднее крыло", "стойка A левая", "стойка A правая", "порог левый", "порог правый"];
export const THICKNESS_PANELS_KT = ["капот", "крыша кабины", "левая дверь", "правая дверь", "левое крыло", "правое крыло"];

// Моки: 3 тестовых аудита
export const auditOrdersMock: Record<string, AuditState> = {
  ord2: {
    order: {
      id: "ord2",
      assetName: "KamAZ 5490",
      assetVin: "X9K5490123456789",
      address: "Санкт-Петербург, Невский пр., 100",
      city: "Санкт-Петербург",
      serviceLabel: "Технико-финансовый аудит",
      status: "in_progress",
      statusLabel: "В работе",
      accessAgreed: true,
      assetType: "truck",
      axesCount: 3,
    },
    step0Access: "yes",
    block1: {
      overviewPhotos: [
        { id: "o1", label: "Спереди" },
        { id: "o2", label: "45° спереди слева" },
        { id: "o3", label: "45° спереди справа" },
        { id: "o4", label: "Сзади" },
        { id: "o5", label: "45° сзади слева" },
        { id: "o6", label: "45° сзади справа" },
      ],
      interiorPhotos: [
        { id: "i1", label: "Передняя панель во всю длину" },
        { id: "i2", label: "Приборная панель с пробегом" },
        { id: "i3", label: "Передние кресла" },
        { id: "i4", label: "Задние сидения" },
      ],
    },
    block2: {
      assetType: "truck",
      axesCount: 3,
      hasDefects: true,
      defects: [
        {
          id: "d1",
          zone: "кабина",
          zoneLabel: "Кабина",
          defectType: "paint_damage",
          defectTypeLabel: "Разрушение ЛКП",
          comment: "Царапина на левой двери",
          impact: "low",
          fieldFixable: true,
          normHours: 2,
          materialsNeeded: true,
          materialsComment: "Краска, грунт",
          isNonField: false,
        },
      ],
      thicknessPanels: [],
      tires: [
        { id: "w1", label: "Ось 1 лев" },
        { id: "w2", label: "Ось 1 прав" },
        { id: "w3", label: "Ось 2 лев" },
        { id: "w4", label: "Ось 2 прав" },
        { id: "w5", label: "Ось 3 лев" },
        { id: "w6", label: "Ось 3 прав" },
      ],
    },
    block3: {
      startsOnOwn: "yes",
      underhoodIssues: [],
      mileageValue: 120000,
      mileageUnit: "km",
      diagComment: "Диагностика проведена, ошибок нет.",
    },
    managerQA: undefined,
    block4: {
      items: [
        { id: "i1", label: "Окраска левой двери кабины", type: "work", amount: 5000 },
        { id: "i2", label: "Материалы (краска, грунт)", type: "material", amount: 3000 },
      ],
      totalWork: 5000,
      totalMaterials: 3000,
    },
    block5: {
      scenario: "B",
      scenarioLabel: "Оптимальная эффективность",
      roiPercent: 28,
      workListForCustomer: [
        { id: "w1", label: "Окраска левой двери кабины" },
        { id: "w2", label: "Проверка ходовой" },
      ],
    },
  },
  ord_audit_lcv: {
    order: {
      id: "ord_audit_lcv",
      assetName: "Toyota Camry",
      assetVin: "JTDBT923001234567",
      address: "Москва, ул. Тверская, 1",
      city: "Москва",
      serviceLabel: "Технико-финансовый аудит",
      status: "on_review",
      statusLabel: "На проверке менеджером/QA",
      accessAgreed: true,
      assetType: "lcv",
      axesCount: 2,
    },
    step0Access: "yes",
    block1: {
      vinPlatePhoto: "placeholder",
      overviewPhotos: [
        { id: "o1", label: "Спереди", hasGeo: true, hasTime: true },
        { id: "o2", label: "45° спереди слева", hasGeo: true, hasTime: true },
        { id: "o3", label: "45° спереди справа" },
        { id: "o4", label: "Сзади" },
        { id: "o5", label: "45° сзади слева" },
        { id: "o6", label: "45° сзади справа" },
      ],
      interiorPhotos: [
        { id: "i1", label: "Передняя панель во всю длину" },
        { id: "i2", label: "Приборная панель с пробегом" },
        { id: "i3", label: "Передние кресла" },
        { id: "i4", label: "Задние сидения" },
      ],
    },
    block2: {
      assetType: "lcv",
      hasDefects: false,
      defects: [],
      thicknessPanels: THICKNESS_PANELS_LCV.map((label, i) => ({ id: `t${i}`, label, points: { p1: "x", p2: "x", p3: "x", p4: "x", p5: "x" } })),
      tires: [
        { id: "w1", label: "Перед лев", treadMm: 4, pressureBar: 2.2 },
        { id: "w2", label: "Перед прав" },
        { id: "w3", label: "Зад лев" },
        { id: "w4", label: "Зад прав" },
      ],
    },
    block3: {
      startsOnOwn: "yes",
      underhoodIssues: [],
      mileageValue: 56000,
      mileageUnit: "km",
      diagFile: "diag.pdf",
      diagComment: "ЭБУ без ошибок.",
    },
    managerQA: { qualityScore: 4.8, decision: "accept" },
    block4: {
      items: [
        { id: "i1", label: "Работы по аудиту", type: "work", amount: 10000 },
        { id: "i2", label: "Материалы", type: "material", amount: 0 },
      ],
      totalWork: 10000,
      totalMaterials: 0,
    },
    block5: {
      scenario: "A",
      scenarioLabel: "Максимальная ликвидность",
      roiPercent: 55,
      sisPrice: 2500000,
      arvPrice: 2650000,
      workListForCustomer: [
        { id: "w1", label: "Полировка кузова" },
        { id: "w2", label: "Замена масла" },
      ],
      sentToCustomer: true,
    },
  },
  ord_audit_special: {
    order: {
      id: "ord_audit_special",
      assetName: "Экскаватор CAT 320",
      assetVin: "CAT320XXXXX",
      address: "Екатеринбург, ул. Мира, 10",
      city: "Екатеринбург",
      serviceLabel: "Технико-финансовый аудит",
      status: "access_pending",
      statusLabel: "Ожидаем согласования доступа заказчиком",
      accessAgreed: null,
      accessPendingHours: 2,
      assetType: "special",
      specialChassis: "tracked",
    },
    step0Access: "pending",
    block1: {
      overviewPhotos: [
        { id: "o1", label: "Спереди" },
        { id: "o2", label: "45° спереди слева" },
        { id: "o3", label: "45° спереди справа" },
        { id: "o4", label: "Сзади" },
        { id: "o5", label: "45° сзади слева" },
        { id: "o6", label: "45° сзади справа" },
      ],
      interiorPhotos: [
        { id: "i1", label: "Передняя панель во всю длину" },
        { id: "i2", label: "Приборная панель с пробегом" },
        { id: "i3", label: "Передние кресла" },
        { id: "i4", label: "Задние сидения" },
      ],
    },
    block2: {
      assetType: "special",
      specialChassis: "tracked",
      thicknessOptional: true,
      hasDefects: false,
      defects: [],
      thicknessPanels: [],
      tires: [],
      trackReadings: [
        { id: "tr1", label: "Гусеницы", done: false },
        { id: "tr2", label: "Катки", done: false },
        { id: "tr3", label: "Ведущая звезда", done: false },
      ],
    },
    block3: {
      startsOnOwn: "yes",
      underhoodIssues: [],
    },
  },
};

export function getAuditState(orderId: string): AuditState | null {
  return auditOrdersMock[orderId] ?? null;
}

const OVERVIEW_LABELS = [
  "Спереди",
  "45° спереди слева",
  "45° спереди справа",
  "Сзади",
  "45° сзади слева",
  "45° сзади справа",
];

export function getDefaultAuditState(
  orderId: string,
  order: { assetName: string; assetVin?: string; address: string; city: string }
): AuditState {
  return {
    order: {
      id: orderId,
      assetName: order.assetName,
      assetVin: order.assetVin ?? "",
      address: order.address,
      city: order.city,
      serviceLabel: "Технико-финансовый аудит",
      status: "in_progress",
      statusLabel: "В работе",
      accessAgreed: null,
    },
    step0Access: "pending",
    block1: {
      interiorPhotos: [
        { id: "i1", label: "Передняя панель во всю длину" },
        { id: "i2", label: "Приборная панель с пробегом" },
        { id: "i3", label: "Передние кресла" },
        { id: "i4", label: "Задние сидения" },
      ],
      overviewPhotos: OVERVIEW_LABELS.map((label, i) => ({
        id: `o${i + 1}`,
        label,
      })),
    },
    block2: {
      hasDefects: false,
      defects: [],
      thicknessPanels: [],
      tires: [],
    },
    block3: {
      startsOnOwn: null,
      underhoodIssues: [],
    },
  };
}

// ——— Очередь задач менеджера (Task Inbox) ———

export type ManagerTaskType =
  | "audit_check_report"
  | "audit_calculate_materials"
  | "audit_form_kp"
  | "audit_send_customer"
  | "audit_recheck_after_rework"
  | "prep_check_result"
  | "publish_avito"
  | "publish_auto_ru"
  | "publish_drom"
  | "sale_check_metrics"
  | "sale_ad_removed"
  | "sale_fix_final_price"
  | "inspection_check_report"
  | "inspection_calculate_materials"
  | "invoice_executor"
  | "invoice_customer"
  | "to_accountant"
  | "nudge_access";

export type ManagerTaskStatus =
  | "new"
  | "in_progress"
  | "done"
  | "waiting_clarification";

export type ManagerTaskOrderTab = "report" | "estimate" | "kp";

export interface ManagerTask {
  id: string;
  orderId: string;
  orderTab: ManagerTaskOrderTab;
  type: ManagerTaskType;
  typeLabel: string;
  status: ManagerTaskStatus;
  priority: "high" | "normal";
  assetName: string;
  assetVin?: string;
  serviceType?: ServiceType;
  serviceLabel: string;
  dueLabel: string;
  createdAt: string;
  shortDescription?: string;
  comment?: string;
}

export const MANAGER_TASK_TYPE_LABELS: Record<ManagerTaskType, string> = {
  audit_check_report: "Проверить отчёт аудита (блоки 1–3)",
  audit_calculate_materials: "Рассчитать стоимость материалов/деталей (блок 4)",
  audit_form_kp: "Сформировать/пересчитать КП (блок 5)",
  audit_send_customer: "Отправить результат заказчику",
  audit_recheck_after_rework: "Повторная проверка после доработки",
  prep_check_result: "Проверить результат предпродажной подготовки",
  publish_avito: "Опубликовать на Avito",
  publish_auto_ru: "Опубликовать на Auto.ru",
  publish_drom: "Опубликовать на Drom",
  sale_check_metrics: "Проверить ссылку/доступ (метрики не обновляются)",
  sale_ad_removed: "Объявление снято/не найдено — требуется действие",
  sale_fix_final_price: "Зафиксировать продажу (ввести финальную цену)",
  inspection_check_report: "Проверить отчёт инспекции",
  inspection_calculate_materials: "Рассчитать материалы по инспекции",
  invoice_executor: "Получить счёт/акт от исполнителя",
  invoice_customer: "Получить счёт/акт для заказчика",
  to_accountant: "Передать бухгалтеру: оплатить/подтвердить",
  nudge_access: "Пнуть заказчика по доступу",
};

export const managerTasksMock: ManagerTask[] = [
  // Цепочка аудита 1 (ord2 — KamAZ)
  {
    id: "mt1",
    orderId: "ord2",
    orderTab: "report",
    type: "audit_check_report",
    typeLabel: "Проверить отчёт аудита (блоки 1–3)",
    status: "in_progress",
    priority: "high",
    assetName: "KamAZ 5490",
    assetVin: "X9K5490123456789",
    serviceType: "audit",
    serviceLabel: "Технико-финансовый аудит",
    dueLabel: "Сегодня",
    createdAt: "2025-02-02T10:00:00",
    shortDescription: "Исполнитель сдал отчёт на проверку",
  },
  {
    id: "mt2",
    orderId: "ord2",
    orderTab: "estimate",
    type: "audit_calculate_materials",
    typeLabel: "Рассчитать стоимость материалов/деталей (блок 4)",
    status: "new",
    priority: "normal",
    assetName: "KamAZ 5490",
    assetVin: "X9K5490123456789",
    serviceType: "audit",
    serviceLabel: "Технико-финансовый аудит",
    dueLabel: "3 дня",
    createdAt: "2025-02-02T10:00:00",
  },
  {
    id: "mt3",
    orderId: "ord2",
    orderTab: "kp",
    type: "audit_form_kp",
    typeLabel: "Сформировать/пересчитать КП (блок 5)",
    status: "new",
    priority: "normal",
    assetName: "KamAZ 5490",
    serviceType: "audit",
    serviceLabel: "Технико-финансовый аудит",
    dueLabel: "3 дня",
    createdAt: "2025-02-02T10:00:00",
  },
  {
    id: "mt4",
    orderId: "ord2",
    orderTab: "kp",
    type: "audit_send_customer",
    typeLabel: "Отправить результат заказчику",
    status: "new",
    priority: "normal",
    assetName: "KamAZ 5490",
    serviceType: "audit",
    serviceLabel: "Технико-финансовый аудит",
    dueLabel: "5 дней",
    createdAt: "2025-02-02T10:00:00",
  },
  // Цепочка аудита 2 (ord_audit_lcv — Toyota Camry)
  {
    id: "mt5",
    orderId: "ord_audit_lcv",
    orderTab: "report",
    type: "audit_check_report",
    typeLabel: "Проверить отчёт аудита (блоки 1–3)",
    status: "done",
    priority: "normal",
    assetName: "Toyota Camry",
    assetVin: "JTDBT923001234567",
    serviceType: "audit",
    serviceLabel: "Технико-финансовый аудит",
    dueLabel: "Вчера",
    createdAt: "2025-02-01T14:00:00",
    shortDescription: "Принято, оценка 4.8",
  },
  {
    id: "mt6",
    orderId: "ord_audit_lcv",
    orderTab: "kp",
    type: "audit_send_customer",
    typeLabel: "Отправить результат заказчику",
    status: "in_progress",
    priority: "normal",
    assetName: "Toyota Camry",
    serviceType: "audit",
    serviceLabel: "Технико-финансовый аудит",
    dueLabel: "24ч",
    createdAt: "2025-02-02T09:00:00",
  },
  // Инспекция (ord1 — проактивная инспекция)
  {
    id: "mt7",
    orderId: "ord1",
    orderTab: "report",
    type: "inspection_check_report",
    typeLabel: "Проверить отчёт инспекции",
    status: "in_progress",
    priority: "high",
    assetName: "Toyota Land Cruiser 200",
    serviceType: "inspection",
    serviceLabel: "Проактивная инспекция",
    dueLabel: "24ч",
    createdAt: "2025-02-02T08:00:00",
  },
  {
    id: "mt8",
    orderId: "ord1",
    orderTab: "estimate",
    type: "inspection_calculate_materials",
    typeLabel: "Рассчитать материалы по инспекции",
    status: "new",
    priority: "normal",
    assetName: "Toyota Land Cruiser 200",
    serviceType: "inspection",
    serviceLabel: "Проактивная инспекция",
    dueLabel: "3 дня",
    createdAt: "2025-02-02T08:00:00",
  },
  // Общие
  {
    id: "mt9",
    orderId: "ord2",
    orderTab: "estimate",
    type: "invoice_executor",
    typeLabel: "Получить счёт/акт от исполнителя",
    status: "new",
    priority: "normal",
    assetName: "KamAZ 5490",
    serviceLabel: "Технико-финансовый аудит",
    dueLabel: "5 дней",
    createdAt: "2025-02-01T12:00:00",
  },
  {
    id: "mt10",
    orderId: "ord_audit_special",
    orderTab: "report",
    type: "nudge_access",
    typeLabel: "Пнуть заказчика по доступу",
    status: "new",
    priority: "high",
    assetName: "Экскаватор CAT 320",
    serviceType: "audit",
    serviceLabel: "Технико-финансовый аудит",
    dueLabel: "Ожидаем > 3 ч",
    createdAt: "2025-02-02T07:00:00",
    shortDescription: "Доступ не согласован более 3 часов",
  },
  {
    id: "mt11",
    orderId: "ord3",
    orderTab: "estimate",
    type: "to_accountant",
    typeLabel: "Передать бухгалтеру: оплатить/подтвердить",
    status: "new",
    priority: "normal",
    assetName: "Hyundai Porter",
    serviceLabel: "Техническое обслуживание и ремонт",
    dueLabel: "Неделя",
    createdAt: "2025-02-01T16:00:00",
  },
  {
    id: "mt12",
    orderId: "prep2",
    orderTab: "report",
    type: "prep_check_result",
    typeLabel: "Проверить результат предпродажной подготовки",
    status: "new",
    priority: "normal",
    assetName: "KamAZ 5490",
    serviceType: "maintenance",
    serviceLabel: "Обслуживание и ремонт",
    dueLabel: "24ч",
    createdAt: "2025-02-02T14:00:00",
    shortDescription: "Исполнитель сдал предотчёт на проверку",
  },
  {
    id: "mt13",
    orderId: "sale2",
    orderTab: "kp",
    type: "publish_avito",
    typeLabel: "Опубликовать на Avito",
    status: "new",
    priority: "high",
    assetName: "Toyota Land Cruiser 200",
    serviceType: "sale",
    serviceLabel: "Продажа под ключ",
    dueLabel: "Сегодня",
    createdAt: "2025-02-02T16:00:00",
  },
  {
    id: "mt14",
    orderId: "sale2",
    orderTab: "kp",
    type: "publish_auto_ru",
    typeLabel: "Опубликовать на Auto.ru",
    status: "new",
    priority: "high",
    assetName: "Toyota Land Cruiser 200",
    serviceType: "sale",
    serviceLabel: "Продажа под ключ",
    dueLabel: "Сегодня",
    createdAt: "2025-02-02T16:00:00",
  },
  {
    id: "mt15",
    orderId: "sale2",
    orderTab: "kp",
    type: "publish_drom",
    typeLabel: "Опубликовать на Drom",
    status: "new",
    priority: "high",
    assetName: "Toyota Land Cruiser 200",
    serviceType: "sale",
    serviceLabel: "Продажа под ключ",
    dueLabel: "Сегодня",
    createdAt: "2025-02-02T16:00:00",
  },
  {
    id: "mt16",
    orderId: "insp1",
    orderTab: "report",
    type: "inspection_check_report",
    typeLabel: "Проверить отчёт инспекции",
    status: "in_progress",
    priority: "high",
    assetName: "Hyundai Porter",
    serviceType: "inspection",
    serviceLabel: "Проактивная инспекция",
    dueLabel: "24ч",
    createdAt: "2025-02-02T12:00:00",
    shortDescription: "Исполнитель сдал отчёт на проверку",
  },
];

export function getManagerTaskById(taskId: string): ManagerTask | undefined {
  return managerTasksMock.find((t) => t.id === taskId);
}

export function getManagerTasksByOrderId(orderId: string): ManagerTask[] {
  return managerTasksMock.filter((t) => t.orderId === orderId);
}

// ——— Обслуживание и ремонт (Prep) ———

export type PrepPackageId = "max_liquidity" | "optimal" | "as_is";

export interface PrepPackage {
  id: PrepPackageId;
  label: string;
  description: string;
  roePercent: number;
  exposureDaysReduction: number;
  opexAmount: number;
  recommended: boolean;
}

export const PREP_PACKAGES: PrepPackage[] = [
  {
    id: "max_liquidity",
    label: "Максимальная ликвидность",
    description: "Полный объём работ для быстрой продажи по лучшей цене.",
    roePercent: 55,
    exposureDaysReduction: 14,
    opexAmount: 180000,
    recommended: true,
  },
  {
    id: "optimal",
    label: "Оптимальная эффективность",
    description: "Баланс затрат и срока продажи.",
    roePercent: 28,
    exposureDaysReduction: 7,
    opexAmount: 95000,
    recommended: false,
  },
  {
    id: "as_is",
    label: "Продажа как есть",
    description: "Минимальная подготовка, продажа в текущем состоянии.",
    roePercent: 12,
    exposureDaysReduction: 0,
    opexAmount: 25000,
    recommended: false,
  },
];

export type PrepOrderStatus =
  | "access_pending"
  | "in_progress"
  | "on_review"
  | "completed"
  | "on_rework";

export interface PrepOrder {
  id: string;
  assetId: string;
  assetName: string;
  assetVin: string;
  address: string;
  packageId: PrepPackageId;
  packageLabel: string;
  status: PrepOrderStatus;
  statusLabel: string;
  executorId: string;
  executorName: string;
  executorPassportNote?: string;
  accessAgreed: boolean | null;
  accessPendingHours?: number;
  priority: "high" | "normal";
}

export interface PrepChecklistItem {
  id: string;
  prepOrderId: string;
  label: string;
  done: boolean;
  comment?: string;
  photos?: string[];
}

export const prepOrdersMock: PrepOrder[] = [
  {
    id: "prep1",
    assetId: "ord_audit_lcv",
    assetName: "Toyota Camry",
    assetVin: "JTDBT923001234567",
    address: "Москва, ул. Тверская, 1",
    packageId: "max_liquidity",
    packageLabel: "Максимальная ликвидность",
    status: "access_pending",
    statusLabel: "Ожидаем согласования доступа",
    executorId: "ex1",
    executorName: "Андрей Андреев",
    executorPassportNote: "Паспортные данные переданы заказчику",
    accessAgreed: null,
    accessPendingHours: 1,
    priority: "normal",
  },
  {
    id: "prep2",
    assetId: "ord2",
    assetName: "KamAZ 5490",
    assetVin: "X9K5490123456789",
    address: "Санкт-Петербург, Невский пр., 100",
    packageId: "optimal",
    packageLabel: "Оптимальная эффективность",
    status: "in_progress",
    statusLabel: "В работе",
    executorId: "ex1",
    executorName: "Андрей Андреев",
    accessAgreed: true,
    priority: "normal",
  },
  {
    id: "prep3",
    assetId: "ord_audit_2",
    assetName: "MAN TGX",
    assetVin: "WMA1234567890",
    address: "Самара, ул. Мичурина, 22",
    packageId: "max_liquidity",
    packageLabel: "Максимальная ликвидность",
    status: "in_progress",
    statusLabel: "В работе",
    executorId: "ex1",
    executorName: "Андрей Андреев",
    accessAgreed: true,
    priority: "normal",
  },
  {
    id: "prep4",
    assetId: "sale_daf",
    assetName: "DAF XF",
    assetVin: "XLRTE47XS0E123456",
    address: "Ростов-на-Дону, пр. Будённовский, 50",
    packageId: "as_is",
    packageLabel: "As is",
    status: "access_pending",
    statusLabel: "Ожидаем согласования доступа",
    executorId: "ex1",
    executorName: "Андрей Андреев",
    executorPassportNote: "Паспортные данные переданы",
    accessAgreed: null,
    accessPendingHours: 2,
    priority: "normal",
  },
];

export const prepChecklistMock: PrepChecklistItem[] = [
  { id: "pc1", prepOrderId: "prep1", label: "Полировка кузова (по аудиту)", done: false },
  { id: "pc2", prepOrderId: "prep1", label: "Замена масла ДВС", done: false },
  { id: "pc3", prepOrderId: "prep1", label: "Проверка тормозной системы", done: false },
  { id: "pc4", prepOrderId: "prep2", label: "Окраска левой двери кабины (по аудиту)", done: true },
  { id: "pc5", prepOrderId: "prep2", label: "Проверка ходовой", done: false },
  { id: "pc6", prepOrderId: "prep3", label: "Замена фильтров (по аудиту)", done: false },
  { id: "pc7", prepOrderId: "prep3", label: "Диагностика АКПП", done: false },
  { id: "pc8", prepOrderId: "prep4", label: "Полировка и химчистка", done: false },
];

export function getPrepOrderById(id: string): PrepOrder | undefined {
  return prepOrdersMock.find((o) => o.id === id);
}

export function getPrepChecklist(prepOrderId: string): PrepChecklistItem[] {
  return prepChecklistMock.filter((c) => c.prepOrderId === prepOrderId);
}

export function getAuditCompletedForAsset(assetId: string): boolean {
  const audit = getAuditState(assetId);
  return !!(audit?.block5?.sentToCustomer || audit?.order?.status === "completed");
}

// ——— Продажа под ключ (Sale) ———

export type SaleScenarioId = "max_liquidity" | "optimal" | "as_is";

export interface SaleScenario {
  id: SaleScenarioId;
  label: string;
  description: string;
  roePercent: number;
  exposureDaysReduction: number;
  opexAmount: number;
  recommended: boolean;
  targetPrice: number;
}

export const SALE_SCENARIOS: SaleScenario[] = [
  { id: "max_liquidity", label: "Максимальная ликвидность", description: "Полный объём работ для быстрой продажи по лучшей цене.", roePercent: 55, exposureDaysReduction: 14, opexAmount: 180000, recommended: true, targetPrice: 2650000 },
  { id: "optimal", label: "Оптимальная эффективность", description: "Баланс затрат и срока продажи.", roePercent: 28, exposureDaysReduction: 7, opexAmount: 95000, recommended: false, targetPrice: 2400000 },
  { id: "as_is", label: "Продажа как есть", description: "Минимальная подготовка, продажа в текущем состоянии.", roePercent: 12, exposureDaysReduction: 0, opexAmount: 25000, recommended: false, targetPrice: 2200000 },
];

export type SaleOptionType = "percent_only" | "fix_and_percent";

export type SaleOrderStatus = "awaiting_publication" | "in_sale" | "sold";

export interface SalePublicationPlatform {
  link1: string;
  link2?: string;
  views?: number;
  likes?: number;
  calls?: number;
  messages?: number;
  price?: number;
  adStatus?: string;
  updatedAt?: string;
  metricsAvailable?: boolean;
}

export interface SaleOrder {
  id: string;
  assetId: string;
  assetName: string;
  assetVin: string;
  address: string;
  targetPrice: number;
  scenarioId?: SaleScenarioId;
  fromPrep?: boolean;
  optionType: SaleOptionType;
  fixAmount?: number;
  percent?: number;
  tradeThreshold: number;
  minPrice: number;
  ptsUploaded: boolean;
  status: SaleOrderStatus;
  statusLabel: string;
  avito?: SalePublicationPlatform;
  autoRu?: SalePublicationPlatform;
  drom?: SalePublicationPlatform;
  finalPrice?: number;
  soldAt?: string;
}

export const saleOrdersMock: SaleOrder[] = [
  {
    id: "sale1",
    assetId: "ord_audit_lcv",
    assetName: "Toyota Camry",
    assetVin: "JTDBT923001234567",
    address: "Москва, ул. Тверская, 1",
    targetPrice: 2650000,
    scenarioId: "max_liquidity",
    fromPrep: false,
    optionType: "percent_only",
    percent: 5,
    tradeThreshold: 50000,
    minPrice: 2600000,
    ptsUploaded: true,
    status: "in_sale",
    statusLabel: "В продаже",
    avito: { link1: "https://avito.ru/...", views: 120, likes: 8, calls: 3, messages: 5, adStatus: "Активно", updatedAt: "2 ч назад", metricsAvailable: true },
    autoRu: { link1: "https://auto.ru/...", views: 85, adStatus: "Активно", updatedAt: "1 ч назад", metricsAvailable: false },
    drom: { link1: "" },
  },
  {
    id: "sale2",
    assetId: "ord4",
    assetName: "Toyota Land Cruiser 200",
    assetVin: "JTM34HH5768HBJK457",
    address: "Москва, Варшавское ш., 1",
    targetPrice: 4300000,
    fromPrep: true,
    optionType: "fix_and_percent",
    fixAmount: 50000,
    percent: 3,
    tradeThreshold: 100000,
    minPrice: 4200000,
    ptsUploaded: true,
    status: "awaiting_publication",
    statusLabel: "Ожидает публикации",
  },
];

export function getSaleOrderById(id: string): SaleOrder | undefined {
  return saleOrdersMock.find((o) => o.id === id);
}

export function getSaleOrderByAssetId(assetId: string): SaleOrder | undefined {
  return saleOrdersMock.find((o) => o.assetId === assetId);
}

// ——— Инспекция (Inspection) ———

export type InspectionAssetType = "passenger" | "lcv" | "truck" | "special" | "trailer";

export type InspectionOrderStatus = "new" | "access_pending" | "in_progress" | "on_review" | "completed" | "on_rework";

export interface InspectionOrder {
  id: string;
  assetType: InspectionAssetType;
  assetTypeLabel: string;
  vin: string;
  brandModel: string;
  contractNumber: string;
  address: string;
  contact: string;
  phone: string;
  comment?: string;
  costBase: number;
  costLogistics: number;
  costTotal: number;
  status: InspectionOrderStatus;
  statusLabel: string;
  executorId?: string;
  executorName?: string;
  accessAgreed?: boolean | null;
}

export interface InspectionBlock1 {
  vinPhoto?: string;
  overviewPhotos: { id: string; label: string; photo?: string }[];
  identificationComment?: string;
}

export interface InspectionBlock2 {
  assetType?: InspectionAssetType;
  hasDefects: boolean;
  defectsCount: number;
}

export interface InspectionBlock3 {
  startsOnOwn: boolean;
  odometerPhoto?: string;
  mileageValue?: number;
  underhoodPhoto?: string;
  hasLeaks: boolean;
  comment?: string;
}

export const inspectionOrdersMock: InspectionOrder[] = [
  {
    id: "insp1",
    assetType: "lcv",
    assetTypeLabel: "LCV",
    vin: "Z94CB41AAGR323020",
    brandModel: "Hyundai Porter",
    contractNumber: "Д-2025-001",
    address: "Москва, Тверской б-р, 26A",
    contact: "Иван Петров",
    phone: "+7 999 123-45-67",
    costBase: 8000,
    costLogistics: 2000,
    costTotal: 10000,
    status: "on_review",
    statusLabel: "На проверке менеджером",
    executorId: "ex2",
    executorName: "Петр Петров",
    accessAgreed: true,
  },
  {
    id: "insp2",
    assetType: "truck",
    assetTypeLabel: "Грузовой транспорт",
    vin: "WF0XXXTTX1234567",
    brandModel: "Mercedes Actros",
    contractNumber: "Д-2025-002",
    address: "Казань, ул. Баумана, 8",
    contact: "Сергей Козлов",
    phone: "+7 987 654-32-10",
    costBase: 8000,
    costLogistics: 2500,
    costTotal: 10500,
    status: "in_progress",
    statusLabel: "В работе",
    executorId: "ex1",
    executorName: "Андрей Андреев",
    accessAgreed: true,
  },
  {
    id: "insp3",
    assetType: "truck",
    assetTypeLabel: "Грузовой транспорт",
    vin: "YV1LS56A1X1234567",
    brandModel: "Volvo FH 16",
    contractNumber: "Д-2025-003",
    address: "Нижний Новгород, ул. Рождественская, 1",
    contact: "Алексей Волков",
    phone: "+7 912 345-67-89",
    costBase: 8000,
    costLogistics: 3000,
    costTotal: 11000,
    status: "access_pending",
    statusLabel: "Ожидаем согласования доступа",
    executorId: "ex1",
    executorName: "Андрей Андреев",
    accessAgreed: null,
  },
];

export function getInspectionOrderById(id: string): InspectionOrder | undefined {
  return inspectionOrdersMock.find((o) => o.id === id);
}

// ——— Админка: компании, KPI, воронка, тайминги, интеграции, журнал, тревоги ———

export type AdminCompanyStatus = "integrated" | "pending" | "in_progress";

export interface AdminCompany {
  id: string;
  name: string;
  inn?: string;
  status: AdminCompanyStatus;
  statusLabel: string;
  ordersCount: number;
  ordersByType: Record<string, number>;
  lastActivityAt: string;
  lastOrderCreatedAt: string;
  revenuePeriod: number;
  isCooling: boolean;
  isAtRisk: boolean;
  riskReasons: string[];
}

export interface AdminKpi {
  companiesTotal: number;
  companiesInPeriod: number;
  companiesCooling: number;
  companiesAtRisk: number;
  ordersNew: number;
  ordersInProgress: number;
  ordersOnReview: number;
  ordersOnRework: number;
  ordersSlaOverdue: number;
  revenuePeriod: number;
  payoutsPeriod: number;
  materialsPeriod: number;
  marginTarget: number;
}

export interface AdminServiceSlice {
  serviceType: string;
  serviceLabel: string;
  created: number;
  completed: number;
  inProgress: number;
  notCompleted: number;
  avgLeadTimeDays: number;
}

export interface AdminFunnelStage {
  stage: string;
  stageLabel: string;
  count: number;
  avgTimeHours: number;
  p90TimeHours: number;
  slaOverdueCount: number;
}

export interface AdminIntegration {
  id: string;
  name: string;
  status: "ok" | "issues" | "down";
  lastError?: string;
  errorsCountPeriod: number;
}

export interface AdminAuditLogEntry {
  id: string;
  at: string;
  action: string;
  objectType: "company" | "order" | "user" | "balance";
  objectId: string;
  objectLabel: string;
  who: string;
  comment?: string;
}

export interface AdminAlert {
  id: string;
  type: string;
  title: string;
  description: string;
  objectId?: string;
  objectType?: string;
  createdAt: string;
}

export const adminCompaniesMock: AdminCompany[] = [
  { id: "co1", name: "ООО Лизинг Альфа", inn: "7701234567", status: "integrated", statusLabel: "Интегрирована", ordersCount: 12, ordersByType: { inspection: 3, audit: 5, maintenance: 2, sale: 2 }, lastActivityAt: "2025-02-02T10:00:00", lastOrderCreatedAt: "2025-02-01T14:00:00", revenuePeriod: 450000, isCooling: false, isAtRisk: false, riskReasons: [] },
  { id: "co2", name: "АО ТрансЛогист", inn: "7702345678", status: "integrated", statusLabel: "Интегрирована", ordersCount: 8, ordersByType: { inspection: 2, audit: 4, maintenance: 1, sale: 1 }, lastActivityAt: "2025-01-28T09:00:00", lastOrderCreatedAt: "2025-01-25T11:00:00", revenuePeriod: 280000, isCooling: true, isAtRisk: false, riskReasons: ["нет активности 5 дней"] },
  { id: "co3", name: "ИП Петров", inn: "7703456789", status: "in_progress", statusLabel: "В процессе", ordersCount: 2, ordersByType: { audit: 1, inspection: 1 }, lastActivityAt: "2025-02-02T08:00:00", lastOrderCreatedAt: "2025-02-02T08:00:00", revenuePeriod: 35000, isCooling: false, isAtRisk: true, riskReasons: ["висит доступ/согласование", "незакрытые оплаты"] },
  { id: "co4", name: "ООО Флот Сервис", inn: "7704567890", status: "integrated", statusLabel: "Интегрирована", ordersCount: 25, ordersByType: { inspection: 8, audit: 10, maintenance: 4, sale: 3 }, lastActivityAt: "2025-02-02T12:00:00", lastOrderCreatedAt: "2025-02-02T11:00:00", revenuePeriod: 920000, isCooling: false, isAtRisk: false, riskReasons: [] },
];

export const adminKpiMock: AdminKpi = {
  companiesTotal: 48,
  companiesInPeriod: 12,
  companiesCooling: 5,
  companiesAtRisk: 3,
  ordersNew: 8,
  ordersInProgress: 20,
  ordersOnReview: 12,
  ordersOnRework: 4,
  ordersSlaOverdue: 5,
  revenuePeriod: 1850000,
  payoutsPeriod: 420000,
  materialsPeriod: 180000,
  marginTarget: 1250000,
};

export const adminServiceSliceMock: AdminServiceSlice[] = [
  { serviceType: "inspection", serviceLabel: "Инспекция", created: 15, completed: 10, inProgress: 3, notCompleted: 2, avgLeadTimeDays: 2.5 },
  { serviceType: "audit", serviceLabel: "Аудит", created: 12, completed: 7, inProgress: 4, notCompleted: 1, avgLeadTimeDays: 5 },
  { serviceType: "maintenance", serviceLabel: "Обслуживание и ремонт", created: 8, completed: 5, inProgress: 3, notCompleted: 0, avgLeadTimeDays: 7 },
  { serviceType: "sale", serviceLabel: "Продажа под ключ", created: 6, completed: 2, inProgress: 4, notCompleted: 0, avgLeadTimeDays: 14 },
];

export const adminFunnelMock: AdminFunnelStage[] = [
  { stage: "new", stageLabel: "Не взят/не назначен", count: 8, avgTimeHours: 18, p90TimeHours: 48, slaOverdueCount: 2 },
  { stage: "access_pending", stageLabel: "Согласование доступа", count: 4, avgTimeHours: 24, p90TimeHours: 72, slaOverdueCount: 1 },
  { stage: "in_progress", stageLabel: "Выезд/выполнение", count: 20, avgTimeHours: 72, p90TimeHours: 120, slaOverdueCount: 0 },
  { stage: "on_review", stageLabel: "На проверке менеджера", count: 12, avgTimeHours: 12, p90TimeHours: 24, slaOverdueCount: 3 },
  { stage: "on_rework", stageLabel: "На доработке", count: 4, avgTimeHours: 48, p90TimeHours: 96, slaOverdueCount: 1 },
  { stage: "completed", stageLabel: "Завершено/не состоялось", count: 0, avgTimeHours: 0, p90TimeHours: 0, slaOverdueCount: 0 },
];

export const adminIntegrationsMock: AdminIntegration[] = [
  { id: "dadata", name: "Dadata (подтягивание компании)", status: "ok", errorsCountPeriod: 0 },
  { id: "npd", name: "Проверка НПД", status: "ok", errorsCountPeriod: 0 },
  { id: "sbis", name: "СБИС", status: "issues", lastError: "Таймаут при запросе акта", errorsCountPeriod: 3 },
  { id: "avito", name: "Скрейпер Avito", status: "ok", errorsCountPeriod: 0 },
  { id: "auto_ru", name: "Скрейпер Auto.ru", status: "down", lastError: "Сервис недоступен", errorsCountPeriod: 12 },
  { id: "drom", name: "Скрейпер Drom", status: "ok", errorsCountPeriod: 1 },
];

export const adminAuditLogMock: AdminAuditLogEntry[] = [
  { id: "al1", at: "2025-02-02T14:30:00", action: "Изменение баланса", objectType: "balance", objectId: "co1", objectLabel: "ООО Лизинг Альфа", who: "admin@proactiv.ru", comment: "+50 000 ₽ — пополнение по договору" },
  { id: "al2", at: "2025-02-02T13:00:00", action: "Открыл как заказчик", objectType: "company", objectId: "co3", objectLabel: "ИП Петров", who: "admin@proactiv.ru" },
  { id: "al3", at: "2025-02-02T11:15:00", action: "Ручная корректировка", objectType: "balance", objectId: "co2", objectLabel: "АО ТрансЛогист", who: "admin@proactiv.ru", comment: "Корректировка −10 000 ₽ — возврат" },
];

export const adminAlertsMock: AdminAlert[] = [
  { id: "aa1", type: "order", title: "Заказ не взят > 3 ч", description: "ord_extra_5 — Toyota Land Cruiser 200", objectId: "ord_extra_5", objectType: "order", createdAt: "2025-02-02T11:00:00" },
  { id: "aa2", type: "access", title: "Доступ не согласован слишком долго", description: "ord_audit_special — Экскаватор CAT 320", objectId: "ord_audit_special", objectType: "order", createdAt: "2025-02-02T09:00:00" },
  { id: "aa3", type: "review", title: "Проверка менеджера висит", description: "ord3 — Hyundai Porter", objectId: "ord3", objectType: "order", createdAt: "2025-02-02T08:30:00" },
  { id: "aa4", type: "company", title: "Компании в риске", description: "ИП Петров, ООО Затухший Флот", objectType: "company", createdAt: "2025-02-02T08:00:00" },
];

export interface CompanyBalance {
  companyId: string;
  companyName: string;
  balance: number;
  reserved?: number;
  available?: number;
  lastChangedAt: string;
}

export const adminBalancesMock: CompanyBalance[] = [
  { companyId: "co1", companyName: "ООО Лизинг Альфа", balance: 250000, reserved: 50000, available: 200000, lastChangedAt: "2025-02-02T14:30:00" },
  { companyId: "co2", companyName: "АО ТрансЛогист", balance: 180000, lastChangedAt: "2025-02-02T11:15:00" },
  { companyId: "co3", companyName: "ИП Петров", balance: 35000, lastChangedAt: "2025-02-01T16:00:00" },
];

// ——— Бухгалтерия: дашборд, очереди «не закрыто», оплаты, выплаты, материалы ———

export interface AccountingKpi {
  confirmedIncoming: number;
  expectedIncoming: number;
  confirmedPayouts: number;
  payoutsInWork: number;
  ordersUnclosedDocs: number;
  ordersUnconfirmedPayment: number;
}

export interface AccountingNotClosedItem {
  id: string;
  category: "executor_invoice" | "executor_act" | "executor_payout" | "customer_invoice" | "customer_payment" | "customer_act" | "material_invoice" | "material_payment" | "material_warrant" | "sale_close";
  categoryLabel: string;
  companyName: string;
  orderId: string;
  orderType: string;
  whatUnclosed: string;
  responsible: string;
  daysPending: number;
}

export interface AccountingAuditEntry {
  id: string;
  at: string;
  action: string;
  objectType: string;
  objectId: string;
  who: string;
  comment?: string;
}

export const accountingKpiMock: AccountingKpi = {
  confirmedIncoming: 1250000,
  expectedIncoming: 380000,
  confirmedPayouts: 420000,
  payoutsInWork: 95000,
  ordersUnclosedDocs: 8,
  ordersUnconfirmedPayment: 5,
};

export const accountingNotClosedMock: AccountingNotClosedItem[] = [
  { id: "nc1", category: "executor_act", categoryLabel: "Нет акта (СБИС)", companyName: "ООО Лизинг Альфа", orderId: "ord2", orderType: "Аудит", whatUnclosed: "Акт от исполнителя не получен", responsible: "Андрей Андреев", daysPending: 3 },
  { id: "nc2", category: "customer_payment", categoryLabel: "Оплата не подтверждена", companyName: "АО ТрансЛогист", orderId: "ord3", orderType: "Обслуживание", whatUnclosed: "Ожидаем подтверждение оплаты", responsible: "Менеджер Сидорова", daysPending: 5 },
  { id: "nc3", category: "material_invoice", categoryLabel: "Нет счета поставщика", companyName: "ИП Петров", orderId: "prep2", orderType: "Обслуживание", whatUnclosed: "Счет на материалы не получен", responsible: "Менеджер Иванов", daysPending: 2 },
  { id: "nc4", category: "executor_invoice", categoryLabel: "Нет счета от исполнителя", companyName: "ООО Флот Сервис", orderId: "insp1", orderType: "Инспекция", whatUnclosed: "Счет (юрлицо/ИП) не получен", responsible: "Петр Петров", daysPending: 1 },
];

export const accountingAuditLogMock: AccountingAuditEntry[] = [
  { id: "ac1", at: "2025-02-02T15:00:00", action: "Подтвердил оплату", objectType: "order", objectId: "ord1", who: "accountant@proactiv.ru", comment: "Поступление 45 000 ₽" },
  { id: "ac2", at: "2025-02-02T14:45:00", action: "Изменил баланс компании", objectType: "company", objectId: "co1", who: "accountant@proactiv.ru", comment: "+50 000 — пополнение" },
  { id: "ac3", at: "2025-02-02T14:00:00", action: "Обработал заявку на вывод", objectType: "payout", objectId: "pr1", who: "accountant@proactiv.ru" },
];
