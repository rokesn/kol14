import {
  Connection,
  PublicKey,
  Transaction,
  Keypair,
  clusterApiUrl,
  SystemProgram,
  LAMPORTS_PER_SOL,
  TransactionInstruction,
} from '@solana/web3.js';

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

// SPL Token Program ID
const TOKEN_PROGRAM_ID = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');
const ASSOCIATED_TOKEN_PROGRAM_ID = new PublicKey('ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL');

// Helper to create raw instructions without buffer dependencies
function createRawInstruction(
  programId: PublicKey,
  keys: Array<{ pubkey: PublicKey; isSigner: boolean; isWritable: boolean }>,
  data: Uint8Array
): TransactionInstruction {
  return new TransactionInstruction({
    keys,
    programId,
    data: Buffer.from(data),
  });
}

// Helper to convert number to little-endian bytes
function numberToLEBytes(num: number, bytes: number): Uint8Array {
  const arr = new Uint8Array(bytes);
  for (let i = 0; i < bytes; i++) {
    arr[i] = num & 0xff;
    num = num >> 8;
  }
  return arr;
}

// Helper to convert bigint to little-endian bytes
function bigintToLEBytes(num: bigint, bytes: number): Uint8Array {
  const arr = new Uint8Array(bytes);
  for (let i = 0; i < bytes; i++) {
    arr[i] = Number(num & BigInt(0xff));
    num = num >> BigInt(8);
  }
  return arr;
}

export async function createSolanaToken(
  tokenData: TokenCreationData,
  walletAddress: string,
  network: "devnet" | "mainnet",
  walletAdapter: any
): Promise<TokenResult> {
  try {
    console.log('Starting token creation with raw instructions...');
    
    // 1. Setup connection
    const endpoint = network === 'devnet' ? clusterApiUrl('devnet') : clusterApiUrl('mainnet-beta');
    const connection = new Connection(endpoint, 'confirmed');
    
    // 2. Validate wallet connection
    const payer = new PublicKey(walletAddress);
    
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
    
    // 5. Calculate Associated Token Address manually
    const seeds = [
      payer.toBytes(),
      TOKEN_PROGRAM_ID.toBytes(),
      mint.toBytes(),
    ];
    const [associatedTokenAddress] = await PublicKey.findProgramAddress(seeds, ASSOCIATED_TOKEN_PROGRAM_ID);
    console.log(`Associated token address: ${associatedTokenAddress.toString()}`);
    
    // 6. Calculate mint account rent
    const mintAccountSpace = 82; // Fixed size for mint account
    const mintRent = await connection.getMinimumBalanceForRentExemption(mintAccountSpace);
    console.log(`Mint rent: ${mintRent / LAMPORTS_PER_SOL} SOL`);
    
    // 7. Build the transaction with raw instructions
    const transaction = new Transaction();
    
    // Create mint account
    transaction.add(
      SystemProgram.createAccount({
        fromPubkey: payer,
        newAccountPubkey: mint,
        space: mintAccountSpace,
        lamports: mintRent,
        programId: TOKEN_PROGRAM_ID,
      })
    );
    
    // Initialize mint instruction (raw)
    const initMintData = new Uint8Array(67);
    initMintData[0] = 0; // InitializeMint instruction
    initMintData[1] = tokenData.decimals; // decimals
    // Mint authority (32 bytes)
    payer.toBytes().forEach((byte, index) => {
      initMintData[2 + index] = byte;
    });
    initMintData[34] = 1; // COption::Some for freeze authority
    // Freeze authority (32 bytes)
    payer.toBytes().forEach((byte, index) => {
      initMintData[35 + index] = byte;
    });
    
    transaction.add(createRawInstruction(
      TOKEN_PROGRAM_ID,
      [
        { pubkey: mint, isSigner: false, isWritable: true },
        { pubkey: new PublicKey('SysvarRent111111111111111111111111111111111'), isSigner: false, isWritable: false },
      ],
      initMintData
    ));
    
    // Create Associated Token Account instruction (raw)
    transaction.add(createRawInstruction(
      ASSOCIATED_TOKEN_PROGRAM_ID,
      [
        { pubkey: payer, isSigner: true, isWritable: true }, // payer
        { pubkey: associatedTokenAddress, isSigner: false, isWritable: true }, // associated token account
        { pubkey: payer, isSigner: false, isWritable: false }, // owner
        { pubkey: mint, isSigner: false, isWritable: false }, // mint
        { pubkey: SystemProgram.programId, isSigner: false, isWritable: false }, // system program
        { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false }, // token program
        { pubkey: new PublicKey('SysvarRent111111111111111111111111111111111'), isSigner: false, isWritable: false }, // rent sysvar
      ],
      new Uint8Array(0) // no data needed for create ATA
    ));
    
    // Mint tokens instruction (raw)
    const mintAmount = BigInt(tokenData.totalSupply) * BigInt(10 ** tokenData.decimals);
    const mintToData = new Uint8Array(9);
    mintToData[0] = 7; // MintTo instruction
    const amountBytes = bigintToLEBytes(mintAmount, 8);
    amountBytes.forEach((byte, index) => {
      mintToData[1 + index] = byte;
    });
    
    transaction.add(createRawInstruction(
      TOKEN_PROGRAM_ID,
      [
        { pubkey: mint, isSigner: false, isWritable: true }, // mint
        { pubkey: associatedTokenAddress, isSigner: false, isWritable: true }, // destination
        { pubkey: payer, isSigner: true, isWritable: false }, // mint authority
      ],
      mintToData
    ));
    
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
}