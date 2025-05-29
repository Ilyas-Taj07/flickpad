import { Stack } from "expo-router";
import "./global.css"

export default function RootLayout() {
  return <Stack>
    <Stack.Screen
      name="index"
      options={{
        headerShown: false
      }}
    />
    <Stack.Screen
      name="note"
      options={{
        headerShown: false
      }}
    />
    <Stack.Screen
      name="settings"
      options={{
        headerShown: false
      }}
    />
  </Stack>;
}
