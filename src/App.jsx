import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import PackagesPage from './pages/PackagesPage';
import FlowerSelectionPage from './pages/FlowerSelectionPage';
import SubscriptionPage from './pages/SubscriptionPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import CartPage from './pages/CartPage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import ProtectedRoute from './components/ProtectedRoute';
import Header from './components/Header';
import Footer from './components/Footer';

// Admin pages
import AdminDashboard from './admin/Dashboard';
import AdminPackages from './admin/Packages';
import AdminOrders from './admin/Orders';
import AdminFlowers from './admin/Flowers';
import AdminCustomers from './admin/Customers';
import AdminReports from './admin/Reports';

// Staff pages
import StaffDashboard from './staff/Dashboard';
import StaffOrders from './staff/Orders';
import StaffDeliveries from './staff/Deliveries';
import StaffCustomers from './staff/Customers';
import StaffReports from './staff/Reports';

import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Admin routes - no Header/Footer */}
        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin/packages" element={
          <ProtectedRoute>
            <AdminPackages />
          </ProtectedRoute>
        } />
        <Route path="/admin/orders" element={
          <ProtectedRoute>
            <AdminOrders />
          </ProtectedRoute>
        } />
        <Route path="/admin/flowers" element={
          <ProtectedRoute>
            <AdminFlowers />
          </ProtectedRoute>
        } />
        <Route path="/admin/customers" element={
          <ProtectedRoute>
            <AdminCustomers />
          </ProtectedRoute>
        } />
        <Route path="/admin/reports" element={
          <ProtectedRoute>
            <AdminReports />
          </ProtectedRoute>
        } />

        {/* Staff routes - no Header/Footer */}
        <Route path="/staff" element={
          <ProtectedRoute>
            <StaffDashboard />
          </ProtectedRoute>
        } />
        <Route path="/staff/orders" element={
          <ProtectedRoute>
            <StaffOrders />
          </ProtectedRoute>
        } />
        <Route path="/staff/deliveries" element={
          <ProtectedRoute>
            <StaffDeliveries />
          </ProtectedRoute>
        } />
        <Route path="/staff/customers" element={
          <ProtectedRoute>
            <StaffCustomers />
          </ProtectedRoute>
        } />
        <Route path="/staff/reports" element={
          <ProtectedRoute>
            <StaffReports />
          </ProtectedRoute>
        } />

        {/* Public routes with Header/Footer */}
        <Route path="/" element={
          <>
            <Header />
            <HomePage />
            <Footer />
          </>
        } />
        <Route path="/packages" element={
          <>
            <Header />
            <PackagesPage />
            <Footer />
          </>
        } />
        <Route path="/flower-selection" element={
          <>
            <Header />
            <FlowerSelectionPage />
            <Footer />
          </>
        } />
        <Route path="/subscription" element={
          <>
            <Header />
            <SubscriptionPage />
            <Footer />
          </>
        } />
        <Route path="/login" element={
          <>
            <Header />
            <LoginPage />
            <Footer />
          </>
        } />
        <Route path="/register" element={
          <>
            <Header />
            <RegisterPage />
            <Footer />
          </>
        } />
        <Route path="/forgot-password" element={
          <>
            <Header />
            <ForgotPasswordPage />
            <Footer />
          </>
        } />
        <Route path="/cart" element={
          <>
            <Header />
            <ProtectedRoute>
              <CartPage />
            </ProtectedRoute>
            <Footer />
          </>
        } />
        <Route path="/payment-success" element={
          <>
            <Header />
            <ProtectedRoute>
              <PaymentSuccessPage />
            </ProtectedRoute>
            <Footer />
          </>
        } />
        <Route path="/about" element={
          <>
            <Header />
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
              <h1 className="text-4xl font-bold text-gray-800">About Us Page</h1>
            </div>
            <Footer />
          </>
        } />
        <Route path="/contact" element={
          <>
            <Header />
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
              <h1 className="text-4xl font-bold text-gray-800">Contact Page</h1>
            </div>
            <Footer />
          </>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
