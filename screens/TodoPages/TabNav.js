import * as React from 'react';
import { View, useWindowDimensions, StyleSheet } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import todo from './Todo';
import ShortMaker from './TodoShortTerm/ShortMaker';
import { colors } from '../../styles/AppStyles';

const renderScene = SceneMap({
  first: ShortMaker,
  second: todo,
});

const renderTabBar = () => {
  return(
  <TabBar
    style = {styles.activeBar}
    activeColor='#4D3636'
    inactiveColor='#332424'
  />
  );
}

export default function TabViewExample() {
  const layout = useWindowDimensions();

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'first', title: 'Appointments' },
    { key: 'second', title: 'Tasks' },
  ]);

  return (
    <TabView
      navigationState={{ index, routes }} 
      tabBarPosition='top' 
      // renderTabBar = {<TabBar style = {styles.activeBar}/>}
      swipeEnabled = {false} 
      renderScene={renderScene} 
      onIndexChange={setIndex} 
      initialLayout={{ width: layout.width }} 
    />
  );
}


const styles = StyleSheet.create({
  activeBar: {
    backgroundColor: colors.secondary,
  },
  inactiveBar: {backgroundColor: colors.primary}
})
