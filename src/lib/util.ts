export function artistsToString(artists: string[] | undefined) {
  if (!artists) return "Unknown";
  return artists.join(", ");
}

export function msToTime(ms: number | undefined) {
  if (!ms) return "0:00";
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const paddedSeconds = seconds.toString().padStart(2, "0");
  return `${minutes}:${paddedSeconds}`;
}

export function hashString(str: string): number {
  let hash = 0,
    i,
    chr;
  if (str.length === 0) return hash;
  for (i = 0; i < str.length; i++) {
    chr = str.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0;
  }
  return hash;
}

export function bi2n(
  num: bigint | undefined | null
): number | undefined | null {
  if (num === undefined || num === null) return num;
  return Number(BigInt(num));
}

export function convertBigInts(obj: any) {
  return JSON.parse(
    JSON.stringify(obj, (_, value) =>
      typeof value === "bigint" ? value.toString() : value
    )
  );
}
