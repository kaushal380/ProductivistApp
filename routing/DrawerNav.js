import { StatusBar } from 'expo-status-bar';
import 'react-native-gesture-handler';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Home from '../screens/Home';
import Settings from '../screens/Settings';
import calTab from '../screens/scheduler/CalTab';
import Routine from '../screens/routines/RoutineMaker';
import Todo from '../screens/tasks/Todo';
import { NavigationContainer } from '@react-navigation/native';
import TabNav from '../screens/tasks/TabNav'

const Drawer = createDrawerNavigator();
export default function DrawerNav() {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name = "Home" component = {Home} />
      <Drawer.Screen name = "Scheduler" component = {calTab} />
      <Drawer.Screen name = "Todo" component = {TabNav} />
      <Drawer.Screen name = "Routines" component = {Routine}/>
      <Drawer.Screen name = "About" component = {Settings}/>
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
