import { Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import Header from '../Templates/Header';
import messaging from '@react-native-firebase/messaging';
import { Colors } from '../Helpers/Colors';

const Info = () => {
  const [_token, setToken] = useState('');
  const [oauthToken, setOauthToken] = useState('ya29.a0ATi6K2sA0_KVIJEazUwpPeHv8_9bCKcG1wvNX3vjHOVyEMwhRKpVMiFrEVQj7ejF0neHTjJB617WHdDDhBr-3-OHHn-UCURBGHnAnY9bD7mbgwvM1qMbWRvU9orLfkKRlgJKoYefUMezlYZG61DFslqYoM9wOzB_xieZT_bUm0Ugo4CKl5IroTkQVtQfXfhp8A4J3aUaCgYKAakSARESFQHGX2Mi7Hn2nuCzW6uzkH4sja2X-g0206');
  const [page, setPage] = useState('https://sandbox-client-app.apudacta.com/');
  const [title, setTitle] = useState('Notification by fetch');
  const [body, setBody] = useState('Prueba de notificacion vía fetch.');

  useEffect(() => {
    permissions();
    getToken();
  }, []);

  const getToken = async () => {
    try {
      await messaging().registerDeviceForRemoteMessages();
      const token = await messaging().getToken();
      if (token) {
        console.log('Token: ', token);
        setToken(token);
      } else {
        console.log('No token found');
      }
    } catch (err) {
      console.log(err);
    }
  };

  const onSendNotification = () => {
    fetch('https://fcm.googleapis.com/v1/projects/387505969547/messages:send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${oauthToken}`,
      },
      body: JSON.stringify({
        message: {
        token: _token,
        data: {
            page: page,
            sound: "default",
            title: title,
            body: body
        }
    }
      }),
    });
  };

  const permissions = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
    }
  };

  return (
    <View style={styles.container}>
      <Header barStyle="light-content" showColor />
      <View style={{ marginHorizontal: 10 }}>
        <Text style={{fontSize: 16, fontWeight: 'bold'}}>Firebase Token: </Text>
        <Text style={{marginBottom: 15}} selectable={true}>{_token}</Text>
        <Text style={{fontSize: 16, fontWeight: 'bold'}}>Oauth Token: </Text>
        <TextInput
          value={oauthToken}
          onChangeText={setOauthToken}
          style={{
            height: 40,
            borderColor: 'gray',
            borderWidth: 1,
            marginBottom: 15,
          }}
        />
        <Text style={{fontSize: 16, fontWeight: 'bold'}}>Título: </Text>
        <TextInput
          value={title}
          onChangeText={setTitle}
          style={{
            height: 40,
            borderColor: 'gray',
            borderWidth: 1,
            marginBottom: 15,
          }}
        />
        <Text style={{fontSize: 16, fontWeight: 'bold'}}>Mensaje: </Text>
        <TextInput
          value={body}
          onChangeText={setBody}
          style={{
            height: 40,
            borderColor: 'gray',
            borderWidth: 1,
            marginBottom: 15,
          }}
        />
        <Text style={{fontSize: 16, fontWeight: 'bold'}}>Página: </Text>
        <TextInput
          value={page}
          onChangeText={setPage}
          style={{
            height: 40,
            borderColor: 'gray',
            borderWidth: 1,
            marginBottom: 15,
          }}
        />
        <Text style={{fontSize: 16, fontWeight: 'bold'}}>Notificacion vía fetch</Text>
        <TouchableOpacity
          onPress={onSendNotification}
          style={{
            backgroundColor: Colors.primary,
            padding: 10,
            borderRadius: 5,
            marginTop: 10,
            marginBottom: 15,
          }}
        >
          <Text style={{ color: 'white' }}>Enviar notificacion</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Info;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
