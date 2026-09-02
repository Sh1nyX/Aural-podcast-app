import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Podcast } from '@/types/podcast';

type PodcastCardProps = {
  podcast: Podcast;
  onPress: () => void;
};

export default function PodcastCard({
  podcast,
  onPress,
}: PodcastCardProps) {
  return (
    <Pressable
      style={styles.card}
      onPress={onPress}
    >
      <Image
        source={{ uri: podcast.artworkUrl }}
        style={styles.image}
      />

      <View style={styles.info}>
        <Text
          style={styles.name}
          numberOfLines={2}
        >
          {podcast.name}
        </Text>

        <Text
          style={styles.artist}
          numberOfLines={1}
        >
          {podcast.artist}
        </Text>

        <Text style={styles.category}>
          {podcast.category}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    padding: 12,
    marginBottom: 12,
    borderRadius: 12,
    backgroundColor: '#eeeeee',
  },

  image: {
    width: 90,
    height: 90,
    borderRadius: 10,
  },

  info: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },

  name: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 5,
  },

  artist: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 5,
  },

  category: {
    fontSize: 12,
    color: '#208AEF',
  },
});