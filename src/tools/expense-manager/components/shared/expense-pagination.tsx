import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/shared/components/ui/pagination";

interface ExpensePaginationProps {
  currentPage: number;
  totalPages: number;
  total: number;
  itemsPerPage: number;
  isLoading: boolean;
  onPageChange: (page: number) => void;
}

export const ExpensePagination: React.FC<ExpensePaginationProps> = ({
  currentPage,
  totalPages,
  total,
  itemsPerPage,
  isLoading,
  onPageChange,
}) => {
  if (totalPages <= 1) {
    return null;
  }

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, total);

  return (
    <div className="space-y-3 pt-4 border-t">
      {/* Pagination Info */}
      <div className="text-xs md:text-sm text-muted-foreground text-center whitespace-nowrap">
        Hiển thị {startItem}-{endItem} trong {total} giao dịch
      </div>

      {/* Pagination Controls - Only Previous and Next */}
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
              className={`cursor-pointer ${currentPage === 1 || isLoading ? "pointer-events-none opacity-50" : ""}`}
            >
              <span className="hidden sm:block">Trước</span>
            </PaginationPrevious>
          </PaginationItem>

          <PaginationItem>
            <PaginationNext
              onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
              className={`cursor-pointer ${currentPage === totalPages || isLoading ? "pointer-events-none opacity-50" : ""}`}
            >
              <span className="hidden sm:block">Sau</span>
            </PaginationNext>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};
