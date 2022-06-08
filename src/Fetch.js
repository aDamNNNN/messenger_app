import { TouchableOpacity, FlatList, StyleSheet, Text, View } from 'react-native';
import React, { useState, useEffect} from 'react';
import { useNavigation } from '@react-navigation/core';
import io from 'socket.io-client'
import { NULL } from 'mysql/lib/protocol/constants/types';

let socket

const Fetch = ({email}) => {

    const [Groups, setGroups] = useState([]);
    const navigation = useNavigation()

    useEffect(() => {
        socket = io("https://3901-2a02-ab88-7504-3d00-41c6-cc78-cbfd-8707.eu.ngrok.io")
        socketEmit()
    }, [])

    const socketEmit = () => {
      if (email.includes('@')) {
        socket.emit("returnGroups", {email}, (response) => {
            setGroups(response)
        })}
    }
    
    return (
        <View style = {{ flex: 1, marginTop: 10, width: '95%' }}>
            
            <FlatList
                style = {{ height: '100%' }}
                data = { Groups }
                numColumns = {1}
                renderItem = {({item}) => (
                    <TouchableOpacity onPress={() => navigation.navigate('Messages', { email: email, thread: item })} style = {styles.container}>
                        <View style = {styles.innerContainer}>
                            <Text style = {styles.chatName}>{item.group_name}</Text>
                        </View>
                    </TouchableOpacity>
                )}
            />
        </View>
    )
}

export default Fetch

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        padding: 15,
        width: '95%',
        borderRadius: 15,
        margin: 5,
        marginHorizontal: 10,
        borderColor: '#3498eb',
      },
      innerContainer: {
        alignItems: 'center',
        flexDirection: 'column',
      },
      chatName: {
        fontWeight: 'bold'
      },
})