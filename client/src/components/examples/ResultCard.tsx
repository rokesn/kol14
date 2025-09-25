import ResultCard from '../ResultCard';

export default function ResultCardExample() {
  const mockResult = {
    mintAddress: 'H8k9v2zJ3L4m1N6p9Q8r7S5t4U3w2X1y0Z9a8B7c6D5e',
    tokenName: 'My Awesome Token',
    tokenSymbol: 'MAT',
    totalSupply: 1000000,
    decimals: 9,
    transactionSignature: 'A1b2C3d4E5f6G7h8I9j0K1l2M3n4O5p6Q7r8S9t0U1v2W3x4Y5z6',
    explorerUrl: 'https://solscan.io/token/H8k9v2zJ3L4m1N6p9Q8r7S5t4U3w2X1y0Z9a8B7c6D5e?cluster=devnet',
    network: 'devnet' as const,
  };

  const handleCreateAnother = () => {
    console.log('Creating another token...');
  };

  return (
    <ResultCard result={mockResult} onCreateAnother={handleCreateAnother} />
  );
}