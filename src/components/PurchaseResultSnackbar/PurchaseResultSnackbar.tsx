import { Alert, Snackbar } from "@mui/material";
import type { LastPurchase } from "@/hooks/useShop";

type PurchaseResultSnackbarProps = {
  purchase: LastPurchase | null;
  onClose: () => void;
};

const buildMessage = (purchase: LastPurchase): string => {
  const { item, result } = purchase;
  if (result.shoppingSuccess) {
    return `Bought ${item.name} — level ${result.level}, ${result.gold} gold left`;
  }
  return `Couldn't buy ${item.name} — purchase failed`;
};

export const PurchaseResultSnackbar = ({
  purchase,
  onClose,
}: PurchaseResultSnackbarProps) => (
  <Snackbar
    open={purchase !== null}
    autoHideDuration={4000}
    onClose={onClose}
    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
  >
    <Alert
      onClose={onClose}
      severity={purchase?.result.shoppingSuccess ? "success" : "warning"}
      variant="filled"
      sx={{ width: "100%" }}
    >
      {purchase ? buildMessage(purchase) : ""}
    </Alert>
  </Snackbar>
);
