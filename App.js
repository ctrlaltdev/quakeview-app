import React, { useState } from 'react'
import { Platform, StatusBar, StyleSheet, Text, ScrollView, View } from 'react-native'
import { AppLoading } from 'expo'

import QuakeView from './QuakeVIew'

export default function App(props) {
  const [isLoadingComplete, setLoadingComplete] = useState(false)

  if (!isLoadingComplete && !props.skipLoadingScreen) {
    return (
      <AppLoading
        startAsync={loadResourcesAsync}
        onError={handleLoadingError}
        onFinish={() => handleFinishLoading(setLoadingComplete)}
      />
    )
  } else {
    return (
      <View style={styles.container}>
        {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
        <QuakeView />
      </View>
    )
  }
}

async function loadResourcesAsync() {
  await Promise.all([])
}

function handleLoadingError(error) {
  console.warn(error);
}

function handleFinishLoading(setLoadingComplete) {
  setLoadingComplete(true);
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingTop: 32,
    flex: 1,
    backgroundColor: '#fff',
  },
  text: {
    color: '#333'
  }
});
