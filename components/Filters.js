import React from 'react'
import styled from 'styled-components'

const Filters = ({ prefix, items, selected, onPress }) => {
    return items.map(item => (
        <Filter className='Filters__Filter' key={`${prefix}-${item.value}`}>
            <RadioWrapper onPress={() => onPress(item.value)}><Radio checked={ selected === item.value } /><Label>{ item.label }</Label></RadioWrapper>
        </Filter>
    ))
}

export default Filters

const Filter = styled.View`
    margin-right: 8px;
`
const RadioWrapper = styled.TouchableOpacity`
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
`

const Radio = ({ checked }) => (
    <RadioOuter><RadioInner checked={ checked } /></RadioOuter>
)

const RadioOuter = styled.View`
    flex: 0 0 auto;
    width: 16px;
    height: 16px;
    border-radius: 16px;
    background-color: #ddd;
    margin-right: 4px;
`

const RadioInner = styled.View`
    width: 10px;
    height: 10px;
    border-radius: 10px;
    margin: 3px auto;
    background-color: white;
    ${ props => props.checked ? `
        background-color: #99ccff;
    ` : '' }
`

const Label = styled.Text`
    flex: 0 0 auto;
`
