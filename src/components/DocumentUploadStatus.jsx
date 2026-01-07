import { useState } from "react";
import {
  FileText,
  CheckCircle2,
  AlertCircle,
  Upload,
  Play,
  X,
} from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "../lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";

export function DocumentUploadStatus({
  documents,
  projectName,
  isSidebarOpen,
  onUploadMore,
  onStartProcessing,
  deleteDocument,
  onAllFilesRemoved,
}) {
  const successCount =
    documents?.filter((doc) => doc.status === "success").length || 0;
  const failedCount =
    documents?.filter((doc) => doc.status === "error").length || 0;
  const hasSuccessfulUploads = successCount > 0;

  const [documentToRemove, setDocumentToRemove] = useState(null);

  const handleRemoveFile = (doc) => {
    setDocumentToRemove(doc);
  };

  const confirmRemove = () => {
    if (!documentToRemove) return;

    // Check if this is the last file
    const isLastFile = documents.length === 1;

    // Call the parent's delete handler with document ID
    deleteDocument?.(documentToRemove.id);

    setDocumentToRemove(null);

    // Call callback after removing the last file
    if (isLastFile) {
      onAllFilesRemoved?.();
    }
  };

  return (
    <>
      <div
        className={cn(
          "animate-fade-in flex flex-1 flex-col items-center justify-center p-8 transition-all duration-300",
          isSidebarOpen ? "ml-0" : "ml-0",
        )}
      >
        <div className="w-full max-w-2xl">
          <div className="mb-8 text-center">
            <h2 className="text-foreground mb-2 text-2xl font-semibold">
              Uploaded to {projectName}
            </h2>

            <p className="text-muted-foreground">
              {successCount} file{successCount !== 1 ? "s" : ""} uploaded
              successfully
              {failedCount > 0 && `, ${failedCount} failed`}
            </p>
          </div>

          <div className="bg-card border-border mb-6 rounded-xl border p-4">
            <div className="max-h-100 space-y-2 overflow-y-auto">
              {documents?.map((doc) => {
                const status = doc.status;

                return (
                  <div
                    key={doc.id}
                    className={cn(
                      "flex w-[99%] items-center gap-3 rounded-lg p-3 transition-all",
                      status === "error" &&
                        "bg-destructive/5 border-destructive/20 border",
                      status === "success" &&
                        "border border-green-500/20 bg-green-500/5",
                      !status && "bg-muted/50",
                    )}
                  >
                    <div className="shrink-0">
                      {status === "success" && (
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                      )}
                      {status === "error" && (
                        <AlertCircle className="text-destructive h-4 w-4" />
                      )}
                      {!status && (
                        <FileText className="text-muted-foreground h-4 w-4" />
                      )}
                    </div>

                    <span className="text-foreground flex-1 truncate text-sm">
                      {doc.filename}
                    </span>

                    {status === "success" && (
                      <span className="rounded-full border border-green-500/20 bg-green-500/10 px-2 py-0.5 text-xs text-green-600 dark:text-green-400">
                        Uploaded
                      </span>
                    )}
                    {status === "error" && (
                      <span className="bg-destructive/10 text-destructive border-destructive/20 rounded-full border px-2 py-0.5 text-xs">
                        Failed
                      </span>
                    )}

                    {doc.size && (
                      <span className="text-muted-foreground text-xs">
                        {(doc.size / 1024).toFixed(1)}KB
                      </span>
                    )}

                    <button
                      onClick={() => handleRemoveFile(doc)}
                      className="hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-smooth flex h-6 w-6 items-center justify-center rounded"
                      aria-label={`Remove ${doc.filename}`}
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-center gap-3">
            <Button variant="outline" onClick={onUploadMore}>
              <Upload className="h-4 w-4" />
              Upload More Files
            </Button>

            {hasSuccessfulUploads && (
              <Button
                onClick={onStartProcessing}
                className="bg-green-600 hover:bg-green-700"
              >
                <Play className="h-4 w-4" />
                Start Processing
              </Button>
            )}
          </div>
        </div>
      </div>

      <Dialog
        open={documentToRemove !== null}
        onOpenChange={(open) => !open && setDocumentToRemove(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove File</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove "{documentToRemove?.filename}"
              from the upload list?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDocumentToRemove(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmRemove}>
              Remove
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
