import apiClient from '@/services/axiosClient';

export async function createSession(documentId: string, mode = 'student_led'): Promise<Record<string, any> | null> {
  try {
    const res = await apiClient.post('/sessions', { document_id: documentId, mode });
    if (res.status === 200 || res.status === 201) return res.data;
  } catch (e) {
    console.error('세션 생성 실패:', e);
  }
  return null;
}

export async function sendMessage(sessionId: string, content: string): Promise<Record<string, any> | null> {
  try {
    const res = await apiClient.post(`/sessions/${sessionId}/messages`, { content });
    if (res.status === 200) return res.data;
  } catch (e) {
    console.error('메시지 전송 실패:', e);
  }
  return null;
}

export async function finalizeSession(sessionId: string): Promise<string | null> {
  try {
    const res = await apiClient.post(`/sessions/${sessionId}/finalize`);
    if (res.status === 200) return res.data?.report_id ?? null;
  } catch (e) {
    console.error('세션 종료 실패:', e);
  }
  return null;
}
