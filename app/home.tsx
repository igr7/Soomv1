import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';

export default function Home() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
  };

  return (
    <View className="flex-1 bg-background-primary px-6 py-8">
      <View className="items-center mt-12">
        <Text className="text-accent-primary text-4xl font-bold mb-4">
          Welcome!
        </Text>
        <Text className="text-text-primary text-xl mb-2">
          {user?.username}
        </Text>
        <Text className="text-text-secondary text-sm mb-8">
          {user?.email}
        </Text>

        <View className="bg-background-secondary rounded-lg p-6 w-full mb-8">
          <Text className="text-text-secondary text-sm mb-2">Wallet Balance</Text>
          <Text className="text-accent-primary text-3xl font-bold">
            {user?.walletBalance} SAR
          </Text>
        </View>

        <View className="w-full mb-8">
          <Text className="text-text-primary text-lg font-bold mb-4">Marketplace</Text>

          <TouchableOpacity
            className="bg-accent-primary py-4 px-6 rounded-lg mb-3"
            onPress={() => router.push('/listings')}
          >
            <Text className="text-black font-bold text-center">Browse Listings</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-background-secondary py-4 px-6 rounded-lg mb-3 border border-accent-primary"
            onPress={() => router.push('/my-bids')}
          >
            <Text className="text-accent-primary font-bold text-center">My Bids</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-background-secondary py-4 px-6 rounded-lg border border-accent-primary"
            onPress={() => router.push('/my-listings')}
          >
            <Text className="text-accent-primary font-bold text-center">My Listings</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          className="bg-error py-4 px-8 rounded-lg"
          onPress={handleLogout}
        >
          <Text className="text-white font-bold">Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
