import apiClient from '@/services/axiosClient';
import { Document } from '@/models/document';

export async function uploadDocument(fileName: string, fileUri: string, fileBytes?: Uint8Array): Promise<Document | null> {
  try {
    const formData = new FormData();
    formData.append('file', { uri: fileUri, name: fileName, type: 'application/pdf' } as any);
    formData.append('title', fileName);

    const res = await apiClient.post('/documents', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    const data = res.data;
    const realTitle = data?.meta?.filename ?? data?.title ?? fileName;
    const realChars = data?.meta?.total_chars ?? data?.total_chars ?? data?.char_count ?? 0;

    return {
      id: data?.document_id ?? data?.id ?? '',
      title: realTitle,
      contentType: 'application/pdf',
      charCount: realChars,
    };
  } catch (e) {
    console.error('업로드 실패:', e);
    return null;
  }
}

export async function getDocuments(): Promise<Document[]> {
  try {
    const res = await apiClient.get('/documents');
    const list: any[] = res.data?.documents ?? (Array.isArray(res.data) ? res.data : []);

    const results = await Promise.all(
      list.map(async (e) => {
        let id: string = e?.document_id ?? e?.id ?? '';
        let title: string = e?.title ?? e?.filename ?? '제목 없음';
        let charCount: number = e?.total_chars ?? e?.char_count ?? 0;

        if (id && (title === id || title.startsWith('doc_'))) {
          try {
            const detail = await apiClient.get(`/documents/${id}`);
            title = detail.data?.meta?.filename ?? title;
            charCount = detail.data?.meta?.total_chars ?? charCount;
          } catch {}
        }

        return { id, title, charCount };
      }),
    );
    return results;
  } catch (e) {
    console.error('목록 조회 실패:', e);
    return [];
  }
}

export async function deleteDocument(documentId: string): Promise<boolean> {
  try {
    const res = await apiClient.delete(`/documents/${documentId}`);
    return res.status === 200 || res.status === 204;
  } catch {
    return false;
  }
}

export async function getDocumentContent(documentId: string): Promise<string[]> {
  try {
    const res = await apiClient.get(`/documents/${documentId}/chunks`);
    const rawList: any[] = Array.isArray(res.data)
      ? res.data
      : res.data?.chunks ?? res.data?.data ?? [];

    return rawList.map((item) => {
      if (typeof item === 'string') return item;
      if (typeof item === 'object' && item?.text) return String(item.text);
      return String(item);
    });
  } catch {
    return ['내용을 불러올 수 없습니다.'];
  }
}
