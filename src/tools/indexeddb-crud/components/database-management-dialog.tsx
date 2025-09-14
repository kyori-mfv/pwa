import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import { Input } from "@/shared/components/ui/input";
import { Separator } from "@/shared/components/ui/separator";
import { AlertTriangle, Settings, Trash2 } from "lucide-react";
import { useState } from "react";
import type { DatabaseInfo } from "../types";

interface DatabaseManagementDialogProps {
  database: DatabaseInfo;
  onDeleteDatabase: (name: string) => Promise<void>;
  trigger?: React.ReactNode;
}

export const DatabaseManagementDialog: React.FC<DatabaseManagementDialogProps> = ({
  database,
  onDeleteDatabase,
  trigger,
}) => {
  const [open, setOpen] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");

  const handleDelete = async () => {
    if (deleteConfirmation !== database.name) {
      return;
    }

    setIsLoading(true);
    try {
      await onDeleteDatabase(database.name);
      setOpen(false);
      setShowDelete(false);
      setDeleteConfirmation("");
    } catch (error) {
      // Error handling is done in parent component
    } finally {
      setIsLoading(false);
    }
  };

  const resetDialog = () => {
    setShowDelete(false);
    setDeleteConfirmation("");
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      resetDialog();
    }
  };

  const defaultTrigger = (
    <Button variant="ghost" size="sm">
      <Settings className="h-4 w-4" />
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Database Settings</DialogTitle>
          <DialogDescription>Manage the "{database.name}" database.</DialogDescription>
        </DialogHeader>

        {!showDelete && (
          <div className="space-y-3">
            <div className="text-sm space-y-2">
              <p>
                <strong>Name:</strong> {database.name}
              </p>
              <p>
                <strong>Version:</strong> {database.version}
              </p>
              <p>
                <strong>Object Stores:</strong> {database.objectStores.length}
              </p>
            </div>

            <Separator />

            <div className="space-y-2">
              <Button
                variant="destructive"
                className="w-full justify-start"
                onClick={() => setShowDelete(true)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Database
              </Button>
            </div>
          </div>
        )}

        {showDelete && (
          <div className="space-y-4">
            <div className="bg-destructive/10 border border-destructive/20 rounded-md p-3">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
                <div className="text-sm">
                  <p className="font-medium text-destructive">Destructive Action</p>
                  <p className="text-destructive/80 mt-1">
                    This will permanently delete the database and all its data. This action cannot
                    be undone.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="delete-confirmation" className="text-sm font-medium">
                Type "{database.name}" to confirm deletion:
              </label>
              <Input
                id="delete-confirmation"
                value={deleteConfirmation}
                onChange={(e) => setDeleteConfirmation(e.target.value)}
                placeholder={database.name}
                disabled={isLoading}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowDelete(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={deleteConfirmation !== database.name || isLoading}
              >
                {isLoading ? "Deleting..." : "Delete Database"}
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
