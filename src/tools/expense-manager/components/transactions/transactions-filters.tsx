import { memo } from "react";
import { ExpenseFilters } from "../shared/expense-filters";

interface TransactionsFiltersProps {
  selectedCategory: string;
  categories: string[];
  searchTerm: string;
  onCategoryChange: (value: string) => void;
  onSearchChange: (value: string) => void;
}

export const TransactionsFilters: React.FC<TransactionsFiltersProps> = memo(
  ({ selectedCategory, categories, searchTerm, onCategoryChange, onSearchChange }) => {
    return (
      <ExpenseFilters
        selectedCategory={selectedCategory}
        categories={categories}
        searchTerm={searchTerm}
        onCategoryChange={onCategoryChange}
        onSearchChange={onSearchChange}
      />
    );
  }
);
