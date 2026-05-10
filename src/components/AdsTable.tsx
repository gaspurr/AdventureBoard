import { useMemo } from "react";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Tooltip,
  Typography,
} from "@mui/material";
import { gutFeelingChipColor } from "@/utils/scoring";
import { sortAds } from "@/utils/sortAds";
import type { AdSortField } from "@/utils/sortAds";
import type { GutFeelingMap } from "@/utils/scoring";
import { useTableSort } from "@/hooks/useTableSort";
import type { Ad } from "@/types/game";

type AdsTableProps = {
  ads: Ad[];
  isLoading: boolean;
  error: string | null;
  onRefresh: () => void;
  onSolve: (adId: string) => void;
  solvingAdId: string | null;
  gutFeelingMap?: GutFeelingMap;
};

export const AdsTable = ({
  ads,
  isLoading,
  error,
  onRefresh,
  onSolve,
  solvingAdId,
  gutFeelingMap,
}: AdsTableProps) => {
  const { sortField, sortDirection, handleSort } =
    useTableSort<AdSortField>("gutFeeling");

  const sortedAds = useMemo(
    () => sortAds(ads, sortField, sortDirection, gutFeelingMap),
    [ads, sortField, sortDirection, gutFeelingMap]
  );

  const isInitialLoad = isLoading && ads.length === 0;
  const isSolving = solvingAdId !== null;

  const renderSortHeader = (
    field: AdSortField,
    label: string,
    align: "left" | "right" = "left"
  ) => (
    <TableCell
      align={align}
      sortDirection={sortField === field ? sortDirection : false}
    >
      <TableSortLabel
        active={sortField === field}
        direction={sortField === field ? sortDirection : "desc"}
        onClick={() => handleSort(field)}
      >
        {label}
      </TableSortLabel>
    </TableCell>
  );

  return (
    <Box className="ads-table">
      <Box className="ads-table__header">
        <Box className="ads-table__title-group">
          <Typography variant="h6" className="ads-table__title">
            Available ads
          </Typography>
          <Typography className="ads-table__count">
            {ads.length} total
          </Typography>
        </Box>
        <Button
          variant="outlined"
          size="small"
          onClick={onRefresh}
          disabled={isLoading || isSolving}
        >
          {isLoading ? "Refreshing..." : "Refresh"}
        </Button>
      </Box>

      {error && (
        <Typography className="ads-table__error">{error}</Typography>
      )}

      {isInitialLoad ? (
        <Box className="ads-table__loading">
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer
          component={Paper}
          className="ads-table__container"
        >
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Message</TableCell>
                {renderSortHeader("reward", "Reward", "right")}
                {renderSortHeader("probability", "Probability")}
                {renderSortHeader("expiresIn", "Expires", "right")}
                {renderSortHeader("gutFeeling", "Gut feeling")}
                <TableCell align="right">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedAds.map((ad) => {
                const isThisRowSolving = solvingAdId === ad.adId;
                const gut = gutFeelingMap?.get(ad.adId);
                const isTopPick = gut?.label === "Top pick";

                return (
                  <TableRow
                    key={ad.adId}
                    className={`ads-table__row${isTopPick ? " ads-table__row--top" : ""}`}
                  >
                    <TableCell className="ads-table__message">
                      {ad.message}
                    </TableCell>
                    <TableCell align="right">
                      {Number(ad.reward)}
                    </TableCell>
                    <TableCell>
                      {ad.probability}
                    </TableCell>
                    <TableCell align="right">{ad.expiresIn}</TableCell>
                    <TableCell>
                      {gut ? (
                        <Tooltip
                          title={`Score: ${gut.score.toFixed(1)}`}
                          arrow
                        >
                          <Chip
                            label={gut.label}
                            size="small"
                            color={gutFeelingChipColor(gut.label)}
                            className="ads-table__gut"
                          />
                        </Tooltip>
                      ) : (
                        "—"
                      )}
                    </TableCell>
                    <TableCell align="right">
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => onSolve(ad.adId)}
                        disabled={isSolving}
                        className="ads-table__solve"
                      >
                        {isThisRowSolving ? "Solving..." : "Solve"}
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
              {sortedAds.length === 0 && !isLoading && (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="ads-table__empty"
                    align="center"
                  >
                    No ads available right now.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};
