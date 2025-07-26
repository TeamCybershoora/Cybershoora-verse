import LayoutShell from '@/components/LayoutShell';
import '@/styles/common.css';
import '@/styles/common.scss';

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
      </head>
      <body className="bg-gray-0 text-black dark:bg-[#111827] dark:text-white">
        <LayoutShell>
          {children}
        </LayoutShell>
      </body>
    </html>
  );
}
