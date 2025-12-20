import { useState } from "react";
import {
  Plus,
  FolderOpen,
  MessageSquare,
  MoreHorizontal,
  Pencil,
  Trash2,
  X,
  Check,
  PanelLeftClose,
} from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { cn } from "../lib/utils";

export function ProjectSidebar({
  projects,
  selectedProject,
  onSelectProject,
  onNewProject,
  onRenameProject,
  onDeleteProject,
  onClose,
}) {
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");

  const handleStartRename = (project, e) => {
    e.stopPropagation();
    setEditingId(project.id);
    setEditName(project.name);
  };

  const handleConfirmRename = (projectId) => {
    if (editName.trim()) {
      onRenameProject(projectId, editName.trim());
    }
    setEditingId(null);
    setEditName("");
  };

  const handleCancelRename = () => {
    setEditingId(null);
    setEditName("");
  };

  const handleKeyDown = (e, projectId) => {
    if (e.key === "Enter") {
      handleConfirmRename(projectId);
    } else if (e.key === "Escape") {
      handleCancelRename();
    }
  };

  return (
    <aside className="bg-sidebar border-sidebar-border animate-slide-in flex h-screen w-80 flex-col border-r">
      <div className="border-sidebar-border border-b p-4">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary flex h-8 w-8 items-center justify-center rounded-lg">
              <MessageSquare className="text-primary-foreground h-4 w-4" />
            </div>
            <span className="text-sidebar-foreground font-semibold">
              RAG Chat
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground h-8 w-8"
          >
            <PanelLeftClose className="h-4 w-4" />
          </Button>
        </div>
        <Button
          onClick={onNewProject}
          variant="outline"
          className="text-sidebar-foreground border-sidebar-border hover:bg-sidebar-accent w-full justify-start gap-2"
        >
          <Plus className="h-4 w-4" />
          New Project
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        <p className="text-muted-foreground px-2 py-1.5 text-xs font-medium tracking-wider uppercase">
          Projects
        </p>
        <nav className="mt-2 space-y-1">
          {projects.map((project, index) => (
            <div
              key={project.id}
              className={cn(
                "group transition-smooth flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm",
                "hover:bg-sidebar-accent",
                selectedProject?.id === project.id
                  ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                  : "text-sidebar-foreground",
              )}
              style={{ animationDelay: `${index * 50}ms` }}
              onClick={() => onSelectProject(project)}
            >
              <button className="flex min-w-0 flex-1 items-center gap-3 text-left">
                <FolderOpen className="h-4 w-4 shrink-0" />
                {editingId === project.id ? (
                  <div
                    className="flex flex-1 items-center gap-1"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      onKeyDown={(e) => handleKeyDown(e, project.id)}
                      className="bg-background border-input focus:ring-ring flex-1 rounded border px-2 py-0.5 text-sm focus:ring-1 focus:outline-none"
                      autoFocus
                    />
                    <div
                      onClick={() => handleConfirmRename(project.id)}
                      role="button"
                      tabIndex={0}
                      className="hover:bg-primary/10 cursor-pointer rounded p-1"
                    >
                      <Check className="text-primary h-3.5 w-3.5" />
                    </div>

                    <div
                      onClick={handleCancelRename}
                      role="button"
                      tabIndex={0}
                      className="hover:bg-destructive/10 cursor-pointer rounded p-1"
                    >
                      <X className="h-3.5 w-3.5 text-red-500" />
                    </div>
                  </div>
                ) : (
                  <span className="truncate">{project.name}</span>
                )}
              </button>

              {editingId !== project.id ? (
                project.status == "processed" ? (
                  <span className="bg-primary h-2 w-2 shrink-0 rounded-full" />
                ) : project.status == "processing" ? (
                  <span className="h-2 w-2 shrink-0 rounded-full bg-yellow-600" />
                ) : (
                  <span className="bg-muted-foreground h-2 w-2 shrink-0 rounded-full" />
                )
              ) : null}

              {editingId !== project.id && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      className="hover:bg-sidebar-accent-foreground/10 rounded p-1 opacity-0 transition-opacity group-hover:opacity-100"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40">
                    <DropdownMenuItem
                      onClick={(e) => handleStartRename(project, e)}
                    >
                      <Pencil className="mr-2 h-4 w-4" />
                      Rename
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onDeleteProject(project.id)}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          ))}
        </nav>
      </div>

      <div className="border-sidebar-border border-t p-4">
        <p className="text-muted-foreground text-xs">
          {projects.length} project{projects.length !== 1 ? "s" : ""}
        </p>
      </div>
    </aside>
  );
}
