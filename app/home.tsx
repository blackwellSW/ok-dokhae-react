import { View, Text, StyleSheet } from 'react-native';
import { colors, fonts } from '@/constants/theme';

// TODO: 문서 목록 + PDF 업로드 구현 (Flutter HomeScreen 이식)
export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>내 문서함</Text>
      <Text style={styles.subtitle}>홈 화면 — 작업 중</Text>
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
