import { useEffect, useRef, useState } from "react";

import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import Box from "@mui/material/Box";

import api, { mute } from '../api'

import RepeatOn from "@mui/icons-material/RepeatOn";
import Repeat from "@mui/icons-material/Repeat";
import VolumeOff from "@mui/icons-material/VolumeOff";
import VolumeUp from "@mui/icons-material/VolumeUp";

import OBR, { isImage, Item } from "@owlbear-rodeo/sdk";

import { Playback, Playlist } from "../types";

import { PlaylistItem } from "./PlaylistItem";
import { getPluginId } from "../obr";
import { Header } from "./Header";
import { isPlainObject } from "../obr";

/** Check that the item metadata is in the correct format */
function isMetadata(
  metadata: unknown
): metadata is { count: string; active: boolean, hp: number } {
  return (
    isPlainObject(metadata) &&
    typeof metadata.count === "string" &&
    typeof metadata.active === "boolean" &&
    typeof metadata.hp === "number"
  );
}

export function Body() {
  const [playlists, setPlaylists] = useState<Playlist[]>([])
  const [playerRole, setPlayerRole] = useState('');
  const [repeat, setRepeat] = useState("off");
  const [muted, setMuted] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [currentPlaylist, setCurrentPlaylist] = useState<Playlist>();

  useEffect(() => {
    OBR.player.getRole().then(setPlayerRole);
  }, []);

  useEffect(() => {
    const activePlaylists = playlists.map((p) => {
      p.active = p.id === currentPlaylist?.id && playing;
      return p;
    })
    setPlaylists(activePlaylists);
  }, [currentPlaylist, playing])

  const onPlay = async (playlist: Playlist) => {
    if (playlist.id === currentPlaylist?.id) {
      api.play()
      setPlaying(true)
    } else {
      api.start(playlist.id)
      setCurrentPlaylist(playlist)
      setPlaying(true)
    }
  }

  const onPause = async () => {
    api.pause()
    setPlaying(false)
  }

  const onMute = async () => {
    api.mute(!muted)
    setMuted(!muted)
  }

  const onRepeat = async () => {
    const newRepeat = repeat === "off" ? "playlist" : "off"
    api.repeat(newRepeat)
    setRepeat(newRepeat)
  }

  useEffect(() => {
    api.playlists().then(response => setPlaylists(response.playlists || []))
    api.playback().then(response => {
      setCurrentPlaylist(response.playlist)
      setPlaying(response.playing)
      setRepeat(response.repeat)
      setShuffle(response.shuffle)
      setMuted(response.muted)
    })
  }, []);

  const listRef = useRef<HTMLUListElement>(null);
  useEffect(() => {
    if (listRef.current && ResizeObserver) {
      const resizeObserver = new ResizeObserver((entries) => {
        if (entries.length > 0) {
          const entry = entries[0];
          const borderHeight = entry.contentRect.bottom + entry.contentRect.top;
          const listHeight = Math.max(borderHeight, 64);
          OBR.action.setHeight(listHeight + 64 + 1);
        }
      });
      resizeObserver.observe(listRef.current);
      return () => {
        resizeObserver.disconnect();
        OBR.action.setHeight(129);
      };
    }
  }, []);

  return (
    <Stack height="100vh">
      <Header
        subtitle={
          playlists.length === 0
            ? "Start Kenku FM Remote control on port 3333"
            : playerRole === "PLAYER" ? "Only GM has access to this plugin"
              : undefined
        }
        action={
          playerRole === "GM" &&
          <>
            <IconButton
              aria-label="muted"
              onClick={onMute}
            >
              {muted ? <VolumeUp /> : <VolumeOff />}
            </IconButton>
            <IconButton
              aria-label="muted"
              onClick={onRepeat}
            >
              {repeat === "off" ? <Repeat /> : <RepeatOn />}
            </IconButton>
          </>
        }
      />
      <Box sx={{ overflowY: "auto" }}>
        <List ref={listRef}>
          {playerRole === "GM" && playlists
            .map((playlists) => (
              <PlaylistItem
                onPlay={onPlay}
                onPause={onPause}
                playerRole={playerRole}
                key={playlists.id}
                playlist={playlists}
              />
            ))}
        </List>
      </Box>
    </Stack>
  );
}
