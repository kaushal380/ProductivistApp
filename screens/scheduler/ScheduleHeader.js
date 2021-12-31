import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

// style components
import {
    HeaderView,
    HeaderTitle,
    HeaderButton, 
    colors
} from "../../styles/AppStyles";

import {Entypo, AntDesign} from "@expo/vector-icons"
const ScheduleHeader = ({getInit, deleteSchedule}) => {
    const date = new Date().toDateString()
    return (
    <HeaderView>
        
            <HeaderTitle>schedule</HeaderTitle>
            <HeaderButton
            onPress = {deleteSchedule}
            >
                <Entypo name='trash' size={25} color={colors.tertiary}/>

            </HeaderButton>
            
            <HeaderButton
                onPress = {getInit}    
            >
                <AntDesign name = "sync" size = {25} color = {colors.tertiary} />

            </HeaderButton>


    </HeaderView>
    )
}



export default ScheduleHeader
