import React, {useState} from 'react'
import { useNavigation } from '@react-navigation/core';
import { KeyboardAvoidingView, StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native'
import * as SQLite from 'expo-sqlite';


const db = SQLite.openDatabase("Productivity1.db");

const SignupScreen = () => {
    const [password, setPassword] = useState('')
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')

    const navigation = useNavigation()

    
    const createTable = () => {
        db.transaction((tx) => {
            tx.executeSql(
                "CREATE TABLE IF NOT EXISTS "
                +"users "
                +"(ID INTEGER PRIMARY KEY AUTOINCREMENT, Email TEXT, Username TEXT, Password TEXT);"
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

    const checkUserExist = (email, username, password) => {
        createTable()
        console.log("inside CheckUserExist")
        db.transaction((tx) => {
            tx.executeSql(
                'SELECT Username, Email FROM users', [],
                (tx, results) => {
                console.log('results length: ', results.rows.length); 
                console.log("Query successful")
                if (results.rows.length > 0) {
                    for (let i = 0; i < results.rows.length; ++i)
                    {
                    if (results.rows.item(i)['Email'] === email){
                        alert("The email already exists")
                        return
                    }
                    else if(results.rows.item(i)['Username'] === username){
                        alert("The username already exists")
                        return
                    }

                    }
                  } 
                registerUser(email, username, password)
            })
            
        })
    }
    const registerUser = (email, username, password) => {
        // createTable();  

        db.transaction((tx) => {
            tx.executeSql(
                "INSERT INTO users (Email, Username, Password) VALUES ('" + email + "','" + username + "', '" + password + "')"
            )
        })
        navigation.navigate('Home')
    }      

    const DeleteUser = (email, username) => {
        // createTable();  

        db.transaction((tx) => {
            tx.executeSql(
                "DELETE FROM users WHERE Username = '" + username + "'"
            )
        })
        // navigation.navigate('Home')""
        alert("deleated user")
    }      

    return (

        <KeyboardAvoidingView
            style = {styles.container}
            behavior = "padding"
        >
            <View style = {styles.inputContainer}>
                <TextInput
                    placeholder = "Email"
                    value = {email}
                    onChangeText = {text => setEmail(text)}
                    style = {styles.input}                   
                />
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
                    onPress = {() => {checkUserExist(email, username, password)}}
                    style = {styles.button}
                >
                   <Text style = {styles.buttonText}>Register</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress = {() => {navigation.navigate('Login')}}
                    style = {[styles.button, styles.buttonOutline]}
                >
                    <Text style = {styles.buttonOutlineText}>Back to login</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress = {() => {PrintDB()}}
                    style = {[styles.button, styles.buttonOutline]}
                >
                    <Text style = {styles.buttonOutlineText}>DatabaseInteraction</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress = {() => {DeleteUser(email, username)}}
                    style = {[styles.button, styles.buttonOutline]}
                >
                    <Text style = {styles.buttonOutlineText}>DeleteUser</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView> 
    )
}

export default SignupScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        
    },
    inputContainer: {
        width: "80%",
        
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
