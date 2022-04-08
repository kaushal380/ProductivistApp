import React, {useEffect, useState} from 'react'
import {Image, Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import {colors} from '../../styles/AppStyles'
import * as SQLite from 'expo-sqlite';
import {firebase} from '../../firebase/config'
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {useNavigation} from '@react-navigation/core';
import {
  AdMobBanner,
  AdMobInterstitial,
  PublisherBanner,
  AdMobRewarded,
} from 'react-native-admob'

const db = SQLite.openDatabase("user.db");

const Settings = () => {
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

    let formatStart = convertTimeFormat(startTime[0])
    let formatEnd = convertTimeFormat(endTime[0])


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
        navigation.pop()
      })
  }
  const convertTimeFormat = (timeNum) => {
    let hours = Math.trunc(timeNum / 60)
    let minutes = timeNum % 60
    return format12Hour(hours, minutes)
  }

  const format12Hour = (hours, minutes) => {
    let pm = hours > 11
    hours %= 12
    if (hours === 0) hours = 12
    if (minutes < 10) minutes = "0" + minutes
    return hours + ":" + minutes + " " + (pm ? "PM" : "AM")
  }

  const openTerms = () => {
    Linking.openURL("https://docs.google.com/document/d/1YpjIoFfji-uGzAni7BkCxLtr2SfG-TE4IluAYS3XvmE/edit?usp=sharing")
  }

  const openPP = () => {
    Linking.openURL('https://docs.google.com/document/d/1YYObK6L81yX53PYPNpZas5A3WKeEo-EHYgrRECZz9-Q/edit?usp=sharing')
  }

  const openFeedback = () => {
    Linking.openURL('https://forms.gle/ayKSyxHKG3uNE2UE7')
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

    setStartTime(format12Hour(hours, minutes));
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

    setEndTime(format12Hour(hours, minutes))
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
            source={require('../../assets/updatedLogo.png')}
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

          <Text style={styles.Linkitems} onPress = {openPP}>
            Privacy Policy
          </Text>

          <Text style={styles.Linkitems} onPress = {openFeedback}>
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

        <AdMobBanner
            adSize="fullBanner"
            adUnitID="your-admob-unit-id"
            testDevices={[AdMobBanner.simulatorId]}
            onAdFailedToLoad={error => console.log("Error: " + error)}
        />

      </View>
    </ScrollView>
  )
}

export default Settings

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
    width: 90,
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
