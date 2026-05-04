import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, fonts, spacing, radius } from '@/constants/theme';

type ScoreItem = { label: string; score: number; reason: string };
type FlowStep = { step: string; status: string; comment: string; quote?: string | null };
type ReportData = {
  summary: string;
  tags: string[];
  scores: ScoreItem[];
  flow_analysis: FlowStep[];
  prescription: string;
};

const MOCK_REPORT: ReportData = {
  summary: '본문의 핵심 정서를 파악하고 있으나,\n근거를 구체적으로 연결하는 연습이 필요합니다.',
  tags: ['#이별의정서', '#고전시가', '#근거부족'],
  scores: [
    { label: '이해력', score: 0.82, reason: '본문의 주요 사건과 인물 관계를 정확히 파악했습니다.' },
    { label: '추론력', score: 0.65, reason: '감정의 원인을 추론했으나 본문 근거가 다소 부족합니다.' },
    { label: '근거력', score: 0.48, reason: '주장에 비해 인용한 본문 표현이 적었습니다.' },
    { label: '표현력', score: 0.75, reason: '자신의 해석을 명확하게 언어로 전달했습니다.' },
  ],
  flow_analysis: [
    { step: '주제 파악', status: 'good', comment: '이별과 충절이라는 핵심 주제를 빠르게 포착했습니다.', quote: '이별이라네 이별이라네' },
    { step: '정서 분석', status: 'excellent', comment: '화자의 슬픔과 체념을 구체적인 어휘로 설명했습니다.' },
    { step: '근거 제시', status: 'weak', comment: '주장은 명확했으나 본문 인용이 부족했습니다.' },
    { step: '맥락 연결', status: 'average', comment: '시대적 배경과 작품의 연결을 시도했으나 완성도가 아쉽습니다.' },
  ],
  prescription:
    '본문에서 자신의 해석을 뒷받침하는 구절을 직접 찾아 인용하는 연습을 해보세요. \'이 표현이 ~을 의미한다\'는 방식으로 연결하면 논리력이 빠르게 성장합니다.',
};

function getGrade(score: number): { text: string; color: string } {
  if (score >= 0.9) return { text: '탁월', color: '#2E7D32' };
  if (score >= 0.75) return { text: '우수', color: '#43A047' };
  if (score >= 0.5) return { text: '보통', color: '#F9A825' };
  return { text: '미흡', color: '#C62828' };
}

function StepIcon({ status }: { status: string }) {
  const s = status.toLowerCase();
  if (s.includes('perfect') || s.includes('excellent')) {
    return <MaterialCommunityIcons name="check-circle" size={24} color="#2E7D32" />;
  }
  if (s.includes('good') || s.includes('average')) {
    return <MaterialCommunityIcons name="check-circle-outline" size={24} color="#1976D2" />;
  }
  return <MaterialCommunityIcons name="alert-circle-outline" size={24} color="#F57F17" />;
}

export default function ResultScreen() {
  const { reportData } = useLocalSearchParams<{ reportData: string }>();

  let parsed: ReportData | null = null;
  try {
    const raw = JSON.parse(reportData ?? 'null');
    if (raw && typeof raw === 'object') parsed = raw as ReportData;
  } catch { /* ignore */ }

  const data = parsed ?? MOCK_REPORT;
  const tags: string[] = Array.isArray(data.tags) ? data.tags : [];
  const scores: ScoreItem[] = Array.isArray(data.scores) ? data.scores : [];
  const flows: FlowStep[] = Array.isArray(data.flow_analysis) ? data.flow_analysis : [];
  const summary = data.summary || '요약 내용이 없습니다.';
  const prescription = data.prescription || '처방 내용이 없습니다.';

  const handleSaveAndExit = () => {
    router.replace('/home');
  };

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <View style={{ width: 36 }} />
        <Text style={styles.headerTitle}>진단 리포트</Text>
        <TouchableOpacity onPress={handleSaveAndExit} style={styles.closeBtn}>
          <MaterialCommunityIcons name="close" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>
      <View style={styles.headerDivider} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: spacing.md, paddingBottom: spacing.md }}
      >
        {/* 태그 + 요약 */}
        <View style={styles.card}>
          <View style={styles.tagsRow}>
            {tags.map((tag, i) => (
              <View key={i} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
          <View style={{ height: spacing.md }} />
          <Text style={styles.summaryText}>{summary}</Text>
        </View>

        <View style={styles.gap} />

        {/* 영역별 강점 및 약점 */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>영역별 강점 및 약점</Text>
          <Text style={styles.sectionSubtitle}>이번 세션에서 관찰된 사고 패턴을 분석했습니다.</Text>
          <View style={{ height: spacing.lg }} />

          {scores.length === 0 ? (
            <Text style={styles.emptyText}>점수 분석 데이터를 불러오지 못했습니다.</Text>
          ) : (
            scores.map((item, i) => {
              const rawScore = Math.min(Math.max(item.score > 1 ? item.score / 100 : item.score, 0), 1);
              const grade = getGrade(rawScore);
              return (
                <View key={i} style={styles.scoreItem}>
                  <View style={styles.scoreRow}>
                    <Text style={styles.scoreLabel}>{item.label}</Text>
                    <View style={styles.progressTrack}>
                      <View style={[styles.progressFill, { width: `${rawScore * 100}%` as any, backgroundColor: grade.color }]} />
                    </View>
                    <Text style={[styles.gradeText, { color: grade.color }]}>{grade.text}</Text>
                  </View>
                  <View style={styles.scoreReasonRow}>
                    <MaterialCommunityIcons name="subdirectory-arrow-right" size={14} color={colors.textSecondary} />
                    <Text style={styles.scoreReason}>{item.reason}</Text>
                  </View>
                </View>
              );
            })
          )}
        </View>

        <View style={styles.gap} />

        {/* 사고 흐름 상세 진단 */}
        {flows.length > 0 && (
          <View style={styles.card}>
            <View style={styles.sectionTitleRow}>
              <MaterialCommunityIcons name="chart-timeline-variant" size={20} color={colors.accent} />
              <Text style={styles.sectionTitle}>사고 흐름 상세 진단</Text>
            </View>
            <View style={{ height: spacing.lg }} />

            {flows.map((step, i) => {
              const isLast = i === flows.length - 1;
              return (
                <View key={i} style={styles.flowRow}>
                  {/* 타임라인 왼쪽 */}
                  <View style={styles.flowLeft}>
                    <StepIcon status={step.status} />
                    {!isLast && <View style={styles.flowLine} />}
                  </View>

                  {/* 내용 */}
                  <View style={[styles.flowContent, isLast && { paddingBottom: 0 }]}>
                    <Text style={styles.flowStep}>{step.step}</Text>
                    <Text style={styles.flowComment}>{step.comment}</Text>
                    {step.quote ? (
                      <View style={styles.quoteBox}>
                        <MaterialCommunityIcons name="format-quote-open" size={14} color={colors.accent} />
                        <Text style={styles.quoteText}>{step.quote}</Text>
                      </View>
                    ) : null}
                  </View>
                </View>
              );
            })}
          </View>
        )}

        <View style={styles.gap} />

        {/* 튜터의 맞춤 처방 */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>💊 튜터의 맞춤 처방</Text>
          <View style={{ height: spacing.md }} />
          <View style={styles.prescriptionBox}>
            <View style={styles.prescriptionTitleRow}>
              <MaterialCommunityIcons name="lightbulb-outline" size={18} color="#F57F17" />
              <Text style={styles.prescriptionTitle}>이렇게 해보면 어때요?</Text>
            </View>
            <View style={{ height: spacing.sm }} />
            <Text style={styles.prescriptionText}>{prescription}</Text>
          </View>
        </View>

        <View style={{ height: spacing.md }} />

        {/* 하단 버튼 */}
        <View style={styles.buttonArea}>
          <TouchableOpacity style={styles.saveButton} onPress={handleSaveAndExit} activeOpacity={0.85}>
            <Text style={styles.saveButtonText}>리포트 저장 및 종료</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF8F5',
    maxWidth: 480,
    alignSelf: 'center',
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingTop: 8,
    paddingBottom: spacing.sm,
    backgroundColor: colors.background,
  },
  headerTitle: {
    flex: 1,
    fontFamily: fonts.bold,
    fontSize: 18,
    color: colors.text,
    textAlign: 'center',
  },
  closeBtn: {
    padding: 8,
    marginRight: -4,
  },
  headerDivider: { height: 1, backgroundColor: '#EEEEEE' },
  card: {
    backgroundColor: colors.background,
    padding: spacing.lg,
    borderRadius: radius.lg,
    marginHorizontal: spacing.md,
  },
  gap: { height: 8 },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: colors.accentLight,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: '#C8E6C9',
  },
  tagText: {
    fontFamily: fonts.bold,
    fontSize: 13,
    color: colors.accentDark,
  },
  summaryText: {
    fontFamily: fonts.bold,
    fontSize: 20,
    color: '#263238',
    textAlign: 'center',
    lineHeight: 30,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  sectionTitle: {
    fontFamily: fonts.bold,
    fontSize: 17,
    color: colors.text,
  },
  sectionSubtitle: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 4,
  },
  emptyText: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.textSecondary,
  },
  scoreItem: {
    marginBottom: spacing.lg,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  scoreLabel: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: '#212121',
    width: 52,
  },
  progressTrack: {
    flex: 1,
    height: 8,
    backgroundColor: '#F0F0F0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  gradeText: {
    fontFamily: fonts.bold,
    fontSize: 12,
    width: 28,
    textAlign: 'right',
  },
  scoreReasonRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 4,
    marginTop: 6,
    paddingLeft: 60,
  },
  scoreReason: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: '#616161',
    lineHeight: 18,
    flex: 1,
  },
  flowRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  flowLeft: {
    alignItems: 'center',
    width: 24,
  },
  flowLine: {
    flex: 1,
    width: 2,
    backgroundColor: '#EEEEEE',
    marginTop: 4,
    marginBottom: 0,
  },
  flowContent: {
    flex: 1,
    paddingBottom: spacing.lg,
  },
  flowStep: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: '#212121',
    marginBottom: 4,
  },
  flowComment: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: '#757575',
    lineHeight: 20,
  },
  quoteBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    marginTop: 8,
    backgroundColor: '#F5F5F5',
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    padding: 10,
  },
  quoteText: {
    fontFamily: fonts.regular,
    fontSize: 13,
    fontStyle: 'italic',
    color: colors.accentDark,
    flex: 1,
    lineHeight: 18,
  },
  prescriptionBox: {
    backgroundColor: '#FFF8E1',
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: '#FFE0B2',
    padding: spacing.md,
  },
  prescriptionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  prescriptionTitle: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: '#E65100',
  },
  prescriptionText: {
    fontFamily: fonts.regular,
    fontSize: 15,
    color: '#BF360C',
    lineHeight: 24,
  },
  buttonArea: {
    paddingHorizontal: spacing.lg,
  },
  saveButton: {
    width: '100%',
    height: 56,
    backgroundColor: colors.accent,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    fontFamily: fonts.bold,
    fontSize: 16,
    color: '#fff',
  },
});
