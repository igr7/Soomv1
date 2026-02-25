import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from '../contexts/AuthContext';
import '../global.css';

export default function RootLayout() {
  return (
    <AuthProvider>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: '#0a0a0a',
          },
          headerTintColor: '#00FF41',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          contentStyle: {
            backgroundColor: '#0a0a0a',
          },
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="login"
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="register"
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="home"
          options={{
            title: 'Home',
            headerShown: true
          }}
        />
      </Stack>
    </AuthProvider>
  );
}
