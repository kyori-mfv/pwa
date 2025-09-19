import { Button } from "@/shared/components/ui/button";
import { Calendar } from "@/shared/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/components/ui/popover";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import type { DateRange } from "react-day-picker";

interface DateRangePickerProps {
  dateRange: { start: Date; end: Date };
  onDateRangeChange: (dateRange: { start: Date; end: Date }) => void;
}

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
  dateRange,
  onDateRangeChange,
}) => {
  // Convert our dateRange to react-day-picker format
  const selectedRange: DateRange = {
    from: dateRange.start,
    to: dateRange.end,
  };

  const handleRangeSelect = (range: DateRange | undefined) => {
    if (range?.from && range?.to) {
      onDateRangeChange({
        start: range.from,
        end: range.to,
      });
    } else if (range?.from && !range?.to) {
      // Single date selected, set both start and end to same date
      onDateRangeChange({
        start: range.from,
        end: range.from,
      });
    }
  };

  return (
    <div className="flex justify-end">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-[280px] justify-start text-left font-normal">
            <CalendarIcon className="mr-2 h-4 w-4" />
            {format(dateRange.start, "dd/MM/yyyy", { locale: vi })} -{" "}
            {format(dateRange.end, "dd/MM/yyyy", { locale: vi })}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <Calendar
            mode="range"
            numberOfMonths={2}
            selected={selectedRange}
            onSelect={handleRangeSelect}
            locale={vi}
            className="rounded-md border"
            showOutsideDays={true}
            defaultMonth={dateRange.start || new Date()}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};
