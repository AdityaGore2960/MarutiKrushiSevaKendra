import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { UserProvider } from './context/UserContext';
import { CartProvider } from './context/CartContext';
import { LanguageProvider } from './context/LanguageContext';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './components/AdminLayout';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Scroll to top helper component
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

// Public Pages
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import About from './pages/About';
import Contact from './pages/Contact';
import PrivacyPolicy from './pages/PrivacyPolicy';
import ReturnRefundPolicy from './pages/ReturnRefundPolicy';
import ShippingPolicy from './pages/ShippingPolicy';
import TermsConditions from './pages/TermsConditions';
import CategoryPage from './pages/CategoryPage';
import VegetableSeeds from './pages/VegetableSeeds';
import CropProtection from './pages/CropProtection';
import FlowerSeeds from './pages/FlowerSeeds';
import CropNutrition from './pages/CropNutrition';
import Insecticides from './pages/Insecticides';
import Fungicides from './pages/Fungicides';
import Herbicides from './pages/Herbicides';
import BioInsecticides from './pages/BioInsecticides';
import FarmingTools from './pages/FarmingTools';
import Plants from './pages/Plants';
import Profile from './pages/Profile';
import Orders from './pages/Orders';
import Addresses from './pages/Addresses';
import Checkout from './pages/Checkout';
import Payment from './pages/Payment';

// Admin Pages
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import AdminProducts from './pages/admin/Products';
import AddProduct from './pages/admin/AddProduct';
import EditProduct from './pages/admin/EditProduct';
import Categories from './pages/admin/Categories';
import AdminOrders from './pages/admin/Orders';
import OrderDetails from './pages/admin/OrderDetails';
import AdminUsers from './pages/admin/Users';
import UserDetails from './pages/admin/UserDetails';
import AdminMessages from './pages/admin/Messages';
import AdminInventory from './pages/admin/Inventory';
import AdminBrands from './pages/admin/Brands';
import AdminReviews from './pages/admin/Reviews';
import AdminCoupons from './pages/admin/Coupons';
import AdminReports from './pages/admin/Reports';
import AdminSettings from './pages/admin/Settings';
import AdminNotifications from './pages/admin/Notifications';

const PublicLayout = ({ children }) => (
  <>
    <Navbar />
    <main>{children}</main>
    <Footer />
  </>
);

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <LanguageProvider>
        <AuthProvider>
          <UserProvider>
            <CartProvider>
            <Routes>
              {/* Public Routes */}
              <Route
                path="/"
                element={
                  <PublicLayout>
                    <Home />
                  </PublicLayout>
                }
              />
              <Route
                path="/products"
                element={
                  <PublicLayout>
                    <Products />
                  </PublicLayout>
                }
              />
              <Route
                path="/products/:id"
                element={
                  <PublicLayout>
                    <ProductDetails />
                  </PublicLayout>
                }
              />
              <Route
                path="/category/:slug"
                element={
                  <PublicLayout>
                    <CategoryPage />
                  </PublicLayout>
                }
              />
              <Route
                path="/vegetable-seeds"
                element={
                  <PublicLayout>
                    <VegetableSeeds />
                  </PublicLayout>
                }
              />
              <Route
                path="/crop-protection"
                element={
                  <PublicLayout>
                    <CropProtection />
                  </PublicLayout>
                }
              />
              <Route
                path="/flower-seeds"
                element={
                  <PublicLayout>
                    <FlowerSeeds />
                  </PublicLayout>
                }
              />
              <Route
                path="/crop-nutrition"
                element={
                  <PublicLayout>
                    <CropNutrition />
                  </PublicLayout>
                }
              />
              <Route
                path="/insecticides"
                element={
                  <PublicLayout>
                    <Insecticides />
                  </PublicLayout>
                }
              />
              <Route
                path="/fungicides"
                element={
                  <PublicLayout>
                    <Fungicides />
                  </PublicLayout>
                }
              />
              <Route
                path="/herbicides"
                element={
                  <PublicLayout>
                    <Herbicides />
                  </PublicLayout>
                }
              />
              <Route
                path="/bio-insecticides"
                element={
                  <PublicLayout>
                    <BioInsecticides />
                  </PublicLayout>
                }
              />
              <Route
                path="/farming-tools"
                element={
                  <PublicLayout>
                    <FarmingTools />
                  </PublicLayout>
                }
              />
              <Route
                path="/plants"
                element={
                  <PublicLayout>
                    <Plants />
                  </PublicLayout>
                }
              />
              <Route
                path="/about"
                element={
                  <PublicLayout>
                    <About />
                  </PublicLayout>
                }
              />
              <Route
                path="/contact"
                element={
                  <PublicLayout>
                    <Contact />
                  </PublicLayout>
                }
              />
              <Route
                path="/privacy"
                element={
                  <PublicLayout>
                    <PrivacyPolicy />
                  </PublicLayout>
                }
              />
              <Route
                path="/returns"
                element={
                  <PublicLayout>
                    <ReturnRefundPolicy />
                  </PublicLayout>
                }
              />
              <Route
                path="/shipping"
                element={
                  <PublicLayout>
                    <ShippingPolicy />
                  </PublicLayout>
                }
              />
              <Route
                path="/terms"
                element={
                  <PublicLayout>
                    <TermsConditions />
                  </PublicLayout>
                }
              />
              <Route
                path="/checkout"
                element={
                  <PublicLayout>
                    <Checkout />
                  </PublicLayout>
                }
              />
              <Route
                path="/payment"
                element={
                  <PublicLayout>
                    <Payment />
                  </PublicLayout>
                }
              />
              
              {/* Admin Login */}
              <Route path="/admin/login" element={<Login />} />

              {/* Protected Admin Routes */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="products" element={<AdminProducts />} />
                <Route path="products/add" element={<AddProduct />} />
                <Route path="products/edit/:id" element={<EditProduct />} />
                <Route path="categories" element={<Categories />} />
                <Route path="orders" element={<AdminOrders />} />
                <Route path="orders/:id" element={<OrderDetails />} />
                <Route path="customers" element={<AdminUsers />} />
                <Route path="customers/:id" element={<UserDetails />} />
                <Route path="messages" element={<AdminMessages />} />
                <Route path="inventory" element={<AdminInventory />} />
                <Route path="brands" element={<AdminBrands />} />
                <Route path="reviews" element={<AdminReviews />} />
                <Route path="coupons" element={<AdminCoupons />} />
                <Route path="reports" element={<AdminReports />} />
                <Route path="settings" element={<AdminSettings />} />
                <Route path="notifications" element={<AdminNotifications />} />
              </Route>


              <Route
                path="/profile"
                element={
                  <PublicLayout>
                    <Profile />
                  </PublicLayout>
                }
              />
              <Route
                path="/orders"
                element={
                  <PublicLayout>
                    <Orders />
                  </PublicLayout>
                }
              />
              <Route
                path="/addresses"
                element={
                  <PublicLayout>
                    <Addresses />
                  </PublicLayout>
                }
              />

              {/* Catch all */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            </CartProvider>
          </UserProvider>
        </AuthProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
}

export default App;
