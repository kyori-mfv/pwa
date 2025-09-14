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
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Database, Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const createDatabaseSchema = z.object({
  name: z
    .string()
    .min(1, "Database name is required")
    .max(50, "Database name must be less than 50 characters")
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      "Database name can only contain letters, numbers, hyphens, and underscores"
    ),
  version: z
    .number()
    .min(1, "Version must be at least 1")
    .max(999, "Version must be less than 1000"),
});

type CreateDatabaseFormData = z.infer<typeof createDatabaseSchema>;

interface CreateDatabaseDialogProps {
  onCreateDatabase: (data: CreateDatabaseFormData) => Promise<void>;
  trigger?: React.ReactNode;
}

export const CreateDatabaseDialog: React.FC<CreateDatabaseDialogProps> = ({
  onCreateDatabase,
  trigger,
}) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<CreateDatabaseFormData>({
    resolver: zodResolver(createDatabaseSchema),
    defaultValues: {
      name: "",
      version: 1,
    },
  });

  const handleSubmit = async (data: CreateDatabaseFormData) => {
    setIsLoading(true);
    try {
      await onCreateDatabase(data);
      setOpen(false);
      form.reset();
    } catch (error) {
      // Error handling is done in parent component
    } finally {
      setIsLoading(false);
    }
  };

  const defaultTrigger = (
    <Button variant="outline" size="sm">
      <Plus className="h-4 w-4 mr-2" />
      Create Database
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Create Database
          </DialogTitle>
          <DialogDescription>
            Create a new IndexedDB database. The database will be created with the specified name
            and version.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Database Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., my-app-db" {...field} disabled={isLoading} />
                  </FormControl>
                  <FormDescription>
                    A unique name for your database. Use only letters, numbers, hyphens, and
                    underscores.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="version"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Version</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      max="999"
                      {...field}
                      onChange={(e) => field.onChange(Number.parseInt(e.target.value) || 1)}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormDescription>
                    Database version number. Start with 1 and increment for schema changes.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Database"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
