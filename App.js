import React from 'react'
import { LogBox, StyleSheet, Text, View } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import Tabs from './routing/BottamTab'
import LoginStack from './routing/loginNav/LoginStack';

const App = () => {
  LogBox.ignoreAllLogs(true)
  return (
    <NavigationContainer>
      <LoginStack/>
    </NavigationContainer>
  )
}

export default App

const styles = StyleSheet.create({})