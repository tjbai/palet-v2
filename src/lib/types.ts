export interface PlaylistContext {
  id: string | number | undefined;
  name: string;
  index: number;
  imageUrl?: string;
  originUrl: string;
  songs: NowPlaying[];
  routeAlias: string;
  shuffledOrder: number[];
  shuffledIndex: number;
}

export interface PlaylistPreview {
  id: string | number | undefined;
  name: string;
  imageUrl: string | null;
  originUrl: string | null;
  routeAlias: string;
  trackCount: number;
  kandiCount: number;
  totalDuration: number;
  description: string | null;
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

export interface UserDonationSet {
  clerkId: string;
  linkedSongs: { songId: number; totalDonation: number }[];
}

export interface PlayerQueryParams {
  type: number;
  crate: string;
}
