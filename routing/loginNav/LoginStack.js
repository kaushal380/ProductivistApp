import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LoginScreen from '../../screens/login/LoginScreen';
import TabNav from '../TabNav';
import SignupScreen from '../../screens/login/SignupScreen';
import Welcome from '../../screens/login/Welcome';

const Stack = createNativeStackNavigator();

export default function loginUI() {
  return(
    <Stack.Navigator>
      <Stack.Screen options = {{headerShown: false}} name = "welcome" component = {Welcome} />
      <Stack.Screen options = {{headerShown: false}} name = "Login" component = {LoginScreen} />
      <Stack.Screen options = {{headerShown: false}} name = "Signup" component = {SignupScreen} />
      <Stack.Screen options = {{headerShown: false}} name = "AppRoute" component = {TabNav} />
    </Stack.Navigator>
  );
}
