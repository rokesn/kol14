import TokenForm from '../TokenForm';
import { useState } from 'react';

export default function TokenFormExample() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (data: any) => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      console.log('Token creation completed:', data);
    }, 3000);
  };

  return (
    <TokenForm onSubmit={handleSubmit} isLoading={isLoading} />
  );
}// Updated 2025-09-25 11:29:46
