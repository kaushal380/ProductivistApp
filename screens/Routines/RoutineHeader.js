import React from 'react'
import { View, Text } from 'react-native'

// style components
import {
    HeaderView,
    HeaderTitle,
    HeaderButton, 
    colors
} from "../../styles/AppStyles";

import {Entypo, AntDesign} from "@expo/vector-icons"
const Header = ({handleClearTodos, getInit}) => {
    return (
        <HeaderView>
            <HeaderTitle>Routines</HeaderTitle>
            <HeaderButton
                onPress = {handleClearTodos}
            >
                <Entypo name = "trash" size={25} color = {colors.tertiary} />
            </HeaderButton>
            <HeaderButton
                onPress = {getInit}    
            >
                <AntDesign name = "sync" size = {25} color = {colors.tertiary} />

            </HeaderButton>
        </HeaderView>
    )
}

export default Header
