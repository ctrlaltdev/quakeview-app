import React, { Fragment, useState } from 'react'
import { SectionList, Platform } from 'react-native'
import styled from 'styled-components'

import colors from '../constants/colors'

import Filters from './Filters'

const FilterPanel = ({ filterlist }) => {
    const isIOS = Platform.OS === 'ios'
    const [ open, toggleFilters ] = useState(false)

    const filtersList = filterlist.map(f => ({
        title: f.prefix,
        ...f,
        data: [ { items: f.items, key: `Filter-${f.prefix}` } ]
    }))

    const states = filterlist.map(f => (
        <FilterState key={`FilterState-${f.prefix}`}>{ f.prefix }: { f.selected }</FilterState>
    ))

    const getPanel = () => (
        open ?
            <SectionList
                renderItem={ ({ item, section }) => <FiltersList key={item.key}><Filters prefix={ section.prefix } selected={ section.selected } onPress={ section.onPress } items={ item.items } /></FiltersList> }
                renderSectionHeader={ ({ section: { title } }) => <FilterLabel>{ title }</FilterLabel> }
                sections={ filtersList } /> :
            <FiltersState>{ states }</FiltersState>
    )

    return (
        <Fragment>
            <ToggleWrapper><Toggle key='FiltersToggle' value={ open } trackColor={ { true: colors.accent } } thumbColor={ 'white' } onChange={() => toggleFilters(!open)} style={ isIOS ? { transform: [{ scaleX: .8 }, { scaleY: .8 }] } : null} /></ToggleWrapper>
            { getPanel() }
        </Fragment>
    )
}

export default FilterPanel

const ToggleWrapper = styled.View`
    display: flex;
    padding: 0 8px;
    flex-flow: row nowrap;
    justify-content: flex-end;
`

const Toggle = styled.Switch`
    flex: 0 0 auto;
`

const FiltersState = styled.View`
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    padding: 8px;
`

const FilterState = styled.Text`
    color: ${ colors.foreground };
    flex: 0 1 auto;
    padding: 4px 0;
    text-align: center;
    opacity: 0.4;
`

const FilterLabel = styled.Text`
    color: ${ colors.foreground };
    padding: 8px 8px 0;
    font-weight: bold;
    font-size: 16px;
`

const FiltersList = styled.View`
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
  padding: 8px;
`
