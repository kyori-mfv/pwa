import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Search } from "lucide-react";

interface ExpenseFiltersProps {
  searchTerm: string;
  selectedCategory: string;
  categories: string[];
  isLoading: boolean;
  onSearchTermChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
}

export const ExpenseFilters: React.FC<ExpenseFiltersProps> = ({
  searchTerm,
  selectedCategory,
  categories,
  isLoading,
  onSearchTermChange,
  onCategoryChange,
}) => {
  return (
    <div className="space-y-3 md:space-y-0 md:grid md:grid-cols-2 md:gap-4">
      {/* Search Input */}
      <div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm..."
            value={searchTerm}
            onChange={(e) => onSearchTermChange(e.target.value)}
            className="pl-9 text-sm"
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Category Filter */}
      <Select value={selectedCategory} onValueChange={onCategoryChange} disabled={isLoading}>
        <SelectTrigger className="text-sm w-full">
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
};
