import { Pressable, KeyboardAvoidingView, StyleSheet, Text, View, Button } from 'react-native'
import React, { useState, useEffect } from 'react'
import { auth } from '../firebase'
import { useNavigation } from '@react-navigation/core';
import Fetch from '../src/Fetch'
import Dialog from "react-native-dialog";
import io from 'socket.io-client'

let socket

const Home = ({route}) => {
  const email = route.params.email
  const navigation = useNavigation()
  
  useEffect( () => {
    socket = io("https://3901-2a02-ab88-7504-3d00-41c6-cc78-cbfd-8707.eu.ngrok.io")
  }, [])

  const handleSignOut = () => {
    auth.signOut().then(() => {
      navigation.replace("Login")
    })
    .catch(error => alert(error.message))
  }

  const [visible, setVisible] = useState(false);

  const showDialog = () => {
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
  };
  
  const [givenName, setGivenName] = useState('')

  const handleCreate = () => {
    if( givenName.length > 0 ) {
      socket.emit("createGroup", {givenName, email}, (response) => {
        alert(response)
      })
      setVisible(false);
    }
  };

  return(
    <KeyboardAvoidingView style={styles.container}>
      <View style={{ flexDirection: "row" }}>
        <View>
          
          <Pressable style = {styles.outerContainerButton} onPress={showDialog}>
            <View style = {styles.innerContainerButton}>
              <Text style = {styles.buttonNameButton}>New Chat</Text>
            </View>
          </Pressable>

          <Dialog.Container visible={visible}>
            <Dialog.Title>New chat</Dialog.Title>
            <Dialog.Description>
              Enter the name below you want to name your chat:
            </Dialog.Description>
            <Dialog.Input onChangeText={val => setGivenName(val)}>

            </Dialog.Input>
            <Dialog.Button label="Cancel" onPress={handleCancel} />
            <Dialog.Button label="Create" onPress={handleCreate} />
          </Dialog.Container>

        </View>

        <View>
        
          <Pressable style = {styles.outerContainerButton} onPress={handleSignOut}>
            <View style = {styles.innerContainerButton}>
              <Text style = {styles.buttonNameButton}>Sign out</Text>
            </View>
          </Pressable>

        </View>
      </View>
      <Fetch email={email}/>
    </KeyboardAvoidingView>

  )
}

export default Home

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
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
  button: {
    backgroundColor: 'black',
    width: '50%',
    padding: 15,
    alignment: 'center',
  },
  newChatCont: {
    width: '100%',
    backgroundColor: 'blue',
  },
  outerContainerButton: {
    backgroundColor: 'white',
    width: 175,
    height: 50,
    borderWidth: 1,
    borderColor: '#3498eb',
    borderRadius: 15,
    padding: 10,
    margin: 10,
  },
  innerContainerButton: {
    alignItems: 'center',
    flexDirection: 'column',
  },
  buttonNameButton: {
    fontWeight: 'bold',
    fontSize: 20,
    color: '#3498eb'
  },
});