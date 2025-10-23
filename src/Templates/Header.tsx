import React from 'react';
import {StatusBar, StatusBarStyle, View} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../Helpers/Colors';

interface HeaderProps {
  barStyle: StatusBarStyle;
  showColor?: boolean;
}

const Header: React.FC<HeaderProps> = ({barStyle, showColor}) => {
  return (
    <View>
      <StatusBar barStyle={barStyle} />
      {showColor && (
        <>
          <View
            style={{
              height: StatusBar.currentHeight,
              backgroundColor: Colors.primary
            }}
          />
          <SafeAreaView style={{backgroundColor: Colors.primary}} />
        </>
      )}
    </View>
  );
};

export default Header;
