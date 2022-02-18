import React, {useState, useEffect} from 'react'
import { Platform,StyleSheet, View, Image, Dimensions } from 'react-native'

import { useNavigation } from '@react-navigation/core';
import { firebase } from '../../firebase/config';
import * as SQLite from 'expo-sqlite';
import { render } from 'react-dom';
import AppLoading from 'expo-app-loading';
import AnimatedBar from "react-native-animated-bar";

let { width } = Dimensions.get('window');

const db = SQLite.openDatabase("user.db");
const Welcome = (props) => {
    const [isNavigate, setNavigate] = useState(false);

    const [password, setPassword] = useState('')
    const [email, setEmail] = useState('')
    const [seconds, setSeconds] = useState(0);
    const navigation = useNavigation()
    let type = "";
    // const { navigate } = props.navigation
    
    if(Platform.OS === 'ios'){
        type = "padding";
    }
    else if(Platform.OS === 'android'){
        type = "height";
    }
    else{type = "height"}
    
    const CheckLogIn = () => {
        alert("checkLog")
        firebase.auth().onAuthStateChanged(function(user) {
            console.log(user);
        })
    }
    const createTable = () => {
        db.transaction((tx) => {
            tx.executeSql(
                "CREATE TABLE IF NOT EXISTS "
                +"users "
                +"(ID INTEGER PRIMARY KEY AUTOINCREMENT, Email TEXT, Password TEXT);"
            )
        })
    }
    const InitLogin = () => {
        db.transaction((tx) => {
            tx.executeSql(
                'SELECT Email, Password FROM users', [],
                (tx, results) => {
                console.log('results length: ', results.rows.length); 
                console.log("Query successful")
                if (results.rows.length > 0) {
                  console.log(results.rows.Email);
                  firebase
                    .auth()
                    .signInWithEmailAndPassword(results.rows.item(0)['Email'], results.rows.item(0)['Password'])
                    .then((response) => {
                        // alert("success")
                        const uid = response.user.uid
                        console.log(uid)
                        setTimeout(() => {  navigation.navigate('AppRoute'); }, 2000);  
                        return;
                })
            }
        })
    })
    setTimeout(() => {  navigation.navigate('Login'); }, 2000);
}
    const handleLogin = (email, password) => {
        
        createTable()

        db.transaction((tx) => {
            tx.executeSql(
                "DELETE FROM users"
            )
        })

        firebase
            .auth()
            .signInWithEmailAndPassword(email, password)
            .then((response) => {
                db.transaction((tx) => {
                    tx.executeSql(
                        "INSERT INTO users (Email, Password) VALUES ('" + email + "', '" + password + "')"
                    )
                })
                const uid = response.user.uid
                console.log(uid)
                navigation.navigate('AppRoute')
            })
            .catch((error) => {
                alert(error)
        });
      }
     
      useEffect(() => {
        const interval = setInterval(() => {
          setSeconds(seconds => seconds + 2);
        }, 1000);

        InitLogin()
      }, [])

    
    return (
      <View style = {styles.container}>
      <Image
      style = {styles.appName}
      source = {require("../../assets/appName.png")}
      />
      <AnimatedBar
        progress = {seconds}
        height={20}
        width = {250}
        borderColor="#DDD"
        barColor="#94A285"
        fillColor = "#F1EBD9"
        // borderRadius={5}
        // borderWidth={5}
        duration={2000}
      />
      
    </View>
    )
}

export default Welcome

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'black'

  },
  appName: {
    width: width,
    height: 150,
    alignSelf: 'center'
  }

})