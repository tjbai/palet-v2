export interface PlaylistContext {
  id: string | number | undefined;
  name: string;
  index: number;
  imageUrl?: string;
  originUrl: string;
  songs: NowPlaying[];
}

export interface NowPlaying {
  id: string | number;
  name: string;
  artists: string[];
  cdnPath: string;
  durationMs: number;
  kandiCount: number;
  originUrl: string;
}

export interface User {
  clerkId: string;
  firstName?: string;
  lastName?: string;
  kandiBalance: number;
}
