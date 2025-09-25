// Wallet type declarations for TypeScript
export interface PhantomWallet {
  isPhantom: boolean;
  publicKey: { toString(): string } | null;
  connect(): Promise<void>;
  disconnect(): Promise<void>;
}

export interface SolflareWallet {
  publicKey: { toString(): string } | null;
  connect(): Promise<void>;
  disconnect(): Promise<void>;
}

export interface BackpackWallet {
  publicKey: { toString(): string } | null;
  connect(): Promise<void>;
  disconnect(): Promise<void>;
}

declare global {
  interface Window {
    solana?: PhantomWallet;
    solflare?: SolflareWallet;
    backpack?: BackpackWallet;
  }
}// Updated 2025-09-25 11:29:46
