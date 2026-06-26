import { HashRouter, Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import Layout from '@/components/Layout';

// Lazy load pages for code splitting
const Home = lazy(() => import('@/pages/Home'));
const Browse = lazy(() => import('@/pages/Browse'));
const ProductDetail = lazy(() => import('@/pages/ProductDetail'));
const FarmerRegister = lazy(() => import('@/pages/FarmerRegister'));
const Ussd = lazy(() => import('@/pages/Ussd'));
const Cart = lazy(() => import('@/pages/Cart'));
const About = lazy(() => import('@/pages/About'));
const PrintDrop = lazy(() => import('@/pages/PrintDrop'));
const AdminDashboard = lazy(() => import('@/pages/AdminDashboard'));

function PageLoader() {
  return (
    <div className="min-h-[60dvh] flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-leaf border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

export default function App() {
  return (
    <HashRouter>
      <Layout>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/browse" element={<Browse />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/farmer-register" element={<FarmerRegister />} />
            <Route path="/ussd" element={<Ussd />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/about" element={<About />} />
            <Route path="/print" element={<PrintDrop />} />
            <Route path="/admin/*" element={<AdminDashboard />} />
          </Routes>
        </Suspense>
      </Layout>
    </HashRouter>
  );
}
