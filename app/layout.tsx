import '@/app/ui/global.css';
import type { Metadata } from 'next';
import { beVietnam } from '@/app/ui/fonts';
import { SITE_NAME, SITE_URL } from '@/app/lib/site';
import Providers from '@/app/ui/providers';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    template: `%s | ${SITE_NAME}`,
    default: `${SITE_NAME} - Cổng deadline của lớp`,
  },
  description:
    'Theo dõi deadline các môn học của lớp: xem công khai, đăng nhập để đánh dấu hoàn thành.',
  openGraph: { siteName: SITE_NAME, locale: 'vi_VN', type: 'website' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body className={`${beVietnam.className} bg-gray-50 text-gray-900 antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
