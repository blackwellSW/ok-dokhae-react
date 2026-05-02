import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import ApiConfig from '@/config/api';

const TOKEN_KEY = 'auth_token';

const apiClient = axios.create({
  baseURL: ApiConfig.apiBaseUrl,
  timeout: ApiConfig.connectTimeoutMs,
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const saveToken = (token: string) => SecureStore.setItemAsync(TOKEN_KEY, token);
export const clearToken = () => SecureStore.deleteItemAsync(TOKEN_KEY);
export const getToken = () => SecureStore.getItemAsync(TOKEN_KEY);

export default apiClient;
