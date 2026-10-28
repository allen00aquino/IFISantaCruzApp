import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  StyleSheet,
  StatusBar,
  Platform,
  View,
  Text,
  Image,
  TouchableOpacity,
  Linking,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';

const TARGET_URL = 'https://ifisantacruz.com/';
const APP_NAME = 'IFI Santa Cruz';
const TAGLINE = 'Katedral ng Birhen Maria Maulawin';

const MIN_LOADING_MS = 1800;
const FADE_MS = 350;
const TIMEOUT_MS = 20000;
const SITE_HOST = /^https?:\/\/([^/]+\.)?ifisantacruz\.com/i;

const BG = require('./assets/loading-bg.jpg');
const LOGO = require('./assets/logo.png');

const LOGO_H = 160;
const LOGO_W = Math.round(LOGO_H * (336 / 419));

function BrandedBackground({ children }) {
  return (
    <View style={styles.fill}>
      <Image
        source={BG}
        style={styles.backgroundImage}
        resizeMode="cover"
        fadeDuration={0}
        onLoad={() => console.log('[IFI splash] Background image loaded')}
        onError={(event) => console.warn('[IFI splash] Background image failed:', event.nativeEvent)}
      />
      <View style={styles.tint} />
      <View style={styles.centerContent}>{children}</View>
    </View>
  );
}

export default function App() {
  const webRef = useRef(null);
  const startedAt = useRef(Date.now());
  const timeoutRef = useRef(null);
  const opacity = useRef(new Animated.Value(1)).current;

  const [overlayVisible, setOverlayVisible] = useState(true);
  const [error, setError] = useState(false);

  const clearTimer = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const startTimer = useCallback(() => {
    clearTimer();
    timeoutRef.current = setTimeout(() => setError(true), TIMEOUT_MS);
  }, [clearTimer]);

  useEffect(() => {
    startTimer();
    return clearTimer;
  }, [startTimer, clearTimer]);

  useEffect(() => {
    if (Platform.OS !== 'web') return;
    const timer = setTimeout(() => {
      window.location.replace(TARGET_URL);
    }, MIN_LOADING_MS + FADE_MS);
    return () => clearTimeout(timer);
  }, []);

  const handleLoaded = () => {
    clearTimer();
    setError(false);
    const wait = Math.max(0, MIN_LOADING_MS - (Date.now() - startedAt.current));
    setTimeout(() => {
      Animated.timing(opacity, {
        toValue: 0,
        duration: FADE_MS,
        useNativeDriver: true,
      }).start(() => setOverlayVisible(false));
    }, wait);
  };

  const handleError = () => {
    clearTimer();
    setError(true);
  };

  const retry = () => {
    setError(false);
    setOverlayVisible(true);
    opacity.setValue(1);
    startedAt.current = Date.now();
    startTimer();
    webRef.current?.reload();
  };

  const onShouldStartLoad = (req) => {
    const url = req.url || '';
    if (url === 'about:blank' || SITE_HOST.test(url)) return true;
    if (req.isTopFrame === false) return true;
    Linking.openURL(url).catch(() => {});
    return false;
  };

  if (Platform.OS === 'web') {
    return (
      <View style={styles.webRoot}>
        <StatusBar barStyle="light-content" />
        <BrandedBackground>
          <Image source={LOGO} style={styles.logo} resizeMode="contain" onLoad={() => console.log('[IFI splash] Logo loaded')} onError={(event) => console.warn('[IFI splash] Logo failed:', event.nativeEvent)} />
          <Text style={styles.name}>{APP_NAME}</Text>
          <Text style={styles.tagline}>{TAGLINE}</Text>
          <ActivityIndicator size="large" color="#ffffff" style={styles.spinner} />
        </BrandedBackground>
      </View>
    );
  }

  const darkBackdrop = overlayVisible || error;

  return (
    <SafeAreaProvider>
      <View style={styles.root}>
        <StatusBar barStyle={darkBackdrop ? 'light-content' : 'dark-content'} />

        <SafeAreaView style={styles.fill}>
          <WebView
            ref={webRef}
            source={{ uri: TARGET_URL }}
            style={styles.webview}
            javaScriptEnabled
            domStorageEnabled
            pullToRefreshEnabled
            allowsBackForwardNavigationGestures
            onLoad={handleLoaded}
            onError={handleError}
            onHttpError={handleError}
            onShouldStartLoadWithRequest={onShouldStartLoad}
          />
        </SafeAreaView>

        {overlayVisible && (
          <Animated.View
            style={[styles.overlay, { opacity }]}
            pointerEvents={error ? 'auto' : 'none'}
          >
            <BrandedBackground>
              <Image source={LOGO} style={styles.logo} resizeMode="contain" />
              <Text style={styles.name}>{APP_NAME}</Text>
              <Text style={styles.tagline}>{TAGLINE}</Text>

              {!error ? (
                <ActivityIndicator size="large" color="#ffffff" style={styles.spinner} />
              ) : (
                <View style={styles.card}>
                  <Text style={styles.cardTitle}>Hindi ma-load ang page</Text>
                  <Text style={styles.cardText}>Tingnan ang internet connection mo.</Text>
                  <TouchableOpacity style={styles.button} onPress={retry}>
                    <Text style={styles.buttonText}>Subukan ulit</Text>
                  </TouchableOpacity>
                </View>
              )}
            </BrandedBackground>
          </Animated.View>
        )}
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#ffffff' },
  webRoot: {
    flex: 1,
    width: '100%',
    minHeight: '100%',
    alignSelf: 'stretch',
    backgroundColor: '#14234a',
  },
  fill: { flex: 1, position: 'relative', overflow: 'hidden', backgroundColor: '#14234a' },
  webview: { flex: 1, backgroundColor: '#ffffff' },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 10,
    elevation: 10,
    backgroundColor: '#14234a',
  },
  tint: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
    backgroundColor: 'rgba(14,28,66,0.28)',
  },
  centerContent: {
    flex: 1,
    zIndex: 2,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  logo: {
    width: LOGO_W,
    height: LOGO_H,
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
  },
  name: {
    marginTop: 18,
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
  },
  tagline: {
    marginTop: 6,
    fontSize: 14,
    color: '#e8ecf7',
    textAlign: 'center',
  },
  spinner: { marginTop: 28 },
  card: {
    marginTop: 28,
    width: '100%',
    maxWidth: 320,
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 20,
    alignItems: 'center',
  },
  cardTitle: { fontSize: 17, fontWeight: '700', color: '#1d2433', marginBottom: 6 },
  cardText: { fontSize: 14, color: '#5d6577', marginBottom: 16, textAlign: 'center' },
  button: {
    backgroundColor: '#1f3b7a',
    paddingVertical: 12,
    paddingHorizontal: 26,
    borderRadius: 9,
  },
  buttonText: { color: '#ffffff', fontSize: 16, fontWeight: '600' },
});