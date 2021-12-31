import React, {useState} from 'react'
import { KeyboardAvoidingView, StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native'

import * as SQLite from 'expo-sqlite';
import { useNavigation } from '@react-navigation/core';


const db = SQLite.openDatabase("Productivity1.db");

const LoginScreen = () => {

    const [password, setPassword] = useState('')
    const [username, setUsername] = useState('')
    const navigation = useNavigation()
    
    const createTable = () => {
        db.transaction((tx) => {
            tx.executeSql(
                "CREATE TABLE IF NOT EXISTS "
                +"users "
                +"(ID INTEGER PRIMARY KEY AUTOINCREMENT, Username TEXT, Password TEXT);"
            )
        })
    }

    const PrintDB = () => {
        console.log("db print")
        db.transaction((tx) =>{
            tx.executeSql(
                'SELECT Username, Password FROM users', [],
                (tx, results) => {

                    if (results.rows.length > 0) {
                        
                        for (let i = 0; i < results.rows.length; ++i)
                        {
                            console.log("DB: ", results.rows.item(i))
                           
                        }
                      } else console.log('Failed....');
                }
                    
            )
        })
    }

    const verifyLogin = (username, password ) => {
        console.log("verify login");
        db.transaction(function(tx) {
            console.log("inside dbTransaction");
            tx.executeSql(
                'SELECT Username, Password FROM users', [],
                (tx, results) => {
                console.log('results length: ', results.rows.length); 

                if (results.rows.length > 0) {
                    for (let i = 0; i < results.rows.length; ++i)
                    {
                      if (results.rows.item(i)["Username"] === username && results.rows.item(i)["Password"] === password) {
                        navigation.navigate('Home')
                        return
                      }
                    }
                    alert("incorrect username1 or password1")
                  } else console.log('Failed....');
            }
            )
        })
    }



    
    return (

        <KeyboardAvoidingView
            style = {styles.container}
            behavior = "padding"
        >
            <View style = {styles.inputContainer}>
 
                <TextInput
                    placeholder = "Username"
                    value = {username}
                    onChangeText = {text => setUsername(text)}
                    style = {styles.input}                   
                />
                <TextInput
                    placeholder = "Password"
                    value = { password}
                    onChangeText = {text => setPassword(text)}
                    style = {styles.input}
                    secureTextEntry
                />
            </View>

            <View style = {styles.buttonContainer}>

                <TouchableOpacity
                    onPress = {() => {verifyLogin(username, password)}}
                    style = {styles.button}
                >
                   <Text style = {styles.buttonText}>Login</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress = {() => {navigation.navigate('Signup')}}
                    style = {[styles.button, styles.buttonOutline]}
                >
                    <Text style = {styles.buttonOutlineText}>Signup</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress = {() => {PrintDB()}}
                    style = {[styles.button, styles.buttonOutline]}
                >
                    <Text style = {styles.buttonOutlineText}>DatabaseInteraction</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView> 
    )
}

export default LoginScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    inputContainer: {
        width: "80%"
    },
    input: {
        backgroundColor: 'white',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 10,
        marginTop: 5,
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
    }
})
