import NetworkSelector from '../NetworkSelector';
import { useState } from 'react';

export default function NetworkSelectorExample() {
  const [network, setNetwork] = useState<"devnet" | "mainnet">("devnet");

  return (
    <NetworkSelector
      selectedNetwork={network}
      onNetworkChange={setNetwork}
    />
  );
}