import React, {useEffect} from "react";
import { View, Text, StyleSheet, Image, Dimensions } from "react-native";
import ProgressBar from "react-native-animated-progress";
import { useNavigation } from '@react-navigation/core';
import { firebase } from '../../firebase/config';
import { colors } from "../../styles/AppStyles";
import * as SQLite from 'expo-sqlite';
const db = SQLite.openDatabase("user.db");

let { width } = Dimensions.get('window');
const Welcome = () => {
    const navigation = useNavigation()
    const checkAuth = () => {
        db.transaction((tx) => {
            tx.executeSql(
                'SELECT Email, Password FROM users', [],
                (tx, result) => {
                    if(result.rows._array.length > 0){
                    let authList = [(result.rows._array[0].Email), (result.rows._array[0].Password)];
                    initLogin(authList)
                    }
                    else {
                        setTimeout(() => {  navigation.navigate('Login'); }, 1000);
                        // setTimeout(() => {  alert(' going to Login'); }, 1000);
                    }
                }
            )
        })
    }
    const initLogin = (authList) => {
        let email = authList[0]
        let password = authList[1]
        try{
        firebase
            .auth()
            .signInWithEmailAndPassword(email, password)
            .then((response) => {
                console.log(response.user.uid)
                setTimeout(() => {  navigation.navigate('AppRoute'); }, 1000);
                // setTimeout(() => {  alert(' going to home'); }, 1000);
                return;
            })
        }
        catch(e){
            console.log(e);
            setTimeout(() => {  navigation.navigate('Login'); }, 1000);
            // setTimeout(() => {  alert(' going to Login'); }, 1000);
        }
    }
    useEffect(() => {
        checkAuth()
    }, [])
  return (
    <View
      style={styles.container}
    >
        <Image
            style = {styles.appName}
            source = {require("../../assets/appName.png")}
        />
      <View>
        <ProgressBar progress={100} height={15} backgroundColor = {colors.secondary} />
      </View>

    </View>
  );
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
      alignSelf: 'center',
      marginRight: 20
    }
  
  })
