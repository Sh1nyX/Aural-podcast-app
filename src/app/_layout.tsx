import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#0F1110',
        },
        headerTintColor: '#F1F3F1',
        headerTitleStyle: {
          fontWeight: '600',
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{ title: 'Аудіо' }}
      />

      <Stack.Screen
        name="record"
        options={{ title: 'Новий запис' }}
      />

      <Stack.Screen
        name="podcasts"
        options={{ title: 'Подкасти' }}
      />

      <Stack.Screen
        name="podcasts/[id]"
        options={{ title: 'Випуски' }}
      />

      <Stack.Screen
        name="podcasts/search"
        options={{ title: 'Пошук подкастів' }}
      />

      <Stack.Screen
        name="player/[id]"
        options={{ title: 'Плеєр' }}
      />
    </Stack>
  );
}