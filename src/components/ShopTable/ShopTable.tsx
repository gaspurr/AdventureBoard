import { useMemo } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Typography,
} from "@mui/material";
import { sortShopItems } from "@/utils/sortShopItems";
import type { ShopSortField } from "@/utils/sortShopItems";
import { useTableSort } from "@/hooks/useTableSort";
import type { ShopItem } from "@/types/game";

type ShopTableProps = {
  items: ShopItem[];
  isLoading: boolean;
  error: string | null;
  onRefresh: () => void;
  onBuy: (itemId: string) => void;
  buyingItemId: string | null;
  gold: number;
};

export const ShopTable = ({
  items,
  isLoading,
  error,
  onRefresh,
  onBuy,
  buyingItemId,
  gold,
}: ShopTableProps) => {
  const { sortField, sortDirection, handleSort } =
    useTableSort<ShopSortField>("cost", "asc");

  const sortedItems = useMemo(
    () => sortShopItems(items, sortField, sortDirection),
    [items, sortField, sortDirection]
  );

  const isInitialLoad = isLoading && items.length === 0;
  const isBuying = buyingItemId !== null;

  const renderSortHeader = (
    field: ShopSortField,
    label: string,
    align: "left" | "right" = "left"
  ) => (
    <TableCell
      align={align}
      sortDirection={sortField === field ? sortDirection : false}
    >
      <TableSortLabel
        active={sortField === field}
        direction={sortField === field ? sortDirection : "asc"}
        onClick={() => handleSort(field)}
      >
        {label}
      </TableSortLabel>
    </TableCell>
  );

  return (
    <Box className="shop-table">
      <Box className="shop-table__header">
        <Typography variant="h6" className="shop-table__title">
          Shop
        </Typography>
        <Box className="shop-table__header-actions">
          <Typography className="shop-table__balance">
            {gold} gold available
          </Typography>
          <Button
            variant="outlined"
            size="small"
            onClick={onRefresh}
            disabled={isLoading || isBuying}
          >
            {isLoading ? "Loading..." : "Refresh"}
          </Button>
        </Box>
      </Box>

      {error && (
        <Typography className="shop-table__error">{error}</Typography>
      )}

      {isInitialLoad ? (
        <Box className="shop-table__loading">
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer
          component={Paper}
          className="shop-table__container"
        >
          <Table size="small">
            <TableHead>
              <TableRow>
                {renderSortHeader("name", "Item")}
                {renderSortHeader("cost", "Cost", "right")}
                <TableCell align="right">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedItems.map((item) => {
                const canAfford = gold >= item.cost;
                const isThisRowBuying = buyingItemId === item.id;
                const buttonLabel = isThisRowBuying
                  ? "Buying..."
                  : canAfford
                    ? "Buy"
                    : "Too pricey";

                return (
                  <TableRow key={item.id} className="shop-table__row">
                    <TableCell>{item.name}</TableCell>
                    <TableCell align="right">{item.cost}</TableCell>
                    <TableCell align="right">
                      <Button
                        variant="contained"
                        size="small"
                        color="secondary"
                        onClick={() => onBuy(item.id)}
                        disabled={isBuying || !canAfford}
                        className="shop-table__buy"
                      >
                        {buttonLabel}
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
              {sortedItems.length === 0 && !isLoading && (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    className="shop-table__empty"
                    align="center"
                  >
                    Shop is empty.
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
