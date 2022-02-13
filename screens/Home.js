import React, {useState, useEffect, useRef} from 'react'
import { Button, View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { firebase } from '../firebase/config';
import { useNavigation } from '@react-navigation/core';
import * as SQLite from 'expo-sqlite';
import CircularProgress from 'react-native-circular-progress-indicator';
import * as Notifications from 'expo-notifications';
const db = SQLite.openDatabase("user.db");
import Device from 'expo-device';
import Constants from 'expo-constants';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const Home = () => {
  const firebaseAccess = firebase.firestore();
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  const navigation = useNavigation()
  // const {state} = props.navigation
  const [userdata, setUserdata] = useState()
  const [todoTotal, setTodoTotal] = useState(0);
  const [todoDone, SettodoDone] = useState(0);
  const [todoSubtitle, setTodoSubtitle] = useState();
  const [appsTotal, setAppsTotal] = useState(0);
  const [appsDone, setAppsDone] = useState(0);
  const [appsSubtitle, setAppsSubtitle] = useState()
  const [routinesTotal, setRoutinesTotal] = useState(0)
  const [doneRoutines, setDoneRoutines] = useState(0)
  const [RoutineSubtitle, setRoutinesSubtitle] = useState()

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
  const GetDaysApps = (array) => {
    let date = new Date();
    let filteredArray = []
    for (let index = 0; index < array.length; index++) {
        let selectedDate = new Date(array[index].date);
        if((date.getFullYear() === selectedDate.getFullYear()) && 
        (date.getMonth() === selectedDate.getMonth()) &&
        (date.getDate() === selectedDate.getDate())){
            filteredArray = [...filteredArray, array[index]]
        }
    }
    // filteredArray = SortElementsFromNum(filteredArray)
    return filteredArray;
}

const getCompletedTasks = (array) => {
    let filteredArray = []

    for (let index = 0; index < array.length; index++) {
      if(array[index].status === "done"){
        filteredArray = [...filteredArray, array[index]]
      }
    }
    return filteredArray;
}
  const configProgress = async () => {
    const timeSnap = await firebase.firestore()
      .collection('users')
      .doc(firebase.auth().currentUser.uid)
      .collection('userData')
      .doc('currentTime')
      .get()
    
    let time = Object.values(Object.seal(timeSnap.data()))

    const documentSnapshot = await firebase.firestore()
      .collection('users')
      .doc(firebase.auth().currentUser.uid)
      .collection('userData')
      .doc('todos')
      .get()

    let todos = Object.values(Object.seal(documentSnapshot.data()))

    const documentSnapshot1 = await firebase.firestore()
    .collection('users')
    .doc(firebase.auth().currentUser.uid)
    .collection('userData')
    .doc('routines')
    .get()

    let routines = Object.values(Object.seal(documentSnapshot1.data()))

    routines = unMarkDone(routines, time)
    const documentSnapshot2 = await firebase.firestore()
    .collection('users')
    .doc(firebase.auth().currentUser.uid)
    .collection('userData')
    .doc('shortTerm')
    .get()

    let apps = Object.values(Object.seal(documentSnapshot2.data()))

    let totalTodo = GetDaysApps(todos).length
    let doneTodo = getCompletedTasks(GetDaysApps(todos)).length
    setTodoTotal(totalTodo)
    SettodoDone(doneTodo)
    let subtitleTodo = "of " + totalTodo
    setTodoSubtitle(subtitleTodo)

    let totalApps = GetDaysApps(apps).length
    let doneApps = getCompletedTasks(GetDaysApps(apps)).length
    setAppsTotal(totalApps)
    setAppsDone(doneApps)
    let subtitleApp = "of " + totalApps
    setAppsSubtitle(subtitleApp)

    let totalRoutine = routines.length
    let doneRoutines = getCompletedTasks(routines).length
    setRoutinesTotal(totalRoutine)
    setDoneRoutines(doneRoutines)
    let subtitleRoutine = "of " + totalRoutine
    setRoutinesSubtitle(subtitleRoutine)
    

  }
  const unMarkDone = (routines, time) => {
    console.log(time[0])
    let currentTime = new Date()
    let setTime = currentTime.toDateString()
    let firebaseTime = new Date(time[0])

    console.log(firebaseTime.getFullYear() + "-" + firebaseTime.getMonth() + "-" + firebaseTime.getDate());
    if((firebaseTime.getFullYear() != currentTime.getFullYear()) || (firebaseTime.getMonth() != currentTime.getMonth()) || (firebaseTime.getDate() != currentTime.getDate())){
      for (let index = 0; index < routines.length; index++) {
        routines[index].status = "pending";
      }
      const upDateRoutine = Object.assign({}, routines)
      firebaseAccess
        .collection('users')
        .doc(firebase.auth().currentUser.uid)
        .collection('userData')
        .doc('routines')
        .set(upDateRoutine)

      firebaseAccess
        .collection('users')
        .doc(firebase.auth().currentUser.uid)
        .collection('userData')
        .doc('currentTime')
        .set({setTime})
    }
    return routines;
  }  
  const getDbDate =()=> {
    // console.log("db")
    db.transaction((tx) => {
      tx.executeSql(
          'SELECT Email, Password FROM users', [],
          (tx, results) => {
          console.log('results length: ', results.rows.length); 
          console.log("Query successful")
          if (results.rows.length > 0) {
            console.log(results.rows.item(0)['Password']);
          }
  })})}


  const getUser = async () => {
    // alert("pressed!")
    try {
      const documentSnapshot = await firebase.firestore()
      .collection('users')
      .doc(firebase.auth().currentUser.uid)
      .collection('userData')
      .doc('authInfo')
      .get()
      let userData = Object.values(Object.seal(documentSnapshot.data()))
      setUserdata(userData[2])
    //  alert(userData)
      //do whatever
    }
    catch{
        console.log("error occured!");
    }
   
  };
  
  useEffect(() => {
    getUser()
    configProgress()
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    schedulePushNotification()

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  async function schedulePushNotification() {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "You've got mail yeahhh! 📬",
        body: 'Here is the notification body',
        data: { data: 'goes here' },
      },
      trigger: {seconds: 1},
    });
  }

  async function registerForPushNotificationsAsync() {
    let token;
    if (Constants.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log(token);
    } else {
      alert('Must use physical device for Push Notifications');
    }
  
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
    return token;
  }
    return (
      <ScrollView
      showsVerticalScrollIndicator = {false}
      onTouchStart={configProgress} 
      >
      <View
      style = {styles.container}
      >
      <View style = {styles.buttonContainer}>
        <Text
        style = {{
          marginBottom: 40,
          fontSize: 40,
          fontWeight: 'bold'
        }}
        >
          Hello {userdata}, 
        </Text>
        <Text>Routines</Text>
        <CircularProgress
            value={doneRoutines}
            maxValue={routinesTotal}
            radius={120}
            textColor={'black'}
            activeStrokeColor={'#f39c12'}
            inActiveStrokeColor={'#9b59b6'}
            inActiveStrokeOpacity={0.5}
            inActiveStrokeWidth={20}
            activeStrokeWidth={40}
            subtitle= {RoutineSubtitle}
            subtitleColor='black' 
        />
        <Text>tasks</Text>
        <CircularProgress
            value={todoDone}
            maxValue={todoTotal}
            radius={120}
            textColor={'black'}
            activeStrokeColor={'#f39c12'}
            inActiveStrokeColor={'#9b59b6'}
            inActiveStrokeOpacity={0.5}
            inActiveStrokeWidth={20}
            activeStrokeWidth={40}
            subtitle= {todoSubtitle}
            subtitleColor='black' 
        />
        <Text>appointments</Text>
        <CircularProgress
            value={appsDone}
            maxValue={appsTotal}
            radius={120}
            textColor={'black'}
            activeStrokeColor={'#f39c12'}
            inActiveStrokeColor={'#9b59b6'}
            inActiveStrokeOpacity={0.5}
            inActiveStrokeWidth={20}
            activeStrokeWidth={40}
            subtitle= {appsSubtitle}
            subtitleColor='black'
            
        />
        <TouchableOpacity
          onPress = {getDbDate}
          style = {styles.button}
        >
            <Text style = {styles.buttonText}>GetUserInfo</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress = {handleSignout}
          style = {[styles.button, styles.buttonOutline]}
        >
            <Text style = {styles.buttonOutlineText}>SignOut</Text>
        </TouchableOpacity>
      </View>
      </View>
      </ScrollView>
    )
}

const styles = StyleSheet.create({
  container : {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
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
}})

export default Home
