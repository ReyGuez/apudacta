import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import Header from '../Templates/Header';
import messaging from '@react-native-firebase/messaging';
import { Colors } from '../Helpers/Colors';

const Info = () => {
  const [_token, setToken] = useState('');
  const [oauthToken, setOauthToken] = useState('ya29.a0AQQ_BDQdS81R8X76xXOO_N89Rzb2oRq7r2-q0XGNplMNaoRXe0Imvr6pjtOmvewLWRhYHDtYmaY6oUvBdriIVUcZEQW5uYwxl4zbIC4nQZA1C2dgGcxPlH3GMF_YYWUNV6jYQp-o1w-yzI4GfNkgRX6KGdK8BTdEBGlyXXOZz6i1DlEem1_eOS-cO1DTpywHZoCNrsAaCgYKASUSARESFQHGX2Mi0wrp6V28-9SBA_pDC2Ej4g0206');
  const [page, setPage] = useState('https://sandbox-client-app.apudacta.com/');
  const [title, setTitle] = useState('Notification by fetch');
  const [body, setBody] = useState('Prueba de notificacion vía fetch.');

  useEffect(() => {
    getToken();
  }, []);

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
