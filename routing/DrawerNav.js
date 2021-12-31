import { StatusBar } from 'expo-status-bar';
import 'react-native-gesture-handler';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Home from '../screens/Home';
import About from '../screens/About';
import calTab from '../screens/scheduler/CalTab';
import Routine from '../screens/Routines/RoutineMaker';
import Todo from '../screens/TodoPages/Todo';
import { NavigationContainer } from '@react-navigation/native';
import TabNav from '../screens/TodoPages/TabNav'

const Drawer = createDrawerNavigator();
export default function DrawerNav() {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name = "Home" component = {Home} />
      <Drawer.Screen name = "Scheduler" component = {calTab} />
      <Drawer.Screen name = "Todo" component = {TabNav} />
      <Drawer.Screen name = "Routines" component = {Routine}/>
      <Drawer.Screen name = "About" component = {About}/>
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
