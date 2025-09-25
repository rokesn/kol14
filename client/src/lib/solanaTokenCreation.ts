import {
  Connection,
  PublicKey,
  Transaction,
  Keypair,
  clusterApiUrl,
  SystemProgram,
  LAMPORTS_PER_SOL
} from '@solana/web3.js';
import {
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  createInitializeMintInstruction,
  createAssociatedTokenAccountInstruction,
  createMintToInstruction,
  getAssociatedTokenAddress,
  getMintLen
} from '@solana/spl-token';

export interface TokenCreationData {
  name: string;
  symbol: string;
  description?: string;
  image?: string;
  totalSupply: number;
  decimals: number;
  website?: string;
  twitter?: string;
  telegram?: string;
  discord?: string;
}

export interface TokenResult {
  mintAddress: string;
  tokenName: string;
  tokenSymbol: string;
  totalSupply: number;
  decimals: number;
  transactionSignature: string;
  explorerUrl: string;
  network: "devnet" | "mainnet";
}

export async function createSolanaToken(
  tokenData: TokenCreationData,
  walletAddress: string,
  network: "devnet" | "mainnet",
  walletAdapter: any
): Promise<TokenResult> {
  try {
    console.log('Starting token creation process...');
    
    // 1. Setup connection
    const endpoint = network === 'devnet' ? clusterApiUrl('devnet') : clusterApiUrl('mainnet-beta');
    const connection = new Connection(endpoint, 'confirmed');
    
    // 2. Validate wallet connection
    const payer = new PublicKey(walletAddress);
    
    // Verify wallet adapter publicKey matches the provided address
    if (!walletAdapter.publicKey) {
      throw new Error('Wallet not connected');
    }
    
    if (walletAdapter.publicKey.toBase58() !== walletAddress) {
      throw new Error('Wallet adapter address mismatch');
    }
    
    // 3. Check SOL balance
    const balance = await connection.getBalance(payer);
    console.log(`Wallet balance: ${balance / LAMPORTS_PER_SOL} SOL`);
    
    if (balance < 0.01 * LAMPORTS_PER_SOL) {
      if (network === 'devnet') {
        // Try to airdrop on devnet
        console.log('Requesting airdrop on devnet...');
        try {
          const airdropSignature = await connection.requestAirdrop(payer, LAMPORTS_PER_SOL);
          await connection.confirmTransaction(airdropSignature);
          console.log('Airdrop successful');
        } catch (airdropError) {
          console.warn('Airdrop failed:', airdropError);
          throw new Error('Insufficient SOL balance. Please fund your wallet with at least 0.01 SOL for transaction fees.');
        }
      } else {
        throw new Error('Insufficient SOL balance. Please fund your wallet with at least 0.01 SOL for transaction fees.');
      }
    }
    
    // 4. Generate mint keypair
    const mintKeypair = Keypair.generate();
    const mint = mintKeypair.publicKey;
    console.log(`Generated mint address: ${mint.toString()}`);
    
    // 5. Get associated token address
    const associatedTokenAddress = await getAssociatedTokenAddress(
      mint,
      payer
    );
    
    console.log(`Associated token address: ${associatedTokenAddress.toString()}`);
    
    // 6. Calculate mint account rent
    const mintRent = await connection.getMinimumBalanceForRentExemption(getMintLen([]));
    console.log(`Mint rent: ${mintRent / LAMPORTS_PER_SOL} SOL`);
    
    // 7. Build the transaction
    const transaction = new Transaction();
    
    // Create mint account
    transaction.add(
      SystemProgram.createAccount({
        fromPubkey: payer,
        newAccountPubkey: mint,
        space: getMintLen([]),
        lamports: mintRent,
        programId: TOKEN_PROGRAM_ID,
      })
    );
    
    // Initialize mint
    transaction.add(
      createInitializeMintInstruction(
        mint,
        tokenData.decimals,
        payer, // mint authority
        payer  // freeze authority
      )
    );
    
    // Create associated token account
    transaction.add(
      createAssociatedTokenAccountInstruction(
        payer, // payer
        associatedTokenAddress, // ata
        payer, // owner
        mint   // mint
      )
    );
    
    // Mint tokens to the associated token account
    const mintAmount = BigInt(tokenData.totalSupply) * BigInt(10 ** tokenData.decimals);
    transaction.add(
      createMintToInstruction(
        mint,
        associatedTokenAddress,
        payer, // mint authority
        mintAmount
      )
    );
    
    // 8. Set transaction properties
    const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = payer;
    
    // 9. Partially sign with mint keypair
    transaction.partialSign(mintKeypair);
    
    // 10. Request wallet to sign the transaction
    console.log('Requesting wallet signature...');
    const signedTransaction = await walletAdapter.signTransaction(transaction);
    
    // 11. Send and confirm transaction
    console.log('Sending transaction...');
    const signature = await connection.sendRawTransaction(signedTransaction.serialize());
    
    console.log(`Transaction sent: ${signature}`);
    console.log('Confirming transaction...');
    
    await connection.confirmTransaction({
      signature,
      blockhash,
      lastValidBlockHeight,
    });
    
    console.log('Transaction confirmed!');
    
    // 12. Build explorer URL
    const clusterParam = network === 'devnet' ? '?cluster=devnet' : '';
    const explorerUrl = `https://explorer.solana.com/address/${mint.toString()}${clusterParam}`;
    
    return {
      mintAddress: mint.toString(),
      tokenName: tokenData.name,
      tokenSymbol: tokenData.symbol,
      totalSupply: tokenData.totalSupply,
      decimals: tokenData.decimals,
      transactionSignature: signature,
      explorerUrl,
      network,
    };
    
  } catch (error) {
    console.error('Token creation error:', error);
    throw new Error(`Token creation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}// Updated 2025-09-25 11:29:46
