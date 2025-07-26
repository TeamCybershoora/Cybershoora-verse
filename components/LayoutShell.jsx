"use client";
import Navbar from '@/components/Navbar';
import NewAdvertisementBanner from '@/components/NewAdvertisementBanner';
import Footer from '@/components/Footer';
import { Toaster } from 'react-hot-toast';
import SmoothScrollProvider from '@/components/SmoothScrollProvider';
import { usePathname } from 'next/navigation';

export default function LayoutShell({ children }) {
  const pathname = usePathname();
  // Hide on dashboard, login, register pages (student/teacher)
  const hideNav = [
    '/student-dashboard', '/teacher-dashboard',
    '/login', '/register', '/student-login', '/teacher-login',
    '/teacher/register', '/student/register',
    '/admin' // Hide on admin login page
  ].some(path => pathname.startsWith(path));

  return (
    <SmoothScrollProvider>
      {!hideNav && <NewAdvertisementBanner />}
      {!hideNav && <Navbar />}
      <Toaster position="top-right" toastOptions={{ style: { zIndex: 99999 } }} />
      <main className="px-4 py-6 min-h-screen sm:px-10 main-content">
        {children}
      </main>
      {!hideNav && <Footer />}
    </SmoothScrollProvider>
  );
} 