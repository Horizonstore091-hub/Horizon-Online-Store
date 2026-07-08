import { Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import CookieConsent from './components/CookieConsent'
import Home from './pages/Home'
import Shop from './pages/Shop'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import About from './pages/About'
import Privacy from './pages/Privacy'
import Terms from './pages/Terms'
import FAQ from './pages/FAQ'
import Contact from './pages/Contact'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import Deposit from './pages/Deposit'
import OrderHistory from './pages/OrderHistory'
import WishlistPage from './pages/WishlistPage'
import Blog from './pages/Blog'
import BlogPost from './pages/BlogPost'
import PromoAds from './pages/PromoAds'
import AdPage from './pages/AdPage'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import CryptoPayment from './pages/CryptoPayment'
import GiftCardPayment from './pages/GiftCardPayment'
import CreditCardPayment from './pages/CreditCardPayment'
import OrderTracking from './pages/OrderTracking'

import ConfirmDeposit from './pages/ConfirmDeposit'
import AdminDashboard from './pages/AdminDashboard'
import AdminProducts from './pages/AdminProducts'
import AdminAddProduct from './pages/AdminAddProduct'
import AdminEditProduct from './pages/AdminEditProduct'
import AdminOrders from './pages/AdminOrders'
import AdminCoupons from './pages/AdminCoupons'
import AdminMessages from './pages/AdminMessages'
import AdminUsers from './pages/AdminUsers'
import AdminPayments from './pages/AdminPayments'
import AdminPages from './pages/AdminPages'
import AdminNotifications from './pages/AdminNotifications'
import AdminReviews from './pages/AdminReviews'
import AdminBlog from './pages/AdminBlog'
import AdminGiftCards from './pages/AdminGiftCards'
import AdminBrands from './pages/AdminBrands'
import AdminCategories from './pages/AdminCategories'
import AdminActivity from './pages/AdminActivity'
import AdminWalletAddresses from './pages/AdminWalletAddresses'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <ScrollToTop />
      <Routes>
        <Route path="/admin/*" element={
          <Routes>
            <Route path="/" element={<AdminDashboard />} />
            <Route path="/products" element={<AdminProducts />} />
            <Route path="/products/add" element={<AdminAddProduct />} />
            <Route path="/products/edit/:id" element={<AdminEditProduct />} />
            <Route path="/orders" element={<AdminOrders />} />
            <Route path="/coupons" element={<AdminCoupons />} />
            <Route path="/messages" element={<AdminMessages />} />
            <Route path="/users" element={<AdminUsers />} />
            <Route path="/payments" element={<AdminPayments />} />
            <Route path="/pages" element={<AdminPages />} />
            <Route path="/notifications" element={<AdminNotifications />} />
            <Route path="/reviews" element={<AdminReviews />} />
            <Route path="/blog" element={<AdminBlog />} />
            <Route path="/giftcards" element={<AdminGiftCards />} />
            <Route path="/brands" element={<AdminBrands />} />
            <Route path="/categories" element={<AdminCategories />} />
            <Route path="/activity" element={<AdminActivity />} />
            <Route path="/wallet-addresses" element={<AdminWalletAddresses />} />
          </Routes>
        } />
        <Route path="/promo-ads" element={<PromoAds />} />
        <Route path="/facebook-ads" element={<PromoAds />} />
        <Route path="/ads/:slug" element={<AdPage />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="*" element={
          <>
            <Navbar />
            <main className="flex-1 pt-24 md:pt-28">
              <CookieConsent />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/shop/:category" element={<Shop />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/about" element={<About />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:slug" element={<BlogPost />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/deposit" element={<Deposit />} />
                <Route path="/orders" element={<OrderHistory />} />
                <Route path="/wishlist" element={<WishlistPage />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/track-order" element={<OrderTracking />} />
                <Route path="/crypto-payment/:orderId" element={<CryptoPayment />} />
                <Route path="/gift-card-payment/:orderId" element={<GiftCardPayment />} />
                <Route path="/credit-card-payment/:orderId" element={<CreditCardPayment />} />

                <Route path="/confirm-deposit/:orderId" element={<ConfirmDeposit />} />
              </Routes>
            </main>
            <Footer />
          </>
        } />
      </Routes>
    </div>
  )
}
