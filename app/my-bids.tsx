import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { api } from '../constants/api';

interface Bid {
  id: string;
  amount: number;
  createdAt: string;
  listing: {
    id: string;
    title: string;
    gameCategory: string;
    currentBid: number | null;
    status: string;
    endTime: string;
  };
}

export default function MyBidsScreen() {
  const router = useRouter();
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyBids();
  }, []);

  const fetchMyBids = async () => {
    try {
      setLoading(true);
      const response = await api.get('/bids/my');
      setBids(response.bids);
    } catch (error) {
      console.error('Failed to fetch bids:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderBid = ({ item }: { item: Bid }) => {
    const isWinning = item.listing.currentBid === item.amount;
    const hasEnded = new Date(item.listing.endTime) < new Date();

    return (
      <TouchableOpacity
        onPress={() => router.push(`/listing/${item.listing.id}`)}
        className="bg-gray-800 p-4 mb-3 rounded-lg border border-gray-700"
      >
        <Text className="text-white text-lg font-bold mb-2">{item.listing.title}</Text>
        <Text className="text-gray-400 mb-2">{item.listing.gameCategory}</Text>

        <View className="flex-row justify-between items-center mb-2">
          <View>
            <Text className="text-gray-400 text-sm">Your Bid</Text>
            <Text className="text-green-400 text-xl font-bold">{item.amount} SAR</Text>
          </View>

          <View>
            <Text className="text-gray-400 text-sm">Current Bid</Text>
            <Text className="text-white text-lg">
              {item.listing.currentBid || item.listing.startPrice} SAR
            </Text>
          </View>
        </View>

        <View className="flex-row justify-between items-center">
          <Text
            className={`font-bold ${
              isWinning ? 'text-green-400' : 'text-yellow-400'
            }`}
          >
            {isWinning ? '🏆 Winning' : '⚠️ Outbid'}
          </Text>

          <Text className={`text-sm ${hasEnded ? 'text-red-400' : 'text-gray-400'}`}>
            {hasEnded ? 'Ended' : item.listing.status}
          </Text>
        </View>

        <Text className="text-gray-500 text-xs mt-2">
          Bid placed: {new Date(item.createdAt).toLocaleString()}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View className="flex-1 bg-gray-900 p-4">
      <Text className="text-white text-2xl font-bold mb-4">My Bids</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#00FF41" />
      ) : (
        <FlatList
          data={bids}
          renderItem={renderBid}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={
            <View className="items-center mt-8">
              <Text className="text-gray-400 text-center mb-4">No bids yet</Text>
              <TouchableOpacity
                onPress={() => router.push('/listings')}
                className="bg-green-500 px-6 py-3 rounded-lg"
              >
                <Text className="text-black font-bold">Browse Listings</Text>
              </TouchableOpacity>
            </View>
          }
        />
      )}
    </View>
  );
}
