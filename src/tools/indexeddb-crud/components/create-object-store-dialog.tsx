import { Button } from "@/shared/components/ui/button";
import { Checkbox } from "@/shared/components/ui/checkbox";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Separator } from "@/shared/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertTriangle, Database, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

const indexSchema = z.object({
  name: z.string().min(1, "Index name is required"),
  keyPath: z.string().min(1, "Key path is required"),
  unique: z.boolean(),
  multiEntry: z.boolean(),
});

const createObjectStoreSchema = z.object({
  name: z
    .string()
    .min(1, "Object store name is required")
    .max(50, "Object store name must be less than 50 characters")
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      "Object store name can only contain letters, numbers, hyphens, and underscores"
    ),
  keyPath: z.string().min(1, "Key path is required"),
  autoIncrement: z.boolean(),
  indexes: z.array(indexSchema),
});

type CreateObjectStoreFormData = z.infer<typeof createObjectStoreSchema>;

interface CreateObjectStoreDialogProps {
  onCreateObjectStore: (data: CreateObjectStoreFormData) => Promise<void>;
  trigger?: React.ReactNode;
  disabled?: boolean;
}

export const CreateObjectStoreDialog: React.FC<CreateObjectStoreDialogProps> = ({
  onCreateObjectStore,
  trigger,
  disabled = false,
}) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<CreateObjectStoreFormData>({
    resolver: zodResolver(createObjectStoreSchema),
    defaultValues: {
      name: "",
      keyPath: "id",
      autoIncrement: true,
      indexes: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "indexes",
  });

  const handleSubmit = async (data: CreateObjectStoreFormData) => {
    setIsLoading(true);
    try {
      await onCreateObjectStore(data);
      setOpen(false);
      form.reset();
    } catch (error) {
      // Error handling is done in parent component
    } finally {
      setIsLoading(false);
    }
  };

  const addIndex = () => {
    append({
      name: "",
      keyPath: "",
      unique: false,
      multiEntry: false,
    });
  };

  const defaultTrigger = (
    <Button variant="outline" size="sm" disabled={disabled}>
      <Plus className="h-4 w-4 mr-2" />
      Create Object Store
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Create Object Store
          </DialogTitle>
          <DialogDescription>
            Create a new object store within the selected database. Object stores are like tables in
            a traditional database.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Object Store Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., users, products, orders"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormDescription>
                    A unique name for your object store within this database.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="keyPath"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Key Path</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., id, email, uuid" {...field} disabled={isLoading} />
                    </FormControl>
                    <FormDescription>
                      Property path to use as the primary key (required).
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="autoIncrement"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 mt-6">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Auto Increment</FormLabel>
                      <FormDescription>Generate keys automatically.</FormDescription>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator />

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium">Indexes</h4>
                  <p className="text-xs text-muted-foreground">
                    Create indexes for faster queries on specific fields.
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addIndex}
                  disabled={isLoading}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Index
                </Button>
              </div>

              {fields.length > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-md p-3">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
                    <div className="text-sm">
                      <p className="font-medium text-amber-800">Index Trade-offs</p>
                      <ul className="text-amber-700 mt-1 text-xs space-y-0.5">
                        <li>
                          • <strong>Pros:</strong> Faster queries and sorting on indexed fields
                        </li>
                        <li>
                          • <strong>Cons:</strong> Slower writes, increased storage space
                        </li>
                        <li>
                          • <strong>Tip:</strong> Only index fields you frequently query
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                {fields.map((field, index) => (
                  <div key={field.id} className="border rounded-md p-3 space-y-3">
                    <div className="flex items-center justify-between">
                      <h5 className="text-sm font-medium">Index #{index + 1}</h5>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => remove(index)}
                        disabled={isLoading}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <FormField
                        control={form.control}
                        name={`indexes.${index}.name`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Index Name</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g., by_email, by_date"
                                {...field}
                                disabled={isLoading}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`indexes.${index}.keyPath`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Key Path</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g., email, createdAt"
                                {...field}
                                disabled={isLoading}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="flex gap-6">
                      <FormField
                        control={form.control}
                        name={`indexes.${index}.unique`}
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                disabled={isLoading}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Unique</FormLabel>
                              <FormDescription className="text-xs">
                                Ensure values are unique.
                              </FormDescription>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`indexes.${index}.multiEntry`}
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                disabled={isLoading}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Multi-Entry</FormLabel>
                              <FormDescription className="text-xs">
                                Index array values separately.
                              </FormDescription>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

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
                {isLoading ? "Creating..." : "Create Object Store"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
