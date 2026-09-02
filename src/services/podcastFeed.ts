import { XMLParser } from 'fast-xml-parser';

import { PodcastEpisode } from '@/types/podcastEpisode';

export async function getPodcastEpisodes(
  feedUrl: string
): Promise<PodcastEpisode[]> {
  const response = await fetch(feedUrl);

  if (!response.ok) {
    throw new Error('Не вдалося отримати випуски');
  }

  const xml = await response.text();

  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '@_',
  });

  const data = parser.parse(xml);

  const items = data?.rss?.channel?.item;

  if (!items) {
    return [];
  }

  const episodes = Array.isArray(items)
    ? items
    : [items];

  return episodes
    .map((item: any, index: number) => {
      const enclosure = item.enclosure;

      if (!enclosure?.['@_url']) {
        return null;
      }

      return {
        id:
          item.guid?.['#text'] ||
          item.guid ||
          `${index}`,

        title:
          item.title || 'Без назви',

        description:
          item.description || '',

        audioUrl:
          enclosure['@_url'],

        duration:
          parseDuration(item['itunes:duration']),

        date:
          item.pubDate || '',
      };
    })
    .filter(
      (episode): episode is PodcastEpisode =>
        episode !== null
    );
}

function parseDuration(
  value: string | number | undefined
): number {
  if (!value) {
    return 0;
  }

  if (typeof value === 'number') {
    return value;
  }

  const parts = value.split(':').map(Number);

  if (parts.length === 3) {
    return (
      parts[0] * 3600 +
      parts[1] * 60 +
      parts[2]
    );
  }

  if (parts.length === 2) {
    return (
      parts[0] * 60 +
      parts[1]
    );
  }

  return Number(value) || 0;
}