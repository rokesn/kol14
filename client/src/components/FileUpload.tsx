import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, X, Image } from "lucide-react";
import { useState, useCallback } from "react";

interface FileUploadProps {
  onFileSelect: (file: File | null) => void;
  acceptedTypes?: string[];
  maxSizeMB?: number;
}

export default function FileUpload({
  onFileSelect,
  acceptedTypes = ["image/png", "image/jpeg", "image/webp"],
  maxSizeMB = 5,
}: FileUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string>("");

  const handleFileSelect = useCallback((file: File) => {
    setError("");
    
    // Validate file type
    if (!acceptedTypes.includes(file.type)) {
      setError("Please select a valid image file (PNG, JPEG, or WebP)");
      return;
    }

    // Validate file size
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`File size must be less than ${maxSizeMB}MB`);
      return;
    }

    setSelectedFile(file);
    onFileSelect(file);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    console.log(`File selected: ${file.name}`);
  }, [acceptedTypes, maxSizeMB, onFileSelect]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  }, [handleFileSelect]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  }, [handleFileSelect]);

  const handleRemove = () => {
    setSelectedFile(null);
    setPreview(null);
    setError("");
    onFileSelect(null);
    console.log("File removed");
  };

  if (selectedFile && preview) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={preview}
                alt="Token logo preview"
                className="w-16 h-16 object-cover rounded-md border"
              />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">{selectedFile.name}</p>
              <p className="text-xs text-muted-foreground">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRemove}
              data-testid="button-remove-file"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive
              ? "border-primary bg-primary/5"
              : error
              ? "border-destructive bg-destructive/5"
              : "border-border hover:border-primary/50"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center gap-4">
            <div className={`p-3 rounded-full ${error ? "bg-destructive/10" : "bg-accent"}`}>
              {error ? (
                <X className="h-8 w-8 text-destructive" />
              ) : (
                <Image className="h-8 w-8 text-muted-foreground" />
              )}
            </div>
            
            <div>
              <h3 className="font-medium mb-1">
                {error ? "Upload Error" : "Upload Token Logo"}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                {error || "Drag and drop an image or click to browse"}
              </p>
              
              {!error && (
                <div className="space-y-2">
                  <Button variant="outline" size="sm" asChild data-testid="button-browse-files">
                    <label className="cursor-pointer">
                      <Upload className="h-4 w-4 mr-2" />
                      Browse Files
                      <input
                        type="file"
                        accept={acceptedTypes.join(",")}
                        onChange={handleInputChange}
                        className="hidden"
                      />
                    </label>
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    PNG, JPEG, WebP up to {maxSizeMB}MB
                  </p>
                </div>
              )}
              
              {error && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setError("")}
                  data-testid="button-try-again"
                >
                  Try Again
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}