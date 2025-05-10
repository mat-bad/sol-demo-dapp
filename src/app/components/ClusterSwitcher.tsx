'use client';

import { useWalletContext } from '../wallet-context';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';

export const ClusterSwitcher = () => {
  const { network, setNetwork } = useWalletContext();

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedNetwork = event.target.value as WalletAdapterNetwork;
    setNetwork(selectedNetwork);
  };

  return (
    <div style={{ marginBottom: '1rem' }}>
      <label htmlFor="cluster-select">Select Cluster: </label>
      <select id="cluster-select" value={network} onChange={handleChange}>
        <option value={WalletAdapterNetwork.Devnet}>Devnet</option>
        <option value={WalletAdapterNetwork.Mainnet}>Mainnet</option>
      </select>
    </div>
  );
};
