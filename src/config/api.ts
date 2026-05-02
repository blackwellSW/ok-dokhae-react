const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL ??
  'https://ok-dokhae-backend-84537953160.asia-northeast1.run.app';

const DEMO_MODE = process.env.EXPO_PUBLIC_DEMO_MODE === 'true';

const CONNECT_TIMEOUT_MS = Number(process.env.EXPO_PUBLIC_CONNECT_TIMEOUT_MS ?? 10000);
const RECEIVE_TIMEOUT_MS = Number(process.env.EXPO_PUBLIC_RECEIVE_TIMEOUT_MS ?? 10000);

const ApiConfig = {
  demoMode: DEMO_MODE,
  apiBaseUrl: API_BASE_URL,
  connectTimeoutMs: CONNECT_TIMEOUT_MS,
  receiveTimeoutMs: RECEIVE_TIMEOUT_MS,
} as const;

export default ApiConfig;
