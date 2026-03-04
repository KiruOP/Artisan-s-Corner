import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import Toast from './components/Toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Shop from './pages/Shop';
import Login from './pages/Login';
import Register from './pages/Register';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import SellerDashboard from './pages/Dashboard/SellerDashboard';
import VendorSetup from './pages/Dashboard/VendorSetup';
import VendorProducts from './pages/Dashboard/VendorProducts';
import VendorOrders from './pages/Dashboard/VendorOrders';
import AddProduct from './pages/Dashboard/AddProduct';
import ProtectedRoute from './components/ProtectedRoute';
import NotFound from './pages/NotFound';
import ServerError from './pages/ServerError';

function App() {
  return (
    <ToastProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-[var(--color-background-soft)] text-[var(--color-text-primary)] selection:bg-[var(--color-brand)]/30">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route
                path="/checkout"
                element={
                  <ProtectedRoute>
                    <Checkout />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/order-confirmation/:id"
                element={
                  <ProtectedRoute>
                    <OrderConfirmation />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/seller"
                element={
                  <ProtectedRoute roles={['vendor']}>
                    <SellerDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/setup"
                element={
                  <ProtectedRoute>
                    <VendorSetup />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/products"
                element={
                  <ProtectedRoute roles={['vendor']}>
                    <VendorProducts />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/orders"
                element={
                  <ProtectedRoute roles={['vendor']}>
                    <VendorOrders />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/products/new"
                element={
                  <ProtectedRoute roles={['vendor']}>
                    <AddProduct />
                  </ProtectedRoute>
                }
              />
              <Route path="/500" element={<ServerError />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
      <Toast />
    </ToastProvider>
  );
}

export default App;
