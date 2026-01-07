import { Check, Loader2, Circle } from "lucide-react";
import { cn } from "../lib/utils";

const steps = [
  { id: "chunking", label: "Chunking documents" },
  { id: "embedding", label: "Embedding documents" },
  { id: "storing", label: "Storing in vector DB" },
];

export function ProcessingTimeline({
  projectName,
  isSidebarOpen = true,
  task, // Pass task from useTask hook
}) {
  // Helper to get step status
  const getStepStatus = (stepId) => {
    if (!task || task.status === "PENDING") {
      return {
        isCompleted: false,
        isActive: false,
        isPending: true,
        progress: 0,
      };
    }

    const currentStageIndex = steps.findIndex((s) => s.id === task.stage);
    const stepIndex = steps.findIndex((s) => s.id === stepId);

    if (stepIndex < currentStageIndex) {
      // This step is completed
      return {
        isCompleted: true,
        isActive: false,
        isPending: false,
        progress: 100,
      };
    } else if (stepIndex === currentStageIndex) {
      // This is the current active step
      return {
        isCompleted: false,
        isActive: true,
        isPending: false,
        progress: (task.progress || 0) * 100,
      };
    } else {
      // This step hasn't started yet
      return {
        isCompleted: false,
        isActive: false,
        isPending: true,
        progress: 0,
      };
    }
  };

  return (
    <div className="animate-fade-in flex flex-1 flex-col">
      <header
        className={`border-border bg-card/50 border-b px-6 py-4 backdrop-blur-sm ${!isSidebarOpen ? "pl-14" : ""}`}
      >
        <h1 className="text-foreground font-semibold">{projectName}</h1>
        <p className="text-muted-foreground text-sm">
          Processing your knowledge base...
        </p>
      </header>

      <div className="flex flex-1 items-center justify-center p-8">
        <div className="w-full max-w-md space-y-2">
          {steps.map((step, index) => {
            const { isCompleted, isActive, isPending, progress } =
              getStepStatus(step.id);

            return (
              <div key={step.id} className="relative">
                {index < steps.length - 1 && (
                  <div
                    className={cn(
                      "absolute top-10 left-4 h-6 w-0.5 transition-colors duration-300",
                      isCompleted ? "bg-primary" : "bg-border",
                    )}
                  />
                )}

                <div className="flex items-center gap-4 rounded-xl p-3 transition-all duration-300">
                  <div
                    className={cn(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all duration-300",
                      isCompleted && "bg-primary text-primary-foreground",
                      isActive &&
                        "bg-primary/20 text-primary border-primary border-2",
                      isPending && "bg-muted text-muted-foreground",
                    )}
                  >
                    {isCompleted ? (
                      <Check className="h-4 w-4" />
                    ) : isActive ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Circle className="h-4 w-4" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p
                      className={cn(
                        "font-medium transition-colors duration-300",
                        isCompleted && "text-foreground",
                        isActive && "text-foreground",
                        isPending && "text-muted-foreground",
                      )}
                    >
                      {step.label}
                    </p>

                    {isActive && (
                      <div className="bg-muted mt-2 h-1.5 overflow-hidden rounded-full">
                        <div
                          className="bg-primary h-full rounded-full transition-all duration-300 ease-out"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    )}

                    {isCompleted && (
                      <p className="text-muted-foreground mt-1 text-xs">
                        Completed
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
