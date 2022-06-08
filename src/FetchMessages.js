import { TouchableOpacity, Pressable, FlatList, KeyboardAvoidingView, StyleSheet, Text, View, Button } from 'react-native';
import React, { useState, useEffect} from 'react';
import { firebase} from '../firebase';
import { auth } from '../firebase'
import { useNavigation } from '@react-navigation/core';
import { render } from 'react-dom';

const FetchMessages = () => {
    
    /* const groupRef = route.params.thread.id
    const [Messages, setMessages] = useState([]);
    const messagesRef = firebase.firestore().collection('groups').doc(groupRef).collection('messages');
    
    useEffect(() => {
      const messagesListener = messagesRef
        .orderBy('createdAt', 'desc')
        .onSnapshot(querySnapshot => {
          const Messages = querySnapshot.docs.map(doc => {
            const firebaseData = doc.data();

            const data = {
              id: doc.id,
              ...firebaseData
            };
            
            return data
          });
          setMessages(Messages)
        })
        return () => messagesListener();
    }, []) */
    
    return (
      <View>
        <Text>asd</Text>
      </View>
    )
}

export default FetchMessages