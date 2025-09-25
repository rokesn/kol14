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
}