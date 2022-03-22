import React, { useState, useEffect, useRef } from 'react'
import { Button, View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, Image } from 'react-native';
import { firebase } from '../../firebase/config';
import { useNavigation } from '@react-navigation/core';
import * as SQLite from 'expo-sqlite';
import CircularProgress from 'react-native-circular-progress-indicator';
import * as Notifications from 'expo-notifications';
const db = SQLite.openDatabase("user.db");
import Device from 'expo-device';
import Constants from 'expo-constants';
import { RoutineText, RoutineTime, colors, TodoDate } from '../../styles/AppStyles';
import AppLoading from 'expo-app-loading';
import { useFonts } from 'expo-font';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

let { width } = Dimensions.get('window')
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

  const [rawTodo, setRawTodo] = useState()
  const [rawRoutine, setRawRoutine] = useState()
  const [rawApps, setRawApps] = useState()

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
      if ((date.getFullYear() === selectedDate.getFullYear()) &&
        (date.getMonth() === selectedDate.getMonth()) &&
        (date.getDate() === selectedDate.getDate())) {
        filteredArray = [...filteredArray, array[index]]
      }
    }
    // filteredArray = SortElementsFromNum(filteredArray)
    return filteredArray;
  }

  const getCompletedTasks = (array) => {
    let filteredArray = []

    for (let index = 0; index < array.length; index++) {
      if (array[index].status === "done") {
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
    setRawTodo(todos)
    const documentSnapshot1 = await firebase.firestore()
      .collection('users')
      .doc(firebase.auth().currentUser.uid)
      .collection('userData')
      .doc('routines')
      .get()

    let routines = Object.values(Object.seal(documentSnapshot1.data()))
    setRawRoutine(routines)
    routines = unMarkDone(routines, time)
    const documentSnapshot2 = await firebase.firestore()
      .collection('users')
      .doc(firebase.auth().currentUser.uid)
      .collection('userData')
      .doc('shortTerm')
      .get()

    let apps = Object.values(Object.seal(documentSnapshot2.data()))
    setRawApps(apps)
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
    if ((firebaseTime.getFullYear() != currentTime.getFullYear()) || (firebaseTime.getMonth() != currentTime.getMonth()) || (firebaseTime.getDate() != currentTime.getDate())) {
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
        .set({ setTime })
    }
    return routines;
  }
  const getDbDate = () => {
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
        })
    })
  }



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
    catch {
      console.log("error occured!");
    }

  };

  const onTouchFunction = () => {
    configProgress()
    fetchUpcomingTasks()
  }



  async function schedulePushNotification() {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "You've got mail yeahhh! 📬",
        body: 'Here is the notification body',
        data: { data: 'goes here' },
      },
      trigger: { seconds: 1 },
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

  ///////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////

  const fetchUpcomingTasks = async () => {

    let date = new Date();


    const documentSnapshot = await firebase.firestore()
      .collection('users')
      .doc(firebase.auth().currentUser.uid)
      .collection('userData')
      .doc('todos')
      .get()

    let initialTodos = Object.values(Object.seal(documentSnapshot.data()))
    initialTodos = getPendingItems(initialTodos)

    const documentSnapshot1 = await firebase.firestore()
      .collection('users')
      .doc(firebase.auth().currentUser.uid)
      .collection('userData')
      .doc('routines')
      .get()

    let initialRoutines = Object.values(Object.seal(documentSnapshot1.data()))

    initialRoutines = Object.values(Object.seal(documentSnapshot1.data()))
    initialRoutines = getPendingItems(initialRoutines)

    const documentSnapshot2 = await firebase.firestore()
      .collection('users')
      .doc(firebase.auth().currentUser.uid)
      .collection('userData')
      .doc('shortTerm')
      .get()

    let initialApps = Object.values(Object.seal(documentSnapshot2.data()))

    initialApps = getPendingItems(initialApps)

    initialRoutines = SortElementsFromNum(initialRoutines); // sorting routines from morning to night based on the time
    initialTodos = getCurrentAndFutureTodos(initialTodos, date); // getting the current and future todos interms of date


    let schedule = createSchedule(initialTodos, initialRoutines, initialApps)

    let finalUpcomingTasks = [];
    if (schedule.length > 3) {
      for (let index = 0; index < 3; index++) {
        finalUpcomingTasks = [...finalUpcomingTasks, schedule[index]]
      }
    }
    else {
      for (let index = 0; index < schedule.length; index++) {
        finalUpcomingTasks = [...finalUpcomingTasks, schedule[index]]
      }
    }

    setUpcomingTasks(finalUpcomingTasks);
  }

  const createSchedule = (todos, routines, apps) => {
    let finalSchedule = []
    let missedList = todos;
    let date = new Date();
    let keyVal = 1;

    let Day_schedule = []
    Day_schedule = routines;
    let Day_apps = GetDaysApps1(apps, date)
    Day_apps = getPendingItems(Day_apps)
    Day_schedule = Day_schedule.concat(Day_apps)

    let date1 = new Date()
    let past = []
    if (date.toString() === date1.toString()) {

      past = GetCurrentAndFutureEvents(SortElementsFromNum(Day_schedule))[1];
      Day_schedule = GetCurrentAndFutureEvents(SortElementsFromNum(Day_schedule))[0];
    }

    // missedList = getCurrentAndFutureTodos(missedList, date);

    let fetchFromCombine = combineTodos(Day_schedule, missedList, past, date)

    let currentDaySchedule = fetchFromCombine[0]

    currentDaySchedule.forEach(element => {
      element.key = keyVal;


      let elementString = JSON.stringify(element)
      finalSchedule = finalSchedule.concat(elementString)


      keyVal++;
    });


    // finalSchedule = [...finalSchedule, currentDaySchedule]
    missedList = fetchFromCombine[1];


    let conversionArray = []
    for (let index = 0; index < finalSchedule.length; index++) {
      let object = JSON.parse(finalSchedule[index])
      conversionArray = [...conversionArray, object]
    }
    return conversionArray;
  }

  /**
  so the way it works:
  1. we have 3 @param initSchedule, Alltodo, pastArray
  
  2. if the initSchedule is null, it is populated with the first item on todo
  3. based on the schedule, it keeps adding the tasks to the next available spot
  4. if all the tasks cannot be added, they are added to the missed lists
  5. combines the final schedule with past elements
  6. @returns a final combined list
  */
  const combineTodos = (initSchedule, Alltodo, pastArray, date) => {

    let Currentdate = new Date();
    let Starttime = 0
    if (Currentdate.toString() === date.toString()) {
      Starttime = (date.getHours() * 60) + (date.getMinutes()); // current time in minutes
    }
    let endTime = 1439; //11:59
    let schedule = initSchedule
    //let todo = SortBasedOnTime(GetDaysApps(Alltodo)); // gets today's tasks that are due and sorts them
    let todo = Alltodo

    let finalCombo = []
    let pastEvents = []
    let missedList = []

    // layer one algorithm: combines tasks of current date
    for (let index = 0; index < todo.length; index++) {

      let start = Starttime;
      if (schedule.length === 0) {
        todo[index].fromNum = start + 5;
        todo[index].toNum = todo[index].fromNum + todo[index].time;
        todo[index].from = convertNumToTime(todo[index])[0];
        todo[index].to = convertNumToTime(todo[index])[1];
        schedule = [...schedule, todo[index]]
        continue;
      }
      for (let i = 0; i < schedule.length; i++) {
        if ((start + todo[index].time + 5) <= schedule[i].fromNum) {
          todo[index].fromNum = start + 5;
          todo[index].toNum = todo[index].fromNum + todo[index].time;
          todo[index].from = convertNumToTime(todo[index])[0];
          todo[index].to = convertNumToTime(todo[index])[1];
          schedule = [...schedule, todo[index]]
          schedule = SortElementsFromNum(schedule)

          break;
        }
        start = schedule[i].toNum;

        if (i === (schedule.length - 1)) {

          let end = start + 5 + todo[index].time;
          if (end <= endTime) {
            todo[index].fromNum = start + 5;
            todo[index].toNum = todo[index].fromNum + todo[index].time;
            todo[index].from = convertNumToTime(todo[index])[0];
            todo[index].to = convertNumToTime(todo[index])[1];
            schedule = [...schedule, todo[index]]
            schedule = SortElementsFromNum(schedule)
          }
          else {

            missedList = [...missedList, todo[index]];
          }
          break;
        }
      }
    }
    // layer 2 algorith: get all the future tasks and assigns it if time permits
    finalCombo = schedule.concat(pastEvents); // adds the past tasks, if the pastEvents is not null
    for (let index = 0; index < finalCombo.length; index++) {
      finalCombo[index].date = date.toDateString();
      finalCombo[index].elementIndex = date.getDate();
    }

    let returnItems = [finalCombo, missedList]
    return returnItems;
  }
  // convert the minutes to hours and time format
  const convertNumToTime = (element) => {
    let FromHours = Math.trunc((element.fromNum / 60));
    let FromMins = element.fromNum - (FromHours * 60);
    if (FromHours < 10) {
      FromHours = "0" + FromHours;
    }
    else {
      FromHours = "" + FromHours;
    }
    if (FromMins < 10) {
      FromMins = "0" + FromMins;
    }
    else {
      FromMins = "" + FromMins;
    }
    let ToHours = Math.trunc((element.toNum / 60));
    let Tomins = element.toNum - (ToHours * 60);
    if (ToHours < 10) {
      ToHours = "0" + ToHours;
    }
    else {
      ToHours = "" + ToHours;
    }
    if (Tomins < 10) {
      Tomins = "0" + Tomins;
    }
    else {
      Tomins = "" + Tomins;
    }
    let from = FromHours + ":" + FromMins;
    let to = ToHours + ":" + Tomins;
    let structure = [from, to];
    return structure;
  }
  const SortElementsFromNum = (array) => {
    let timeSort = []
    let sortedArray = []
    for (let index = 0; index < array.length; index++) {
      timeSort = [...timeSort, array[index].fromNum]
    }

    timeSort = timeSort.sort(function (a, b) { return a - b })
    timeSort = [...new Set(timeSort)];

    for (let index = 0; index < timeSort.length; index++) {
      for (let i = 0; i < array.length; i++) {
        if (array[i].fromNum === timeSort[index]) {
          sortedArray = [...sortedArray, array[i]]
        }
      }
    }

    return sortedArray;
  }
  const GetDaysApps1 = (array, date) => {
    let filteredArray = []
    for (let index = 0; index < array.length; index++) {
      let selectedDate = new Date(array[index].date);
      if ((date.getFullYear() === selectedDate.getFullYear()) &&
        (date.getMonth() === selectedDate.getMonth()) &&
        (date.getDate() === selectedDate.getDate())) {
        filteredArray = [...filteredArray, array[index]]
      }
    }
    // filteredArray = SortElementsFromNum(filteredArray)
    return filteredArray;
  }

  // get the events starting from current time with index 0
  // get the past events from index 1
  const GetCurrentAndFutureEvents = (array) => {

    let date = new Date();
    let time = (date.getHours() * 60) + (date.getMinutes());
    let timeArray = []
    let pastArray = []
    for (let index = 0; index < array.length; index++) {
      if (array[index].toNum > time) {
        timeArray = [...timeArray, array[index]];
      }
      else {
        pastArray = [...pastArray, array[index]]
      }
    }


    let finalArray = [timeArray, pastArray]
    return finalArray;
  }

  const getPendingItems = (list) => {
    let finalList = []
    for (let index = 0; index < list.length; index++) {
      if (list[index].status !== "done") {
        finalList = [...finalList, list[index]]
      }
    }

    return finalList;
  }
  const getCurrentAndFutureTodos = (todos, date) => {
    let finalTodos = []
    let initialTodos = todos;
    // let date = new Date();
    initialTodos.forEach(element => {
      let selectedDate = new Date(element.date);
      let dateCheck = true;

      if (selectedDate.getFullYear() > date.getFullYear()) {
        dateCheck = true;

      }
      else if (selectedDate.getFullYear() === date.getFullYear()) {
        if (selectedDate.getMonth() > date.getMonth()) {
          dateCheck = true;

        }
        else if (selectedDate.getMonth() === date.getMonth()) {
          if (selectedDate.getDate() >= date.getDate()) {
            dateCheck = true;
          }
          else {
            dateCheck = false;
          }
        }
        else {
          dateCheck = false;
        }
      }
      else {
        dateCheck = false;
      }

      if (dateCheck) {
        finalTodos = [...finalTodos, element]
      }
    });
    return finalTodos;
  }

  useEffect(() => {
    getUser()
    configProgress()
    fetchUpcomingTasks()
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    //schedulePushNotification()

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  const [UpcomingTasks, setUpcomingTasks] = useState([])

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      onTouchStart={onTouchFunction}
      style={{ backgroundColor: colors.primary }}
    >
      <Image
        style={{ width: 340, height: 150 }}
        source={require('../../assets/upperDesign.png')}
      />
      <View
        style={styles.container}
      >
        <Image
          style = {{width: 300, height: 100, alignSelf: 'center', marginTop: -100}}
          source = {require('../../assets/updatedLogoName.png')}
        />
        <Text
          style={{
            
            marginBottom: 10,
            fontSize: 23,
            // fontWeight: 'bold',
            alignSelf: 'center',
            marginHorizontal: 30,
            // color: colors.secondary,
            color: '#596849',
            fontFamily: 'Oswald-Regular',
            
          }}
        >
          HELLO {userdata}, LET'S GET WORKING!
        </Text>
        <View style={styles.buttonContainer}>

          <View style={{ flexDirection: 'row' }}>
            <View>
              <Text style={{ alignSelf: 'center', fontFamily: 'Oswald-Regular', fontSize: 20}}>ROUTINES</Text>
              <CircularProgress
                value={doneRoutines}
                maxValue={routinesTotal}
                radius={65}
                textColor={'black'}
                activeStrokeColor={colors.secondary}
                inActiveStrokeColor={colors.secondarySageGreen}
                inActiveStrokeOpacity={0.5}
                inActiveStrokeWidth={10}
                activeStrokeWidth={20}
                subtitle={RoutineSubtitle}
                subtitleColor='black'
              />
            </View>
            <View>
              <Text style={{ alignSelf: 'center', fontFamily: 'Oswald-Regular', fontSize: 20 }}>TASKS</Text>
              <CircularProgress
                value={todoDone}
                maxValue={todoTotal}
                radius={65}
                textColor={'black'}
                activeStrokeColor={colors.secondary}
                inActiveStrokeColor={colors.secondarySageGreen}
                inActiveStrokeOpacity={0.5}
                inActiveStrokeWidth={10}
                activeStrokeWidth={20}
                subtitle={todoSubtitle}
                subtitleColor='black'
              />
            </View>

            <View>
              <Text style={{ alignSelf: 'center', fontFamily: 'Oswald-Regular', fontSize: 20}}>APPOINTMENTS</Text>
              <CircularProgress
                value={appsDone}
                maxValue={appsTotal}
                radius={65}
                textColor={'black'}
                activeStrokeColor={colors.secondary}
                inActiveStrokeColor={colors.secondarySageGreen}
                inActiveStrokeOpacity={0.5}
                inActiveStrokeWidth={10}
                activeStrokeWidth={20}
                subtitle={appsSubtitle}
                subtitleColor='black'
                

              />
            </View>
          </View>
          <View style={styles.upcomingList}>
            <Text style={{ alignSelf: 'flex-start', fontSize: 25, fontFamily: 'Oswald-Regular'}}>YOUR UPCOMING TASKS:</Text>
            <>
              {UpcomingTasks.length == 0 && 
                <TouchableOpacity style = {styles.item}>
                <Text style={{ alignSelf: 'center', fontSize: 20, fontFamily: 'Oswald-Regular' }}>Yayy, You don't have any tasks today!</Text>
                </TouchableOpacity>}

              {UpcomingTasks.length != 0 &&
                <ScrollView>
                  {
                    UpcomingTasks.map((element) =>
                      <TouchableOpacity style={styles.item}>
                        <RoutineText>
                          {element.title}
                        </RoutineText>
                        <RoutineTime>
                          {element.from} - {element.to}
                        </RoutineTime>
                        <TodoDate>
                          type: {element.type}
                        </TodoDate>
                      </TouchableOpacity>
                    )
                  }
                </ScrollView>
              }
            </>
          </View>

        </View>
      </View>
      <Image
        style={{ width: 340, height: 150, alignSelf: 'flex-end', marginTop: -80 }}
        source={require('../../assets/lowerDesign.png')}
      />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
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

  buttonOutline: {
    backgroundColor: 'white',
    marginTop: 5,
    borderColor: '#0782F9',
    borderWidth: 2,
  },
  buttonOutlineText: {
    color: '#0782F9',
    fontWeight: '700',
    fontSize: 16,
  },
  item: {
    backgroundColor: colors.secondary,
    padding: 20,
    margin: 10,
    borderRadius: 20
  },
  // item1: {
  //   backgroundColor: colors.secondary,
  //   padding: 20,
  //   margin: 10,
  //   borderRadius: 20
  // },
  text: {
    fontSize: 20,
    color: 'black',
    fontWeight: 'bold'
  },
  upcomingList: {
    margin: 30,
    width: width - 30,
    alignSelf: 'center',

  }
})

export default Home
