import FileUpload from '../FileUpload';
import { useState } from 'react';

export default function FileUploadExample() {
  const [file, setFile] = useState<File | null>(null);

  const handleFileSelect = (selectedFile: File | null) => {
    setFile(selectedFile);
  };

  return (
    <FileUpload onFileSelect={handleFileSelect} />
  );
}// Updated 2025-09-25 11:29:46
