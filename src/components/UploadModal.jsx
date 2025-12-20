import { useState, useRef } from "react";
import { X, Upload, FileText, Check, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "../lib/utils";

export function UploadModal({
  isOpen,
  onClose,
  onUploadComplete,
  createDocuments,
}) {
  const [files, setFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    if (e.target.files) {
      setFiles((prev) => [...prev, ...Array.from(e.target.files)]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files) {
      setFiles((prev) => [...prev, ...Array.from(e.dataTransfer.files)]);
    }
  };

  const handleUpload = async () => {
    if (files.length === 0) return;

    setIsUploading(true);
    await createDocuments(files);
    setIsUploading(false);
    setFiles([]);
    onUploadComplete();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="bg-foreground/20 absolute inset-0 backdrop-blur-sm"
        onClick={() => {
          setFiles([]);
          onClose();
        }}
      />
      <div className="bg-card shadow-soft border-border animate-scale-in relative mx-4 w-full max-w-lg rounded-2xl border">
        <div className="border-border flex items-center justify-between border-b p-6">
          <h3 className="text-foreground text-lg font-semibold">
            Upload Knowledge Base
          </h3>
          <button
            onClick={() => {
              setFiles([]);
              onClose();
            }}
            className="hover:bg-muted transition-smooth flex h-8 w-8 items-center justify-center rounded-lg"
          >
            <X className="text-muted-foreground h-4 w-4" />
          </button>
        </div>

        <div className="space-y-6 p-6">
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              "transition-smooth cursor-pointer rounded-xl border-2 border-dashed p-8 text-center",
              isDragOver
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50 hover:bg-muted/50",
            )}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.txt,.md,.doc,.docx"
              onChange={handleFileChange}
              className="hidden"
            />
            <div className="bg-accent mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl">
              <Upload className="text-accent-foreground h-6 w-6" />
            </div>
            <p className="text-foreground mb-1 text-sm font-medium">
              Click to browse or drag and drop
            </p>
            <p className="text-muted-foreground text-xs">
              PDF, TXT, MD, DOC, DOCX up to 50MB
            </p>
          </div>

          {files.length > 0 && (
            <div className="animate-fade-in space-y-2">
              <p className="text-foreground text-sm font-medium">
                Selected files ({files.length})
              </p>
              <div className="max-h-32 space-y-2 overflow-y-auto">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="bg-muted/50 flex w-[99%] items-center gap-3 rounded-lg p-3"
                  >
                    <FileText className="text-muted-foreground h-4 w-4 shrink-0" />
                    <span className="text-foreground flex-1 truncate text-sm">
                      {file.name}
                    </span>
                    <span className="text-muted-foreground text-xs">
                      {(file.size / 1024).toFixed(1)}KB
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setFiles((prev) => prev.filter((_, i) => i !== index));
                      }}
                      className="hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-smooth flex h-6 w-6 items-center justify-center rounded"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="border-border flex items-center justify-end gap-3 border-t p-6">
          <Button
            variant="ghost"
            onClick={() => {
              setFiles([]);
              onClose();
            }}
            disabled={isUploading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            disabled={files.length === 0 || isUploading}
          >
            {isUploading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Check className="h-4 w-4" />
                Upload Files
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
