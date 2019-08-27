import React, { useEffect } from 'react'
import { StatusBar } from 'react-native'

import styled from 'styled-components'

import colors from './constants/colors'

import QuakeView from './components/QuakeView'


const App = () => {
  return (
    <Root>
      <Container>
        <StatusBar barStyle="light-content" backgroundColor="#222" />
        <QuakeView />
      </Container>
    </Root>
  )
}

const Root = styled.View`
  background-color: ${ colors.background };
  height: 100%;
`

const Container = styled.SafeAreaView`
`
export default App
