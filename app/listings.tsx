import { View, Text, FlatList, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { api } from '../constants/api';

interface Listing {
  id: string;
  title: string;
  gameCategory: string;
  currentBid: number | null;
  startPrice: number;
  buyNowPrice: number | null;
  status: string;
  endTime: string;
}

export default function ListingsScreen() {
  const router = useRouter();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    fetchListings();
  }, [search, category]);

  const fetchListings = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (category) params.append('gameCategory', category);

      const response = await api.get(`/listings?${params.toString()}`);
      setListings(response.listings);
    } catch (error) {
      console.error('Failed to fetch listings:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderListing = ({ item }: { item: Listing }) => (
    <TouchableOpacity
      onPress={() => router.push(`/listing/${item.id}`)}
      className="bg-gray-800 p-4 mb-3 rounded-lg border border-gray-700"
    >
      <Text className="text-white text-lg font-bold mb-2">{item.title}</Text>
      <Text className="text-gray-400 mb-2">{item.gameCategory}</Text>

      <View className="flex-row justify-between items-center">
        <View>
          <Text className="text-gray-400 text-sm">Current Bid</Text>
          <Text className="text-green-400 text-xl font-bold">
            {item.currentBid ? `${item.currentBid} SAR` : `${item.startPrice} SAR`}
          </Text>
        </View>

        {item.buyNowPrice && (
          <View>
            <Text className="text-gray-400 text-sm">Buy Now</Text>
            <Text className="text-green-400 text-lg">{item.buyNowPrice} SAR</Text>
          </View>
        )}
      </View>

      <Text className="text-gray-500 text-xs mt-2">
        Ends: {new Date(item.endTime).toLocaleString()}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-gray-900 p-4">
      <Text className="text-white text-2xl font-bold mb-4">Browse Listings</Text>

      <TextInput
        placeholder="Search listings..."
        placeholderTextColor="#9CA3AF"
        value={search}
        onChangeText={setSearch}
        className="bg-gray-800 text-white p-3 rounded-lg mb-3 border border-gray-700"
      />

      <TouchableOpacity
        onPress={() => router.push('/create-listing')}
        className="bg-green-500 p-4 rounded-lg mb-4"
      >
        <Text className="text-black text-center font-bold">Create New Listing</Text>
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator size="large" color="#00FF41" />
      ) : (
        <FlatList
          data={listings}
          renderItem={renderListing}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={
            <Text className="text-gray-400 text-center mt-8">No listings found</Text>
          }
        />
      )}
    </View>
  );
}
