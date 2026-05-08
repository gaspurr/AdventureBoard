import { Box, Typography } from "@mui/material";
import { formatLives } from "@/utils/format";
import type { GameState } from "@/types/game";
import "./GameHeader.scss";

type GameHeaderProps = {
  game: GameState;
};

export const GameHeader = ({ game }: GameHeaderProps) => (
  <Box className="game-header">
    <Box className="game-header__stat">
      <Typography className="game-header__label">Lives</Typography>
      <Typography className="game-header__value game-header__value--lives">
        {formatLives(game.lives)}
      </Typography>
    </Box>
    <Box className="game-header__stat">
      <Typography className="game-header__label">Gold</Typography>
      <Typography className="game-header__value">{game.gold}</Typography>
    </Box>
    <Box className="game-header__stat">
      <Typography className="game-header__label">Score</Typography>
      <Typography className="game-header__value">{game.score}</Typography>
    </Box>
    <Box className="game-header__stat">
      <Typography className="game-header__label">Level</Typography>
      <Typography className="game-header__value">{game.level}</Typography>
    </Box>
    <Box className="game-header__stat">
      <Typography className="game-header__label">Turn</Typography>
      <Typography className="game-header__value">{game.turn}</Typography>
    </Box>
  </Box>
);
