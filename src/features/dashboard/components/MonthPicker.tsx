import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

interface MonthPickerProps {
  month: number;
  year: number;
  onPrevious: () => void;
  onNext: () => void;
}

const MONTHS = Array.from({ length: 12 }, (_, i) =>
  new Intl.DateTimeFormat("en-US", { month: "long" }).format(new Date(2000, i)),
);

/**
 * MonthPicker component
 *
 * Allows the user to navigate between months for report filtering.
 * Prevents navigation to future months.
 */
export const MonthPicker = ({
  month,
  year,
  onPrevious,
  onNext,
}: MonthPickerProps) => {
  const now = new Date();
  const isCurrentMonth =
    month === now.getMonth() + 1 && year === now.getFullYear();

  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="icon" onClick={onPrevious}>
        <ChevronLeft className="size-4" />
      </Button>

      <AnimatePresence mode="wait">
        <motion.span
          key={`${month}-${year}`}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.15 }}
          className="w-36 text-center text-sm font-medium"
        >
          {MONTHS[month - 1]} {year}
        </motion.span>
      </AnimatePresence>

      <Button
        variant="outline"
        size="icon"
        onClick={onNext}
        disabled={isCurrentMonth}
      >
        <ChevronRight className="size-4" />
      </Button>
    </div>
  );
};
