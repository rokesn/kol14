// Wallet detection and connection utilities

export interface WalletInfo {
  id: string;
  name: string;
  adapter: any;
}

export function getAvailableWallets(): WalletInfo[] {
  const wallets: WalletInfo[] = [];
  
  if (window.solana?.isPhantom) {
    wallets.push({
      id: 'phantom',
      name: 'Phantom',
      adapter: window.solana
    });
  }
  
  if (window.solflare) {
    wallets.push({
      id: 'solflare', 
      name: 'Solflare',
      adapter: window.solflare
    });
  }
  
  if (window.backpack) {
    wallets.push({
      id: 'backpack',
      name: 'Backpack', 
      adapter: window.backpack
    });
  }
  
  return wallets;
}

export async function autoConnectWallet(): Promise<{ address: string; type: string } | null> {
  const wallets = getAvailableWallets();
  
  if (wallets.length === 0) {
    throw new Error('No Solana wallet detected. Please install Phantom, Solflare, or Backpack wallet.');
  }
  
  // Get preferred wallet from storage or use priority order
  const preferred = localStorage.getItem('preferredWallet');
  const priority = ['phantom', 'solflare', 'backpack'];
  
  let choiceId = preferred && wallets.some(w => w.id === preferred) 
    ? preferred 
    : priority.find(p => wallets.some(w => w.id === p)) || wallets[0].id;
  
  const selectedWallet = wallets.find(w => w.id === choiceId);
  
  if (!selectedWallet) {
    throw new Error('Selected wallet not found');
  }
  
  try {
    // For Phantom, try to reconnect silently if previously trusted
    if (choiceId === 'phantom' && selectedWallet.adapter.connect) {
      try {
        await selectedWallet.adapter.connect({ onlyIfTrusted: true });
      } catch {
        // Silent fail - will try regular connect below
      }
    }
    
    // If not already connected, trigger connection (will show wallet popup)
    if (!selectedWallet.adapter.publicKey) {
      await selectedWallet.adapter.connect();
    }
    
    const address = selectedWallet.adapter.publicKey?.toString();
    if (!address) {
      throw new Error('No public key received from wallet');
    }
    
    // Save successful wallet choice for future use
    localStorage.setItem('preferredWallet', choiceId);
    
    return {
      address,
      type: choiceId
    };
    
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to connect to ${selectedWallet.name}: ${error.message}`);
    }
    throw new Error(`Failed to connect to ${selectedWallet.name} wallet`);
  }
}// Updated 2025-09-25 11:29:46
