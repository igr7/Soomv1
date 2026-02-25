import { View, Text, ActivityIndicator } from 'react-native';
import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';

export default function Index() {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (isAuthenticated) {
        router.replace('/home');
      } else {
        router.replace('/login');
      }
    }
  }, [loading, isAuthenticated]);

  return (
    <View className="flex-1 items-center justify-center bg-background-primary">
      <Text className="text-accent-primary text-5xl font-bold mb-4">
        SOOM
      </Text>
      <ActivityIndicator size="large" color="#00FF41" className="mt-8" />
    </View>
  );
}
