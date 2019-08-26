import React from 'react'
import styled from 'styled-components'
import Moment from 'moment'
import { magnitudeColoring } from '../utils/magnitudeColoring'
import { getDistance } from '../utils/getGeolocation'

export const getEarthQuakes = (timeframe = 'hour', threshold = 'all') => {
  return new Promise((resolve, reject) =>{
    fetch(`https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/${threshold}_${timeframe}.geojson`).then(data => data.json()).then(json => resolve(json)).catch(err => reject(err))
  })
}

export const renderQuakes = (quakes = [], user = {}, openMap = null) => {
  return quakes.map((q, i) => (
    <Quake className='Earthquake' key={`quake-${q.id}`} onClick={() => { openMap({ lat: q.geometry.coordinates[1], lon: q.geometry.coordinates[0] }, q.properties.mag) }}>
      <Magnitude className='Earthquake__Magnitude' style={{ backgroundColor: magnitudeColoring(q.properties.mag) }}><MagnitudeOverlay className='Earthquake__Magnitude__Overlay'>{ q.properties.mag }</MagnitudeOverlay></Magnitude>
      <Location className='Earthquake__Location'>
        { q.properties.place }
        { user.location ?
          ` - ${ getDistance({ lat: user.location.coords.latitude, lon: user.location.coords.longitude }, { lat: q.geometry.coordinates[1], lon: q.geometry.coordinates[0] })[user.unit].toLocaleString() }${user.unit} from you` :
          null
        }
      </Location>
      <Time className='Earthquake__Time'><TimeAbsolute className='Earthquake__Time__Absolute'>{ Moment(q.properties.time).local().format('MMM, ddd DD [at] hh:mmA') }</TimeAbsolute><TimeRelative className='Earthquake__Time__Relative'>{ Moment(q.properties.time).fromNow() }</TimeRelative></Time>
    </Quake>
  ))
}

export const renderNoQuakes = () => {
  return (
    <NoQuakes className='NoEarthquakes'>
      <NoQuakesText>No earthquakes happened within the current filters</NoQuakesText>
    </NoQuakes>
  )
}

const NoQuakes = styled.View`
  padding: 16px;
`
const NoQuakesText = styled.Text`
  font-family: 'Montserrat';
  font-size: 32px;
`

const Quake = styled.View`
  margin: 8px;
  height: 48px;
  font-size: 16px;
  display: flex;
  flex-flow: row nowrap;
`

const Magnitude = styled.View`
  flex: 0 0 auto;
  width: 48px;
  height: 48px;
  line-height: 48px;
  margin-right: 8px;
  background-color: grey;
`

const MagnitudeOverlay = styled.Text`
  font-family: 'Montserrat';
  width: 48px;
  height: 48px;
  line-height: 48px;
  background-color: rgba(0, 0, 0, 0.2);
  font-weight: bold;
  color: white;
  text-align: center;
`

const Location = styled.Text`
  font-family: 'Montserrat';
  flex: 1 1 auto;
  padding: 0 8px;
  height: 48px;
`

const Time = styled.View`
  flex: 0 0 auto;
  padding: 8px;
  text-align: right;
`

const TimeAbsolute = styled.Text`
  font-family: 'Montserrat';
  height: 48px;
  display: none;
`

const TimeRelative = styled.Text`
  font-family: 'Montserrat';
  height: 48px;
`