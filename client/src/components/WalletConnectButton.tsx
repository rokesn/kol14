import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Wallet, Check } from "lucide-react";
import { useState, useEffect } from "react";
import "@/types/wallet";

interface WalletConnectButtonProps {
  connected?: boolean;
  walletAddress?: string;
  connectedWalletType?: string;
  onConnect?: (walletAddress: string, walletType: string) => void;
  onDisconnect?: () => void;
  onError?: (error: string) => void;
}

// Dynamic wallet detection - only show actually available wallets
const getAvailableWallets = () => {
  const wallets = [];
  
  if (typeof window !== 'undefined') {
    if (window.solana?.isPhantom) {
      wallets.push({ name: "Phantom", icon: "👻", id: "phantom", adapter: window.solana });
    }
    if (window.solflare) {
      wallets.push({ name: "Solflare", icon: "☀️", id: "solflare", adapter: window.solflare });
    }
    if (window.backpack) {
      wallets.push({ name: "Backpack", icon: "🎒", id: "backpack", adapter: window.backpack });
    }
  }
  
  return wallets;
};

export default function WalletConnectButton({
  connected = false,
  walletAddress,
  connectedWalletType,
  onConnect,
  onDisconnect,
  onError,
}: WalletConnectButtonProps) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [availableWallets, setAvailableWallets] = useState(getAvailableWallets());
  
  // Refresh available wallets on component mount
  useEffect(() => {
    const checkWallets = () => setAvailableWallets(getAvailableWallets());
    checkWallets();
    // Check again after a brief delay in case wallets load asynchronously
    const timeout = setTimeout(checkWallets, 1000);
    return () => clearTimeout(timeout);
  }, []);

  const handleConnect = async (walletType: string) => {
    setIsConnecting(true);
    try {
      const wallet = availableWallets.find(w => w.id === walletType);
      if (!wallet) {
        throw new Error(`${walletType} wallet is not installed or available`);
      }
      
      // Connect to the wallet
      await wallet.adapter.connect();
      const walletAddress = wallet.adapter.publicKey?.toString();
      
      if (!walletAddress) {
        throw new Error('Failed to get wallet address after connection');
      }
      
      onConnect?.(walletAddress, walletType);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to connect wallet';
      onError?.(errorMessage);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      // Disconnect from the correct wallet based on connected type
      switch (connectedWalletType) {
        case 'phantom':
          if (window.solana?.disconnect) {
            await window.solana.disconnect();
          }
          break;
        case 'solflare':
          if (window.solflare?.disconnect) {
            await window.solflare.disconnect();
          }
          break;
        case 'backpack':
          if (window.backpack?.disconnect) {
            await window.backpack.disconnect();
          }
          break;
      }
      onDisconnect?.();
    } catch (error) {
      console.error(`Failed to disconnect from ${connectedWalletType} wallet:`, error);
      onDisconnect?.(); // Still disconnect from app state
    }
  };

  if (connected && walletAddress) {
    return (
      <Card className="crypto-card border-primary/30 crypto-glow">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 crypto-gradient rounded-lg crypto-glow">
                <Check className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-primary">Wallet Connected</p>
                <p className="text-xs text-muted-foreground font-mono bg-muted/50 px-2 py-1 rounded">
                  {walletAddress.slice(0, 8)}...{walletAddress.slice(-8)}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDisconnect}
              className="border-primary/30 hover:bg-primary/10"
              data-testid="button-disconnect-wallet"
            >
              Disconnect
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="crypto-card">
      <CardContent className="p-8">
        <div className="text-center mb-8">
          <div className="p-4 crypto-gradient rounded-full w-fit mx-auto mb-6 crypto-glow">
            <Wallet className="h-10 w-10 text-white" />
          </div>
          <h3 className="text-xl font-semibold mb-3 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Connect Your Wallet
          </h3>
          <p className="text-muted-foreground">
            Choose a wallet to connect to Solana and start creating tokens
          </p>
        </div>

        <div className="space-y-4">
          {availableWallets.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">
                No Solana wallets detected. Please install one of the following:
              </p>
              <div className="space-y-2 text-sm">
                <p>• <a href="https://phantom.app" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Phantom Wallet</a></p>
                <p>• <a href="https://solflare.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Solflare Wallet</a></p>
                <p>• <a href="https://backpack.app" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Backpack Wallet</a></p>
              </div>
            </div>
          ) : (
            availableWallets.map((wallet) => (
              <Button
                key={wallet.id}
                variant="outline"
                className="w-full justify-start gap-4 h-14 border-primary/20 hover:border-primary/40 hover:bg-primary/5 crypto-glow"
                onClick={() => handleConnect(wallet.id)}
                disabled={isConnecting}
                data-testid={`button-connect-${wallet.id}`}
              >
                <span className="text-2xl">{wallet.icon}</span>
                <span className="font-medium">{wallet.name}</span>
                {isConnecting && <span className="ml-auto text-xs text-primary">Connecting...</span>}
              </Button>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}