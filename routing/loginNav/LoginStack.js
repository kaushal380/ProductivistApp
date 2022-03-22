// import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import {View, Text, StyleSheet, LogBox} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LoginScreen from '../../screens/loginsScreens/LoginScreen';
import DrawerNav from '../TabNav';
// import Home from './screens/Home';
import SignupScreen from '../../screens/loginsScreens/SignupScreen';
import Welcome from '../../screens/welcomeScreens/Welcome';
import About from '../../screens/About';
const Stack = createNativeStackNavigator();

export default function loginUI() {
  return(
    <Stack.Navigator>
      <Stack.Screen options = {{headerShown: false}} name = "welcome" component = {Welcome} />
      <Stack.Screen options = {{headerShown: false}} name = "Login" component = {LoginScreen} />
      <Stack.Screen options = {{headerShown: false}} name = "Signup" component = {SignupScreen} />
      <Stack.Screen options = {{headerShown: false}} name = "AppRoute" component = {DrawerNav} />
    </Stack.Navigator>
  );
}
