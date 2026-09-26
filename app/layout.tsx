import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'WebDominic - ডোমেইন ও ক্লাউড হোস্টিং প্ল্যাটফর্ম',
  description: 'WebDominic (webdominic.com) - ডোমেইন সার্চ, হোস্টিং, ক্লাউড VPS, বিকাশ পেমেন্ট গেটওয়ে, ইউজার ড্যাশবোর্ড এবং অ্যাডমিন বিলিং ম্যানেজমেন্ট।',
  openGraph: {
    title: 'WebDominic - ডোমেইন ও ক্লাউড হোস্টিং প্ল্যাটফর্ম',
    description: 'WebDominic (webdominic.com) - ডোমেইন সার্চ, হোস্টিং, ক্লাউড VPS, বিকাশ পেমেন্ট গেটওয়ে, ইউজার ড্যাশবোর্ড এবং অ্যাডমিন বিলিং ম্যানেজমেন্ট।',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WebDominic - ডোমেইন ও ক্লাউড হোস্টিং প্ল্যাটফর্ম',
    description: 'WebDominic (webdominic.com) - ডোমেইন সার্চ, হোস্টিং, ক্লাউড VPS, বিকাশ পেমেন্ট গেটওয়ে, ইউজার ড্যাশবোর্ড এবং অ্যাডমিন বিলিং ম্যানেজমেন্ট।',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
