import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';

export default function Register() {
  const router = useRouter();
  const { register } = useAuth();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);

  const handleRegister = async () => {
    const validationErrors = [];

    if (!username) validationErrors.push('Username is required');
    if (!email) validationErrors.push('Email is required');
    if (!password) validationErrors.push('Password is required');
    if (password !== confirmPassword) validationErrors.push('Passwords do not match');

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setErrors([]);

    const result = await register(username, email, password);

    if (result.success) {
      router.replace('/home');
    } else {
      setErrors(result.errors?.length > 0 ? result.errors : [result.error]);
    }

    setLoading(false);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-background-primary"
    >
      <ScrollView contentContainerClassName="flex-1">
        <View className="flex-1 justify-center px-6 py-8">
          {/* Logo */}
          <View className="items-center mb-8">
            <Text className="text-accent-primary text-5xl font-bold mb-2">
              SOOM
            </Text>
            <Text className="text-text-secondary text-base">
              Create your account
            </Text>
          </View>

          {/* Form */}
          <View className="space-y-4">
            <View>
              <Text className="text-text-secondary text-sm mb-2">Username</Text>
              <TextInput
                className="bg-background-secondary text-text-primary px-4 py-3 rounded-lg border border-border-primary"
                placeholder="Choose a username"
                placeholderTextColor="#707070"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                editable={!loading}
              />
            </View>

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
                placeholder="Create a password"
                placeholderTextColor="#707070"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                editable={!loading}
              />
            </View>

            <View>
              <Text className="text-text-secondary text-sm mb-2">Confirm Password</Text>
              <TextInput
                className="bg-background-secondary text-text-primary px-4 py-3 rounded-lg border border-border-primary"
                placeholder="Confirm your password"
                placeholderTextColor="#707070"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                editable={!loading}
              />
            </View>

            {errors.length > 0 ? (
              <View className="bg-error/10 border border-error rounded-lg p-3">
                {errors.map((error, index) => (
                  <Text key={index} className="text-error text-sm">
                    • {error}
                  </Text>
                ))}
              </View>
            ) : null}

            <TouchableOpacity
              className={`bg-accent-primary py-4 rounded-lg items-center ${loading ? 'opacity-50' : ''}`}
              onPress={handleRegister}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#0a0a0a" />
              ) : (
                <Text className="text-background-primary font-bold text-base">
                  Create Account
                </Text>
              )}
            </TouchableOpacity>

            <View className="flex-row justify-center items-center mt-4">
              <Text className="text-text-tertiary">Already have an account? </Text>
              <TouchableOpacity onPress={() => router.push('/login')}>
                <Text className="text-accent-primary font-semibold">Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
