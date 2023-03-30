export interface Playlist {
    id: string;
    title: string;
    active: boolean;
    tracks: string[];
}

export interface Playback {
    playing: boolean;
    muted: boolean,
    shuffle: boolean,
    repeat: string,
    playlist: Playlist;
}
