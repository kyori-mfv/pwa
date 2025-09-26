import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Calendar } from "@/shared/components/ui/calendar";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Textarea } from "@/shared/components/ui/textarea";
import { vi } from "date-fns/locale";
import { CalendarDays, DollarSign, FileText, Tag } from "lucide-react";
import type { CategoryRecord, ParsedExpense } from "../../types";

interface IncomeEditFormProps {
  editablePreview: ParsedExpense;
  preview: ParsedExpense | null;
  categories: CategoryRecord[];
  datePickerOpen: boolean;
  onEditablePreviewChange: (preview: ParsedExpense) => void;
  onDatePickerOpenChange: (open: boolean) => void;
}

export const IncomeEditForm: React.FC<IncomeEditFormProps> = ({
  editablePreview,
  preview,
  categories,
  datePickerOpen,
  onEditablePreviewChange,
  onDatePickerOpenChange,
}) => {
  return (
    <Card className="border-muted bg-sidebar">
      <CardContent className="space-y-4">
        <div className="flex justify-end">
          <Badge
            variant={preview?.confidence && preview.confidence > 0.7 ? "default" : "secondary"}
            className="text-xs"
          >
            Độ tin cậy {Math.round((preview?.confidence || 0) * 100)}%
          </Badge>
        </div>

        {/* Date */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <CalendarDays className="w-4 h-4 text-primary" />
            <Label htmlFor="edit-date" className="text-sm font-bold">
              Ngày
            </Label>
          </div>
          <Popover open={datePickerOpen} onOpenChange={onDatePickerOpenChange}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                id="edit-date"
                className="w-full bg-transparent justify-between font-normal mt-1"
              >
                {editablePreview.date
                  ? editablePreview.date.toLocaleDateString("vi-VN", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })
                  : "Chọn ngày"}
                <CalendarDays className="h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto overflow-hidden p-0" align="start">
              <Calendar
                mode="single"
                selected={editablePreview.date || new Date()}
                locale={vi}
                onSelect={(date) => {
                  if (date) {
                    onEditablePreviewChange({
                      ...editablePreview,
                      date: date,
                    });
                  }
                  onDatePickerOpenChange(false);
                }}
                defaultMonth={editablePreview.date || new Date()}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Amount */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <DollarSign className="w-4 h-4 text-primary" />
            <Label htmlFor="edit-amount" className="text-sm font-bold">
              Số tiền
            </Label>
          </div>
          <Input
            id="edit-amount"
            type="number"
            value={editablePreview.amount}
            onChange={(e) =>
              onEditablePreviewChange({
                ...editablePreview,
                amount: Number.parseFloat(e.target.value) || 0,
              })
            }
            className="mt-1"
            placeholder="VND"
          />
        </div>

        {/* Category */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Tag className="w-4 h-4 text-primary" />
            <Label htmlFor="edit-category" className="text-sm font-bold">
              Danh mục
            </Label>
          </div>
          <Select
            value={editablePreview.category}
            onValueChange={(value) =>
              onEditablePreviewChange({
                ...editablePreview,
                category: value,
              })
            }
          >
            <SelectTrigger className="min-w-full mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.name}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Description */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <FileText className="w-4 h-4 text-primary" />
            <Label htmlFor="edit-description" className="text-sm font-bold">
              Mô tả
            </Label>
          </div>
          <Textarea
            id="edit-description"
            value={editablePreview.description}
            onChange={(e) =>
              onEditablePreviewChange({
                ...editablePreview,
                description: e.target.value,
              })
            }
            rows={2}
            className="mt-1 resize-none"
            placeholder="Nhập mô tả thu nhập..."
          />
        </div>
      </CardContent>
    </Card>
  );
};
