"use client";
import Navbar from '@/components/Navbar';
import NewAdvertisementBanner from '@/components/NewAdvertisementBanner';
import Footer from '@/components/Footer';
import { Toaster } from 'react-hot-toast';
import SmoothScrollProvider from '@/components/SmoothScrollProvider';
import { usePathname } from 'next/navigation';

export default function LayoutShell({ children }) {
  const pathname = usePathname();
  // Hide navbar on dashboard, login, register pages (student/teacher)
  const hideNav = [
    '/student-dashboard', '/teacher-dashboard',
    '/login', '/register', '/student-login', '/teacher-login',
    '/teacher/register', '/student/register',
    '/admin' // Hide navbar on admin pages but show banner
  ].some(path => pathname.startsWith(path));

  // Hide banner only on specific pages
  const hideBanner = [
    '/student-dashboard', '/teacher-dashboard',
    '/login', '/register', '/student-login', '/teacher-login',
    '/teacher/register', '/student/register'
  ].some(path => pathname.startsWith(path));

  return (
    <SmoothScrollProvider>
      {!hideBanner && <NewAdvertisementBanner />}
      {!hideNav && <Navbar />}
      <Toaster 
        position="top-right" 
        toastOptions={{ 
          style: { 
            zIndex: 99999,
            background: '#fff',
            color: '#333',
            borderRadius: '8px',
            padding: '12px 20px',
            fontSize: '14px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            border: '1px solid #e5e7eb'
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
          loading: {
            iconTheme: {
              primary: '#9747ff',
              secondary: '#fff',
            },
          },
        }} 
      />
      <main className="px-4 py-6 min-h-screen sm:px-10 main-content">
        {children}
      </main>
      {!hideNav && <Footer />}
    </SmoothScrollProvider>
  );
} 