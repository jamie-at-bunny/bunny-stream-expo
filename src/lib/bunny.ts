export const PULL_ZONE = process.env.EXPO_PUBLIC_BUNNY_PULL_ZONE ?? "";
export const API_BASE = process.env.EXPO_PUBLIC_API_BASE ?? "";

// Local dev fallback: call the Bunny API directly when no API_BASE is set.
// In production, route through an Edge Script so the key never reaches the client.
const LIBRARY_ID = process.env.EXPO_PUBLIC_BUNNY_LIBRARY_ID ?? "";
const API_KEY = process.env.EXPO_PUBLIC_BUNNY_API_KEY ?? "";

function apiFetch(path: string, params?: Record<string, string>) {
  if (API_BASE) {
    const url = new URL(`${API_BASE}${path}`);
    if (params) for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
    return fetch(url);
  }

  const url = new URL(`https://video.bunnycdn.com/library/${LIBRARY_ID}${path}`);
  if (params) for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  return fetch(url, { headers: { AccessKey: API_KEY } });
}

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

export async function listVideos(
  page = 1,
  perPage = 20,
): Promise<ListResponse> {
  const res = await apiFetch("/videos", {
    page: String(page),
    itemsPerPage: String(perPage),
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export async function getVideo(videoId: string): Promise<BunnyVideo> {
  const res = await apiFetch(`/videos/${videoId}`);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
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
