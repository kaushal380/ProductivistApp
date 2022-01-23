import React, {useState, useEffect} from 'react'
import { Button, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { firebase } from '../firebase/config';
import { useNavigation } from '@react-navigation/core';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase("user.db");

const Home = () => {
  const navigation = useNavigation()
  // const {state} = props.navigation
  const [userdata, setUserdata] = useState()

  const handleSignout = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        db.transaction((tx) => {
          tx.executeSql(
              "DELETE FROM users"
          )
      })
        navigation.navigate('Login')
    })  
  }
  const getDbDate =()=> {
    // console.log("db")
    db.transaction((tx) => {
      tx.executeSql(
          'SELECT Email, Password FROM users', [],
          (tx, results) => {
          console.log('results length: ', results.rows.length); 
          console.log("Query successful")
          if (results.rows.length > 0) {
            console.log(results.rows.item(0)['Password']);
          }
  })})}

  const getUser = async () => {
    // alert("pressed!")
    try {
      const documentSnapshot = await firebase.firestore()
      .collection('users')
      .doc(firebase.auth().currentUser.uid)
      .collection('userData')
      .doc('authInfo')
      .get()
      let userData = Object.values(Object.seal(documentSnapshot.data()))
      setUserdata(userData[2])
    //  alert(userData)
      //do whatever
    }
    catch{
        console.log("error occured!");
    }
   
  };
  
    useEffect(() => {
      getUser()
    }, [])
  
    return (
      <View
      style = {styles.container}
      >
      <View style = {styles.buttonContainer}>
        <Text
        style = {{
          marginBottom: 40,
          fontSize: 40,
          fontWeight: 'bold'
        }}
        >
          Hello {userdata}, 
        </Text>
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
