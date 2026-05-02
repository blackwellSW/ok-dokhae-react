import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { colors, fonts } from '@/constants/theme';

// TODO: AI 채팅 세션 구현 (Flutter SessionScreen 이식)
// 파라미터: id (document ID), title (document title)
export default function SessionScreen() {
  const { id, title } = useLocalSearchParams<{ id: string; title: string }>();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title ?? '학습 세션'}</Text>
      <Text style={styles.subtitle}>세션 화면 — 작업 중 (id: {id})</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: colors.background,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: 22,
    color: colors.primaryDark,
    marginTop: 60,
  },
  subtitle: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 8,
  },
});
