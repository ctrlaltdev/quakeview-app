import React from 'react'
import { Platform, StyleSheet, Text, TouchableOpacity, ScrollView, View } from 'react-native'

const Filters = ({ prefix, items, selected, onChange }) => {
    return items.map(item => (
        <View className='Filters__Filter' key={`${prefix}-${item.value}`}>
            <TouchableOpacity onChange={onChange}><View value={item.value} checked={selected === item.value}></View> <Text>{ item.label }</Text></TouchableOpacity>
        </View>
    ))
}

export default Filters
