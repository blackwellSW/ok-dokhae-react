<div align="center">

# OK독해 AI 학습 시스템

<p>
  <img src="https://img.shields.io/badge/Award-2026%20Google%20Cloud%20AI%20Competition%20Grand%20Prize-3FA34D?style=for-the-badge&logo=googlecloud&logoColor=white" alt="Award Badge" />
  <img src="https://img.shields.io/badge/Stack-React%20Native%20%7C%20Expo%20%7C%20TypeScript-2F855A?style=for-the-badge" alt="Stack Badge" />
  <img src="https://img.shields.io/badge/Platform-Web%20%7C%20iOS%20%7C%20Android-14532D?style=for-the-badge" alt="Platform Badge" />
</p>

<p>
  <strong>2026 전국 Google Cloud 기반 AI 융합 경진대회 최우수상</strong><br/>
  <sub>수상일: 2026/02/13</sub>
</p>

<p>
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:14532d,50:16a34a,100:86efac&height=220&section=header&text=Thinking%20Beyond%20Answers&fontSize=44&fontColor=ffffff&animation=fadeIn&fontAlignY=35" width="100%" alt="banner" />
</p>

<p>
  <strong>Socratic AI Tutor for Classical Literature</strong><br/>
  <sub>Green-themed portfolio highlight for the OK독해 project</sub>
</p>

</div>

## 프로젝트 한 줄 소개

고전 문학 학습에서 정답을 바로 주는 대신, 학생이 스스로 근거를 찾고 사고를 확장하도록 유도하는 AI 학습 시스템입니다.

## 하이라이트

- `소크라틱 질문` 기반 대화형 튜터
- `4단계 사고` 구조의 학습 흐름
- `직접 평가 + 정량 평가` 결합 리포트
- `Google Cloud` 기반 학습 및 배포 파이프라인
- `React Native(Expo)` 앱 + `FastAPI` 백엔드 + `Vertex AI` 서비스 연동

## 언론 보도

- Pressian: https://www.pressian.com/pages/articles/2026022317460997947

## 수상 성과

<table>
  <tr>
    <td align="center" width="50%">
      <div style="font-size:18px; font-weight:700;">🏆 최우수상</div>
      <div>2026 전국 Google Cloud 기반 AI 융합 경진대회</div>
      <div><strong>2026/02/13</strong></div>
    </td>
    <td align="center" width="50%">
      <div style="font-size:18px; font-weight:700;">🌿 프로젝트 방향</div>
      <div>정답 중심이 아니라 사고 과정 중심</div>
      <div>문학 해석, 근거 연결, 재사유 강화</div>
    </td>
  </tr>
</table>

## 팀

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/healthy27">
        <img src="https://github.com/healthy27.png?size=120" width="96" height="96" style="border-radius:50%;" alt="healthy27" />
      </a>
      <br/>
      <strong>healthy27</strong>
      <br/>
      <sub>팀장, AI/데이터 담당</sub>
    </td>
    <td align="center">
      <a href="https://github.com/blackwellSW">
        <img src="https://github.com/blackwellSW.png?size=120" width="96" height="96" style="border-radius:50%;" alt="blackwellSW" />
      </a>
      <br/>
      <strong>blackwellSW</strong>
      <br/>
      <sub>프론트엔드/기획</sub>
    </td>
    <td align="center">
      <a href="https://github.com/amblergonz">
        <img src="https://github.com/amblergonz.png?size=120" width="96" height="96" style="border-radius:50%;" alt="amblergonz" />
      </a>
      <br/>
      <strong>amblergonz</strong>
      <br/>
      <sub>백엔드/기획</sub>
    </td>
    <td align="center">
      <a href="https://github.com/123k444">
        <img src="https://github.com/123k444.png?size=120" width="96" height="96" style="border-radius:50%;" alt="123k444" />
      </a>
      <br/>
      <strong>123k444</strong>
      <br/>
      <sub>백엔드/디자인</sub>
    </td>
  </tr>
</table>

## 핵심 기능

### 1. 사고를 유도하는 대화형 학습
- 학생의 답에 바로 정답 처리하지 않고, 다음 사고를 이끄는 질문을 제공합니다.
- 이해 → 해석 → 근거 연결 → 재사유를 반복하며 학습합니다.

### 2. 자동 평가 시스템
- Gemini 기반 직접 평가
- 발화문 분석 및 언어 지표 기반 정량 평가
- 두 결과를 합산해 정밀한 피드백 리포트를 작성합니다.

### 3. 문서/세션/리포트 관리
- 문서 업로드 및 파싱
- 학습 세션 생성 및 대화 로그 저장
- 리포트 생성 및 재조회
- 교사용 요약 화면 지원

### 4. 페르소나 기반 응답 스타일
- 조선 시대 문인 스타일
- 교육 스타일 기반 페르소나
- 학생이 원하는 튜터 키를 선택할 수 있는 구조

## 아키텍처

```text
사용자 입력
   ↓
React Native(Expo) 앱
   ↓
FastAPI 백엔드
   ↓
Vertex AI / vLLM 모델 서비스
   ↓
Gemini + NLP 평가
   ↓
리포트 저장 및 재조회
```

## 기술 스택

<p>
  <img src="https://img.shields.io/badge/React_Native-0F766E?style=for-the-badge&logo=react&logoColor=white" alt="React Native" />
  <img src="https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white" alt="Expo" />
  <img src="https://img.shields.io/badge/TypeScript-2E7D32?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Expo_Router-16A34A?style=for-the-badge&logo=expo&logoColor=white" alt="Expo Router" />
  <img src="https://img.shields.io/badge/Google_Cloud-34A853?style=for-the-badge&logo=googlecloud&logoColor=white" alt="Google Cloud" />
  <img src="https://img.shields.io/badge/Vertex_AI-16A34A?style=for-the-badge&logo=googlecloud&logoColor=white" alt="Vertex AI" />
  <img src="https://img.shields.io/badge/Gemini-15803D?style=for-the-badge&logo=google&logoColor=white" alt="Gemini" />
  <img src="https://img.shields.io/badge/Firestore-65A30D?style=for-the-badge&logo=firebase&logoColor=white" alt="Firestore" />
</p>

## 저장소 구성

```text
.
├── app/                    # Expo Router 화면
│   ├── landing.tsx         # 온보딩 슬라이드
│   ├── home.tsx            # 메인 홈 (파일 업로드 · 예시 작품)
│   ├── session.tsx         # AI 튜터 학습 세션
│   └── result.tsx          # 사고력 진단 리포트
├── src/
│   ├── constants/
│   │   └── theme.ts        # 색상 · 폰트 · 간격 토큰
│   └── services/
│       └── mockApiService.ts  # Mock API (백엔드 연동 전 임시)
├── assets/                 # 이미지 · 폰트 · 아이콘
└── app.json                # Expo 프로젝트 설정
```

## 실행 방법

### 1. 공통 의존성 설치

```bash
npm install
```

### 2. 웹 실행

```bash
npm run web
```

### 3. iOS / Android (Expo Go)

```bash
npx expo start
```

## 환경 변수 예시

백엔드 연동 시 필요한 환경 변수입니다. ([원본 저장소](https://github.com/blackwellSW/ok-dokhae-ai-model) 참고)

```bash
GEMINI_API_KEY=your-api-key
GOOGLE_CLIENT_ID=your-google-oauth-client-id
JWT_SECRET_KEY=change-this-in-production
DATABASE_URL=sqlite+aiosqlite:////tmp/test.db
VERTEX_AI_ENDPOINT=your-vertex-endpoint
VERTEX_AI_MODEL=classical-lit
USE_VERTEX_AI=true
CORS_ORIGINS=http://localhost:3000,http://localhost:5173
```

## 주요 API

백엔드 연동 시 사용하는 API 엔드포인트입니다.

- `POST /auth/login`
- `POST /auth/register`
- `POST /documents`
- `POST /sessions`
- `POST /sessions/{id}/messages`
- `GET /reports/{id}`
- `GET /teacher/*`

## 개발 메모

- 현재 `src/services/mockApiService.ts`가 모든 API 응답을 대체합니다. 백엔드 연동 시 각 함수를 실제 호출로 교체하면 됩니다.
- 발표/기술 정리 문서는 [원본 저장소](https://github.com/blackwellSW/ok-dokhae-ai-model)의 `docs/` 폴더에 있습니다.

## GitHub

- Repository: https://github.com/blackwellSW/ok-dokhae-ai-model

## 라이선스

MIT License
