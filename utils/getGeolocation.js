import Locator from 'react-native-geolocation-service'
import { Platform, PermissionsAndroid } from 'react-native'

async function requestLocationPermission () {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Where are you?',
        message:
          'We can tell you the distance to the earthquake ' +
          'if you give us permission.',
        buttonNeutral: 'Meh',
        buttonNegative: 'Nope',
        buttonPositive: 'OK',
      },
    )
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      return true
    } else {
      return false
    }
  } catch (err) {
    console.warn(err)
  }
}

export class Geolocation {
  constructor () {
    if ( Platform.OS === 'ios' ) {
      Locator.setRNConfiguration({ authorizationLevel: 'whenInUse' })
      this.granted = Locator.requestAuthorization()
    }
    if ( Platform.OS === 'android' ) {
      this.granted = requestLocationPermission()
    }
  }

  getLocation() {
    return new Promise((resolve, reject) => {
      Locator.getCurrentPosition(
        location => resolve(location),
        err => reject(err),
        { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
      ).catch(err => reject(err))
    })
  }
}

export const getDistance = (coord1, coord2) => {
  const R = 6371 // Radius of the earth in km
  const dLat = (coord2.lat - coord1.lat) * Math.PI / 180  // Javascript functions in radians
  const dLon = (coord2.lon - coord1.lon) * Math.PI / 180
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(coord1.lat * Math.PI / 180) * Math.cos(coord2.lat * Math.PI / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2) 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const d = R * c // Distance in km
  return { km: Math.round(d), mi: Math.round(d * 0.62137119) }
}
