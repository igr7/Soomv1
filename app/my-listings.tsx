import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { api } from '../constants/api';

interface Listing {
  id: string;
  title: string;
  gameCategory: string;
  startPrice: number;
  currentBid: number | null;
  buyNowPrice: number | null;
  status: string;
  endTime: string;
  _count: {
    bids: number;
  };
}

export default function MyListingsScreen() {
  const router = useRouter();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyListings();
  }, []);

  const fetchMyListings = async () => {
    try {
      setLoading(true);
      const response = await api.get('/listings/my');
      setListings(response.listings);
    } catch (error) {
      console.error('Failed to fetch listings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    Alert.alert(
      'Delete Listing',
      'Are you sure you want to delete this listing?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await api.delete(`/listings/${id}`);
              Alert.alert('Success', 'Listing deleted successfully');
              fetchMyListings();
            } catch (error: any) {
              Alert.alert('Error', error.response?.data?.message || 'Failed to delete listing');
            }
          }
        }
      ]
    );
  };

  const renderListing = ({ item }: { item: Listing }) => {
    const hasEnded = new Date(item.endTime) < new Date();
    const statusColor =
      item.status === 'ACTIVE' ? 'text-green-400' :
      item.status === 'SOLD' ? 'text-blue-400' :
      item.status === 'DISPUTED' ? 'text-red-400' :
      'text-yellow-400';

    return (
      <View className="bg-gray-800 p-4 mb-3 rounded-lg border border-gray-700">
        <TouchableOpacity onPress={() => router.push(`/listing/${item.id}`)}>
          <Text className="text-white text-lg font-bold mb-2">{item.title}</Text>
          <Text className="text-gray-400 mb-2">{item.gameCategory}</Text>

          <View className="flex-row justify-between items-center mb-3">
            <View>
              <Text className="text-gray-400 text-sm">Current Bid</Text>
              <Text className="text-green-400 text-xl font-bold">
                {item.currentBid ? `${item.currentBid} SAR` : `${item.startPrice} SAR`}
              </Text>
            </View>

            <View>
              <Text className="text-gray-400 text-sm">Total Bids</Text>
              <Text className="text-white text-xl font-bold">{item._count.bids}</Text>
            </View>
          </View>

          <View className="flex-row justify-between items-center mb-3">
            <Text className={`font-bold ${statusColor}`}>
              {hasEnded ? 'ENDED' : item.status}
            </Text>
            <Text className="text-gray-500 text-xs">
              Ends: {new Date(item.endTime).toLocaleDateString()}
            </Text>
          </View>
        </TouchableOpacity>

        {item.status === 'PENDING' && (
          <TouchableOpacity
            onPress={() => handleDelete(item.id)}
            className="bg-red-600 py-2 px-4 rounded-lg mt-2"
          >
            <Text className="text-white text-center font-bold">Delete</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <View className="flex-1 bg-gray-900 p-4">
      <Text className="text-white text-2xl font-bold mb-4">My Listings</Text>

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
            <View className="items-center mt-8">
              <Text className="text-gray-400 text-center mb-4">No listings yet</Text>
              <Text className="text-gray-500 text-center">
                Create your first listing to start selling
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}
