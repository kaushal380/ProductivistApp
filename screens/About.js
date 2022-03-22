import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView, Linking } from 'react-native'
import { colors } from '../styles/AppStyles'
import * as SQLite from 'expo-sqlite';
import { firebase } from '../firebase/config'
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { useNavigation } from '@react-navigation/core';
const db = SQLite.openDatabase("user.db");

const About = () => {
  const navigation = useNavigation()
  const [UserName, setUserName] = useState("random guy")
  const [userEmail, setUserEmail] = useState("random@random.com")
  const [startTime, setStartTime] = useState("00:00");
  const [endTime, setEndTime] = useState("00:00");
  const [openStartTime, setOpenStartTime] = useState(false);
  const [openEndTime, setOpenEndTime] = useState(false);
  const firebaseAccess = firebase.firestore()

  const fetchFirebaseData = async () => {
    const documentSnapshot = await firebase.firestore()
      .collection('users')
      .doc(firebase.auth().currentUser.uid)
      .collection('userData')
      .doc('authInfo')
      .get()

    let userData = Object.values(Object.seal(documentSnapshot.data()))
    setUserName(userData[2])
    setUserEmail(userData[1])

    const documentSnapshot1 = await firebase.firestore()
      .collection('users')
      .doc(firebase.auth().currentUser.uid)
      .collection('settings')
      .doc("startTime")
      .get()

    let startTime = Object.values(Object.seal(documentSnapshot1.data()))

    const documentSnapshot2 = await firebase.firestore()
      .collection('users')
      .doc(firebase.auth().currentUser.uid)
      .collection('settings')
      .doc("endTime")
      .get()

    let endTime = Object.values(Object.seal(documentSnapshot2.data()))

    let formatStart = conevertTimeformat(startTime[0])
    let formatEnd = conevertTimeformat(endTime[0])


    setStartTime(formatStart)
    setEndTime(formatEnd)
  }

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

  const conevertTimeformat = (timeNum) => {

    let hours = Math.trunc(timeNum / 60)
    let mins = timeNum - (hours * 60)

    if (hours < 10) {
      hours = "0" + hours
    }
    else {
      hours = hours.toString()
    }
    if (mins < 0) {
      mins = "0" + mins
    }
    else {
      mins = mins.toString()
    }

    let format = hours + ":" + mins;
    return format;
  }

  const openTerms = () => {
    Linking.openURL("https://docs.google.com/document/d/1W3kQ6CECfipK6oZCu7rVG4hpiDGuCN_ejUHrmiQ-jcI/edit?usp=sharing")
  }

  const submitStartTime = (time) => {
    setOpenStartTime(false)
    let selectedTime = new Date(time)
    let hours = selectedTime.getHours()
    let minutes = selectedTime.getMinutes()

    let timeAsNum = (hours * 60) + minutes;
    const obj = { startTime: timeAsNum }

    firebaseAccess
      .collection('users')
      .doc(firebase.auth().currentUser.uid)
      .collection('settings')
      .doc('startTime')
      .set(obj)

    if (hours < 10) {
      hours = "0" + hours
    }
    if (minutes < 10) {
      minutes = "0" + minutes
    }

    const format = hours + ":" + minutes;
    setStartTime(format);
  }

  const submitEndTime = (time) => {
    setOpenEndTime(false)
    let selectedTime = new Date(time)
    let hours = selectedTime.getHours()
    let minutes = selectedTime.getMinutes()

    let timeAsNum = (hours * 60) + minutes;
    const obj = { endTime: timeAsNum }

    firebaseAccess
      .collection('users')
      .doc(firebase.auth().currentUser.uid)
      .collection('settings')
      .doc('endTime')
      .set(obj)

    if (hours < 10) {
      hours = "0" + hours
    }
    if (minutes < 10) {
      minutes = "0" + minutes
    }

    const format = hours + ":" + minutes;
    setEndTime(format);
  }



  useEffect(() => {
    fetchFirebaseData()
  }, []);
  return (
    <ScrollView>
      <View style={styles.container}>

        <View style={styles.logoContainer}>
          <Image
            style={{ width: 150, height: 150 }}
            source={require('../assets/updatedLogo.png')}
          />
        </View>
        <View style={styles.itemContainer}>
          <Text style={styles.subtitle}>Profile</Text>
          <Text style={styles.items}>Name: {UserName}</Text>
          <Text style={styles.items}>Email: {userEmail}</Text>
          <Text style={styles.subtitle}>Settings</Text>
          <View style={styles.timeSetView}>
            <Text style={styles.items}>
              Wake up time:
            </Text>
            <TouchableOpacity style={styles.timeContainer} onPress={() => { setOpenStartTime(true) }}>
              <Text style={{ fontSize: 15 }}>
                {startTime}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.timeSetView}>
            <Text style={styles.items}>
              Sleep time:
            </Text>
            <TouchableOpacity style={styles.timeContainer} onPress={() => { setOpenEndTime(true) }}>
              <Text style={{ fontSize: 15 }}>
                {endTime}
              </Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.subtitle}>
            General
          </Text>

          <Text style={styles.items}>
            App name: Productivist
          </Text>
          <Text style={styles.items}>
            App version: 1.0.0
          </Text>

          <Text style={styles.Linkitems} onPress={openTerms}>
            Terms and conditions
          </Text>

          <Text style={styles.Linkitems}>
            Privacy Policy
          </Text>

          <Text style={styles.Linkitems}>
            Send feedback
          </Text>

        </View>
        <DateTimePickerModal
          isVisible={openStartTime}
          mode='time'
          onConfirm={(time) => { submitStartTime(time) }}
          onCancel={() => { setOpenStartTime(false) }}
        />
        <DateTimePickerModal
          isVisible={openEndTime}
          mode='time'
          onConfirm={(time) => { submitEndTime(time) }}
          onCancel={() => { setOpenEndTime(false) }}
        />
        <TouchableOpacity
          onPress={handleSignout}
          style={styles.button}
        >
          <Text style={styles.buttonText}>SIGN OUT</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

export default About

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    flex: 1,
    backgroundColor: colors.primary
  },
  logoContainer: {
    alignSelf: 'center'
  },
  itemContainer: {
    alignSelf: 'flex-start',
    marginHorizontal: 30,
    marginTop: 20
  },
  subtitle: {
    fontSize: 40,
    fontFamily: 'arial',
    color: 'black',
    marginVertical: 20, 
    fontFamily: 'Oswald-Regular'
  },
  items: {
    fontSize: 25,
    marginVertical: 10,
    fontFamily: 'Oswald-Regular'
    // fontFamily: 'FontsFree-Net-PlaylistScript'
  },
  Linkitems: {
    fontSize: 15,
    marginVertical: 10,
    textDecorationLine: 'underline',
    fontFamily: 'Oswald-Regular'
  },
  timeSetView: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  timeContainer: {
    backgroundColor: colors.secondary,
    width: 70,
    height: 30,
    borderRadius: 10,
    marginLeft: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  button: {
    backgroundColor: colors.secondary,
    width: '70%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    margin: 30
  },

  buttonText: {
    color: 'black',
    fontWeight: '700',
    fontSize: 16,
  },

})
