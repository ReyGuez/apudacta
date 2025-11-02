import {
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import Header from '../Templates/Header';
import { useNavigation, useRoute } from '@react-navigation/native';
import WebView from 'react-native-webview';
import * as Progress from 'react-native-progress';
import { Colors } from '../Helpers/Colors';
import messaging from '@react-native-firebase/messaging';
import notifee, { AndroidImportance, EventType } from '@notifee/react-native';
import { Values } from '../Helpers/Values';

const Home = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const [progress, setProgress] = useState(0);
  const [uri, setUri] = useState('');

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('remoteMessage', remoteMessage);
      delete remoteMessage?.mutableContent;
      delete remoteMessage?.contentAvailable;
      onDisplayNotification(remoteMessage);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    const unsubscribe = notifee.onForegroundEvent(({ type, detail }) => {
      if (type === EventType.PRESS) {
        console.log('Notificación FCM tocada:', detail.notification);
        miFuncionAlTocarNotificacion(detail.notification);
      }
    });

    return () => unsubscribe();
  }, []);

  function miFuncionAlTocarNotificacion(notification: any) {
    const page = notification?.data?.data?.page || notification?.data?.page;
    setUri(page);
  }

  async function onDisplayNotification(remoteMessage: any) {
    if (Platform.OS === 'android' && Platform.Version >= 33) {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      );
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) return;
    }

    await notifee.requestPermission();

    const dataPayload =
      remoteMessage?.notification || remoteMessage?.data || {};

    const channelId = await notifee.createChannel({
      id: Values.id,
      name: Values.name,
      importance: AndroidImportance.HIGH,
      vibration: true,
      vibrationPattern: [300, 500, 300, 500],
    });

    await notifee.displayNotification({
      title: dataPayload.title,
      body: dataPayload.body,
      data: remoteMessage,
      android: {
        channelId,
        smallIcon: Values.icon,
        sound: Values.sound,
        vibrationPattern: [300, 500, 300, 500],
        pressAction: {
          id: Values.pressAction,
        },
      },
      ios: {
        categoryId: 'default',
        sound: 'default',
      },
    });
  }


  return (
    <View style={styles.container}>
      <Header barStyle="light-content" showColor />
      {progress < 1 && (
        <Progress.Bar
          progress={progress}
          width={null}
          color={Colors.primary}
          borderRadius={0}
          borderWidth={0}
          height={3}
        />
      )}
      <WebView
        source={{
          uri:
            route.params?.url ||
            uri ||
            'https://sandbox-client-app.apudacta.com/',
        }}
        onLoadProgress={({ nativeEvent }) => setProgress(nativeEvent.progress)}
        startInLoadingState={true}
        style={{ flex: 1 }}
      />
      <TouchableOpacity
      onPress={() => navigation.navigate('Info')}
        style={{
          position: 'absolute',
          bottom: 100,
          right: 20,
          backgroundColor: Colors.primary,
          width: 50,
          height: 50,
          borderRadius: 25,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Text style={{ color: Colors.white, fontSize: 30, lineHeight: 30 }}>
          +
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
