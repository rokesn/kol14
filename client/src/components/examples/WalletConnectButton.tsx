import WalletConnectButton from '../WalletConnectButton';
import { useState } from 'react';

export default function WalletConnectButtonExample() {
  const [connected, setConnected] = useState(false);
  const [walletAddress] = useState('H8k9v2zJ3L4m1N6p9Q8r7S5t4U3w2X1y0Z9a8B7c6D5e');

  const handleConnect = (walletType: string) => {
    setConnected(true);
  };

  const handleDisconnect = () => {
    setConnected(false);
  };

  return (
    <WalletConnectButton
      connected={connected}
      walletAddress={connected ? walletAddress : undefined}
      onConnect={handleConnect}
      onDisconnect={handleDisconnect}
    />
  );
}