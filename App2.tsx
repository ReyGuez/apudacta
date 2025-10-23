import notifee, { AndroidImportance, EventType } from '@notifee/react-native';
import {
  View,
  PermissionsAndroid,
  Platform,
  Text,
  Linking,
} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import { useEffect, useState } from 'react';
import WebView from 'react-native-webview';
import { NavigationContainer, useRoute } from '@react-navigation/native';

const linking = {
  prefixes: ['myapudacta://'],
  config: {
    screens: {
      Home: 'home',
      Profile: 'profile/:id',
    },
  },
};


const App = () => {
   const route = useRoute();
  const [uri, setUri] = useState('https://google.com');
  const [token, setToken] = useState('');

  useEffect(() => {
    getToken();
  }, []);

  useEffect(() => {
    async function checkInitialNotification() {
      const event = await notifee.getInitialNotification();

      if (event) {
        console.log('🚪 App abierta desde notificación:', event);
        // Lógica de navegación o inicialización
        miFuncionAlTocarNotificacion(event.notification);
      }
    }

    checkInitialNotification();
  }, []);

  useEffect(() => {
    const unsubscribe = notifee.onBackgroundEvent((event: any) => {
      if (event.type === EventType.PRESS) {
        console.log(
          '👆 Notificación tocada con la app abierta o en background:',
          event,
        );
        miFuncionAlTocarNotificacion(event.detail.notification);
      }
      return Promise.resolve();
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log(remoteMessage);
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

    const dataPayload = remoteMessage?.data || {};

    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
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
        smallIcon: 'ic_launcher',
        sound: 'default',
        vibrationPattern: [300, 500, 300, 500],
        pressAction: {
          id: 'default',
        },
      },
    });
  }

  const getToken = async () => {
    try {
      const token = await messaging().getToken();
      if (token) {
        console.log('Token: ', token);
        setToken(token);
      } else {
        console.log('No token found');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  useEffect(() => {
    const handleDeepLink = (event: any) => {
      const url = event.url;
      console.log(route);
      console.log('Deep link:', url);
      // lógica para navegar según la URL
    };

    const subscription = Linking.addEventListener('url', handleDeepLink);

    return () => {
      subscription.remove(); // ✅ esta es la forma correcta
    };
  }, []);

  return (
    <NavigationContainer linking={linking}>
    <View style={{ flex: 1 }}>
      <WebView source={{ uri }} />
      <View style={{ height: 100, marginHorizontal: 10 }}>
        <Text selectable={true}>Token: {token}</Text>
      </View>
    </View>
    </NavigationContainer>
  );
};

export default App;

// useEffect(() => {
//   const checkInitialNotification = async () => {
//     const remoteMessage = await messaging().getInitialNotification();
//     if (remoteMessage) {
//       miFuncionAlTocarNotificacionBG(remoteMessage);
//     }
//   };

//   checkInitialNotification();
// }, []);

// function miFuncionAlTocarNotificacionBG(data: any) {
//   console.log('Ejecutando acción por notificación:', data);
//   setUri(data.data.page);
// }

// useEffect(() => {
//   const cargarMensaje = async () => {
//     const data = await AsyncStorage.getItem('remoteMessage');
//     if (data) {
//       const remoteMessage = JSON.parse(data);
//       setUri(remoteMessage.data.page);
//       console.log('remoteMessage',remoteMessage);
//     }
//   };

//   cargarMensaje();
// }, []);
