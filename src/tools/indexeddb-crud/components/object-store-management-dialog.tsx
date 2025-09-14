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
import type { ObjectStoreInfo } from "../types";

interface ObjectStoreManagementDialogProps {
  objectStore: ObjectStoreInfo;
  databaseName: string;
  onDeleteObjectStore: (databaseName: string, name: string) => Promise<void>;
  trigger?: React.ReactNode;
}

export const ObjectStoreManagementDialog: React.FC<ObjectStoreManagementDialogProps> = ({
  objectStore,
  databaseName,
  onDeleteObjectStore,
  trigger,
}) => {
  const [open, setOpen] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");

  const handleDelete = async () => {
    if (deleteConfirmation !== objectStore.name) {
      return;
    }

    setIsLoading(true);
    try {
      await onDeleteObjectStore(databaseName, objectStore.name);
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
          <DialogTitle>Object Store Settings</DialogTitle>
          <DialogDescription>
            Manage the "{objectStore.name}" object store in "{databaseName}" database.
          </DialogDescription>
        </DialogHeader>

        {!showDelete && (
          <div className="space-y-3">
            <div className="text-sm space-y-2">
              <p>
                <strong>Name:</strong> {objectStore.name}
              </p>
              <p>
                <strong>Key Path:</strong> {objectStore.keyPath || "None"}
              </p>
              <p>
                <strong>Auto Increment:</strong> {objectStore.autoIncrement ? "Yes" : "No"}
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
                Delete Object Store
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
                    This will permanently delete the object store and all its records. This action
                    cannot be undone and will increment the database version.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="delete-confirmation" className="text-sm font-medium">
                Type "{objectStore.name}" to confirm deletion:
              </label>
              <Input
                id="delete-confirmation"
                value={deleteConfirmation}
                onChange={(e) => setDeleteConfirmation(e.target.value)}
                placeholder={objectStore.name}
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
                disabled={deleteConfirmation !== objectStore.name || isLoading}
              >
                {isLoading ? "Deleting..." : "Delete Object Store"}
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
