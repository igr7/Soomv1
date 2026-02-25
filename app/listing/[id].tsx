import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { api } from '../../constants/api';
import { useAuth } from '../../contexts/AuthContext';

interface Listing {
  id: string;
  title: string;
  description: string;
  gameCategory: string;
  startPrice: number;
  currentBid: number | null;
  buyNowPrice: number | null;
  status: string;
  endTime: string;
  seller: {
    id: string;
    username: string;
  };
}

interface Bid {
  id: string;
  amount: number;
  bidder: {
    username: string;
  };
  createdAt: string;
}

export default function ListingDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const [listing, setListing] = useState<Listing | null>(null);
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(true);
  const [bidAmount, setBidAmount] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchListing();
    fetchBids();
  }, [id]);

  const fetchListing = async () => {
    try {
      const response = await api.get(`/listings/${id}`);
      setListing(response.listing);
    } catch (error) {
      Alert.alert('Error', 'Failed to load listing');
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const fetchBids = async () => {
    try {
      const response = await api.get(`/bids/listing/${id}`);
      setBids(response.bids);
    } catch (error) {
      console.error('Failed to fetch bids:', error);
    }
  };

  const handlePlaceBid = async () => {
    if (!bidAmount) {
      Alert.alert('Error', 'Please enter a bid amount');
      return;
    }

    const amount = parseFloat(bidAmount);
    const minBid = listing?.currentBid ? listing.currentBid + 1 : listing?.startPrice || 0;

    if (amount < minBid) {
      Alert.alert('Error', `Minimum bid is ${minBid} SAR`);
      return;
    }

    try {
      setSubmitting(true);
      await api.post('/bids', {
        listingId: id,
        amount
      });

      Alert.alert('Success', 'Bid placed successfully');
      setBidAmount('');
      fetchListing();
      fetchBids();
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to place bid');
    } finally {
      setSubmitting(false);
    }
  };

  const handleBuyNow = async () => {
    Alert.alert(
      'Confirm Purchase',
      `Buy now for ${listing?.buyNowPrice} SAR?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: async () => {
            try {
              setSubmitting(true);
              await api.post('/bids/buy-now', {
                listingId: id
              });

              Alert.alert('Success', 'Purchase completed successfully');
              router.back();
            } catch (error: any) {
              Alert.alert('Error', error.response?.data?.message || 'Failed to complete purchase');
            } finally {
              setSubmitting(false);
            }
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <View className="flex-1 bg-gray-900 justify-center items-center">
        <ActivityIndicator size="large" color="#00FF41" />
      </View>
    );
  }

  if (!listing) {
    return (
      <View className="flex-1 bg-gray-900 justify-center items-center">
        <Text className="text-white">Listing not found</Text>
      </View>
    );
  }

  const isOwner = user?.userId === listing.seller.id;
  const isActive = listing.status === 'ACTIVE';
  const hasEnded = new Date(listing.endTime) < new Date();

  return (
    <ScrollView className="flex-1 bg-gray-900 p-4">
      <Text className="text-white text-2xl font-bold mb-2">{listing.title}</Text>
      <Text className="text-gray-400 mb-4">{listing.gameCategory}</Text>

      {listing.description && (
        <View className="mb-4">
          <Text className="text-gray-400 mb-2">Description</Text>
          <Text className="text-white">{listing.description}</Text>
        </View>
      )}

      <View className="bg-gray-800 p-4 rounded-lg mb-4 border border-gray-700">
        <View className="flex-row justify-between mb-3">
          <View>
            <Text className="text-gray-400 text-sm">Current Bid</Text>
            <Text className="text-green-400 text-2xl font-bold">
              {listing.currentBid ? `${listing.currentBid} SAR` : `${listing.startPrice} SAR`}
            </Text>
          </View>

          {listing.buyNowPrice && (
            <View>
              <Text className="text-gray-400 text-sm">Buy Now</Text>
              <Text className="text-green-400 text-xl font-bold">{listing.buyNowPrice} SAR</Text>
            </View>
          )}
        </View>

        <Text className="text-gray-400 text-sm">Seller: {listing.seller.username}</Text>
        <Text className="text-gray-400 text-sm">
          Ends: {new Date(listing.endTime).toLocaleString()}
        </Text>
        <Text className={`text-sm mt-2 ${hasEnded ? 'text-red-400' : 'text-green-400'}`}>
          Status: {hasEnded ? 'ENDED' : listing.status}
        </Text>
      </View>

      {!isOwner && isActive && !hasEnded && (
        <View className="mb-4">
          <Text className="text-white text-lg font-bold mb-3">Place Your Bid</Text>

          <TextInput
            placeholder={`Minimum: ${listing.currentBid ? listing.currentBid + 1 : listing.startPrice} SAR`}
            placeholderTextColor="#9CA3AF"
            value={bidAmount}
            onChangeText={setBidAmount}
            keyboardType="numeric"
            className="bg-gray-800 text-white p-3 rounded-lg mb-3 border border-gray-700"
          />

          <TouchableOpacity
            onPress={handlePlaceBid}
            disabled={submitting}
            className={`p-4 rounded-lg mb-3 ${submitting ? 'bg-gray-600' : 'bg-green-500'}`}
          >
            <Text className="text-black text-center font-bold text-lg">
              {submitting ? 'Placing Bid...' : 'Place Bid'}
            </Text>
          </TouchableOpacity>

          {listing.buyNowPrice && (
            <TouchableOpacity
              onPress={handleBuyNow}
              disabled={submitting}
              className={`p-4 rounded-lg border-2 ${submitting ? 'border-gray-600' : 'border-green-500'}`}
            >
              <Text className="text-green-500 text-center font-bold text-lg">
                Buy Now - {listing.buyNowPrice} SAR
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      <View className="mb-4">
        <Text className="text-white text-lg font-bold mb-3">Bid History</Text>
        {bids.length === 0 ? (
          <Text className="text-gray-400 text-center py-4">No bids yet</Text>
        ) : (
          bids.map((bid) => (
            <View key={bid.id} className="bg-gray-800 p-3 rounded-lg mb-2 border border-gray-700">
              <View className="flex-row justify-between">
                <Text className="text-white font-bold">{bid.amount} SAR</Text>
                <Text className="text-gray-400">{bid.bidder.username}</Text>
              </View>
              <Text className="text-gray-500 text-xs mt-1">
                {new Date(bid.createdAt).toLocaleString()}
              </Text>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}
