import axios from 'axios';
import { BASE_URL } from '../utils/Base_URL';
import { logout } from '../redux/slices/authSlice';

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor
apiClient.interceptors.request.use(
  (config) => {
    const { store } = require('../redux/store');
    const state = store.getState();
    const token = state.auth.token;
    console.log("token", token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // API LOGGING
    console.log(`[API REQUEST] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    if (config.headers.Authorization) {
      console.log(`[AUTH TOKEN] ${config.headers.Authorization.toString().substring(0, 20)}...`);
    }
    if (config.data) console.log(`[DATA]`, config.data);
    return config;
  },
  (error) => {
    console.error(`[API REQUEST ERROR]`, error);
    return Promise.reject(error);
  }
);

// Response Interceptor
apiClient.interceptors.response.use(
  (response) => {
    // API LOGGING
    console.log(`[API RESPONSE] ${response.status} ${response.config.url}`, response.data);
    return response;
  },
  (error) => {
    // API LOGGING
    console.error(`[API ERROR] ${error.response?.status} ${error.config?.url}`, JSON.stringify(error.response?.data, null, 2) || error.message);

    if (error.response && error.response.status === 401) {
      // Unauthorized, logout user if they were logged in
      const { store } = require('../redux/store');
      const state = store.getState();
      if (state.auth.isAuthenticated) {
        store.dispatch(logout());
      }
      
      try {
        const { navigationRef } = require('../navigations/AppNavigator');
        if (navigationRef.isReady()) {
          navigationRef.reset({
            index: 0,
            routes: [{ name: 'ChooseRole' }],
          });
        }
      } catch (navErr) {
        console.error('[API CLIENT] Error resetting navigation:', navErr);
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
