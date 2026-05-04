<div align="center">

# OK독해 AI 학습 시스템 — React Native

<p>
  <img src="https://img.shields.io/badge/Award-2026%20Google%20Cloud%20AI%20Competition%20Grand%20Prize-3FA34D?style=for-the-badge&logo=googlecloud&logoColor=white" alt="Award Badge" />
  <img src="https://img.shields.io/badge/Stack-React%20Native%20%7C%20Expo%20%7C%20TypeScript-2F855A?style=for-the-badge" alt="Stack Badge" />
  <img src="https://img.shields.io/badge/Platform-Web%20%7C%20iOS%20%7C%20Android-14532D?style=for-the-badge" alt="Platform Badge" />
</p>

<p>
  <strong>2026 전국 Google Cloud 기반 AI 융합 경진대회 최우수상 수상작</strong><br/>
  <sub>Flutter 앱의 React Native(Expo) 크로스플랫폼 이식 버전</sub>
</p>

<p>
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:14532d,50:16a34a,100:86efac&height=220&section=header&text=Thinking%20Beyond%20Answers&fontSize=44&fontColor=ffffff&animation=fadeIn&fontAlignY=35" width="100%" alt="banner" />
</p>

</div>

## 프로젝트 한 줄 소개

고전 문학 학습에서 정답을 바로 주는 대신, 학생이 스스로 근거를 찾고 사고를 확장하도록 유도하는 AI 학습 시스템의 React Native 프론트엔드입니다.

---

## 이 저장소에 대해

원본 프로젝트([ok-dokhae-ai-model](https://github.com/blackwellSW/ok-dokhae-ai-model))는 Flutter + FastAPI + Vertex AI 기반으로 개발되었습니다. 이 저장소는 동일한 서비스를 **React Native(Expo)** 로 이식한 버전으로, 웹·iOS·Android를 단일 코드베이스로 지원하는 것을 목표로 합니다.

> 현재는 Mock API 기반으로 동작하며, 백엔드 연동 시 `src/services/mockApiService.ts`의 각 함수를 실제 API 호출로 교체하면 됩니다.

---

## 화면 구성

| 화면 | 설명 |
|------|------|
| **Landing** | 온보딩 슬라이드 + Google 로그인 |
| **Home** | 파일 업로드 + 예시 작품 선택 |
| **Session** | 소크라틱 AI 튜터와의 대화 세션 |
| **Result** | 사고력 진단 리포트 (영역별 점수 · 흐름 분석 · 맞춤 처방) |

---

## 핵심 기능

### 1. 사고를 유도하는 대화형 학습
- 학생의 답에 바로 정답을 알려주지 않고, 다음 사고를 이끄는 질문을 제공합니다.
- 이해 → 정서 분석 → 근거 연결 → 맥락 확장의 4단계 흐름으로 학습합니다.

### 2. 파일 업로드 기반 학습
- PDF, TXT, DOCX 파일을 업로드해 자신만의 지문으로 세션을 시작할 수 있습니다.
- 텍스트 파일은 업로드 즉시 미리보기를 제공합니다.

### 3. 진단 리포트
- 이해력 · 추론력 · 근거력 · 표현력 4개 영역의 점수와 등급을 시각화합니다.
- 사고 흐름 타임라인으로 각 단계의 수행 수준을 확인할 수 있습니다.
- 튜터의 맞춤 처방으로 다음 학습 방향을 제시합니다.

---

## 기술 스택

<p>
  <img src="https://img.shields.io/badge/React_Native-0F766E?style=for-the-badge&logo=react&logoColor=white" alt="React Native" />
  <img src="https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white" alt="Expo" />
  <img src="https://img.shields.io/badge/TypeScript-2E7D32?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Expo_Router-16A34A?style=for-the-badge&logo=expo&logoColor=white" alt="Expo Router" />
  <img src="https://img.shields.io/badge/Pretendard-15803D?style=for-the-badge" alt="Pretendard" />
</p>

| 분류 | 기술 |
|------|------|
| 프레임워크 | React Native 0.76 (New Architecture) |
| 개발 환경 | Expo SDK 52 |
| 라우팅 | Expo Router v4 (파일 기반) |
| 언어 | TypeScript |
| 폰트 | Pretendard (Regular · Medium · Bold) |
| 아이콘 | @expo/vector-icons (MaterialCommunityIcons) |
| 파일 선택 | expo-document-picker |
| 애니메이션 | React Native Animated API |

---

## 프로젝트 구조

```text
ok-dokhae-react/
├── app/                    # Expo Router 화면
│   ├── landing.tsx         # 온보딩 슬라이드
│   ├── home.tsx            # 메인 홈
│   ├── session.tsx         # 학습 세션
│   └── result.tsx          # 진단 리포트
├── src/
│   ├── constants/
│   │   └── theme.ts        # 색상·폰트·간격 토큰
│   └── services/
│       └── mockApiService.ts  # Mock API (백엔드 연동 전 임시)
└── assets/                 # 이미지·폰트·아이콘
```

---

## 실행 방법

### 의존성 설치

```bash
npm install
```

### 웹 실행

```bash
npm run web
```

### iOS / Android (Expo Go)

```bash
npx expo start
```

---

## 백엔드 연동 가이드

현재 `src/services/mockApiService.ts`가 모든 API 응답을 하드코딩으로 반환합니다. 실제 백엔드 연동 시 아래 함수들을 교체하면 됩니다.

| 함수 | 역할 |
|------|------|
| `getWorks()` | 학습 가능한 작품 목록 조회 |
| `getWorkContent(id)` | 지문 본문 조회 |
| `startThinkingSession(id)` | 세션 초기화 |
| `getGuidance(id, answer)` | AI 튜터 응답 생성 |

---

## 관련 링크

- 원본 저장소: [ok-dokhae-ai-model](https://github.com/blackwellSW/ok-dokhae-ai-model)
- 수상 소식 (Pressian): https://www.pressian.com/pages/articles/2026022317460997947

---

## 팀

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/healthy27">
        <img src="https://github.com/healthy27.png?size=120" width="80" height="80" style="border-radius:50%;" alt="healthy27" />
      </a>
      <br/>
      <strong>healthy27</strong>
      <br/>
      <sub>팀장 · AI/데이터</sub>
    </td>
    <td align="center">
      <a href="https://github.com/blackwellSW">
        <img src="https://github.com/blackwellSW.png?size=120" width="80" height="80" style="border-radius:50%;" alt="blackwellSW" />
      </a>
      <br/>
      <strong>blackwellSW</strong>
      <br/>
      <sub>프론트엔드 · 기획</sub>
    </td>
    <td align="center">
      <a href="https://github.com/amblergonz">
        <img src="https://github.com/amblergonz.png?size=120" width="80" height="80" style="border-radius:50%;" alt="amblergonz" />
      </a>
      <br/>
      <strong>amblergonz</strong>
      <br/>
      <sub>백엔드 · 기획</sub>
    </td>
    <td align="center">
      <a href="https://github.com/123k444">
        <img src="https://github.com/123k444.png?size=120" width="80" height="80" style="border-radius:50%;" alt="123k444" />
      </a>
      <br/>
      <strong>123k444</strong>
      <br/>
      <sub>백엔드 · 디자인</sub>
    </td>
  </tr>
</table>

---

## 라이선스

MIT License
