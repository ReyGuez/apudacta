/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import messaging from '@react-native-firebase/messaging';
import notifee, { AndroidImportance } from '@notifee/react-native';
import { Values } from './src/Helpers/Values';

messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('📩 FCM recibido en background:', remoteMessage);

  const dataPayload = remoteMessage?.data || {};

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
    android: {
      channelId,
      smallIcon: Values.icon,
      sound: Values.sound,
      pressAction: {
        id: Values.pressAction,
      },
    },
    data: dataPayload,
  });
});

AppRegistry.registerComponent(appName, () => App);
