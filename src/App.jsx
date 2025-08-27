import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import PackagesPage from './pages/PackagesPage';
import FlowerSelectionPage from './pages/FlowerSelectionPage';
import SubscriptionPage from './pages/SubscriptionPage';
import MySubscriptionsPage from './pages/MySubscriptionsPage';
import SubscriptionDetailPage from './pages/SubscriptionDetailPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import ProtectedRoute from './components/ProtectedRoute';
import Header from './components/Header';
import Footer from './components/Footer';

// Admin pages
import AdminDashboard from './admin/Dashboard';
import AdminPackages from './admin/Packages';
import AddPackage from './admin/AddPackage';
import ViewDetailPackage from './admin/ViewDetailPackage';
import EditPackage from './admin/EditPackage';
import AdminOrders from './admin/Orders';
import AdminFlowers from './admin/Flowers';
import AdminCustomers from './admin/Customers';
import AdminReports from './admin/Reports';
import AddFlower from './admin/AddFlower';
import ViewFlower from './admin/ViewFlower';
import EditFlower from './admin/EditFlower';
import Bouquets from './admin/Bouquets';
import AddBouquet from './admin/AddBouquet';
import ViewBouquet from './admin/ViewBouquet';
import EditBouquet from './admin/EditBouquet';

// Staff pages
import StaffDashboard from './staff/Dashboard';
import StaffOrders from './staff/Orders';
import StaffDeliveries from './staff/Deliveries';
import StaffCustomers from './staff/Customers';
import StaffReports from './staff/Reports';

import './App.css';

function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true }}>
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
        <Route path="/admin/packages/add" element={
          <ProtectedRoute>
            <AddPackage />
          </ProtectedRoute>
        } />
        <Route path="/admin/packages/view/:id" element={
          <ProtectedRoute>
            <ViewDetailPackage />
          </ProtectedRoute>
        } />
        <Route path="/admin/packages/edit/:id" element={
          <ProtectedRoute>
            <EditPackage />
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
        <Route path="/admin/flowers/add" element={
          <ProtectedRoute>
            <AddFlower />
          </ProtectedRoute>
        } />
        <Route path="/admin/flowers/view/:id" element={
          <ProtectedRoute>
            <ViewFlower />
          </ProtectedRoute>
        } />
        <Route path="/admin/flowers/edit/:id" element={
          <ProtectedRoute>
            <EditFlower />
          </ProtectedRoute>
        } />
        <Route path="/admin/bouquets" element={
          <ProtectedRoute>
            <Bouquets />
          </ProtectedRoute>
        } />
        <Route path="/admin/bouquets/add" element={
          <ProtectedRoute>
            <AddBouquet />
          </ProtectedRoute>
        } />
        <Route path="/admin/bouquets/:id" element={
          <ProtectedRoute>
            <ViewBouquet />
          </ProtectedRoute>
        } />
        <Route path="/admin/bouquets/:id/edit" element={
          <ProtectedRoute>
            <EditBouquet />
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
        <Route path="/my-subscriptions" element={
          <>
            <Header />
            <ProtectedRoute>
              <MySubscriptionsPage />
            </ProtectedRoute>
            <Footer />
          </>
        } />
        <Route path="/subscription-detail/:id" element={
          <>
            <Header />
            <ProtectedRoute>
              <SubscriptionDetailPage />
            </ProtectedRoute>
            <Footer />
          </>
        } />
        <Route path="/profile" element={
          <>
            <Header />
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
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


        <Route path="/payment-success" element={
          <>
            <Header />
            <ProtectedRoute>
              <PaymentSuccessPage />
            </ProtectedRoute>
            <Footer />
          </>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
