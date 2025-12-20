import { useEffect, useState } from "react";
import { Check, Loader2, Circle } from "lucide-react";
import { cn } from "../lib/utils";

const steps = [
  { id: "upload", label: "Uploading documents", duration: 1500 },
  { id: "chunk", label: "Chunking documents", duration: 2000 },
  { id: "embed", label: "Embedding documents", duration: 2500 },
  { id: "store", label: "Storing in vector DB", duration: 1800 },
  { id: "complete", label: "Database created", duration: 1000 },
];

export function ProcessingTimeline({
  projectName,
  isSidebarOpen = true,
  onComplete,
}) {
  const [currentStep, setCurrentStep] = useState(0);
  const [stepProgress, setStepProgress] = useState(0);

  useEffect(() => {
    if (currentStep >= steps.length) {
      const timer = setTimeout(onComplete, 500);
      return () => clearTimeout(timer);
    }

    const step = steps[currentStep];
    const interval = 50;
    const increment = (interval / step.duration) * 100;

    const progressTimer = setInterval(() => {
      setStepProgress((prev) => {
        const next = prev + increment;
        if (next >= 100) {
          clearInterval(progressTimer);
          setTimeout(() => {
            setCurrentStep((s) => s + 1);
            setStepProgress(0);
          }, 200);
          return 100;
        }
        return next;
      });
    }, interval);

    return () => clearInterval(progressTimer);
  }, [currentStep, onComplete]);

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
            const isCompleted = index < currentStep;
            const isActive = index === currentStep;
            const isPending = index > currentStep;

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
                          className="bg-primary h-full rounded-full transition-all duration-100 ease-linear"
                          style={{ width: `${stepProgress}%` }}
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
