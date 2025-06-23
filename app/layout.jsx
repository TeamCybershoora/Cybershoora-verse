// app/layout.jsx
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Toaster } from 'react-hot-toast'; // ✅ Import this
<link rel="preload" as="fetch" href="/models/face_recognition/face_recognition_model-weights_manifest.json" crossorigin="anonymous" />


export const metadata = {
  title: 'ShooraVerse',
  description: 'Welcome to ShooraVerse Registration Portal',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-0 text-black dark:bg-[#111827] dark:text-white">
        <Navbar />
        <Toaster position="top-right" /> {/* ✅ Add this just below Navbar */}
        <main className="min-h-screen px-4 sm:px-10 py-6">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
