import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { RefreshControl, ActivityIndicator, View } from 'react-native'

import { getGeolocation } from '../utils/getGeolocation'
import { autoUnit } from '../utils/locale'

import { getEarthQuakes, renderQuakes, renderNoQuakes } from './Earthquakes'
import Filters from './Filters'

import colors from '../constants/colors';

const index = () => {
  const [ loading, setLoading ] = useState(true)
  const [ quakes, updateQuakes ] = useState([])
  const [ timeframe, updateTimeframe ] = useState('day')
  const [ threshold, updateThreshold ] = useState('4.5')
  const [ user, updateUser ] = useState({ location: null, unit: 'km', userSelected: false })

  useEffect(() => {
    getGeolocation()
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

  return (
    <View>
      <View className='Filters'>
        <View className='Filters__Timeframe'>
          <FiltersList><Filters prefix='time' selected={timeframe} onPress={changeTimeframe} items={timeOptions} /></FiltersList>
        </View>
        <View className='Filters__Threshold'>
          <FiltersList><Filters prefix='magnitude' selected={threshold} onPress={changeThreshold} items={thresholdOptions} /></FiltersList>
        </View>
        <View className='Filters__Unit'>
          <FiltersList><Filters prefix='unit' selected={user.unit} onPress={changeUnit} items={[{ value: 'km', label: 'Metric' }, { value: 'mi', label: 'Imperial' }]} /></FiltersList>
        </View>
      </View>

      { loading ? <ActivityIndicator size="large" color={ colors.accent } /> : 
        quakes.length > 0 ? 
          <Quakes refreshControl={
            <RefreshControl refreshing={loading} onRefresh={refreshQuakes} />
          }>
            { renderQuakes(quakes, user) }
          </Quakes> : renderNoQuakes()
      }
    </View>
  )
}

export default index

const Quakes = styled.ScrollView`
  height: 100%;
`
const FiltersList = styled.View`
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
  padding: 8px;
`