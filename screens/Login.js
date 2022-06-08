import { StatusBar } from 'expo-status-bar'
import { Pressable, StyleSheet, Text, View, TextInput, Button } from 'react-native'
import React, {useState} from 'react'
import { useEffect } from 'react'
import { auth } from '../firebase'
import { useNavigation } from '@react-navigation/core';
import io from 'socket.io-client'
import AsyncStorage from '@react-native-async-storage/async-storage'

let socket;

const Login = () => {
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConf, setPasswordConf] = useState('')
  const [userName, setUserName] = useState('')

  const navigation = useNavigation()

  useEffect(() => {
    socket = io("https://3901-2a02-ab88-7504-3d00-41c6-cc78-cbfd-8707.eu.ngrok.io")
  }, [])

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        navigation.replace("Home")
      }
    })

    return unsubscribe
  }, [])

  const handleSignUp = async () => {
    if ( (password === passwordConf) && (userName.length > 0) && (email.includes('@')) ) {
/*       auth.createUserWithEmailAndPassword(email, password)
        .then(userCredentials => {
          const user = userCredentials.user;
          alert("Registered with " + user.email);
        })
        .catch(error => alert(error.message)) */
      await socket.emit('signup', { email: email, password: password, userName: userName}, (response) => {
        alert(response)
      })
    } else if ( userName.length == 0 ) {
      alert("Enter a username!")
    } else if (password !== passwordConf) {
      alert("Passwords do NOT match!")
    } else {
      alert("Wrong email format!")
    }
  }

  const handleLogIn = async () => {
/*     auth.signInWithEmailAndPassword(email, password)
      .then(userCredentials => {
        const user = userCredentials.user;
        alert("Logged in with " + user.email);
      })
      .catch(error => alert(error.message)) */
    socket.emit('login', { email: email, password: password}, (response) => {
      if (response != 0) {
        saveData(email)
        navigation.navigate("Home", {email: email})
      }
      else { alert("Wrong inputs!")}
    })
  }

  const saveData = async (input) => {
    try {
      await AsyncStorage.setItem('email', input)
      alert('Data successfully saved')
    } catch (e) {
      alert('Failed to save the data to the storage')
    }
  }  

  return (
    <View style={styles.container}>
      <Text>Login with e-mail and password!</Text>
      <TextInput placeholder = "E-mail" value={email} onChangeText={val => setEmail(val.toLowerCase())} style={styles.input}/>
      <TextInput placeholder = "Password" value={password} onChangeText={val => setPassword(val)} style={styles.input}/>
      
      <Pressable style = {styles.outerContainerSignIn} onPress={handleLogIn}>
        <View style = {styles.innerContainerSignIn}>
          <Text style = {styles.buttonNameSignIn}>Sign in</Text>
        </View>
      </Pressable>

      <TextInput placeholder = "Confirm password" value={passwordConf} onChangeText={val => setPasswordConf(val)} style={styles.input}/>
      <TextInput placeholder = "Username" value={userName} onChangeText={val => setUserName(val)} style={styles.input}/>

      <Pressable style = {styles.outerContainerSignUp} onPress={handleSignUp}>
        <View style = {styles.innerContainerSignUp}>
          <Text style = {styles.buttonNameSignUp}>Sign up</Text>
        </View>
      </Pressable>
      
      <StatusBar style="auto" />
    </View>
  );
}

export default Login

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eeeee4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    backgroundColor: 'white',
    width: 300,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 5,
  },
  button: {
    backgroundColor: 'black',
    width: '100%',
    padding: 15,
    borderRadius: 10,
    alignment: 'center',
  },
  outerContainerSignIn: {
    backgroundColor: 'white',
    width: '50%',
    height: 50,
    borderWidth: 1,
    borderColor: '#3498eb',
    borderRadius: 15,
    padding: 10,
    margin: 10,
  },
  innerContainerSignIn: {
    alignItems: 'center',
    flexDirection: 'column',
  },
  buttonNameSignIn: {
    fontWeight: 'bold',
    fontSize: 20,
    color: '#3498eb'
  },
  outerContainerSignUp: {
    backgroundColor: '#3498eb',
    width: '50%',
    height: 50,
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 15,
    padding: 10,
    margin: 10,
  },
  innerContainerSignUp: {
    alignItems: 'center',
    flexDirection: 'column',
  },
  buttonNameSignUp: {
    fontWeight: 'bold',
    fontSize: 20,
    color: 'white'
  },
});