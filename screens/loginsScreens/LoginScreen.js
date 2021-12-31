import React, {useState} from 'react'
import { KeyboardAvoidingView, StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native'

import { useNavigation } from '@react-navigation/core';

import { firebase } from '../../firebase/config';


const LoginScreen = (props) => {


    const [password, setPassword] = useState('')
    const [email, setEmail] = useState('')
    const navigation = useNavigation()
    // const { navigate } = props.navigation
    

    const handleLogin = (email, password) => {
        // alert("clicked register!")

        alert("logged in")

        firebase
            .auth()
            .signInWithEmailAndPassword(email, password)
            .then((response) => {
                const uid = response.user.uid
                console.log(uid)
                navigation.navigate('AppRoute')
            })
            .catch((error) => {
                alert(error)
        });
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
                    placeholder = "Password"
                    value = { password}
                    onChangeText = {text => setPassword(text)}
                    style = {styles.input}
                    secureTextEntry
                />
            </View>

            <View style = {styles.buttonContainer}>

                <TouchableOpacity
                    onPress = {() => {handleLogin(email, password)}}
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
                    onPress = {() => {navigation.navigate('AppRoute')}}
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
