import React, { useState } from 'react';
import { StyleSheet, StatusBar, Platform, View, Text, TouchableOpacity, Linking } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';

export default function App() {
  const targetUrl = 'https://ifisantacruz.com/';

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        {Platform.OS === 'web' ? (
          <View style={styles.webContainer}>
            <Text style={styles.text}>IFI Santa Cruz Web Portal</Text>
            <Text style={styles.subtext}>
              (Note: Mobile WebView is enabled for Android/iOS builds)
            </Text>
            <TouchableOpacity 
              style={styles.button}
              onPress={() => Linking.openURL(targetUrl)}
            >
              <Text style={styles.buttonText}>Open ifisantacruz.com</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <WebView 
            source={{ uri: targetUrl }} 
            style={{ flex: 1 }}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            startInLoadingState={true}
          />
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  webContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  subtext: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});