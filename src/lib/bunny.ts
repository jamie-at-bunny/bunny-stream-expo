export const PULL_ZONE = process.env.EXPO_PUBLIC_BUNNY_PULL_ZONE ?? "";
export const LIBRARY_ID = process.env.EXPO_PUBLIC_BUNNY_LIBRARY_ID ?? "";

// In production, proxy API calls through your backend
// so the API key never reaches the client.
const API_KEY = process.env.EXPO_PUBLIC_BUNNY_API_KEY ?? "";

export type BunnyCaption = { srclang: string; label: string };
export type BunnyChapter = { title: string; start: number; end: number };
export type BunnyMoment = { label: string; timestamp: number };

export type BunnyVideo = {
  guid: string;
  title: string;
  description: string | null;
  length: number;
  width: number;
  height: number;
  views: number;
  status: number;
  thumbnailFileName: string | null;
  thumbnailBlurhash: string | null;
  captions: BunnyCaption[] | null;
  chapters: BunnyChapter[] | null;
  moments: BunnyMoment[] | null;
  availableResolutions: string | null;
  hasMP4Fallback: boolean;
};

type ListResponse = {
  totalItems: number;
  currentPage: number;
  itemsPerPage: number;
  items: BunnyVideo[];
};

const headers = { AccessKey: API_KEY };

export async function listVideos(
  page = 1,
  perPage = 20,
): Promise<ListResponse> {
  const url = new URL(
    `https://video.bunnycdn.com/library/${LIBRARY_ID}/videos`,
  );
  url.searchParams.set("page", String(page));
  url.searchParams.set("itemsPerPage", String(perPage));
  url.searchParams.set("orderBy", "date");

  const res = await fetch(url, { headers });
  if (!res.ok) throw new Error(`Bunny API error: ${res.status}`);
  return res.json();
}

export async function getVideo(videoId: string): Promise<BunnyVideo> {
  const res = await fetch(
    `https://video.bunnycdn.com/library/${LIBRARY_ID}/videos/${videoId}`,
    { headers },
  );
  if (!res.ok) throw new Error(`Bunny API error: ${res.status}`);
  return res.json();
}

export function thumbnailUrl(videoId: string, fileName: string) {
  return `https://${PULL_ZONE}/${videoId}/${fileName}`;
}

export function hlsUrl(videoId: string) {
  return `https://${PULL_ZONE}/${videoId}/playlist.m3u8`;
}

export function formatTime(s: number) {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}
