import React, { useState } from 'react'
import styled from 'styled-components'
import { Platform, StatusBar } from 'react-native'
import { AppLoading } from 'expo'
import * as Font from 'expo-font'

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
      <Container>
        {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
        <QuakeView />
      </Container>
    )
  }
}

async function loadResourcesAsync() {
  const fontAssets = cacheFonts([{ Montserrat: require('./assets/fonts/montserrat.ttf') }])
  await Promise.all([
    ...fontAssets
  ])
}

function cacheFonts (fonts) {
  return fonts.map(font => Font.loadAsync(font))
}

function handleLoadingError(error) {
  console.warn(error);
}

function handleFinishLoading(setLoadingComplete) {
  setLoadingComplete(true);
}

const Container = styled.View`
  padding-top: 32px;
`
