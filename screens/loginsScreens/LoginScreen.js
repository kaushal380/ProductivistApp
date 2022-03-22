import React, { useState, useEffect } from 'react'
import { Platform, KeyboardAvoidingView, StyleSheet, Text, View, TextInput, TouchableOpacity, Image, Dimensions } from 'react-native'

import { useNavigation } from '@react-navigation/core';
import { firebase } from '../../firebase/config';
import * as SQLite from 'expo-sqlite';
import { render } from 'react-dom';
import AppLoading from 'expo-app-loading';
import { colors } from '../../styles/AppStyles'
let { width, height } = Dimensions.get('window');
const db = SQLite.openDatabase("user.db");
const LoginScreen = (props) => {
    const [isNavigate, setNavigate] = useState(false);

    const [password, setPassword] = useState('')
    const [email, setEmail] = useState('')
    const navigation = useNavigation()
    let type = "";
    // const { navigate } = props.navigation

    if (Platform.OS === 'ios') {
        type = "padding";
    }
    else if (Platform.OS === 'android') {
        type = "height";
    }
    else { type = "height" }

    const CheckLogIn = () => {
        alert("checkLog")
        firebase.auth().onAuthStateChanged(function (user) {
            console.log(user);
        })
    }
    const createTable = () => {
        db.transaction((tx) => {
            tx.executeSql(
                "CREATE TABLE IF NOT EXISTS "
                + "users "
                + "(ID INTEGER PRIMARY KEY AUTOINCREMENT, Email TEXT, Password TEXT);"
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
                                navigation.navigate('AppRoute')
                            })
                    }
                })
        })
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
        InitLogin()
    }, [])


    return (
        <>
            <KeyboardAvoidingView
                style={styles.container}
                behavior={type} // try padding for ios maybe?
            >

                <View style={styles.inputContainer}>
                    <Image
                        style={styles.appName}
                        source={require("../../assets/updatedLogoName.png")}
                    />

                    <Text
                        style={{

                            marginBottom: 50,
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
                </View>

                <View style={styles.buttonContainer}>

                    <TouchableOpacity
                        onPress={() => { handleLogin(email, password) }}
                        style={styles.button}
                    >
                        <Text style={styles.buttonText}>Login</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => { navigation.navigate('Signup') }}
                        style={[styles.button, styles.buttonOutline]}
                    >
                        <Text style={styles.buttonOutlineText}>Signup</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </>
    )
}

export default LoginScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: colors.primary,
        alignItems: 'center',
        height: height + 100
    },
    inputContainer: {
        width: "80%"
    },
    input: {
        backgroundColor: "white",
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
        backgroundColor: colors.secondary, // #0782F9
        width: '100%',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
    },

    buttonText: {
        color: "white",
        fontWeight: '700',
        fontSize: 16,
    },

    buttonOutline: {
        backgroundColor: "white",
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
    },
    upperDesign: {
        width: width,
        height: 250,
        alignSelf: 'flex-start'
    }
})
