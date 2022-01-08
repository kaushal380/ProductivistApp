import { StatusBar } from 'expo-status-bar';
import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View } from 'react-native';
import EventCalendar from 'react-native-events-calendar';
import { firebase } from '../../firebase/config';
import {Container, HeaderView} from '../../styles/AppStyles';
import {AntDesign, Entypo} from "@expo/vector-icons"


const CalendarDisplay = () => {
  let date = new Date()
  let dateFormat = ""
  const getInit = async() => {

  let calendarInpu1 = []
  let initialRoutines
  let initialApps
  let Date1
  let month = date.getMonth() + 1
  let dateCheck = date.getDate()
  
  console.log(dateCheck)
  if(month < 10){
     month = "0"+ month
  }
  if(dateCheck < 10){
    dateCheck = '0' + dateCheck
  }
  
  // console.log(dateCheck)
  dateFormat = date.getFullYear() + '-' + month + '-' + dateCheck;
  
  console.log(dateFormat)

  const documentSnapshot = await firebase.firestore()
            .collection('users')
            .doc(firebase.auth().currentUser.uid)
            .collection('userData')
            .doc('routines')
            .get()
            initialRoutines = Object.values(Object.seal(documentSnapshot.data()))

  const documentSnapshot1 = await firebase.firestore()
            .collection('users')
            .doc(firebase.auth().currentUser.uid)
            .collection('userData')
            .doc('shortTerm')
            .get()
            initialApps = Object.values(Object.seal(documentSnapshot1.data()))

          for(let i = 0; i < initialApps.length; i++){
            initialRoutines = [...initialRoutines, initialApps[i]]
          }

            for (let index = 0; index < initialRoutines.length; index++) {
            
              let month = date.getMonth()+1
              if(month < 10){
                  month = '0' + month
              }
              let title = initialRoutines[index].title
              if(date.getDate()< 10){
                Date1 = '0'+date.getDate()
              }
              let from = date.getFullYear() + '-' + month + '-' + Date1 + " " +initialRoutines[index].from +":00"
              let to = date.getFullYear() + '-' + month + '-' + Date1 + " " +initialRoutines[index].to + ":00"
              let mylist = {start: from, end: to, title: title, summary: ""}

              calendarInpu1 = [...calendarInpu1,mylist]
          }
    // console.log(calendarInput)
    setCalendar(calendarInpu1)
  } 

  useEffect(() => {
    getInit()
  }, [])

  let mylist1 = {"end": "2022-01-02 02:30:00", "start": '2022-01-02 01:30:00', "summary": '3412 Piedmont Rd NE, GA 3032', "title": 'Dr. Mariana Joseph',}
  let mylist2 = {"end": "2022-01-02 05:00:00", "start": '2022-01-02 04:30:00', "summary": '3412 Piedmont Rd NE, GA 3032', "title": 'Dr. Mariana Joseph',}
  const [calendarInput, setCalendar] = useState([])
  const events = [mylist1, mylist2]
  // console.log("array")
//   console.log(calendarInput)
  // const events = calendarInput
  // console.log(events)

  return (
    <>
    <View style = {styles.header}>
      <Text style = {styles.headerItem}>Let's see what you got today :)</Text>
      <AntDesign name='reload1' size={25} onPress={getInit} />
    </View>
    <EventCalendar  
      eventTapped={(value) => {alert(value.title)}}
      events={calendarInput} 
      width={400}
      initDate= {{dateFormat}} 
    />
  </>    
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    alignSelf: 'center',
    alignContent: 'space-between',
    height: 30
  },
  headerItem: {
    fontSize: 20,
    marginRight: 30,
    
  }
});

export default CalendarDisplay;