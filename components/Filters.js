import React from 'react'
import styled from 'styled-components'

import colors from '../constants/colors'

const Filters = ({ prefix, items, selected, onPress }) => {
    return items.map(item => (
        <Filter key={`${prefix}-${item.value}`} checked={ selected === item.value }>
            <RadioWrapper onPress={() => onPress(item.value)}><Radio checked={ selected === item.value }><Label checked={ selected === item.value }>{ item.label }</Label></Radio></RadioWrapper>
        </Filter>
    ))
}

export default Filters

const Filter = styled.View`
    flex: 1 1 auto;
    border-bottom-width: 1px;
    border-bottom-color: grey;
    ${ props => props.checked ? `
        border-bottom-color: ${ colors.accent };
    ` : '' }
`
const RadioWrapper = styled.TouchableOpacity`
`

const Radio = styled.View`
    padding: 4px 8px;
    background-color: rgba(255, 255, 255, 0);
    ${ props => props.checked ? `
        background-color: rgba(255, 255, 255, 0.1);
    ` : '' }
`

const Label = styled.Text`
    text-align: center;
    color: ${ colors.foreground };
    ${ props => props.checked ? `
        color: ${ colors.accent };
    ` : '' }
`
