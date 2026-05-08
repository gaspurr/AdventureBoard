import { useCallback, useState } from "react";
import type { SortDirection } from "@/types/sort";

// Generic sort-state hook. Clicking the active column toggles direction;
// clicking a different column sets it to the new field with a desc default.
export const useTableSort = <Field extends string>(
  initialField: Field,
  initialDirection: SortDirection = "desc"
) => {
  const [sortField, setSortField] = useState<Field>(initialField);
  const [sortDirection, setSortDirection] =
    useState<SortDirection>(initialDirection);

  const handleSort = useCallback(
    (field: Field) => {
      if (field === sortField) {
        setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
        return;
      }
      setSortField(field);
      setSortDirection("desc");
    },
    [sortField]
  );

  return { sortField, sortDirection, handleSort };
};
