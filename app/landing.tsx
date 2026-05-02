import { View, Text, StyleSheet } from 'react-native';
import { colors, fonts } from '@/constants/theme';

// TODO: 온보딩 슬라이드 + 구글 로그인 구현 (Flutter LandingScreen 이식)
export default function LandingScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>OK독해</Text>
      <Text style={styles.subtitle}>랜딩 화면 — 작업 중</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: 32,
    color: colors.primary,
  },
  subtitle: {
    fontFamily: fonts.regular,
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 8,
  },
});
