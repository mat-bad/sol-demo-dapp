'use client';

import { useState, useEffect } from 'react';
import {
  Connection,
  PublicKey,
  Transaction,
  clusterApiUrl,
  LAMPORTS_PER_SOL,
  SystemProgram,
} from '@solana/web3.js';
import { useWalletContext } from '../wallet-context';
import {
  useWallet,
  useConnection
} from '@solana/wallet-adapter-react';
import {
  WalletMultiButton
} from '@solana/wallet-adapter-react-ui';
// import { ClusterSwitcher } from './components/ClusterSwitcher';
// import { SolBalance } from './components/SolBalance';
// import { TokenTransferForm } from './components/TokenTransferForm';



export const SolTransferForm = () => {
  const { connection } = useConnection();
  const { publicKey, signMessage, sendTransaction } = useWallet();
  

  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('0');
  const [txSig, setTxSig] = useState<string | null>(null);

  const [message, setMessage] = useState('');
  const [signed, setSigned] = useState<string | null>(null);

  const handleSign = async () => {
    if (!publicKey || !signMessage) return;
    const encoded = new TextEncoder().encode(message);
    const sig = await signMessage(encoded);
    setSigned(Buffer.from(sig).toString('hex'));
  };

  const handleSend = async () => {
    if (!publicKey || !sendTransaction) return;
    const toPubkey = new PublicKey(recipient);
    const lamports = Math.round(parseFloat(amount) * 1e9);
    const tx = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: publicKey,
        toPubkey,
        lamports
      })
    );
    const signature = await sendTransaction(tx, connection);
    await connection.confirmTransaction(signature, 'processed');
    setTxSig(signature);
  };


  return (
    <div style={{ marginTop: '2rem' }}>
<section style={{ marginTop: 40 }}>
        <h2>Sign a Message</h2>
        <textarea
          rows={3}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Message to sign"
          style={{ width: '100%' }}
        />
        <button onClick={handleSign} disabled={!publicKey || !signMessage}>
          Sign Message
        </button>
        {signed && (
          <pre style={{ wordBreak: 'break-all' }}>{signed}</pre>
        )}
      </section>

      <section style={{ marginTop: 40 }}>
        <h2>Send SOL</h2>
        <input
          type="text"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          placeholder="Recipient address"
          style={{ width: '100%', marginBottom: 8 }}
        />
        <input
          type="number"
          step="0.000000001"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount (SOL)"
          style={{ width: '100%', marginBottom: 8 }}
        />
        <button onClick={handleSend} disabled={!publicKey || !sendTransaction}>
          Send SOL
        </button>
        {txSig && (
          <p>
            Transaction Signature:{' '}
            <a
              href={`https://explorer.solana.com/tx/${txSig}?cluster=devnet`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {txSig}
            </a>
          </p>
        )}
      </section>
      </div>
      )

}