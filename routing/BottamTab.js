import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import Home from "../screens/Home";
import scheduler from "../screens/scheduler/CalTab";
import todo from "../screens/TodoPages/TabNav";
import RoutineMaker from "../screens/Routines/RoutineMaker";
import About from "../screens/About";
import { View, Button, Text } from "react-native";
import {Entypo, AntDesign, Ionicons} from "@expo/vector-icons"
const Tab = createBottomTabNavigator();

const Tabs = () => {
    return(
        <Tab.Navigator
            screenOptions={ ({ route }) => ({
                tabBarIcon: ({focused, color, size}) => {
                    let iconName = "menu";
                    if(route.name === 'Home'){
                        iconName = "home"
                        size = 40
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
                tabBarActiveTintColor: 'tomato',
                tabBarInactiveTintColor: 'grey',

            })}
            initialRouteName="Home"
        >

            <Tab.Screen name="Schedule" component = {scheduler}/>
            <Tab.Screen name="Todo" component = {todo}/>
            <Tab.Screen name="Home" component = {Home}/> 
            <Tab.Screen name="Routines" component = {RoutineMaker}/>
            <Tab.Screen name="Settings" component = {About}/>
        </Tab.Navigator>
    )
}

export default Tabs;