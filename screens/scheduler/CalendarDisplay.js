import { StatusBar } from 'expo-status-bar';
import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View } from 'react-native';
import EventCalendar from 'react-native-events-calendar';
import { firebase } from '../../firebase/config';
import {Container, HeaderView} from '../../styles/AppStyles';
import {AntDesign, Entypo} from "@expo/vector-icons"


const CalendarDisplay = () => {
  let date = new Date()
  const getInit = async() => {
  alert("hel")
  let calendarInpu1 = []
  let initialTodos
  
  // console.log(date.getMonth())

  const documentSnapshot = await firebase.firestore()
            .collection('users')
            .doc(firebase.auth().currentUser.uid)
            .collection('userData')
            .doc('routines')
            .get()
            initialTodos = Object.values(Object.seal(documentSnapshot.data()))

            for (let index = 0; index < initialTodos.length; index++) {
              let month = date.getMonth()+1
              let title = initialTodos[index].title
              let from = date.getFullYear() + '-' + month + '-' + date.getDate() + " " +initialTodos[index].from +":00"
              let to = date.getFullYear() + '-' + month + '-' + date.getDate() + " " +initialTodos[index].to + ":00"
              let mylist = {start: from, end: to, title: title, summary: ""}

              calendarInpu1 = [...calendarInpu1,mylist]
          }
    // console.log(calendarInput)
    setCalendar(calendarInpu1)
  } 

  useEffect(() => {
    getInit()
  }, [])
  let mylist1 = {"end": "2021-12-23 02:30:00", "start": '2021-12-23 01:30:00', "summary": '3412 Piedmont Rd NE, GA 3032', "title": 'Dr. Mariana Joseph',}
  let mylist2 = {"end": "2021-12-23 05:00:00", "start": '2021-12-23 04:30:00', "summary": '3412 Piedmont Rd NE, GA 3032', "title": 'Dr. Mariana Joseph',}
  const [calendarInput, setCalendar] = useState([])
  // const events = [mylist1, mylist2]
  // console.log("array")
  // console.log(calendarInput)
  // const events = calendarInput
  // console.log(events)

  return (
    <>
    <View style = {styles.header}>
      <Text style = {styles.headerItem}>Let's see what you got today :)</Text>
      <AntDesign name='reload1' size={25} onPress={getInit} />
    </View>
    <EventCalendar
      eventTapped={true}
      events={calendarInput}
      width={400}
      initDate= {'2021-12-30'}
      
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