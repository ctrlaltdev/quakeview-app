import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { View } from 'react-native'

import { getGeolocation } from './utils/getGeolocation'
import { autoUnit } from './utils/locale'

import { getEarthQuakes, renderQuakes, renderNoQuakes } from './components/Earthquakes'
import Filters from './components/Filters'
import MapContainer from './components/MapContainer'

const index = () => {
  const [quakes, updateQuakes] = useState([])
  const [timeframe, updateTimeframe] = useState('day')
  const [threshold, updateThreshold] = useState('4.5')
  const [user, updateUser] = useState({ location: null, unit: 'km', userSelected: false })

  useEffect(() => {
    getGeolocation()
      .then(location => {
        if (!user.userSelected) {
          updateUser({ ...user, location: location, unit: autoUnit() })
        } else {
          updateUser({ ...user, location: location })
        }
      })
  }, [])

  useEffect(() => {
    getEarthQuakes(timeframe, threshold)
      .then(quakes => { updateQuakes(quakes.features) })
  }, [timeframe, threshold])

  useEffect(() => {
    const interval = setInterval(() => {
      getEarthQuakes(timeframe, threshold)
        .then(quakes => { 
          updateQuakes(quakes.features)
        })
    }, 1000 * 60)

    return () => clearInterval(interval)
  }, [timeframe, threshold])

  const openMap = (coords, quake) => {
    // updateMap({ ...coords, ...quake, isOpen: true })
  }

  const closeMap = () => {
    updateMap({ isOpen: false })
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

      {/* { map.isOpen ? <MapContainer coords={map.coords} quake={map.quake} closeMap={closeMap} /> : null } */}

      { quakes.length > 0 ? 
        <Quakes className='Earthquakes'>
          { renderQuakes(quakes, user, openMap) }
        </Quakes> : renderNoQuakes()
      }
    </View>
  )
}

export default index

const Quakes = styled.ScrollView`

`
const FiltersList = styled.View`
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
  padding: 8px;
`