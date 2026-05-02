export type Work = {
  id: string;
  title: string;
  author: string;
  category: string;
  baseColor: string;
  spineColor: string;
  studyTime: string;
};

export type Guidance = {
  text: string;
  is_finish: boolean;
};

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

const TUTOR_SCRIPT = [
  "글에서 가장 눈에 띄는 단어나 구절은 무엇인가요? 그 단어나 구절이 반복되거나 다른 부분과 차별화되는 이유는 무엇일까요? 그 단어나 구절이 설명하는 바가 무엇이라고 생각하나요?",
  "춘향전에서 이별의 장면이 반복적으로 등장하는 이유는 무엇일까요? 춘향전은 단순한 사랑 이야기일까요? 아니면 다른 의미를 담고 있을까요? 이별이라는 상황이 춘향전의 주제와 어떻게 연결될 수 있을까요?",
  "춘향이가 이별의 상황에서 충절을 지킨다는 것은 당시 사회에서 여성에게 어떤 의미였을까요? 춘향이가 처한 시대적 배경을 고려해보세요. 만약 춘향이가 양반 가문의 여인이었다면, 그의 선택은 어떻게 달라졌을까요?",
  "정확합니다. 당시 신분제의 한계 속에서도 춘향이 지킨 '충절'은 단순한 사랑을 넘어선, 자신의 신념을 증명하는 행위였다고 볼 수 있죠. 이 점을 정확히 짚어주셨네요. \n\n지금까지의 대화를 바탕으로 사고력 정밀 진단 리포트를 생성했습니다.",
];

const WORK_CONTENT: Record<string, string[]> = {
  simcheong: [
    "심청이 거동 봐라.",
    "밥 빌러 나갈 제, 치마 자락을 거둠거둠 안고...",
    "\"아가 아가 심청 아가. 이리 와서 점심이나 먹고 가라.\"",
    "심청이 생각한들 아니 슬플소냐.",
  ],
  gwandong: [
    "춘향이별가",
    "만금 같은 너를 만나 백년해로하잤더니, 금일 이별 어이하리! 너를 두고 어이 가잔 말이냐? 나는 아마도 못 살겠다!",
    "이별이라네 이별이라네 이 도령 춘향이가 이별이로다.",
    "잘 가시오 잘 있거라 산첩첩 수중중한데 부디 편안히 잘 가시오.",
  ],
};

const turnIndex: Record<string, number> = {};

export const mockApiService = {
  getWorks(): Work[] {
    return [
      { id: 'simcheong', title: '심청전', author: '작자미상', category: '고전소설', baseColor: '#D7CCC8', spineColor: '#5D4037', studyTime: '5분' },
      { id: 'gwandong', title: '관동별곡', author: '정철', category: '고전시가', baseColor: '#C8E6C9', spineColor: '#1B5E20', studyTime: '5분' },
    ];
  },

  async getWorkContent(workId: string): Promise<string[]> {
    await delay(300);
    return WORK_CONTENT[workId] ?? ["내용을 불러올 수 없습니다."];
  },

  async startThinkingSession(workId: string): Promise<string> {
    await delay(400);
    turnIndex[workId] = 0;
    return "좋아요. 먼저 학생이 궁금한 걸 질문해보세요. 예: \"이 구절이 왜 중요한지 모르겠어.\"";
  },

  async getGuidance(workId: string, userAnswer: string): Promise<Guidance> {
    await delay(1800);
    if (userAnswer.trim().length < 5) {
      return { text: "조금 더 구체적으로 이야기해 줄래요? 가능하면 본문 표현을 같이 언급해보면 좋아요.", is_finish: false };
    }
    if (turnIndex[workId] === undefined) turnIndex[workId] = 0;
    const idx = turnIndex[workId];
    if (idx < TUTOR_SCRIPT.length) {
      turnIndex[workId] = idx + 1;
      return { text: TUTOR_SCRIPT[idx], is_finish: idx === TUTOR_SCRIPT.length - 1 };
    }
    return { text: "좋아요. 여기까지 내용을 바탕으로 리포트를 생성해볼까요?", is_finish: true };
  },
};
