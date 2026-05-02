import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  Modal,
  ListRenderItemInfo,
} from 'react-native';
import { router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { colors, fonts, spacing, radius } from '@/constants/theme';

type Work = {
  id: string;
  title: string;
  author: string;
  category: string;
  baseColor: string;
  spineColor: string;
  studyTime: string;
};

const DEMO_WORKS: Work[] = [
  {
    id: 'simcheong',
    title: '심청전',
    author: '작자미상',
    category: '고전소설',
    baseColor: '#D7CCC8',
    spineColor: '#5D4037',
    studyTime: '5분',
  },
  {
    id: 'gwandong',
    title: '관동별곡',
    author: '정철',
    category: '고전시가',
    baseColor: '#C8E6C9',
    spineColor: '#1B5E20',
    studyTime: '5분',
  },
];

type UploadedFile = { name: string; uri: string };

export default function HomeScreen() {
  const [deletedIds, setDeletedIds] = useState<Set<string>>(new Set());
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(DEMO_WORKS.length > 1);
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);

  const listRef = useRef<FlatList>(null);
  const scrollOffset = useRef(0);

  const works = DEMO_WORKS.filter((w) => !deletedIds.has(w.id));

  const handleScroll = (event: any) => {
    const x = event.nativeEvent.contentOffset.x;
    const maxX = event.nativeEvent.contentSize.width - event.nativeEvent.layoutMeasurement.width;
    scrollOffset.current = x;
    setShowLeft(x > 4);
    setShowRight(x < maxX - 4);
  };

  const scrollLeft = () => {
    listRef.current?.scrollToOffset({
      offset: Math.max(0, scrollOffset.current - 232),
      animated: true,
    });
  };

  const scrollRight = () => {
    listRef.current?.scrollToOffset({
      offset: scrollOffset.current + 232,
      animated: true,
    });
  };

  const handleDelete = (workId: string) => {
    Alert.alert('문서 삭제', '목록에서 이 문서를 삭제하시겠습니까?', [
      { text: '취소', style: 'cancel' },
      {
        text: '삭제',
        style: 'destructive',
        onPress: () => setDeletedIds((prev) => new Set([...prev, workId])),
      },
    ]);
  };

  const handleFileUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          'application/pdf',
          'text/plain',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ],
        copyToCacheDirectory: true,
      });
      if (!result.canceled && result.assets.length > 0) {
        const asset = result.assets[0];
        setUploadedFile({ name: asset.name, uri: asset.uri });
      }
    } catch {
      Alert.alert('오류', '파일을 불러오는 중 문제가 발생했습니다.');
    }
  };

  const navigateToSession = (id: string, title: string) => {
    router.push({ pathname: '/session', params: { id, title } });
  };

  const renderWorkCard = ({ item }: ListRenderItemInfo<Work>) => (
    <TouchableOpacity
      style={[styles.workCard, { borderColor: item.spineColor, backgroundColor: item.baseColor + '33' }]}
      onPress={() => navigateToSession(item.id, item.title)}
      activeOpacity={0.75}
    >
      <View style={[styles.workAvatar, { backgroundColor: item.spineColor }]}>
        <Text style={styles.workAvatarText}>{item.title[0]}</Text>
      </View>
      <View style={styles.workInfo}>
        <Text style={styles.workTitle} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.workAuthor}>{item.author}</Text>
      </View>
      <TouchableOpacity onPress={() => handleDelete(item.id)} hitSlop={8}>
        <MaterialCommunityIcons name="delete-outline" size={22} color={colors.textSecondary} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <MaterialCommunityIcons name="book-open-variant" size={28} color={colors.accent} />
        <Text style={styles.headerTitle}>OK 독해</Text>
        <View style={{ flex: 1 }} />
        <TouchableOpacity>
          <MaterialCommunityIcons name="account-circle" size={32} color={colors.accent} />
        </TouchableOpacity>
      </View>

      {/* 상단 여백 */}
      <View style={{ flex: 1 }} />

      {/* 메인 콘텐츠 */}
      <View style={styles.mainContent}>
        <Text style={styles.mainTitle}>
          {'대화로 사고를 확장하고,\n리포트로 진단해드려요.'}
        </Text>

        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            ✨ 3분 대화 후: 핵심 요약 + 사고 패턴 분석 리포트 제공
          </Text>
        </View>

        <View style={{ height: spacing.xl }} />

        {/* 업로드 박스 */}
        <TouchableOpacity style={styles.uploadBox} onPress={handleFileUpload} activeOpacity={0.8}>
          <View style={styles.uploadIconWrapper}>
            <MaterialCommunityIcons name="cloud-upload" size={40} color={colors.accent} />
          </View>
          <Text style={styles.uploadText}>파일 업로드하기</Text>
          <Text style={styles.uploadSubText}>PDF, TXT, DOCX 지원</Text>
        </TouchableOpacity>
      </View>

      {/* 하단 여백 (2배) */}
      <View style={{ flex: 2 }} />

      {/* 하단 예시 섹션 */}
      <View style={styles.bottomSection}>
        <Text style={styles.bottomLabel}>자료가 없으신가요? 예시로 시작해보세요.</Text>
        <View style={{ height: spacing.md }} />

        {works.length === 0 ? (
          <Text style={styles.emptyText}>등록된 문서가 없습니다.</Text>
        ) : (
          <View style={styles.scrollWrapper}>
            <FlatList
              ref={listRef}
              data={works}
              renderItem={renderWorkCard}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
              onScroll={handleScroll}
              scrollEventThrottle={16}
              style={{ flexGrow: 0 }}
              contentContainerStyle={{ paddingBottom: 4 }}
            />

            {showLeft && (
              <TouchableOpacity style={[styles.scrollArrow, styles.scrollArrowLeft]} onPress={scrollLeft}>
                <MaterialCommunityIcons name="arrow-left" size={24} color={colors.text} />
              </TouchableOpacity>
            )}
            {showRight && (
              <TouchableOpacity style={[styles.scrollArrow, styles.scrollArrowRight]} onPress={scrollRight}>
                <MaterialCommunityIcons name="arrow-right" size={24} color={colors.text} />
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>

      {/* 업로드 완료 모달 */}
      <Modal visible={uploadedFile !== null} transparent animationType="slide">
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setUploadedFile(null)}
        >
          <TouchableOpacity activeOpacity={1} style={styles.modalSheet}>
            {/* 핸들 바 */}
            <View style={styles.modalHandle} />

            <View style={styles.modalRow}>
              <MaterialCommunityIcons name="file-document" size={22} color={colors.accent} />
              <Text style={styles.modalTitle}>학습 자료 준비 완료</Text>
            </View>

            <View style={{ height: spacing.md }} />

            <View style={styles.modalCard}>
              <View style={styles.modalCardRow}>
                <MaterialCommunityIcons name="check-circle" size={20} color={colors.accent} />
                <Text style={styles.modalFileName} numberOfLines={1}>
                  {uploadedFile?.name}
                </Text>
              </View>
            </View>

            <View style={{ height: spacing.lg }} />

            <TouchableOpacity
              style={styles.startButton}
              activeOpacity={0.85}
              onPress={() => {
                const file = uploadedFile!;
                setUploadedFile(null);
                navigateToSession(file.uri, file.name);
              }}
            >
              <Text style={styles.startButtonText}>이 자료로 진단 시작하기</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
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
    paddingHorizontal: spacing.lg,
    paddingTop: 26,
    paddingBottom: spacing.md,
    gap: spacing.sm,
  },
  headerTitle: {
    fontFamily: fonts.bold,
    fontSize: 22,
    color: colors.accentDark,
  },
  mainContent: {
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  mainTitle: {
    fontFamily: fonts.bold,
    fontSize: 24,
    color: colors.text,
    textAlign: 'center',
    lineHeight: 34,
  },
  badge: {
    marginTop: spacing.sm,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: colors.accentLight,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: '#C8E6C9',
  },
  badgeText: {
    fontFamily: fonts.bold,
    fontSize: 13,
    color: colors.accentDark,
  },
  uploadBox: {
    width: 280,
    height: 180,
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  uploadIconWrapper: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  uploadText: {
    fontFamily: fonts.bold,
    fontSize: 18,
    color: colors.accentDark,
    marginTop: spacing.md,
  },
  uploadSubText: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },
  bottomSection: {
    backgroundColor: '#F0EDE8',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: spacing.lg,
  },
  bottomLabel: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.textSecondary,
  },
  emptyText: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.textSecondary,
  },
  scrollWrapper: {
    height: 100,
    position: 'relative',
  },
  workCard: {
    width: 220,
    height: 88,
    borderRadius: radius.md,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  workAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  workAvatarText: {
    fontFamily: fonts.bold,
    fontSize: 16,
    color: '#fff',
  },
  workInfo: {
    flex: 1,
  },
  workTitle: {
    fontFamily: fonts.bold,
    fontSize: 16,
    color: colors.text,
  },
  workAuthor: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  scrollArrow: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 48,
    height: 48,
    marginTop: 'auto',
    marginBottom: 'auto',
    alignSelf: 'center',
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  scrollArrowLeft: { left: 0 },
  scrollArrowRight: { right: 0 },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: spacing.lg,
  },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    alignSelf: 'center',
    marginBottom: spacing.md,
  },
  modalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  modalTitle: {
    fontFamily: fonts.bold,
    fontSize: 18,
    color: colors.text,
  },
  modalCard: {
    backgroundColor: '#F5F5F5',
    borderRadius: radius.md,
    padding: spacing.md,
  },
  modalCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  modalFileName: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.text,
    flex: 1,
  },
  startButton: {
    width: '100%',
    height: 56,
    backgroundColor: colors.accent,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  startButtonText: {
    fontFamily: fonts.bold,
    fontSize: 18,
    color: '#fff',
  },
});
