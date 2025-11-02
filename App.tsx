import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import {
  CardStyleInterpolators,
  createStackNavigator,
} from '@react-navigation/stack';
import Home from './src/Home';
import Info from './src/Info';
import { StatusBar } from 'react-native';

export type RootStackParamList = {
  Home: undefined;
  Info: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();
const linking = {
  prefixes: ['myapudacta://'],
  config: {
    screens: {
      Home: 'Home',
      Info: 'Info',
    },
  },
};

const RootStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={Home}
        options={{
          headerShown: false,
          cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
          gestureEnabled: true,
        }}
      />
      <Stack.Screen
        name="Info"
        component={Info}
        options={{
          headerShown: false,
          cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
          gestureEnabled: true,
        }}
      />
    </Stack.Navigator>
  );
};

const App = () => {
  return (
    <NavigationContainer linking={linking}>
      <StatusBar
        translucent={true}
        backgroundColor="transparent"
        barStyle="light-content"
      />
      <RootStack />
    </NavigationContainer>
  );
};

export default App;
