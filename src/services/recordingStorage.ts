import AsyncStorage from '@react-native-async-storage/async-storage';
import { File } from 'expo-file-system';

import { Recording } from '@/types/recording';

const STORAGE_KEY = '@audio_notes_recordings';

export async function getRecordings(): Promise<Recording[]> {
  const data = await AsyncStorage.getItem(STORAGE_KEY);

  if (!data) {
    return [];
  }

  return JSON.parse(data);
}

export async function saveRecordings(
  recordings: Recording[]
): Promise<void> {
  await AsyncStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(recordings)
  );
}

export async function deleteRecordingFile(
  uri: string
): Promise<void> {
  const file = new File(uri);

  if (file.exists) {
    file.delete();
  }
}