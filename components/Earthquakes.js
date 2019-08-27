import React from 'react'
import styled from 'styled-components'
import Moment from 'moment'

import colors from '../constants/colors'

import { magnitudeColoring } from '../utils/magnitudeColoring'
import { getDistance } from '../utils/getGeolocation'

export const getEarthQuakes = (timeframe = 'hour', threshold = 'all') => {
  return new Promise((resolve, reject) =>{
    fetch(`https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/${threshold}_${timeframe}.geojson`).then(data => data.json()).then(json => resolve(json)).catch(err => reject(err))
  })
}

export const renderQuakes = (quakes = [], user = {}) => {
  return quakes.map((q, i) => (
    <Quake className='Earthquake' key={`quake-${q.id}`}>
      <Magnitude className='Earthquake__Magnitude' style={{ backgroundColor: magnitudeColoring(q.properties.mag) }}><MagnitudeOverlay className='Earthquake__Magnitude__Overlay'><MagnitudeText>{ q.properties.mag }</MagnitudeText></MagnitudeOverlay></Magnitude>
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
  height: 100%;
`
const NoQuakesText = styled.Text`
  font-family: 'Montserrat';
  font-size: 32px;
  margin-top: 50%;
  text-align: center;
  color: ${ colors.foreground };
`

const Quake = styled.View`
  margin: 8px;
  height: 48px;
  font-size: 16px;
  display: flex;
  flex-flow: row nowrap;
  background-color: rgba(255, 255, 255, 0.1);
`

const Magnitude = styled.View`
  flex: 0 0 auto;
  width: 48px;
  height: 48px;
  line-height: 48px;
  margin-right: 8px;
  background-color: grey;
`

const MagnitudeOverlay = styled.View`
  background-color: rgba(0, 0, 0, 0.2);
  width: 48px;
  height: 48px;
`

const MagnitudeText = styled.Text`
  line-height: 48px;
  font-weight: bold;
  color: white;
  text-align: center;
  color: ${ colors.background };
  font-family: 'Montserrat';
`

const Location = styled.Text`
  font-family: 'Montserrat';
  flex: 1 1 auto;
  padding: 0 8px;
  height: 48px;
  color: ${ colors.foreground };
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
  color: ${ colors.foreground };
`

const TimeRelative = styled.Text`
  font-family: 'Montserrat';
  height: 48px;
  color: ${ colors.foreground };
`