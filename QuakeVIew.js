import { Platform, StyleSheet, Text, ScrollView, View } from 'react-native'
import React, { useState, useEffect } from 'react'

import { getGeolocation } from './utils/getGeolocation'
import { newNotification } from './utils/notifications'
import { autoUnit } from './utils/locale'

import { getEarthQuakes, renderQuakes, renderNoQuakes } from './components/Earthquakes'
import Filters from './components/Filters'
import MapContainer from './components/MapContainer'

const index = () => {
  const [quakes, updateQuakes] = useState([])
  const [timeframe, updateTimeframe] = useState('day')
  const [threshold, updateThreshold] = useState('4.5')
  const [user, updateUser] = useState({ location: null, unit: 'km', userSelected: false })
  const [canNotify, updateCanNotify] = useState(false)
  // const [map, updateMap] = useState({ isOpen: false })
  
  let notifications = []

  useEffect(() => {
    updateCanNotify(Notification.permission === 'granted')
    const deniedNotify = Notification.permission === 'denied'

    getGeolocation()
      .then(location => {
        if (!user.userSelected) {
          updateUser({ ...user, location: location, unit: autoUnit() })
        } else {
          updateUser({ ...user, location: location })
        }
      })

    if (!canNotify && !deniedNotify) {
      Notification.requestPermission()
        .then(permission => {
          updateCanNotify(permission === 'granted')
        })
    }
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
          if (canNotify) {
            notifications.push(newNotification('Quake View', 'New earthquakes'))
          }
        })
    }, 1000 * 60)

    return () => clearInterval(interval)
  }, [timeframe, threshold, canNotify])

  const openMap = (coords, quake) => {
    // updateMap({ ...coords, ...quake, isOpen: true })
  }

  const closeMap = () => {
    updateMap({ isOpen: false })
  }

  const changeTimeframe = (e) => {
    updateTimeframe(e.target.value)
  }

  const changeThreshold = (e) => {
    updateThreshold(e.target.value)
  }

  const changeUnit = (e) => {
    updateUser({ ...user, unit: e.target.value, userSelected: true })
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
          <Filters prefix='time' selected={timeframe} onChange={changeTimeframe} items={timeOptions} />
        </View>
        <View className='Filters__Threshold'>
          <Filters prefix='magnitude' selected={threshold} onChange={changeThreshold} items={thresholdOptions} />
        </View>
        <View className='Filters__Unit'>
          <Filters prefix='unit' selected={user.unit} onChange={changeUnit} items={[{ value: 'km', label: 'Metric' }, { value: 'mi', label: 'Imperial' }]} />
        </View>
      </View>

      {/* { map.isOpen ? <MapContainer coords={map.coords} quake={map.quake} closeMap={closeMap} /> : null } */}

      { quakes.length > 0 ? 
        <ul className='Earthquakes'>
          { renderQuakes(quakes, user, openMap) }
        </ul> : renderNoQuakes()
      }
    </View>
  )
}

export default index
