import LayoutShell from '@/components/LayoutShell';
import '@/styles/fonts-config.css';
import '@/styles/common.css';
import '@/styles/common.scss';
import '@/styles/fonts.css';
import '@/styles/global.css';

export const metadata = {
  title: 'ShooraVerse',
  description: 'Welcome to ShooraVerse Registration Portal',
  icons: {
    icon: '/assets/favicon.ico',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link href="https://cdn.jsdelivr.net/npm/remixicon@4.5.0/fonts/remixicon.css" rel="stylesheet" />
        {/* Preload critical fonts */}
        <link rel="preload" href="/fonts/BeniRegular.ttf" as="font" type="font/ttf" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/BeniBold.ttf" as="font" type="font/ttf" crossOrigin="anonymous" />
        <link rel="preload" href="https://ik.imagekit.io/sheryians/Fonts/helvetica/HelveticaNowDisplay-Regular_5Mzhp8KlA8_CAVTbnsPOM.woff2?updatedAt=1714048137030" as="font" type="font/woff2" crossOrigin="anonymous" />
      </head>
      <body className="bg-gray-0 text-black dark:bg-[#111827] dark:text-white">
        <LayoutShell>
          {children}
        </LayoutShell>
      </body>
    </html>
  );
}
