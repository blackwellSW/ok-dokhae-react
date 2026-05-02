import apiClient, { saveToken } from '@/services/axiosClient';

export async function loginWithGoogle(idToken: string, userType = 'student'): Promise<boolean> {
  try {
    const res = await apiClient.post('/auth/google-login', {
      id_token: idToken,
      user_type: userType,
    });

    if (res.status === 200 || res.status === 201) {
      const token = res.data?.access_token;
      if (token) {
        await saveToken(token);
        return true;
      }
    }
    return false;
  } catch (e) {
    console.error('Login Error:', e);
    return false;
  }
}
