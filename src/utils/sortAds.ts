import { getProbabilityScore } from "./probability";
import type { Ad } from "@/types/game";
import type { SortDirection } from "@/types/sort";
import type { GutFeelingMap } from "./scoring";

export type AdSortField =
  | "reward"
  | "probability"
  | "expiresIn"
  | "gutFeeling";

const compareAds = (
  field: AdSortField,
  gutFeelingMap: GutFeelingMap | undefined
) => {
  return (a: Ad, b: Ad): number => {
    switch (field) {
      case "reward":
        return Number(a.reward) - Number(b.reward);
      case "probability":
        return (
          getProbabilityScore(a.probability) -
          getProbabilityScore(b.probability)
        );
      case "expiresIn":
        return a.expiresIn - b.expiresIn;
      case "gutFeeling": {
        const sa = gutFeelingMap?.get(a.adId)?.score ?? 0;
        const sb = gutFeelingMap?.get(b.adId)?.score ?? 0;
        return sa - sb;
      }
    }
  };
};

export const sortAds = (
  ads: Ad[],
  field: AdSortField,
  direction: SortDirection,
  gutFeelingMap?: GutFeelingMap
): Ad[] => {
  const sorted = [...ads].sort(compareAds(field, gutFeelingMap));
  return direction === "desc" ? sorted.reverse() : sorted;
};
