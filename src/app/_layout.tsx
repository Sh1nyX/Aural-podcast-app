import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ title: 'Аудіо' }}
      />

      <Stack.Screen
        name="record"
        options={{ title: 'Нова запис' }}
      />

      <Stack.Screen
        name="recordings"
        options={{ title: 'Мої записи' }}
      />

      <Stack.Screen
        name="podcasts"
        options={{ title: 'Подкасти' }}
      />

      <Stack.Screen
        name="player/[id]"
        options={{ title: 'Плеер' }}
      />
    </Stack>
  );
}