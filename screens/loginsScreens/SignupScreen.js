import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/core';
import { Platform, KeyboardAvoidingView, StyleSheet, Text, View, TextInput, TouchableOpacity, Image, Dimensions, Linking } from 'react-native'
import { firebase } from '../../firebase/config';
import { doc, setDoc, Timestamp } from "firebase/firestore";
import * as SQLite from 'expo-sqlite';
import { colors } from '../../styles/AppStyles';
import { CheckBox } from 'react-native-elements'

const db = SQLite.openDatabase("user.db");
let { width } = Dimensions.get('window');
const SignupScreen = () => {
    let type = "";
    const [password, setPassword] = useState('')
    const [confirm_password, setconfirm_password] = useState('')
    const [email, setEmail] = useState('')
    const [Name, setName] = useState('')
    const [isDisabled, setIsDisabled] = useState(false)
    const createTable = () => {
        db.transaction((tx) => {
            tx.executeSql(
                "CREATE TABLE IF NOT EXISTS "
                + "users "
                + "(ID INTEGER PRIMARY KEY AUTOINCREMENT, Email TEXT, Password TEXT);"
            )
        })
    }
    const navigation = useNavigation()
    if (Platform.OS === 'ios') {
        type = "padding";
    }
    else if (Platform.OS === 'android') {
        type = "height";
    }
    else { type = "height" }
    const registerUser = (Name, email, password, confirm_password) => {
        createTable();

        db.transaction((tx) => {
            tx.executeSql(
                "DELETE FROM users"
            )
        })
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
                const data = [
                    uid,
                    email,
                    Name,
                    password,
                ];
                const vData = {}

                const usersRef = firebase.firestore()
                usersRef
                    .collection('users')
                    .doc(uid)
                    .collection('userData')
                    .doc('authInfo')
                    .set(Object.assign({}, data))
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

                usersRef
                    .collection('users')
                    .doc(uid)
                    .collection('settings')
                    .doc('StartTime')
                    .set(vData)

                usersRef
                    .collection('users')
                    .doc(uid)
                    .collection('settings')
                    .doc('endTime')
                    .set(vData)
                    .then(() => {
                        db.transaction((tx) => {
                            tx.executeSql(
                                "INSERT INTO users (Email, Password) VALUES ('" + email + "', '" + password + "')"
                            )
                        })
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
            style={styles.container}
            behavior={type}
        >
            <View style={styles.inputContainer}>
                <Image
                    style={styles.appName}
                    source={require("../../assets/updatedLogoName.png")}
                />
                <Text
                    style={{
                        marginBottom: 30,
                        fontSize: 20,
                        marginTop: -20,
                        // fontWeight: 'bold',
                        alignSelf: 'center',
                        marginHorizontal: 30,
                        color: colors.secondary,
                        fontFamily: 'Oswald-SemiBold',
                    }}
                >
                    PULL YOURSELF TOGETHER
                </Text>
                <TextInput
                    placeholder="name"
                    value={Name}
                    onChangeText={text => setName(text)}
                    style={styles.input}
                />
                <TextInput
                    placeholder="Email"
                    value={email}
                    onChangeText={text => setEmail(text)}
                    style={styles.input}
                />
                <TextInput
                    placeholder="Password"
                    value={password}
                    onChangeText={text => setPassword(text)}
                    style={styles.input}
                    secureTextEntry
                />
                <TextInput
                    placeholder="Confirm Password"
                    value={confirm_password}
                    onChangeText={text => setconfirm_password(text)}
                    style={styles.input}
                    secureTextEntry
                />

            </View>

            <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                <CheckBox
                    title=''
                    checked={isDisabled}
                    onPress={() => setIsDisabled(!isDisabled)}
                />
                <View style = {{marginTop: 15}}>
                <View style = {{marginLeft: -14, flexDirection: 'row'}}>
                    <Text >I agree to the </Text>
                    <Text 
                        style = {{textDecorationLine: 'underline'}}
                        onPress = {() => {Linking.openURL("https://docs.google.com/document/d/1YpjIoFfji-uGzAni7BkCxLtr2SfG-TE4IluAYS3XvmE/edit?usp=sharing")
                    }}
                    >terms and conditions </Text>
                    
                </View>
                <View style = {{marginLeft: -14,flexDirection: 'row'}}>
                    <Text >and the </Text>
                    <Text 
                        style = {{textDecorationLine: 'underline'}} 
                        onPress = {() => {Linking.openURL('https://docs.google.com/document/d/1YYObK6L81yX53PYPNpZas5A3WKeEo-EHYgrRECZz9-Q/edit?usp=sharing')}}
                    >privacy policy</Text>
                </View>
                </View>
            </View>
            <View style={styles.buttonContainer}>

                <TouchableOpacity
                    onPress={() => { registerUser(Name, email, password, confirm_password) }}
                    style={styles.button}
                    disabled={!isDisabled}
                >
                    <Text style={styles.buttonText}>Register</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => { navigation.navigate('Login') }}
                    style={[styles.button, styles.buttonOutline]}
                >
                    <Text style={styles.buttonOutlineText}>Back to login</Text>
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
        backgroundColor: colors.primary

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
        backgroundColor: colors.secondary,//#0782F9 -> blue
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

    buttonOutline: {
        backgroundColor: 'white',
        marginTop: 5,
        borderColor: colors.secondary,
        borderWidth: 2,
    },
    buttonOutlineText: {
        color: colors.secondary,
        fontWeight: '700',
        fontSize: 16,
    },
    appName: {
        width: width,
        height: 150,
        alignSelf: 'center',
    }
})
