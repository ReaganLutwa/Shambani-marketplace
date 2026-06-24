import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { products as demoProducts } from '@/data/products';

export type OrderStatus = 'pending' | 'confirmed' | 'in_transit' | 'delivered' | 'cancelled' | 'disputed';
export type FarmerStatus = 'pending' | 'approved' | 'rejected';
export type ProductStatus = 'active' | 'flagged' | 'out_of_stock' | 'hidden';
export type PaymentStatus = 'pending' | 'released' | 'held' | 'disputed';
export type PaymentMethod = 'paypal' | 'airtel' | 'mtn' | 'bank';
export type WithdrawalStatus = 'pending' | 'approved' | 'rejected' | 'processed';

export interface AdminOrder {
  id: string;
  buyer: string;
  buyerPhone: string;
  farmer: string;
  farmerId: string;
  items: string;
  total: number;
  status: OrderStatus;
  date: string;
}

export interface AdminFarmer {
  id: string;
  name: string;
  farmName: string;
  email: string;
  phone: string;
  country: string;
  district: string;
  products: string[];
  status: FarmerStatus;
  joinedDate: string;
}

export interface AdminProduct {
  id: string;
  name: string;
  category: string;
  farmer: string;
  farmerId: string;
  price: number;
  unit: string;
  stock: number;
  status: ProductStatus;
  image: string;
  listedDate: string;
}

export interface Transaction {
  id: string;
  date: string;
  farmer: string;
  farmerId: string;
  buyer: string;
  amount: number;
  platformFee: number;
  netToFarmer: number;
  method: PaymentMethod;
  status: PaymentStatus;
}

export interface Withdrawal {
  id: string;
  farmer: string;
  farmerId: string;
  amount: number;
  method: PaymentMethod;
  status: WithdrawalStatus;
  requestedDate: string;
}

export interface PlatformSettings {
  platformFeePercent: number;
  paypalHandle: string;
  enabledPaymentMethods: PaymentMethod[];
  enabledCountries: string[];
  defaultLanguage: string;
  smsNotifications: boolean;
  emailNotifications: boolean;
  autoReleasePayments: boolean;
}

export interface ActivityItem {
  id: string;
  time: string;
  activity: string;
  user: string;
  status: 'pending' | 'confirmed' | 'completed' | 'review' | 'approved';
}

interface AdminState {
  orders: AdminOrder[];
  farmers: AdminFarmer[];
  products: AdminProduct[];
  transactions: Transaction[];
  withdrawals: Withdrawal[];
  activities: ActivityItem[];
  settings: PlatformSettings;

  // Stats computed
  getStats: () => {
    totalOrders: number;
    totalProducts: number;
    totalFarmers: number;
    totalRevenue: number;
    commissionEarned: number;
    pendingOrders: number;
    pendingProducts: number;
    pendingFarmers: number;
  };

  // Actions
  approveFarmer: (id: string) => void;
  rejectFarmer: (id: string) => void;
  updateOrderStatus: (id: string, status: OrderStatus) => void;
  updateProductStatus: (id: string, status: ProductStatus) => void;
  releasePayment: (id: string) => void;
  processWithdrawal: (id: string, action: 'approve' | 'reject') => void;
  updateSettings: (settings: Partial<PlatformSettings>) => void;
  addProduct: (product: AdminProduct) => void;
  deleteProduct: (id: string) => void;
}

const generateOrders = (): AdminOrder[] => [
  { id: '#4521', buyer: 'Mukasa David', buyerPhone: '+256701234567', farmer: 'Reagan Lutwama', farmerId: 'f1', items: '5 trays eggs', total: 57500, status: 'confirmed', date: '2026-01-15' },
  { id: '#4520', buyer: 'Nantume Grace', buyerPhone: '+256702345678', farmer: 'Nakamya Josephine', farmerId: 'f2', items: '20 heads cabbage', total: 40000, status: 'delivered', date: '2026-01-14' },
  { id: '#4519', buyer: 'Okello James', buyerPhone: '+256703456789', farmer: 'Acen Mary', farmerId: 'f3', items: '10 kg groundnuts', total: 80000, status: 'in_transit', date: '2026-01-14' },
  { id: '#4518', buyer: 'Kwagala Jane', buyerPhone: '+256704567890', farmer: 'Kato John', farmerId: 'f4', items: '3 bunches matooke', total: 45000, status: 'pending', date: '2026-01-15' },
  { id: '#4517', buyer: 'Ssempala Michael', buyerPhone: '+256705678901', farmer: 'Mutebi David', farmerId: 'f5', items: '8 pineapples', total: 40000, status: 'delivered', date: '2026-01-13' },
  { id: '#4516', buyer: 'Adong Rose', buyerPhone: '+256706789012', farmer: 'Ochieng Peter', farmerId: 'f6', items: '15 kg sweet potatoes', total: 22500, status: 'cancelled', date: '2026-01-12' },
  { id: '#4515', buyer: 'Nabirye Agnes', buyerPhone: '+256707890123', farmer: 'Mukasa Henry', farmerId: 'f7', items: '6 kg chili peppers', total: 21000, status: 'disputed', date: '2026-01-12' },
  { id: '#4514', buyer: 'Tumusiime Grace', buyerPhone: '+256708901234', farmer: 'Nantume Grace', farmerId: 'f8', items: '20 liters milk', total: 40000, status: 'confirmed', date: '2026-01-11' },
  { id: '#4513', buyer: 'Ojok Emmanuel', buyerPhone: '+256709012345', farmer: 'Namukwaya Sarah', farmerId: 'f9', items: '12 kg tomatoes', total: 42000, status: 'in_transit', date: '2026-01-11' },
  { id: '#4512', buyer: 'Auma Christine', buyerPhone: '+256710123456', farmer: 'Kizito Robert', farmerId: 'f10', items: '8 kg carrots', total: 20000, status: 'pending', date: '2026-01-10' },
];

const generateFarmers = (): AdminFarmer[] => [
  { id: 'f1', name: 'Reagan Lutwama', farmName: 'Lutwama Farms', email: 'reagan@lutwama.farm', phone: '+256701111111', country: 'Uganda', district: 'Kampala', products: ['Livestock', 'Dairy'], status: 'approved', joinedDate: '2025-01-15' },
  { id: 'f2', name: 'Nakamya Josephine', farmName: 'Josephine Gardens', email: 'josephine@farm.ug', phone: '+256702222222', country: 'Uganda', district: 'Kampala', products: ['Vegetables'], status: 'approved', joinedDate: '2024-12-10' },
  { id: 'f3', name: 'Acen Mary', farmName: 'Mary\'s Groundnut Farm', email: 'mary@farm.ug', phone: '+256703333333', country: 'Uganda', district: 'Gulu', products: ['Nuts & Seeds'], status: 'approved', joinedDate: '2024-11-20' },
  { id: 'f4', name: 'Kato John', farmName: 'John\'s Banana Plantation', email: 'john@farm.ug', phone: '+256704444444', country: 'Uganda', district: 'Mukono', products: ['Vegetables'], status: 'approved', joinedDate: '2024-10-05' },
  { id: 'f5', name: 'Mutebi David', farmName: 'David Fruits', email: 'david@farm.ug', phone: '+256705555555', country: 'Uganda', district: 'Masaka', products: ['Fruits'], status: 'approved', joinedDate: '2025-01-20' },
  { id: 'f6', name: 'Ochieng Peter', farmName: 'Peter\'s Roots Farm', email: 'peter@farm.ug', phone: '+256706666666', country: 'Uganda', district: 'Lira', products: ['Root Crops'], status: 'pending', joinedDate: '2026-01-15' },
  { id: 'f7', name: 'Mukasa Henry', farmName: 'Henry Spice Garden', email: 'henry@farm.ug', phone: '+256707777777', country: 'Uganda', district: 'Jinja', products: ['Spices'], status: 'approved', joinedDate: '2024-09-15' },
  { id: 'f8', name: 'Nantume Grace', farmName: 'Grace Dairy Farm', email: 'grace@farm.ug', phone: '+256708888888', country: 'Uganda', district: 'Jinja', products: ['Dairy'], status: 'approved', joinedDate: '2024-08-20' },
  { id: 'f9', name: 'Namukwaya Sarah', farmName: 'Sarah\'s Veggie Patch', email: 'sarah@farm.ug', phone: '+256709999999', country: 'Uganda', district: 'Wakiso', products: ['Vegetables'], status: 'pending', joinedDate: '2026-01-14' },
  { id: 'f10', name: 'Kizito Robert', farmName: 'Robert Farms', email: 'robert@farm.ug', phone: '+256710000000', country: 'Uganda', district: 'Wakiso', products: ['Root Crops'], status: 'approved', joinedDate: '2024-07-10' },
  { id: 'f11', name: 'Ouma George', farmName: 'Ouma Cereals', email: 'george@farm.ke', phone: '+254711111111', country: 'Kenya', district: 'Nakuru', products: ['Grains'], status: 'pending', joinedDate: '2026-01-15' },
  { id: 'f12', name: 'Wanjiku Esther', farmName: 'Esther\'s Farm', email: 'esther@farm.ke', phone: '+254722222222', country: 'Kenya', district: 'Kiambu', products: ['Vegetables', 'Fruits'], status: 'rejected', joinedDate: '2026-01-10' },
];

const generateProducts = (): AdminProduct[] =>
  demoProducts.map((p, i) => ({
    id: p.id,
    name: p.name,
    category: p.category,
    farmer: p.farmer,
    farmerId: `f${(i % 10) + 1}`,
    price: p.price,
    unit: p.unit,
    stock: p.stock,
    status: (p.stock === 0 ? 'out_of_stock' : i === 5 ? 'flagged' : 'active') as ProductStatus,
    image: p.image,
    listedDate: `2026-01-${String(10 + (i % 10)).padStart(2, '0')}`,
  }));

const generateTransactions = (): Transaction[] => [
  { id: 'TX-891', date: '2026-01-15', farmer: 'Reagan Lutwama', farmerId: 'f1', buyer: 'Mukasa David', amount: 57500, platformFee: 1438, netToFarmer: 56062, method: 'airtel', status: 'pending' },
  { id: 'TX-890', date: '2026-01-14', farmer: 'Nakamya Josephine', farmerId: 'f2', buyer: 'Nantume Grace', amount: 40000, platformFee: 1000, netToFarmer: 39000, method: 'mtn', status: 'released' },
  { id: 'TX-889', date: '2026-01-14', farmer: 'Acen Mary', farmerId: 'f3', buyer: 'Okello James', amount: 80000, platformFee: 2000, netToFarmer: 78000, method: 'airtel', status: 'pending' },
  { id: 'TX-888', date: '2026-01-13', farmer: 'Mutebi David', farmerId: 'f5', buyer: 'Ssempala Michael', amount: 40000, platformFee: 1000, netToFarmer: 39000, method: 'paypal', status: 'released' },
  { id: 'TX-887', date: '2026-01-12', farmer: 'Mukasa Henry', farmerId: 'f7', buyer: 'Nabirye Agnes', amount: 21000, platformFee: 525, netToFarmer: 20475, method: 'bank', status: 'held' },
  { id: 'TX-886', date: '2026-01-11', farmer: 'Nantume Grace', farmerId: 'f8', buyer: 'Tumusiime Grace', amount: 40000, platformFee: 1000, netToFarmer: 39000, method: 'mtn', status: 'released' },
];

const generateWithdrawals = (): Withdrawal[] => [
  { id: 'WD-101', farmer: 'Reagan Lutwama', farmerId: 'f1', amount: 150000, method: 'airtel', status: 'pending', requestedDate: '2026-01-15' },
  { id: 'WD-102', farmer: 'Nakamya Josephine', farmerId: 'f2', amount: 85000, method: 'mtn', status: 'pending', requestedDate: '2026-01-14' },
  { id: 'WD-103', farmer: 'Acen Mary', farmerId: 'f3', amount: 200000, method: 'airtel', status: 'processed', requestedDate: '2026-01-10' },
  { id: 'WD-104', farmer: 'Mutebi David', farmerId: 'f5', amount: 120000, method: 'paypal', status: 'pending', requestedDate: '2026-01-15' },
  { id: 'WD-105', farmer: 'Kato John', farmerId: 'f4', amount: 95000, method: 'bank', status: 'approved', requestedDate: '2026-01-13' },
];

const generateActivities = (): ActivityItem[] => [
  { id: 'a1', time: '2 min ago', activity: 'New farmer registration', user: 'Reagan Lutwama', status: 'pending' },
  { id: 'a2', time: '15 min ago', activity: 'Order placed', user: 'Mukasa David', status: 'confirmed' },
  { id: 'a3', time: '1 hr ago', activity: 'Payment released', user: 'Nakamya Josephine', status: 'completed' },
  { id: 'a4', time: '2 hrs ago', activity: 'Product flagged', user: 'System', status: 'review' },
  { id: 'a5', time: '3 hrs ago', activity: 'Farmer verified', user: 'Acen Mary', status: 'approved' },
  { id: 'a6', time: '4 hrs ago', activity: 'Order delivered', user: 'Nantume Grace', status: 'completed' },
  { id: 'a7', time: '5 hrs ago', activity: 'Withdrawal request', user: 'Mutebi David', status: 'pending' },
  { id: 'a8', time: '6 hrs ago', activity: 'New product listed', user: 'Kato John', status: 'confirmed' },
];

const defaultSettings: PlatformSettings = {
  platformFeePercent: 2.5,
  paypalHandle: '@LutwamaReagan',
  enabledPaymentMethods: ['paypal', 'airtel', 'mtn', 'bank'],
  enabledCountries: ['Uganda', 'Kenya', 'Tanzania', 'Rwanda'],
  defaultLanguage: 'en',
  smsNotifications: true,
  emailNotifications: true,
  autoReleasePayments: false,
};

export const useAdminStore = create<AdminState>()(
  persist(
    (set, get) => ({
      orders: generateOrders(),
      farmers: generateFarmers(),
      products: generateProducts(),
      transactions: generateTransactions(),
      withdrawals: generateWithdrawals(),
      activities: generateActivities(),
      settings: defaultSettings,

      getStats: () => {
        const state = get();
        const totalOrders = state.orders.length;
        const totalProducts = state.products.length;
        const totalFarmers = state.farmers.length;
        const totalRevenue = state.transactions
          .filter((t) => t.status === 'released')
          .reduce((sum, t) => sum + t.amount, 0);
        const commissionEarned = state.transactions
          .filter((t) => t.status === 'released')
          .reduce((sum, t) => sum + t.platformFee, 0);
        const pendingOrders = state.orders.filter((o) => o.status === 'pending').length;
        const pendingProducts = state.products.filter((p) => p.status === 'flagged').length;
        const pendingFarmers = state.farmers.filter((f) => f.status === 'pending').length;
        return { totalOrders, totalProducts, totalFarmers, totalRevenue, commissionEarned, pendingOrders, pendingProducts, pendingFarmers };
      },

      approveFarmer: (id) =>
        set((state) => ({
          farmers: state.farmers.map((f) =>
            f.id === id ? { ...f, status: 'approved' as FarmerStatus } : f
          ),
        })),

      rejectFarmer: (id) =>
        set((state) => ({
          farmers: state.farmers.map((f) =>
            f.id === id ? { ...f, status: 'rejected' as FarmerStatus } : f
          ),
        })),

      updateOrderStatus: (id, status) =>
        set((state) => ({
          orders: state.orders.map((o) =>
            o.id === id ? { ...o, status } : o
          ),
        })),

      updateProductStatus: (id, status) =>
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id ? { ...p, status } : p
          ),
        })),

      releasePayment: (id) =>
        set((state) => ({
          transactions: state.transactions.map((t) =>
            t.id === id ? { ...t, status: 'released' as PaymentStatus } : t
          ),
        })),

      processWithdrawal: (id, action) =>
        set((state) => ({
          withdrawals: state.withdrawals.map((w) =>
            w.id === id ? { ...w, status: (action === 'approve' ? 'approved' : 'rejected') as WithdrawalStatus } : w
          ),
        })),

      updateSettings: (newSettings) =>
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        })),

      addProduct: (product) =>
        set((state) => ({
          products: [product, ...state.products],
        })),

      deleteProduct: (id) =>
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
        })),
    }),
    { name: 'shambani-admin' }
  )
);
