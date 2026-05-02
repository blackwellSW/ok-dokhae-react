import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Animated,
  Modal,
  KeyboardAvoidingView,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { colors, fonts, spacing, radius } from '@/constants/theme';
import { mockApiService } from '@/services/mockApiService';

type Step = 'loading' | 'chatting' | 'report';
type ChatMessage = { role: 'user' | 'ai'; text: string };

const CHIPS = [
  '🤔 이 구절, 무슨 뜻인지 모르겠어',
  '🧐 화자의 감정이 정확히 뭐야?',
  '🔑 주제를 잡는 단서가 뭐야?',
  '✅ 내 해석이 맞는지 봐줘',
];

const COLLAPSED_H = 48;

export default function SessionScreen() {
  const { id, title } = useLocalSearchParams<{ id: string; title: string }>();
  const { height: windowHeight } = useWindowDimensions();
  const halfScreen = windowHeight / 2;

  const [step, setStep] = useState<Step>('loading');
  const [content, setContent] = useState<string[]>([]);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [attachedFileName, setAttachedFileName] = useState<string | null>(null);
  const [isLoadingResponse, setIsLoadingResponse] = useState(false);
  const [isContentExpanded, setIsContentExpanded] = useState(false);
  const [contentScrollHeight, setContentScrollHeight] = useState(0);
  const [finalReport, setFinalReport] = useState<Record<string, unknown> | null>(null);
  const [showExitModal, setShowExitModal] = useState(false);
  const [showEvidenceModal, setShowEvidenceModal] = useState(false);

  const chatListRef = useRef<FlatList>(null);
  const contentHeightAnim = useRef(new Animated.Value(COLLAPSED_H)).current;

  useEffect(() => {
    initSession();
  }, []);

  useEffect(() => {
    if (chatHistory.length > 0 || isLoadingResponse) {
      setTimeout(() => chatListRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }, [chatHistory, isLoadingResponse]);

  const initSession = async () => {
    setStep('loading');
    try {
      const [workContent] = await Promise.all([
        mockApiService.getWorkContent(id ?? ''),
        mockApiService.startThinkingSession(id ?? ''),
      ]);
      setContent(workContent);
    } catch {
      setContent(['내용을 불러올 수 없습니다.']);
    } finally {
      setStep('chatting');
    }
  };

  const sendMessage = async (overrideText?: string) => {
    const text = (overrideText ?? inputText).trim();
    if (!text && !attachedFileName) return;

    const userText = attachedFileName ? `[파일 첨부: ${attachedFileName}]\n${text}` : text;
    setChatHistory((prev) => [...prev, { role: 'user', text: userText }]);
    setInputText('');
    setAttachedFileName(null);
    setIsLoadingResponse(true);

    try {
      const response = await mockApiService.getGuidance(id ?? '', text);
      setChatHistory((prev) => [...prev, { role: 'ai', text: response.text }]);
      if (response.is_finish) {
        setStep('report');
      }
    } catch {
      setChatHistory((prev) => [...prev, { role: 'ai', text: '오류가 발생했습니다. 다시 시도해주세요.' }]);
    } finally {
      setIsLoadingResponse(false);
    }
  };

  const sendChipMessage = (label: string) => {
    // 앞의 이모지(2글자) 제거하고 전송
    sendMessage(label.substring(2).trim());
  };

  const toggleContent = () => {
    if (isContentExpanded) {
      Animated.timing(contentHeightAnim, { toValue: COLLAPSED_H, duration: 300, useNativeDriver: false }).start();
      setIsContentExpanded(false);
    } else {
      // 일단 화면 절반으로 펼치고, 콘텐츠 측정 후 useEffect에서 필요 시 축소
      Animated.timing(contentHeightAnim, { toValue: halfScreen, duration: 300, useNativeDriver: false }).start();
      setIsContentExpanded(true);
    }
  };

  // 콘텐츠가 화면 절반보다 짧으면 딱 맞게 높이 축소
  useEffect(() => {
    if (!isContentExpanded || contentScrollHeight === 0) return;
    const fittedH = contentScrollHeight + COLLAPSED_H + spacing.md;
    if (fittedH < halfScreen) {
      Animated.timing(contentHeightAnim, { toValue: fittedH, duration: 150, useNativeDriver: false }).start();
    }
  }, [contentScrollHeight]);

  const pickFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'text/plain'],
        copyToCacheDirectory: false,
      });
      if (!result.canceled && result.assets.length > 0) {
        setAttachedFileName(result.assets[0].name);
      }
    } catch { /* ignore */ }
  };

  const navigateToResult = () => {
    router.replace({
      pathname: '/result',
      params: { title: title ?? '', reportData: JSON.stringify(finalReport) },
    });
  };

  const handleExitConfirm = () => {
    setShowExitModal(false);
    setTimeout(navigateToResult, 300);
  };

  // ── 채팅 버블 ─────────────────────────────────────────────────
  const renderBubble = (msg: ChatMessage, index: number) => {
    const isAi = msg.role === 'ai';
    return (
      <View key={index} style={[styles.bubbleWrapper, isAi ? styles.bubbleLeft : styles.bubbleRight]}>
        {isAi && <Text style={styles.bubbleLabel}>튜터</Text>}
        <View style={[styles.bubble, isAi ? styles.bubbleAi : styles.bubbleUser]}>
          <Text style={[styles.bubbleText, isAi ? styles.bubbleTextAi : styles.bubbleTextUser]}>
            {msg.text}
          </Text>
        </View>
        {isAi && (
          <TouchableOpacity style={styles.evidenceBtn} onPress={() => setShowEvidenceModal(true)}>
            <MaterialCommunityIcons name="format-quote-close" size={12} color={colors.textSecondary} />
            <Text style={styles.evidenceBtnText}>근거로 쓴 문장 보기</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  // ── 빈 상태 (첫 진입) ──────────────────────────────────────────
  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <View style={styles.emptyIconCircle}>
        <MaterialCommunityIcons name="chat-outline" size={40} color={colors.accent} />
      </View>
      <Text style={styles.emptyTitle}>{'어디가 막혔나요?\n거기서부터 같이 봐요.'}</Text>
      <Text style={styles.emptyDesc}>{'제가 질문을 던지면서\n생각을 정리하게 도와드릴게요.'}</Text>
      <View style={styles.chipsWrap}>
        {CHIPS.map((chip) => (
          <TouchableOpacity key={chip} style={styles.chip} onPress={() => sendChipMessage(chip)}>
            <Text style={styles.chipText}>{chip}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  // ── 하단 영역 ──────────────────────────────────────────────────
  const renderBottomArea = () => {
    if (step === 'report') {
      return (
        <View style={styles.reportButtonArea}>
          <TouchableOpacity style={styles.reportButton} onPress={navigateToResult}>
            <MaterialCommunityIcons name="chart-bar" size={20} color="#fff" />
            <Text style={styles.reportButtonText}>최종 진단 리포트 확인</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.inputArea}>
        {attachedFileName && (
          <View style={styles.attachedChip}>
            <Text style={styles.attachedChipText} numberOfLines={1}>{attachedFileName}</Text>
            <TouchableOpacity onPress={() => setAttachedFileName(null)}>
              <MaterialCommunityIcons name="close" size={14} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
        )}
        <View style={styles.inputRow}>
          <TouchableOpacity onPress={pickFile} style={styles.inputIcon}>
            <MaterialCommunityIcons name="paperclip" size={22} color={colors.textSecondary} />
          </TouchableOpacity>
          <TextInput
            style={styles.textInput}
            value={inputText}
            onChangeText={setInputText}
            placeholder="질문이나 막힌 구절을 입력하세요..."
            placeholderTextColor={colors.textSecondary}
            onSubmitEditing={() => sendMessage()}
            returnKeyType="send"
            blurOnSubmit={false}
            multiline
          />
          <TouchableOpacity onPress={() => sendMessage()} style={styles.inputIcon}>
            <MaterialCommunityIcons name="send" size={22} color={colors.accent} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerIcon}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>{title}</Text>
        <TouchableOpacity style={styles.exitBtn} onPress={() => setShowExitModal(true)}>
          <MaterialCommunityIcons name="exit-to-app" size={16} color={colors.accent} />
          <Text style={styles.exitBtnText}>세션 종료</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.headerDivider} />

      {/* 상태 배지 */}
      <View style={styles.statusBar}>
        <MaterialCommunityIcons name="pencil" size={14} color={colors.textSecondary} />
        <Text style={styles.statusText}>실시간 사고 흐름 기록 중</Text>
        <View style={{ flex: 1 }} />
        <Text style={styles.statusReady}>진단 준비됨</Text>
      </View>

      {/* 채팅 + 지문 오버레이 */}
      <View style={{ flex: 1 }}>
        {/* 채팅 영역 — 지문 헤더 높이만큼 아래서 시작 */}
        <View style={{ flex: 1, marginTop: COLLAPSED_H }}>
          {step === 'loading' ? (
            <View style={styles.loadingArea}>
              <Text style={styles.loadingText}>지문을 불러오는 중...</Text>
            </View>
          ) : chatHistory.length === 0 ? (
            renderEmptyState()
          ) : (
            <FlatList
              ref={chatListRef}
              data={chatHistory}
              keyExtractor={(_, i) => String(i)}
              contentContainerStyle={styles.chatList}
              renderItem={({ item, index }) => renderBubble(item, index)}
              ListFooterComponent={
                isLoadingResponse ? (
                  <View style={styles.loadingBubble}>
                    <Text style={styles.loadingDots}>···</Text>
                  </View>
                ) : null
              }
            />
          )}
        </View>

        {/* 지문 영역 — 절대 위치로 채팅 위에 오버레이 */}
        <Animated.View style={[styles.contentArea, { height: contentHeightAnim }]}>
          <TouchableOpacity style={styles.contentHeader} onPress={toggleContent}>
            <MaterialCommunityIcons name="file-document-outline" size={18} color={colors.accent} />
            <Text style={styles.contentHeaderText}>지문 본문 보기</Text>
            <View style={{ flex: 1 }} />
            <Text style={styles.contentToggleText}>{isContentExpanded ? '접기' : '펼쳐보기'}</Text>
            <MaterialCommunityIcons
              name={isContentExpanded ? 'chevron-up' : 'chevron-down'}
              size={20}
              color={colors.textSecondary}
            />
          </TouchableOpacity>

          {isContentExpanded && (
            <FlatList
              data={content}
              keyExtractor={(_, i) => String(i)}
              contentContainerStyle={styles.contentBody}
              ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
              onContentSizeChange={(_, h) => setContentScrollHeight(h)}
              renderItem={({ item }) => <Text style={styles.contentText}>{item}</Text>}
            />
          )}
        </Animated.View>
      </View>

      {renderBottomArea()}

      {/* 세션 종료 모달 */}
      <Modal visible={showExitModal} transparent animationType="slide">
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowExitModal(false)}>
          <TouchableOpacity activeOpacity={1} style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>세션을 종료하시겠습니까?</Text>
            <Text style={styles.modalDesc}>지금까지의 대화 내용을 바탕으로 분석 리포트를 생성합니다.</Text>
            <View style={{ height: spacing.lg }} />
            <TouchableOpacity style={styles.modalPrimaryBtn} onPress={handleExitConfirm}>
              <Text style={styles.modalPrimaryBtnText}>네, 리포트 생성하기</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalSecondaryBtn} onPress={() => setShowExitModal(false)}>
              <Text style={styles.modalSecondaryBtnText}>아니요, 더 대화할래요</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* 근거 문장 모달 */}
      <Modal visible={showEvidenceModal} transparent animationType="slide">
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowEvidenceModal(false)}>
          <TouchableOpacity activeOpacity={1} style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <View style={styles.evidenceRow}>
              <MaterialCommunityIcons name="book-open-variant" size={20} color={colors.accent} />
              <Text style={styles.modalTitle}>근거 문장 확인</Text>
            </View>
            <View style={{ height: spacing.md }} />
            <View style={styles.evidenceQuote}>
              <Text style={styles.evidenceQuoteText}>
                {"\"...아니 슬플소냐. 늘물이 비 오듯 하여...\""}
              </Text>
              <Text style={styles.evidenceQuoteSource}>- 3번째 문단</Text>
            </View>
            <View style={styles.evidenceHint}>
              <MaterialCommunityIcons name="lightbulb-outline" size={14} color="#F57F17" />
              <Text style={styles.evidenceHintText}>
                💡 튜터의 노트: 이 문장에서 화자의 감정이 '슬픔'임을 직접적으로 확인할 수 있어요.
              </Text>
            </View>
            <View style={{ height: spacing.lg }} />
            <TouchableOpacity style={styles.modalPrimaryBtn} onPress={() => setShowEvidenceModal(false)}>
              <Text style={styles.modalPrimaryBtnText}>확인</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
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
    gap: spacing.sm,
    backgroundColor: colors.background,
  },
  headerIcon: { paddingVertical: 8, paddingHorizontal: 0 },
  headerTitle: {
    flex: 1,
    fontFamily: fonts.medium,
    fontSize: 16,
    color: colors.text,
  },
  headerDivider: { height: 1, backgroundColor: '#EEEEEE' },
  exitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.full,
  },
  exitBtnText: { fontFamily: fonts.bold, fontSize: 13, color: colors.accent },
  statusBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FAFAFA',
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
  },
  statusText: { fontFamily: fonts.bold, fontSize: 12, color: colors.text },
  statusReady: { fontFamily: fonts.regular, fontSize: 11, color: colors.textSecondary },
  contentArea: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#F5F5F5',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    overflow: 'hidden',
    zIndex: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  contentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    gap: spacing.sm,
  },
  contentHeaderText: { fontFamily: fonts.bold, fontSize: 14, color: colors.accent },
  contentToggleText: { fontFamily: fonts.regular, fontSize: 12, color: colors.textSecondary },
  contentBody: { paddingHorizontal: spacing.md, paddingBottom: spacing.md },
  contentText: { fontFamily: fonts.regular, fontSize: 15, color: colors.text, lineHeight: 24 },
  loadingArea: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  loadingText: { fontFamily: fonts.regular, fontSize: 14, color: colors.textSecondary },
  chatList: { padding: spacing.md, paddingBottom: spacing.xl },
  bubbleWrapper: { marginBottom: 4 },
  bubbleLeft: { alignItems: 'flex-start' },
  bubbleRight: { alignItems: 'flex-end', marginBottom: 12 },
  bubbleLabel: { fontFamily: fonts.bold, fontSize: 11, color: colors.accent, marginLeft: 4, marginBottom: 4 },
  bubble: {
    maxWidth: '80%',
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
  },
  bubbleAi: {
    backgroundColor: '#F5F5F5',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 16,
  },
  bubbleUser: {
    backgroundColor: colors.accent,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 4,
  },
  bubbleText: { fontFamily: fonts.regular, fontSize: 15, lineHeight: 22 },
  bubbleTextAi: { color: colors.text },
  bubbleTextUser: { color: '#fff' },
  evidenceBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginTop: 4,
    marginLeft: 4,
    marginBottom: 12,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.full,
    alignSelf: 'flex-start',
  },
  evidenceBtnText: { fontFamily: fonts.medium, fontSize: 11, color: colors.text },
  loadingBubble: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    marginBottom: 12,
  },
  loadingDots: { fontFamily: fonts.bold, fontSize: 22, color: colors.textSecondary, letterSpacing: 2 },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.lg },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.accentLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  emptyTitle: { fontFamily: fonts.bold, fontSize: 18, color: colors.text, textAlign: 'center', lineHeight: 26, marginBottom: spacing.sm },
  emptyDesc: { fontFamily: fonts.regular, fontSize: 14, color: colors.textSecondary, textAlign: 'center', lineHeight: 22, marginBottom: spacing.lg },
  chipsWrap: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 8 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.full,
  },
  chipText: { fontFamily: fonts.regular, fontSize: 13, color: colors.text },
  inputArea: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
  },
  attachedChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.accentLight,
    borderRadius: radius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    alignSelf: 'flex-start',
    marginBottom: spacing.sm,
    maxWidth: '80%',
  },
  attachedChipText: { fontFamily: fonts.regular, fontSize: 12, color: colors.accentDark, flex: 1 },
  inputRow: { flexDirection: 'row', alignItems: 'center', minHeight: 44, gap: 4 },
  textInput: {
    flex: 1,
    fontFamily: fonts.regular,
    fontSize: 15,
    color: colors.text,
    maxHeight: 80,
    paddingVertical: 0,
    textAlignVertical: 'center',
  },
  inputIcon: { padding: 8 },
  reportButtonArea: { padding: spacing.md },
  reportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    height: 54,
    backgroundColor: colors.accent,
    borderRadius: radius.md,
  },
  reportButtonText: { fontFamily: fonts.bold, fontSize: 16, color: '#fff' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  modalSheet: { backgroundColor: colors.background, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: spacing.lg },
  modalHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: colors.border, alignSelf: 'center', marginBottom: spacing.md },
  modalTitle: { fontFamily: fonts.bold, fontSize: 18, color: colors.text },
  modalDesc: { fontFamily: fonts.regular, fontSize: 14, color: colors.textSecondary, marginTop: 6 },
  modalPrimaryBtn: { height: 52, backgroundColor: colors.accent, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.sm },
  modalPrimaryBtnText: { fontFamily: fonts.bold, fontSize: 15, color: '#fff' },
  modalSecondaryBtn: { height: 44, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.sm },
  modalSecondaryBtnText: { fontFamily: fonts.regular, fontSize: 14, color: colors.textSecondary },
  evidenceRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  evidenceQuote: {
    backgroundColor: '#F5F5F5',
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
  },
  evidenceQuoteText: { fontFamily: fonts.medium, fontSize: 16, color: colors.text, lineHeight: 24, fontStyle: 'italic' },
  evidenceQuoteSource: { fontFamily: fonts.bold, fontSize: 12, color: colors.textSecondary, textAlign: 'right', marginTop: 8 },
  evidenceHint: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: '#FFF8E1',
    borderRadius: radius.sm,
    padding: spacing.sm,
    marginTop: spacing.sm,
  },
  evidenceHintText: { fontFamily: fonts.regular, fontSize: 13, color: '#BF360C', lineHeight: 20, flex: 1 },
});
