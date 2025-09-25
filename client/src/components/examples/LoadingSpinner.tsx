import LoadingSpinner from '../LoadingSpinner';

export default function LoadingSpinnerExample() {
  return (
    <div className="space-y-4">
      <LoadingSpinner size="sm" text="Creating token..." />
      <LoadingSpinner size="default" text="Processing transaction..." />
      <LoadingSpinner size="lg" text="Uploading metadata..." />
    </div>
  );
}