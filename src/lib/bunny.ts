export type BunnyCaption = { srclang: string; label: string };
export type BunnyChapter = { title: string; start: number; end: number };
export type BunnyMoment = { label: string; timestamp: number };

export type BunnyVideoMeta = {
  guid: string;
  title: string;
  description: string | null;
  length: number;
  width: number;
  height: number;
  thumbnailFileName: string | null;
  thumbnailBlurhash: string | null;
  captions: BunnyCaption[] | null;
  chapters: BunnyChapter[] | null;
  moments: BunnyMoment[] | null;
  availableResolutions: string | null;
  hasMP4Fallback: boolean;
  status: number;
};

export async function getVideoMeta(
  libraryId: string,
  videoId: string,
  apiKey: string,
): Promise<BunnyVideoMeta> {
  const res = await fetch(
    `https://video.bunnycdn.com/library/${libraryId}/videos/${videoId}`,
    { headers: { AccessKey: apiKey } },
  );
  if (!res.ok) throw new Error(`Bunny API error: ${res.status}`);
  return res.json();
}

export function thumbnailUrl(
  pullZone: string,
  videoId: string,
  fileName: string,
) {
  return `https://${pullZone}/${videoId}/${fileName}`;
}

export function formatTime(s: number) {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}
