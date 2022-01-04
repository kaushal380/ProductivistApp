import React, {useState} from 'react'
import { Button, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { firebase } from '../firebase/config';
import { useNavigation } from '@react-navigation/core';
const Home = () => {
  const navigation = useNavigation()
  // const {state} = props.navigation
  const [userdata, setUserdata] = useState()

  const handleSignout = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        navigation.navigate('Login')
    })  
  }

  const getUser = async () => {
    // alert("pressed!")
    try {
      const documentSnapshot = await firebase.firestore()
        .collection('users')
        .doc(firebase.auth().currentUser.uid)
        .collection('todos')
        .doc('todos')
        .get();

      const userData = documentSnapshot.data();
     console.log(userData);
    //  alert(userData)
      //do whatever
    }
    catch{
        console.log("error occured!");
    }
   
  };
    
  
    return (
      <View
      style = {styles.container}
      >
      <View style = {styles.buttonContainer}>

        <TouchableOpacity
          onPress = {getUser}
          style = {styles.button}
        >
            <Text style = {styles.buttonText}>GetUserInfo</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress = {handleSignout}
          style = {[styles.button, styles.buttonOutline]}
        >
            <Text style = {styles.buttonOutlineText}>SignOut</Text>
        </TouchableOpacity>
      </View>
      </View>
    )
}

const styles = StyleSheet.create({
  container : {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonContainer: {
    width: '60%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
}, 
button: {
    backgroundColor: '#0782F9',
    width: '100%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
},

buttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
},

buttonOutline:{
    backgroundColor: 'white',
    marginTop: 5,
    borderColor: '#0782F9',
    borderWidth: 2,
},
buttonOutlineText: {
    color: '#0782F9',
    fontWeight: '700',
    fontSize: 16,
}})

export default Home
