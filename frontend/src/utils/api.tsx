import auth from '@react-native-firebase/auth';
import { ENV } from '@utils/Constants';

const BASE_URL = `${ENV.API_IP}:3000`;

const getAuthHeader = async (): Promise<Record<string, string>> => {
  const currentUser = auth().currentUser;
  if (!currentUser) return {};
  const token = await currentUser.getIdToken();
  return { Authorization: `Bearer ${token}` };
};

type ApiFetchOptions = {
  method?: string;
  body?: any;
  headers?: Record<string, string>;
};

/**
 * Authenticated fetch wrapper — attaches the current Firebase ID token as a
 * Bearer token on every request. The backend identifies the caller from this
 * token (req.user.uid); it no longer trusts a userId/uid in the request body,
 * so every call to a protected endpoint must go through this helper.
 *
 * `body` may be a plain object (JSON-encoded automatically) or a FormData
 * instance (for photo uploads — Content-Type is left for fetch to set so it
 * can include the multipart boundary).
 */
export const apiFetch = async (path: string, options: ApiFetchOptions = {}) => {
  const { method = 'GET', body, headers = {} } = options;
  const authHeader = await getAuthHeader();
  const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;

  return fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...authHeader,
      ...headers,
    },
    body: isFormData ? body : body !== undefined ? JSON.stringify(body) : undefined,
  });
};

/** Current user's Firebase ID token, for the socket.io handshake. */
export const getSocketAuthToken = async (): Promise<string | undefined> => {
  const currentUser = auth().currentUser;
  if (!currentUser) return undefined;
  return currentUser.getIdToken();
};
