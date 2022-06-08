import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, View, Button, TextInput, Alert } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HeaderBackButton } from '@react-navigation/elements';
import { firebase} from 'firebase';
import { auth } from 'firebase'
import Login from './screens/Login'
import Home from './screens/Home'
import Messages from './screens/Messages'
import Dialog from "react-native-dialog";
import DialogInput from 'react-native-dialog-input';
import { render } from 'react-dom';
import AsyncStorage from '@react-native-async-storage/async-storage'

const Stack = createNativeStackNavigator();


export default function App() {

const [visible, setVisible] = useState(true);

const handleCreate = () => {
  setVisible(true);
};

const handleCancel = () => {
  setVisible(false);
};

const addMember = () => {

  return(
    <View>
      <Dialog.Container visible={visible}>
            <Dialog.Title>New chat</Dialog.Title>
            <Dialog.Description>
              Enter the name below you want to name your chat:
            </Dialog.Description>
            <Dialog.Input onChangeText={val => setGivenName(val)}>

            </Dialog.Input>
            <Dialog.Button label="Cancel" onPress={alert("canc")} />
            <Dialog.Button label="Create" onPress={alert("send")} />
          </Dialog.Container>
    </View>
  );
}

  return(
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={Login} options={{headerShown:false}}/>
        <Stack.Screen name="Home" component={Home} options={{title: 'Chat list', headerTintColor: 'white' , headerStyle: {backgroundColor: '#002aff'}, headerBackVisible: false}}/>
        <Stack.Screen name="Messages" component={Messages} options={({ route }) => ({
          title: route.params.thread.chatName
          })}/>
      </Stack.Navigator>
    </NavigationContainer>

    
  );
  
}





const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'purple',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    height: 40,
    margin: 12,
    width: 200,
    borderWidth: 1,
    padding: 10,
  },
});
