import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    const result = await login(email, password);

    if (result.success) {
      router.replace('/home');
    } else {
      setError(result.error || 'Login failed');
    }

    setLoading(false);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-background-primary"
    >
      <ScrollView contentContainerClassName="flex-1">
        <View className="flex-1 justify-center px-6">
          {/* Logo */}
          <View className="items-center mb-12">
            <Text className="text-accent-primary text-5xl font-bold mb-2">
              SOOM
            </Text>
            <Text className="text-text-secondary text-base">
              Gaming Marketplace
            </Text>
          </View>

          {/* Form */}
          <View className="space-y-4">
            <View>
              <Text className="text-text-secondary text-sm mb-2">Email</Text>
              <TextInput
                className="bg-background-secondary text-text-primary px-4 py-3 rounded-lg border border-border-primary"
                placeholder="Enter your email"
                placeholderTextColor="#707070"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                editable={!loading}
              />
            </View>

            <View>
              <Text className="text-text-secondary text-sm mb-2">Password</Text>
              <TextInput
                className="bg-background-secondary text-text-primary px-4 py-3 rounded-lg border border-border-primary"
                placeholder="Enter your password"
                placeholderTextColor="#707070"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                editable={!loading}
              />
            </View>

            {error ? (
              <View className="bg-error/10 border border-error rounded-lg p-3">
                <Text className="text-error text-sm">{error}</Text>
              </View>
            ) : null}

            <TouchableOpacity
              className={`bg-accent-primary py-4 rounded-lg items-center ${loading ? 'opacity-50' : ''}`}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#0a0a0a" />
              ) : (
                <Text className="text-background-primary font-bold text-base">
                  Login
                </Text>
              )}
            </TouchableOpacity>

            <View className="flex-row justify-center items-center mt-6">
              <Text className="text-text-tertiary">Don't have an account? </Text>
              <TouchableOpacity onPress={() => router.push('/register')}>
                <Text className="text-accent-primary font-semibold">Register</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
