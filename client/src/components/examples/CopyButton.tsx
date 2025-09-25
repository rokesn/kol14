import CopyButton from '../CopyButton';

export default function CopyButtonExample() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <span className="font-mono text-sm">H8k9v2zJ3L4m1N6p9Q8r7S5t4U3w2X1y0Z9a8B7c6D5e</span>
        <CopyButton text="H8k9v2zJ3L4m1N6p9Q8r7S5t4U3w2X1y0Z9a8B7c6D5e" />
      </div>
      <CopyButton text="Sample text to copy" showText={true} />
    </div>
  );
}