import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import Home from "../screens/home/Home";
import fontTest from "../screens/home/fontTest";
import allEventCalendar from "../screens/scheduler/allEventCalendar";
import todo from "../screens/tasks/todos/TabNav";
import RoutineMaker from "../screens/routines/RoutineMaker";
import Settings from "../screens/settings/Settings";
import { View, Button, Text, StyleSheet } from "react-native";
import {Entypo, AntDesign, Ionicons} from "@expo/vector-icons"
const Tab = createBottomTabNavigator();
import {colors} from '../styles/AppStyles'
const Tabs = () => {
    return(
        <Tab.Navigator
            screenOptions={ ({ route }) => ({
                tabBarIcon: ({focused, color, size}) => {
                    let iconName = "menu";
                    if(route.name === 'Home'){
                        return <Entypo name='home' size={40} color={color}/>

                    }
                    else if(route.name === "Todo"){
                        iconName = "profile"
                    }
                    else if(route.name === "Routines"){
                        iconName = "clockcircle"
                    }
                    else if(route.name === "Schedule"){
                        iconName = "calendar"
                    }
                    else if(route.name === "Settings"){
                        return <Ionicons name="settings" size={size} color={color}/>
                    }

                    return <AntDesign name={iconName} size={size} color={color}/>
                },
                tabBarShowLabel: true,
                tabBarActiveTintColor: colors.secondary,
                tabBarInactiveTintColor: 'black',

            })}
            initialRouteName="Home"
        >

            <Tab.Screen name="Schedule" options={{headerShown: true,}} component = {allEventCalendar}/>
            <Tab.Screen name="Todo" options={{headerShown: true}} component = {todo} />
            <Tab.Screen name="Home" options={{headerShown: true}} component = {Home} />
            <Tab.Screen name="Routines" options={{headerShown: true}} component = {RoutineMaker}/>
            <Tab.Screen name="Settings" options={{headerShown: true}} component = {Settings}/>
        </Tab.Navigator>
    )
}

export default Tabs;

const styles = StyleSheet.create({
    bar: {
        backgroundColor: 'black'
    }
})
