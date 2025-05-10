// app/page.tsx
'use client';
import {
  WalletMultiButton
} from '@solana/wallet-adapter-react-ui';
import { ClusterSwitcher } from './components/ClusterSwitcher';
import { SolBalance } from './components/SolBalance';
import { TokenTransferForm } from './components/TokenTransferForm';
import { SolTransferForm } from './components/SolTransferForm';


export default function HomePage() {

  return (
    <main style={{ maxWidth: 600, margin: 'auto', padding: 20 }}>
      <h1>Solana dApp</h1>
      <ClusterSwitcher />
      <WalletMultiButton />
      <SolBalance />

      <SolTransferForm/>
      <TokenTransferForm/>

    </main>
  );
}
