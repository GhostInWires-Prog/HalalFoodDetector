import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
const API_BASE_URL = 'http://172.28.3.122:8000';
console.log('API base URL:', API_BASE_URL);
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  // Model inference can take longer on device networks; allow ample time before aborting.
  timeout: 120_000,
  maxContentLength: Infinity,
  maxBodyLength: Infinity,
});

apiClient.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('bms.auth.user');
  const buildingId = await AsyncStorage.getItem('bms.currentBuildingId');

  if (token) {
    config.headers.Authorization = token;
  }

  if (buildingId) {
    config.headers['X-Building-Id'] = buildingId;
  }

  return config;
});

