import { TouchableOpacity, Image, FlatList, SafeAreaView, ScrollView, Keyboard, TouchableWithoutFeedback, Pressable, KeyboardAvoidingView, StyleSheet, Text, View, Button, TextInput } from 'react-native'
import React, { useState, useContext, useEffect, useRef } from 'react'
import { firebase} from '../firebase';
import { auth } from '../firebase'
import { NavigationContainer } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/core';
import { HeaderBackButton } from '@react-navigation/elements';
import Fetch from '../src/Fetch'
//import FetchMessages from '../src/FetchMessages'
import Dialog from "react-native-dialog";
import { render } from 'react-dom';
import io from 'socket.io-client';

let socket

const Messages = ({route}) => {
  
  //const groupRef = route.params.thread.id
  const email = route.params.email
  const group = route.params.thread.group_name
  const group_ID = route.params.thread.group_ID

  useEffect( () => {
    socket = io("https://3901-2a02-ab88-7504-3d00-41c6-cc78-cbfd-8707.eu.ngrok.io")
  }, [])

  const MessageInput = () => {

    const [message, setMessage] = useState('')

    const handleSend = (message) => {
      if (message != "") {
        let createdAt = new Date().getTime()
        socket.emit('message_send', {group_ID, message, email, createdAt}, (response)=>{

        })
      }
      setMessage('')
    }

    return (
      <View style={styles.messageBox}>
        <View style={styles.rowContainer}>
          <View style={styles.enterMessage}>
          <TextInput placeholder='Enter message...' value={message} onChangeText={val => setMessage(val)} multiline style={{maxHeight: 80}}></TextInput>
          </View>
          <TouchableOpacity onPress={() => {handleSend(message)}}>
          <Image source={require("../src/sendArrow.png")} style={{width:30,height:30,marginLeft:10,alignSelf:'flex-end'}}/>
          </TouchableOpacity>
        </View>
      </View>
      
    )
  }
 
  const FetchMessages = () => {
    
    const [Messages, setMessages] = useState([]);

    useEffect(() => {
      socket = io("https://3901-2a02-ab88-7504-3d00-41c6-cc78-cbfd-8707.eu.ngrok.io")
      //socket.emit('readMessages', {group_ID}, (response) => {
        //setMessages(response)
      //})
      socket.on('newMessage', (arg) => {
        socket.emit('readMessages', {group_ID}, (response) => {
          setMessages(response)
        })
      })
    }, [])

    /* Messages.forEach(item => {
      item.createdAt = new Intl.DateTimeFormat('en-US', {month: '2-digit', 
        day: '2-digit', 
        hour: '2-digit', 
        minute: '2-digit'}).format(item.createdAt)}) */

    return (
      <FlatList
        inverted = {true}
        data = {Messages}
        renderItem = { ({item}) =>(
          <TouchableOpacity style = {email==item.email? styles.outerContainerButtonMainUser : styles.outerContainerButtonOtherUser}>
            <View style = {email==item.email? styles.innerContainerButtonMainUser : styles.innerContainerButtonOtherUser}>
              <Text style = {email==item.email? styles.buttonNameButtonMainUser : styles.buttonNameButtonOtherUser}>{item.message}</Text>
              <Text style = {styles.sentBy}>Sent by: {item.email}</Text>
              <Text style = {styles.sentBy}>at: {item.createdAt}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    )
  }
  
  const NewMemberDialog = () => {

    socket = io("https://3901-2a02-ab88-7504-3d00-41c6-cc78-cbfd-8707.eu.ngrok.io")
    const [visible, setVisible] = useState(false);
    const [newemail, setNewMemberEmail] = useState('')

    const showDialog = () => {
      setVisible(true);
    };
  
    const handleCancel = () => {
      setVisible(false);
    };

    const handleNewMember = () => {
      if (newemail.length>0) {
        socket.emit('addNewMember', {newemail, group_ID}, (response) => {
          alert(response)
        })
      }
      setVisible(false)
    }

    return (
      <View>
        <Button title="Add member" onPress={showDialog}></Button>

        <Dialog.Container visible={visible}>
          <Dialog.Description>
            Enter the email adress of the new member:
          </Dialog.Description>
          <Dialog.Input onChangeText={val => setNewMemberEmail(val.toLowerCase())}>

          </Dialog.Input>
          <Dialog.Button label="Cancel" onPress={handleCancel} />
          <Dialog.Button label="Add" onPress={handleNewMember} />
        </Dialog.Container>
      </View>    
    )
  }

  return(
    
    <KeyboardAvoidingView style={{flex: 1}} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <View style={styles.container}>

          <NewMemberDialog/>

          <FetchMessages/>
          
          <MessageInput/>

        </View>
    </KeyboardAvoidingView>
    
  )
}

export default Messages

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
    justifyContent: 'flex-end',
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
  outerContainerButtonOtherUser: {
    backgroundColor: 'white',
    maxWidth: '65%',
    borderWidth: 1,
    borderColor: '#3498eb',
    borderRadius: 15,
    padding: 10,
    margin: 2,
  },
  innerContainerButtonOtherUser: {
    alignItems: 'left',
    flexDirection: 'column',
  },
  buttonNameButtonOtherUser: {
    fontSize: 15,
    color: '#3498eb',
    flexShrink: 1,
    textAlign: 'left',
  },
  outerContainerButtonMainUser: {
    alignSelf: 'flex-end',
    backgroundColor: '#3498eb',
    maxWidth: '65%',
    borderWidth: 1,
    borderColor: '#3498eb',
    borderRadius: 15,
    padding: 10,
    margin: 2,
  },
  innerContainerButtonMainUser: {
    alignItems: 'flex-end',
    flexDirection: 'column',
  },
  buttonNameButtonMainUser: {
    fontSize: 15,
    color: 'white',
    flexShrink: 1,
    textAlign: 'right',
  },
  sentBy: {
    fontSize: 8,
  },
  messageBox: {
    alignItem: 'flex-end',
    border: 10,
    backgroundColor: 'white',
    paddingBottom: 100,
    paddingTop: 5,
    paddingLeft: 10,
    paddingRight: 10,
  },
  rowContainer: {
    flexDirection: 'row',
  },
  enterMessage: {
    backgroundColor: '#ababab',
    width: '90%',
    borderRadius: 15,
    paddingLeft: 15,
    paddingRight: 15,
  },
});