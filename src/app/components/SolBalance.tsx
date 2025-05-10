'use client';

import { useEffect, useState } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';

export const SolBalance = () => {
  const { publicKey } = useWallet();
  const { connection } = useConnection();
  const [balance, setBalance] = useState<number | null>(null);

  useEffect(() => {
    const fetchBalance = async () => {
      if (publicKey) {
        try {
          const lamports = await connection.getBalance(publicKey);
          setBalance(lamports / 1e9); // Convert lamports to SOL
        } catch (error) {
          console.error('Error fetching balance:', error);
          setBalance(null);
        }
      }
    };

    fetchBalance();
  }, [publicKey, connection]);

  if (!publicKey) {
    return <p>Connect your wallet to view balance.</p>;
  }

  return (
    <p>
      Balance: {balance !== null ? `${balance.toFixed(4)} SOL` : 'Loading...'}
    </p>
  );
};
