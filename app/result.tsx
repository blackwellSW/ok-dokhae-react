import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { colors, fonts } from '@/constants/theme';

// TODO: 리포트 표시 구현 (Flutter ResultScreen 이식)
// 파라미터: reportId
export default function ResultScreen() {
  const { reportId } = useLocalSearchParams<{ reportId: string }>();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>학습 결과</Text>
      <Text style={styles.subtitle}>결과 화면 — 작업 중 (reportId: {reportId})</Text>
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
    fontSize: 24,
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
