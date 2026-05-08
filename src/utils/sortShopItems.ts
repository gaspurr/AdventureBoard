import type { ShopItem } from "@/types/game";
import type { SortDirection } from "@/types/sort";

export type ShopSortField = "name" | "cost";

const compareShopItems =
  (field: ShopSortField) =>
  (a: ShopItem, b: ShopItem): number => {
    switch (field) {
      case "name":
        return a.name.localeCompare(b.name);
      case "cost":
        return a.cost - b.cost;
    }
  };

export const sortShopItems = (
  items: ShopItem[],
  field: ShopSortField,
  direction: SortDirection
): ShopItem[] => {
  const sorted = [...items].sort(compareShopItems(field));
  return direction === "desc" ? sorted.reverse() : sorted;
};
