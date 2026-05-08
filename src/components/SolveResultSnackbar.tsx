import { Alert, Snackbar } from "@mui/material";
import type { SolveResult } from "@/types/game";

type SolveResultSnackbarProps = {
  result: SolveResult | null;
  onClose: () => void;
};

export const SolveResultSnackbar = ({
  result,
  onClose,
}: SolveResultSnackbarProps) => (
  <Snackbar
    open={result !== null}
    autoHideDuration={4000}
    onClose={onClose}
    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
  >
    <Alert
      onClose={onClose}
      severity={result?.success ? "success" : "warning"}
      variant="filled"
      sx={{ width: "100%" }}
    >
      {result?.message}
    </Alert>
  </Snackbar>
);
