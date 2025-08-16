import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ title: "Taskly", headerShown: false }}
      />
    </Stack>
  );
}
