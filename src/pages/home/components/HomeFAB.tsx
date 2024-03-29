import React from 'react'
import { TouchableOpacity, TouchableOpacityProps } from 'react-native'
import { SFSymbol } from 'react-native-sfsymbols'
import useTheme from '../../../Theming'

function FAB(props: TouchableOpacityProps) {
    const theme = useTheme()

    return (
        <TouchableOpacity
            style={{
                backgroundColor: theme.color.primary_color,
                padding: 11,
                position: 'absolute',
                bottom: 0,
                right: 0,
                marginRight: 25,
                marginBottom: 20,
                borderRadius: 15,
                elevation: 3,
            }}
            {...props}>
            <SFSymbol
                style={{
                    width: 30,
                    height: 30,
                }}
                size={20}
                name="plus"
                color="white"
            />
        </TouchableOpacity>
    )
}

export default FAB
