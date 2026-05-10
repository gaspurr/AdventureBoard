import { Box, Button, MenuItem, TextField } from "@mui/material";
import { Controller } from "react-hook-form";
import type { UseFormReturn } from "react-hook-form";
import type { AdFiltersValues } from "@/hooks/useAdFiltersForm";

type AdFiltersProps = {
  form: UseFormReturn<AdFiltersValues>;
  onReset: () => void;
};

export const AdFilters = ({ form, onReset }: AdFiltersProps) => {
  const { register, control } = form;

  return (
    <Box className="ad-filters">
      <TextField
        label="Min reward"
        type="number"
        size="small"
        className="ad-filters__field"
        inputProps={{ min: 0 }}
        {...register("minReward", { valueAsNumber: true })}
      />

      <TextField
        label="Min turns left"
        type="number"
        size="small"
        className="ad-filters__field"
        inputProps={{ min: 0 }}
        {...register("minExpiresIn", { valueAsNumber: true })}
      />

      <Controller
        control={control}
        name="riskThreshold"
        render={({ field }) => (
          <TextField
            select
            label="Risk threshold"
            size="small"
            className="ad-filters__field"
            {...field}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="risky">Risky or safer</MenuItem>
            <MenuItem value="moderate">Moderate or safer</MenuItem>
            <MenuItem value="safe">Safe only</MenuItem>
          </TextField>
        )}
      />

      <Button
        variant="text"
        size="small"
        onClick={onReset}
        className="ad-filters__reset"
      >
        Reset
      </Button>
    </Box>
  );
};
