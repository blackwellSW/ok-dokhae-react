import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Animated,
  TouchableOpacity,
  useWindowDimensions,
  ListRenderItemInfo,
} from 'react-native';
import { router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Svg, { Path } from 'react-native-svg';
import { colors, fonts, spacing, radius } from '@/constants/theme';

type IconName = React.ComponentProps<typeof MaterialCommunityIcons>['name'];

const SLIDES: { key: string; title: string; desc: string; icon: IconName }[] = [
  {
    key: '0',
    title: '감으로 찍는 독해는\n이제 그만',
    desc: '고어와 한자에 막혀 내용을 짐작만 하셨나요?\nAI가 정확한 해석의 길을 열어드립니다.',
    icon: 'book-open-variant',
  },
  {
    key: '1',
    title: '정답이 아니라\n근거를 말하게',
    desc: '왜 그렇게 해석했는지 설명할 수 있어야 진짜 실력이에요.\n질문으로 생각을 끌어내고, 근거로 정리해드려요.',
    icon: 'clipboard-search-outline',
  },
  {
    key: '2',
    title: '당신의 든든한\n고전 파트너',
    desc: '작품은 남고, 이해는 쌓여요.\n춘향전부터 관동별곡까지, 지금 시작해볼까요?',
    icon: 'bookshelf',
  },
];

function GoogleIcon({ size = 22 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <Path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <Path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
        fill="#FBBC05"
      />
      <Path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </Svg>
  );
}

export default function LandingScreen() {
  const { width: windowWidth } = useWindowDimensions();
  const slideWidth = Math.min(windowWidth, 480);

  const [currentPage, setCurrentPage] = useState(0);
  const [slideAreaHeight, setSlideAreaHeight] = useState(0);

  const flatListRef = useRef<FlatList>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // 0 = 비활성, 1 = 활성 — width·color 둘 다 여기서 interpolate
  const dotProgress = useRef(SLIDES.map((_, i) => new Animated.Value(i === 0 ? 1 : 0))).current;

  const animateDots = (toPage: number) => {
    Animated.parallel(
      SLIDES.map((_, i) =>
        Animated.timing(dotProgress[i], {
          toValue: i === toPage ? 1 : 0,
          duration: 250,
          useNativeDriver: false,
        })
      )
    ).start();
  };

  const animateBottomButtons = (visible: boolean) => {
    Animated.timing(fadeAnim, {
      toValue: visible ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const updatePage = (page: number) => {
    const wasLast = currentPage === SLIDES.length - 1;
    const willBeLast = page === SLIDES.length - 1;
    if (!wasLast && willBeLast) animateBottomButtons(true);
    if (wasLast && !willBeLast) animateBottomButtons(false);
    animateDots(page);
    setCurrentPage(page);
  };

  const goToPage = (page: number) => {
    flatListRef.current?.scrollToIndex({ index: page, animated: true });
    updatePage(page);
  };

  const handleScroll = (event: any) => {
    const page = Math.round(event.nativeEvent.contentOffset.x / slideWidth);
    if (page !== currentPage && page >= 0 && page < SLIDES.length) {
      updatePage(page);
    }
  };

  const handleGoogleLogin = () => {
    // TODO: Google OAuth 구현
    router.replace('/home');
  };

  const startDemo = () => {
    router.push({ pathname: '/session', params: { id: 'gwandong', title: '관동별곡' } });
  };

  const renderSlide = ({ item }: ListRenderItemInfo<typeof SLIDES[number]>) => (
    <View
      style={[
        styles.slide,
        {
          width: slideWidth,
          height: slideAreaHeight > 0 ? slideAreaHeight : undefined,
        },
      ]}
    >
      <View style={styles.iconCircle}>
        <MaterialCommunityIcons name={item.icon} size={80} color={colors.accent} />
      </View>
      <Text style={styles.slideTitle}>{item.title}</Text>
      <Text style={styles.slideDesc}>{item.desc}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Skip 버튼 */}
      <View style={styles.skipContainer}>
        {currentPage < SLIDES.length - 1 && (
          <TouchableOpacity onPress={() => goToPage(SLIDES.length - 1)}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* 슬라이드 영역 */}
      <View
        style={styles.slidesWrapper}
        onLayout={(e) => setSlideAreaHeight(e.nativeEvent.layout.height)}
      >
        {currentPage > 0 && (
          <TouchableOpacity
            style={[styles.arrow, styles.arrowLeft]}
            onPress={() => goToPage(currentPage - 1)}
          >
            <MaterialCommunityIcons name="chevron-left" size={40} color={colors.textSecondary} />
          </TouchableOpacity>
        )}

        <FlatList
          ref={flatListRef}
          data={SLIDES}
          renderItem={renderSlide}
          keyExtractor={(item) => item.key}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          style={{ flex: 1 }}
          getItemLayout={(_, index) => ({
            length: slideWidth,
            offset: slideWidth * index,
            index,
          })}
        />

        {currentPage < SLIDES.length - 1 && (
          <TouchableOpacity
            style={[styles.arrow, styles.arrowRight]}
            onPress={() => goToPage(currentPage + 1)}
          >
            <MaterialCommunityIcons name="chevron-right" size={40} color={colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      {/* 하단: 인디케이터 + 버튼 */}
      <View style={styles.bottomContainer}>
        <View style={styles.dotsRow}>
          {SLIDES.map((_, index) => (
            <TouchableOpacity key={index} onPress={() => goToPage(index)}>
              <Animated.View
                style={[
                  styles.dot,
                  {
                    width: dotProgress[index].interpolate({
                      inputRange: [0, 1],
                      outputRange: [8, 24],
                    }),
                    backgroundColor: dotProgress[index].interpolate({
                      inputRange: [0, 1],
                      outputRange: [colors.primaryLight, colors.accent],
                    }),
                  },
                ]}
              />
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: spacing.xl }} />

        <Animated.View style={{ opacity: fadeAnim, width: '100%' }}>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleGoogleLogin}
            activeOpacity={0.85}
          >
            <GoogleIcon size={22} />
            <Text style={styles.loginButtonText}>Google로 시작하기</Text>
          </TouchableOpacity>
        </Animated.View>

        <View style={{ height: spacing.md }} />

        <Animated.View style={{ opacity: fadeAnim }}>
          <Text style={styles.demoText}>
            구글 로그인 없이 먼저{' '}
            <Text style={styles.demoLink} onPress={startDemo}>
              OK독해 체험해보기!
            </Text>
          </Text>
        </Animated.View>

        <View style={{ height: spacing.xxl }} />
      </View>
    </View>
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
  skipContainer: {
    height: 80,
    paddingTop: 40,
    paddingRight: 20,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  skipText: {
    fontFamily: fonts.medium,
    color: colors.textSecondary,
    fontSize: 15,
    fontWeight: '600',
  },
  slidesWrapper: {
    flex: 1,
  },
  slide: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  iconCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  slideTitle: {
    fontFamily: fonts.bold,
    fontSize: 28,
    color: colors.primaryDark,
    textAlign: 'center',
    lineHeight: 38,
    marginTop: 48,
  },
  slideDesc: {
    fontFamily: fonts.regular,
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 26,
    marginTop: 16,
  },
  arrow: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    zIndex: 10,
    paddingHorizontal: 4,
  },
  arrowLeft: { left: 0 },
  arrowRight: { right: 0 },
  bottomContainer: {
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    height: 8,
    borderRadius: radius.full,
  },
  loginButton: {
    width: '100%',
    height: 56,
    backgroundColor: colors.accent,
    borderRadius: radius.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  loginButtonText: {
    fontFamily: fonts.bold,
    fontSize: 16,
    color: '#fff',
  },
  demoText: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.textSecondary,
  },
  demoLink: {
    fontFamily: fonts.bold,
    color: colors.accent,
    textDecorationLine: 'underline',
  },
});
