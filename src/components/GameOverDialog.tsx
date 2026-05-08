import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import type { GameState } from "@/types/game";

type GameOverDialogProps = {
  open: boolean;
  game: GameState;
  onRestart: () => void;
};

export const GameOverDialog = ({
  open,
  game,
  onRestart,
}: GameOverDialogProps) => (
  <Dialog open={open} className="game-over">
    <DialogTitle className="game-over__title">Game Over</DialogTitle>
    <DialogContent className="game-over__content">
      <Typography className="game-over__row">
        <span className="game-over__label">Final score</span>
        <span className="game-over__value">{game.score}</span>
      </Typography>
      <Typography className="game-over__row">
        <span className="game-over__label">High score</span>
        <span className="game-over__value">{game.highScore}</span>
      </Typography>
      <Typography className="game-over__row">
        <span className="game-over__label">Turns played</span>
        <span className="game-over__value">{game.turn}</span>
      </Typography>
    </DialogContent>
    <DialogActions className="game-over__actions">
      <Button variant="contained" onClick={onRestart}>
        New Game
      </Button>
    </DialogActions>
  </Dialog>
);
