import React, { Fragment, useState } from 'react'
import { Switch, SectionList } from 'react-native'
import styled from 'styled-components'

import colors from '../constants/colors'

import Filters from './Filters'

const FilterPanel = ({ filterlist }) => {

    const [ open, toggleFilters ] = useState(false)

    if ( open ) {
        const filtersList = filterlist.map(f => ({
            title: f.prefix,
            ...f,
            data: [ { items: f.items, key: `Filter-${f.prefix}` } ]
        }))
        return (
            <Fragment>
                <Switch key='FiltersToggle' value={ open } onChange={() => toggleFilters(!open)} />
                <SectionList
                    renderItem={ ({ item, section }) => <FiltersList key={item.key}><Filters prefix={ section.prefix } selected={ section.selected } onPress={ section.onPress } items={ item.items } /></FiltersList> }
                    renderSectionHeader={ ({ section: { title } }) => <FilterLabel>{ title }</FilterLabel> }
                    sections={ filtersList } />
            </Fragment>
        )
    }
    const states = filterlist.map(f => (
        <FilterState key={`FilterState-${f.prefix}`}>{ f.prefix }: { f.selected }</FilterState>
    ))
    return (
        <Fragment>
            <Switch key='FiltersToggle' value={ open } onChange={() => toggleFilters(!open)} />
            <FiltersState>
                { states }
            </FiltersState>
        </Fragment>
    )
}

export default FilterPanel

const FiltersState = styled.View`
    display: flex;
    flex-flow: row nowrap;
`

const FilterState = styled.Text`
    color: ${ colors.foreground };
    flex: 1 1 auto;
    padding: 4px 8px;
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
