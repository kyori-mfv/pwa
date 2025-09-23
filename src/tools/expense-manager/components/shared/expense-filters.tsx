import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Search } from "lucide-react";
import { memo } from "react";

interface ExpenseFiltersProps {
  selectedCategory: string;
  categories: string[];
  searchTerm: string;
  onCategoryChange: (value: string) => void;
  onSearchChange: (value: string) => void;
}

export const ExpenseFilters: React.FC<ExpenseFiltersProps> = memo(
  ({ selectedCategory, categories, searchTerm, onCategoryChange, onSearchChange }) => {
    return (
      <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
        {/* Search Input */}
        <div className="relative w-full max-w-xs">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Tìm kiếm giao dịch..."
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
      </div>
    );
  }
);
