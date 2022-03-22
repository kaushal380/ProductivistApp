import React from 'react';
import { Text, View } from 'react-native';
import AppLoading from 'expo-app-loading';
import { useFonts } from 'expo-font';

export default props => {
  let [fontsLoaded] = useFonts({
    'Oswald-SemiBold': require('../../assets/fonts/Oswald/static/Oswald-SemiBold.ttf'),
    'Oswald-ExtraLight': require('../../assets/fonts/Oswald/static/Oswald-ExtraLight.ttf'),
    'Oswald-Light': require('../../assets/fonts/Oswald/static/Oswald-Light.ttf'),
    'Oswald-Medium': require('../../assets/fonts/Oswald/static/Oswald-Medium.ttf'),
    'Oswald-Regular': require('../../assets/fonts/Oswald/static/Oswald-Regular.ttf'),
    'Oswald-Bold': require('../../assets/fonts/Oswald/static/Oswald-Bold.ttf'),
    "FontsFree-Net-PlaylistScript": require('../../assets/fonts/playlist/FontsFree-Net-PlaylistScript.ttf')
  });
  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <View>
    </View>
  );
};
