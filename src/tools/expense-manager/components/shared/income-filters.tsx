import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Search, X } from "lucide-react";
import { memo } from "react";

interface IncomeFiltersProps {
  selectedCategory: string;
  categories: string[];
  searchTerm: string;
  onCategoryChange: (value: string) => void;
  onSearchChange: (value: string) => void;
}

export const IncomeFilters: React.FC<IncomeFiltersProps> = memo(
  ({ selectedCategory, categories, searchTerm, onCategoryChange, onSearchChange }) => {
    const hasActiveFilters = selectedCategory !== "all" || searchTerm.trim() !== "";

    const clearAllFilters = () => {
      onCategoryChange("all");
      onSearchChange("");
    };

    return (
      <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
        {/* Search Input */}
        <div className="relative w-full max-w-xs">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Tìm kiếm thu nhập..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 text-sm"
          />
        </div>

        {/* Category Filter */}
        <Select value={selectedCategory} onValueChange={onCategoryChange}>
          <SelectTrigger className="text-sm w-full max-w-xs">
            <SelectValue placeholder="Danh mục" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả danh mục</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={clearAllFilters}
            className="flex items-center gap-1 whitespace-nowrap"
          >
            <X className="h-4 w-4" />
            Xóa bộ lọc
          </Button>
        )}
      </div>
    );
  }
);
