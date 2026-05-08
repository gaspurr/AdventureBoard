import { Box, Button, Typography } from "@mui/material";

type StartScreenProps = {
  onStart: () => void;
  isStarting: boolean;
  error: string | null;
};

export const StartScreen = ({
  onStart,
  isStarting,
  error,
}: StartScreenProps) => (
  <Box className="start-screen">
    <Box className="start-screen__content">
      <Typography variant="h2" className="start-screen__title">
        Dragons of Mugloar
      </Typography>
      <Typography variant="body1" className="start-screen__tagline">
        Help the people. Train your dragon. Make some gold.
      </Typography>
      <Button
        variant="contained"
        size="large"
        onClick={onStart}
        disabled={isStarting}
        className="start-screen__button"
      >
        {isStarting ? "Starting..." : "Start Game"}
      </Button>
      {error && (
        <Typography className="start-screen__error">{error}</Typography>
      )}
    </Box>
  </Box>
);
