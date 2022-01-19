import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

const About = () => {
  return (
    <View style = {styles.container}>
      <Text>Settings</Text>
    </View>
  )
}

export default About

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    flex: 1
  }
})
