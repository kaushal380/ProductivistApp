import * as React from 'react';
import { View, useWindowDimensions, StyleSheet } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import todo from './Todo';
import ShortMaker from './TodoShortTerm/ShortMaker';
import { colors } from '../../styles/AppStyles';

const renderScene = SceneMap({
  first: todo,
  second: ShortMaker,
});

const renderTabBar = props => (
  <TabBar
    {...props}
    indicatorStyle={{ backgroundColor: 'white' }}
    style={{ backgroundColor: "#4D3636" }}
    labelStyle = {{color: "white"}}
    
  />
);
export default function TabViewExample() {
  const layout = useWindowDimensions();

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'first', title: 'Tasks' },
    { key: 'second', title: 'Appointments' },
  ]);

  return (
    <TabView
      navigationState={{ index, routes }} 
      tabBarPosition='top' 
      renderTabBar = {renderTabBar}
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
