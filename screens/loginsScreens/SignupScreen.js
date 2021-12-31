import React, {useState} from 'react'
import { useNavigation } from '@react-navigation/core';
import { KeyboardAvoidingView, StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native'
import { firebase } from '../../firebase/config';
import { doc, setDoc, Timestamp } from "firebase/firestore"; 


const SignupScreen = () => {
    const [password, setPassword] = useState('')
    const [confirm_password, setconfirm_password] = useState('')
    const [email, setEmail] = useState('')
    const [firstName, setFirstName] = useState('')
    const [lastName, setlastName] = useState('')
    const [userName, setUserName] = useState('')

    const navigation = useNavigation()

    const registerUser = (firstName, lastName, userName, email, password, confirm_password) => {
        // alert("clicked register!")
        if (password !== confirm_password) {
            alert("Passwords don't match.")
            return
        }
        firebase
            .auth()
            .createUserWithEmailAndPassword(email, password)
            .then((response) => {
                // alert("creater a user")
                const uid = response.user.uid
                const data = {
                    id: uid,
                    email,
                    firstName,
                    lastName,
                    userName,
                    password,
                };
                const vData = {}
                
                const usersRef = firebase.firestore()
                usersRef
                    .collection('users')
                    .doc(uid)
                    .set(data)
                usersRef
                    .collection('users')
                    .doc(uid)
                    .collection('userData')
                    .doc('routines')
                    .set(vData)
                usersRef
                    .collection('users')
                    .doc(uid)
                    .collection('userData')
                    .doc('todos')
                    .set(vData)
                usersRef
                    .collection('users')
                    .doc(uid)
                    .collection('userData')
                    .doc('schedule')
                    .set(vData)
                usersRef
                    .collection('users')
                    .doc(uid)
                    .collection('userData')
                    .doc('shortTerm')
                    .set(vData)                   
                usersRef
                    .collection('users')
                    .doc(uid)
                    .collection('userData')
                    .doc('currentTime')
                    .set(vData)
                    .then(() => {
                        navigation.navigate('AppRoute')
                    })
                    .catch((error) => {
                        alert(error)
                    });
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
                    placeholder = "firstname"
                    value = {firstName}
                    onChangeText = {text => setFirstName(text)}
                    style = {styles.input}                   
                />
                <TextInput
                    placeholder = "lastname"
                    value = {lastName}
                    onChangeText = {text => setlastName(text)}
                    style = {styles.input}                   
                />
                <TextInput
                    placeholder = "Email"
                    value = {email}
                    onChangeText = {text => setEmail(text)}
                    style = {styles.input}                   
                />
                <TextInput
                    placeholder = "user-name"
                    value = {userName}
                    onChangeText = {text => setUserName(text)}
                    style = {styles.input}
                />
                <TextInput
                    placeholder = "Password"
                    value = {password}
                    onChangeText = {text => setPassword(text)}
                    style = {styles.input}                   
                />
                <TextInput
                    placeholder = "Confirm Password"
                    value = { confirm_password}
                    onChangeText = {text => setconfirm_password(text)}
                    style = {styles.input}
                    // secureTextEntry
                />

            </View>

            <View style = {styles.buttonContainer}>

                <TouchableOpacity
                    onPress = {() => {registerUser(firstName, lastName, userName, email, password, confirm_password)}}
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
        // height: "50%"
        
    },
    input: {
        backgroundColor: 'white',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 10,
        marginTop: 5,
        width: 320,
        height: 50,
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
