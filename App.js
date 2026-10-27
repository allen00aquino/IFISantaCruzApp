import React, { useState, useRef, useCallback } from 'react';
import {
  StyleSheet, StatusBar, Platform, View, Text, TouchableOpacity,
  Linking, ActivityIndicator, Image, ImageBackground,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

const TARGET_URL = 'https://ifisantacruz.com/';

export default function App() {
  const webRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const hideSplash = useCallback(() => {
    SplashScreen.hideAsync();
  }, []);

  const retry = () => {
    setError(false);
    setLoading(true);
    webRef.current?.reload();
  };

  if (Platform.OS === 'web') {
    return (
      <View style={styles.center}>
        <Text style={styles.title}>IFI Santa Cruz Web Portal</Text>
        <TouchableOpacity style={styles.button} onPress={() => Linking.openURL(TARGET_URL)}>
          <Text style={styles.buttonText}>Open ifisantacruz.com</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaProvider onLayout={hideSplash}>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#000000" />

        {!error && (
          <WebView
            ref={webRef}
            source={{ uri: TARGET_URL }}
            style={styles.webview}
            javaScriptEnabled
            domStorageEnabled
            pullToRefreshEnabled
            allowsBackForwardNavigationGestures
            onLoadStart={() => setLoading(true)}
            onLoadEnd={() => setLoading(false)}
            onError={() => { setLoading(false); setError(true); }}
            onHttpError={() => { setLoading(false); setError(true); }}
          />
        )}

        {loading && !error && (
          <View style={styles.overlay}>
            <ImageBackground
              source={require('./assets/church-bg.jpg')}
              style={styles.bgImage}
              blurRadius={10}
              resizeMode="cover"
            >
              <View style={styles.darkDarkOverlay}>
                <Image
                  source={require('./assets/logo-transparent.png')}
                  style={styles.logo}
                />
                
                <Text style={styles.appTitle}>IFI Santa Cruz App</Text>
                
                <Text style={styles.subtext}>
                  Welcome to the Cathedral & Shrine of Our Lady of Maulawin
                </Text>

                <ActivityIndicator size="large" color="#ffffff" style={{ marginTop: 25 }} />
              </View>
            </ImageBackground>
          </View>
        )}

        {error && (
          <View style={styles.center}>
            <Text style={styles.title}>Hindi ma-load ang page</Text>
            <Text style={styles.subtextError}>Tingnan ang internet connection mo.</Text>
            <TouchableOpacity style={styles.button} onPress={retry}>
              <Text style={styles.buttonText}>Subukan ulit</Text>
            </TouchableOpacity>
          </View>
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000000' },
  webview: { flex: 1, backgroundColor: '#ffffff' },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  bgImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  darkDarkOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 25,
  },
  logo: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  appTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  subtext: {
    fontSize: 14,
    color: '#e0e0e0',
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: '85%',
  },
  subtextError: { fontSize: 14, color: '#666', marginTop: 10, marginBottom: 20, textAlign: 'center' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20, backgroundColor: '#ffffff' },
  title: { fontSize: 20, fontWeight: 'bold', color: '#333', marginBottom: 8 },
  button: { backgroundColor: '#007AFF', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 8 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});