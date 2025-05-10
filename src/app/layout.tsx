// app/layout.tsx
import './globals.css';
import type { Metadata } from 'next';
import { ReactNode } from 'react';

import { WalletContextProvider } from './wallet-context';

export const metadata: Metadata = {
  title: 'Solana dApp',
  description: 'Connect wallet, sign messages, send tokens',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <WalletContextProvider>
          {children}
        </WalletContextProvider>
      </body>
    </html>
  );
}
