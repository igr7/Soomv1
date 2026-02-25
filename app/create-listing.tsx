import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { api } from '../constants/api';

export default function CreateListingScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    gameCategory: '',
    startPrice: '',
    buyNowPrice: '',
    duration: '24'
  });

  const handleCreate = async () => {
    if (!formData.title || !formData.gameCategory || !formData.startPrice || !formData.duration) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      await api.post('/listings', {
        title: formData.title,
        description: formData.description,
        gameCategory: formData.gameCategory,
        startPrice: parseFloat(formData.startPrice),
        buyNowPrice: formData.buyNowPrice ? parseFloat(formData.buyNowPrice) : null,
        duration: parseInt(formData.duration),
        images: []
      });

      Alert.alert('Success', 'Listing created successfully');
      router.back();
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to create listing');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-gray-900 p-4">
      <Text className="text-white text-2xl font-bold mb-6">Create New Listing</Text>

      <Text className="text-gray-400 mb-2">Title *</Text>
      <TextInput
        placeholder="Enter listing title"
        placeholderTextColor="#9CA3AF"
        value={formData.title}
        onChangeText={(text) => setFormData({ ...formData, title: text })}
        className="bg-gray-800 text-white p-3 rounded-lg mb-4 border border-gray-700"
      />

      <Text className="text-gray-400 mb-2">Description</Text>
      <TextInput
        placeholder="Enter description"
        placeholderTextColor="#9CA3AF"
        value={formData.description}
        onChangeText={(text) => setFormData({ ...formData, description: text })}
        multiline
        numberOfLines={4}
        className="bg-gray-800 text-white p-3 rounded-lg mb-4 border border-gray-700"
      />

      <Text className="text-gray-400 mb-2">Game Category *</Text>
      <TextInput
        placeholder="e.g., PUBG, FIFA, Fortnite"
        placeholderTextColor="#9CA3AF"
        value={formData.gameCategory}
        onChangeText={(text) => setFormData({ ...formData, gameCategory: text })}
        className="bg-gray-800 text-white p-3 rounded-lg mb-4 border border-gray-700"
      />

      <Text className="text-gray-400 mb-2">Start Price (SAR) *</Text>
      <TextInput
        placeholder="Minimum bid amount"
        placeholderTextColor="#9CA3AF"
        value={formData.startPrice}
        onChangeText={(text) => setFormData({ ...formData, startPrice: text })}
        keyboardType="numeric"
        className="bg-gray-800 text-white p-3 rounded-lg mb-4 border border-gray-700"
      />

      <Text className="text-gray-400 mb-2">Buy Now Price (SAR)</Text>
      <TextInput
        placeholder="Optional instant purchase price"
        placeholderTextColor="#9CA3AF"
        value={formData.buyNowPrice}
        onChangeText={(text) => setFormData({ ...formData, buyNowPrice: text })}
        keyboardType="numeric"
        className="bg-gray-800 text-white p-3 rounded-lg mb-4 border border-gray-700"
      />

      <Text className="text-gray-400 mb-2">Duration (hours) *</Text>
      <TextInput
        placeholder="1-168 hours (7 days max)"
        placeholderTextColor="#9CA3AF"
        value={formData.duration}
        onChangeText={(text) => setFormData({ ...formData, duration: text })}
        keyboardType="numeric"
        className="bg-gray-800 text-white p-3 rounded-lg mb-6 border border-gray-700"
      />

      <TouchableOpacity
        onPress={handleCreate}
        disabled={loading}
        className={`p-4 rounded-lg mb-4 ${loading ? 'bg-gray-600' : 'bg-green-500'}`}
      >
        <Text className="text-black text-center font-bold text-lg">
          {loading ? 'Creating...' : 'Create Listing'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.back()}
        className="p-4 rounded-lg border border-gray-700"
      >
        <Text className="text-white text-center font-bold">Cancel</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
