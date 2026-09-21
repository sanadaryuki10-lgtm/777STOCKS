import type {Metadata} from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '777STOCK — The only stock worth holding',
  description: '777STOCK is a memecoin trading on PancakeSwap v3 (BNB Smart Chain). Live price, burn tracker, contract address and how to buy.',
  openGraph: {
    title: '777STOCK — The only stock worth holding',
    description: '777STOCK is a memecoin trading on PancakeSwap v3 (BNB Smart Chain). Live price, burn tracker, contract address and how to buy.',
    type: 'website',
    images: ['/assets/banner.webp'],
  },
  twitter: {
    card: 'summary_large_image',
    title: '777STOCK — The only stock worth holding',
    description: '777STOCK is a memecoin trading on PancakeSwap v3 (BNB Smart Chain). Live price, burn tracker, contract address and how to buy.',
    images: ['/assets/banner.webp'],
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className="dark">
      <body suppressHydrationWarning className="bg-[#000000] text-[#f4eee2] antialiased selection:bg-[#eec76f] selection:text-[#1a1204]">
        {children}
      </body>
    </html>
  );
}
