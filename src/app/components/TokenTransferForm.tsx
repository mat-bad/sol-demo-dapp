'use client';

import { useState, useEffect } from 'react';
import {
  Connection,
  PublicKey,
  Transaction,
  clusterApiUrl,
  LAMPORTS_PER_SOL,
} from '@solana/web3.js';
import {
  getAssociatedTokenAddress,
  getOrCreateAssociatedTokenAccount,
  getAccount,
  getMint,
  createTransferCheckedInstruction,
  TOKEN_PROGRAM_ID,
  getAssociatedTokenAddressSync,
} from '@solana/spl-token';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletContext } from '../wallet-context';

export const TokenTransferForm = () => {
  const { publicKey, signTransaction } = useWallet();
  const { network } = useWalletContext();
  const [connection, setConnection] = useState<Connection | null>(null);
  const [mintAddress, setMintAddress] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [balance, setBalance] = useState<number | null>(null);
  const [decimals, setDecimals] = useState<number | null>(null);
  const [status, setStatus] = useState('');

  useEffect(() => {
    const endpoint = clusterApiUrl(network);
    setConnection(new Connection(endpoint, 'confirmed'));
  }, [network]);

  useEffect(() => {
    const fetchBalance = async () => {
      if (!connection || !publicKey || !mintAddress) return;

      try {
        const mintPubkey = new PublicKey(mintAddress);
        const ata = getAssociatedTokenAddressSync(mintPubkey, publicKey);
        const account = await getAccount(connection, ata);
        const mintInfo = await getMint(connection, mintPubkey);
        setDecimals(mintInfo.decimals);
        const balance = Number(account.amount) / 10 ** mintInfo.decimals;
        setBalance(balance);
        setStatus('');
      } catch (error) {
        console.error('Error fetching balance:', error);
        setBalance(null);
        setDecimals(null);
        setStatus('Invalid token mint address or no associated token account found.');
      }
    };

    fetchBalance();
  }, [connection, publicKey, mintAddress]);

  const handleTransfer = async () => {
    if (!connection || !publicKey || !signTransaction) {
      setStatus('Wallet not connected.');
      return;
    }

    try {
      const mintPubkey = new PublicKey(mintAddress);
      const recipientPubkey = new PublicKey(recipientAddress);
      const senderATA = await getAssociatedTokenAddress(mintPubkey, publicKey);
      const recipientATA = await getAssociatedTokenAddress(mintPubkey, recipientPubkey);

      const mintInfo = await getMint(connection, mintPubkey);
      const transferAmount = Number(amount) * 10 ** mintInfo.decimals;

      const transaction = new Transaction().add(
        createTransferCheckedInstruction(
          senderATA,
          mintPubkey,
          recipientATA,
          publicKey,
          transferAmount,
          mintInfo.decimals
        )
      );

      const signed = await signTransaction(transaction);
      const signature = await connection.sendRawTransaction(signed.serialize());
      await connection.confirmTransaction(signature, 'confirmed');

      setStatus(`Transfer successful. Transaction signature: ${signature}`);
    } catch (error) {
      console.error('Transfer failed:', error);
      setStatus('Transfer failed. Please check the details and try again.');
    }
  };

  return (
    <div style={{ margin: '2rem' }}>
      <h2>Send SPL Token</h2>
      <div>
        <label>Token Mint Address:</label>
        <input
          type="text"
          value={mintAddress}
          onChange={(e) => setMintAddress(e.target.value)}
          style={{ width: '100%' }}
        />
      </div>
      {balance !== null && decimals !== null && (
        <p>
          Your Balance: {balance.toFixed(decimals)} tokens
        </p>
      )}
      <div>
        <label>Recipient Address:</label>
        <input
          type="text"
          value={recipientAddress}
          onChange={(e) => setRecipientAddress(e.target.value)}
          style={{ width: '100%' }}
        />
      </div>
      <div>
        <label>Amount to Send:</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          style={{ width: '100%' }}
        />
      </div>
      <button onClick={handleTransfer} style={{ marginTop: '1rem' }}>
        Send Token
      </button>
      {status && <p>{status}</p>}
    </div>
  );
};
