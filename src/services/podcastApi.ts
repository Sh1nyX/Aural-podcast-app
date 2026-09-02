import { Podcast } from '@/types/podcast';

export async function searchPodcasts(
  query: string
): Promise<Podcast[]> {
  const url =
    `https://itunes.apple.com/search` +
    `?term=${encodeURIComponent(query)}` +
    `&media=podcast` +
    `&limit=20`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Не вдалося отримати подкасти');
  }

  const data = await response.json();

  return data.results.map((item: any) => ({
    id: item.collectionId,
    name: item.collectionName,
    artist: item.artistName,
    artworkUrl: item.artworkUrl600,
    feedUrl: item.feedUrl,
    category: item.primaryGenreName,
  }));
}