import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { ActivityIndicator } from 'react-native'

import { Geolocation } from '../utils/getGeolocation'
import { autoUnit } from '../utils/locale'

import { getEarthQuakes, renderQuakes, renderNoQuakes } from './Earthquakes'
import FilterPanel from './FilterPanel'

import colors from '../constants/colors';

const QuakeView = () => {
  const GPS = new Geolocation()

  const [ loading, setLoading ] = useState(true)
  const [ quakes, updateQuakes ] = useState([])
  const [ timeframe, updateTimeframe ] = useState('day')
  const [ threshold, updateThreshold ] = useState('4.5')
  const [ user, updateUser ] = useState({ location: null, unit: 'mi', userSelected: false })

  useEffect(() => {
    GPS.getLocation()
      .then(location => {
        if (!user.userSelected) {
          updateUser({ ...user, location: location, unit: autoUnit() })
        } else {
          updateUser({ ...user, location: location })
        }
      })
      .catch(e => console.log(e))
  }, [])

  useEffect(() => {
    refreshQuakes()
  }, [timeframe, threshold])

  const refreshQuakes = () => {
    setLoading(true)
    getEarthQuakes(timeframe, threshold)
      .then(quakes => {
        updateQuakes(quakes.features)
        setLoading(false)
      })
  }

  const changeTimeframe = (value) => {
    updateTimeframe(value)
  }

  const changeThreshold = (value) => {
    updateThreshold(value)
  }

  const changeUnit = (value) => {
    updateUser({ ...user, unit: value, userSelected: true })
  }

  const timeOptions = [
    { value: 'hour', label: 'Last hour' },
    { value: 'day', label: 'Last day' },
    { value: 'week', label: 'Last week' },
    { value: 'month', label: 'Last month' }
  ]

  const thresholdOptions = [
    { value: 'all', label: 'All' },
    { value: '1.0', label: '1.0+' },
    { value: '2.5', label: '2.5+' },
    { value: '4.5', label: '4.5+' },
    { value: 'significant', label: 'Significants' }
  ]

  const filterlist = [
    {
      prefix: 'Timeframe',
      selected: timeframe,
      items: timeOptions,
      onPress: changeTimeframe
    },
    {
      prefix: 'Magnitude',
      selected: threshold,
      items: thresholdOptions,
      onPress: changeThreshold
    },
    {
      prefix: 'Unit',
      selected: user.unit,
      items: [{ value: 'km', label: 'Metric' }, { value: 'mi', label: 'Imperial' }],
      onPress: changeUnit
    }
  ]

  return (
    <Main>
      <Top>
        <FilterPanel filterlist={ filterlist } />
      </Top>
      <Content>
        { loading ? <ActivityIndicator size="large" color={ colors.accent } /> : 
          quakes.length > 0 ? renderQuakes(quakes, user, loading, refreshQuakes) : renderNoQuakes()
        }
      </Content>
    </Main>
  )
}

export default QuakeView

const Main = styled.View`
  display: flex;
  flex-flow: column nowrap;
  height: 100%;
`

const Top = styled.View`
  flex: 0 0 auto;
`

const Content = styled.View`
  flex: 0 1 auto;
`