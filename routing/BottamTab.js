// import React from "react";
// import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

// import Home from "../screens/Home";
// import scheduler from "../screens/scheduler/Scheduler";
// import todo from "../screens/TodoPages/Todo";
// import RoutineMaker from "../screens/Routines/RoutineMaker";
// import About from "../screens/About";
// import { View, Button, Text } from "react-native";

// import {Entypo, AntDesign} from "@expo/vector-icons"

// const Tab = createBottomTabNavigator();

// const Tabs = () => {
//     return(
//         <Tab.Navigator
//             screenOptions = {{
//                 tabBarShowLabel: true,
//                 tabBarStyle: {
//                     position: 'absolute',
                    
//                 }

//             }}
//         >
//             <Tab.Screen name="Home" component = {Home}/> 
//             <Tab.Screen name="schedule" component = {scheduler}/>
//             <Tab.Screen name="Todo" component = {todo} />
//             <Tab.Screen name="RoutineMaker" component = {RoutineMaker}/>
//             <Tab.Screen name="About" component = {About}/>
//         </Tab.Navigator>
//     )
// }

// export default Tabs;