import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import TextField from "@mui/material/TextField";
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import { useState } from 'react'
import IconButton from "@mui/material/IconButton";
import PauseCircleRounded from "@mui/icons-material/PauseCircleRounded";
import PlayCircleRounded from "@mui/icons-material/PlayCircleRounded";


import { Playlist } from "../types";

type InitiativeListItemProps = {
  playlist: Playlist;
  playerRole: string;
  onPlay: (playlist: Playlist) => void;
  onPause: () => void;
};

export function PlaylistItem({
  playlist,
  playerRole,
  onPlay,
  onPause,
}: InitiativeListItemProps) {

  playerRole = playerRole || 'PLAYER';

  return (
    <ListItem
      key={playlist.id}
      secondaryAction={
        playlist.active &&
        <IconButton onClick={onPause}>
          <PauseCircleRounded></PauseCircleRounded>
        </IconButton> ||
        <IconButton onClick={() => onPlay(playlist)}>
          <PlayCircleRounded></PlayCircleRounded>
        </IconButton>
      }
      divider
      selected={playlist.active}
      sx={{
        pr: "64px",
      }}
    >
      <ListItemText primary={playlist.title} />
    </ListItem >
  );
}
