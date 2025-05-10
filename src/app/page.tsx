// app/page.tsx
'use client';

import { useState } from 'react';
import { PublicKey, SystemProgram, Transaction } from '@solana/web3.js';
import {
  useWallet,
  useConnection
} from '@solana/wallet-adapter-react';
import {
  WalletMultiButton
} from '@solana/wallet-adapter-react-ui';
import { ClusterSwitcher } from './components/ClusterSwitcher';
import { SolBalance } from './components/SolBalance';
import { TokenTransferForm } from './components/TokenTransferForm';
import { SolTransferForm } from './components/SolTransferForm';


export default function HomePage() {
  const { connection } = useConnection();
  const { publicKey, signMessage, sendTransaction } = useWallet();

  const [message, setMessage] = useState('');
  const [signed, setSigned] = useState<string | null>(null);

  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('0');
  const [txSig, setTxSig] = useState<string | null>(null);

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
