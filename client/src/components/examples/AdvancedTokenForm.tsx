import AdvancedTokenForm from '../AdvancedTokenForm';
import { useState } from 'react';

export default function AdvancedTokenFormExample() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (data: any) => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      console.log('Advanced token creation completed:', data);
    }, 3000);
  };

  return (
    <AdvancedTokenForm onSubmit={handleSubmit} isLoading={isLoading} />
  );
}