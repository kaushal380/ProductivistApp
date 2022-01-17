
import React, { useState, useEffect } from 'react';

import { SafeAreaView, StyleSheet, View, Dimensions } from 'react-native';
import { firebase } from '../../firebase/config';

import EventCalendar from 'react-native-events-calendar';

let { width } = Dimensions.get('window');

const App = () => {
  let date = new Date()
  let date1 = date.getDate()
  let month = date.getMonth()+1
  let year = date.getFullYear()
  let dateFormat = ""

  if(month <10){
    month = '0' + month
  }
  if(date1 < 10){
    date1 = '0' + date1
  }
  dateFormat = year+'-'+month+'-'+date1
  const getEvents = async () => {
    setInitEvents([])
    let initalRoutines
    let initialApps
    let initialEvents = []
    
    const documentSnapshot = await firebase.firestore()
        .collection('users')
        .doc(firebase.auth().currentUser.uid)
        .collection('userData')
        .doc('routines')
        .get()
    
        initalRoutines = Object.values(Object.seal(documentSnapshot.data()))

    const documentSnapshot1 = await firebase.firestore()
    .collection('users')
    .doc(firebase.auth().currentUser.uid)
    .collection('userData')
    .doc('shortTerm')
    .get()

    initialApps = Object.values(Object.seal(documentSnapshot1.data()))

    initialEvents = initialApps.concat(initalRoutines)

        let calendarInpu1 = []
        let month = date.getMonth()+1
        let Date1 = date.getDate()
        let year = date.getFullYear()

        if(month < 10){
          month = '0' + month
        }
      
        if(Date1< 10){
          Date1 = '0'+date.getDate()
        }
        for (let index = 0; index < initialEvents.length; index++) {
                
      
          let title = initialEvents[index].title
      
          let from = year + '-' + month + '-' + Date1 + " " +initialEvents[index].from +":00"
          let to = year + '-' + month + '-' + Date1 + " " +initialEvents[index].to + ":00"
          let mylist = {start: from, end: to, title: title, summary: ""}
      
          calendarInpu1 = [...calendarInpu1,mylist]
      }
        // console.log(calendarInpu1)
        setEvents(calendarInpu1)
        console.log(events)
}

    useEffect(() => {
      getEvents()
    }, [])


  
  const [initialEvents, setInitEvents] = useState([])
  const [events, setEvents] = useState([
    {
      start: '2020-01-01 00:00:00',
      end: '2020-01-01 02:00:00',
      title: 'New Year Party',
      summary: 'xyz Location',
    },    {
      start: '2020-01-01 03:00:00',
      end: '2020-01-01 04:00:00',
      title: 'New Year Party',
      summary: 'xyz Location',
    },    {
      start: '2020-01-01 04:00:00',
      end: '2020-01-01 05:00:00',
      title: 'New Year Party',
      summary: 'xyz Location',
    }, 
  ]);

 
  const eventClicked = (event) => {
    //On Click oC a event showing alert from here
    alert(JSON.stringify(event));
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <EventCalendar
          eventTapped={getEvents}
          //Function on event press
          events={events}
          //passing the Array of event
          width={width}
          //Container width
          size={60}
          //number of date will render before and after initDate
          //(default is 30 will render 30 day before initDate and 29 day after initDate)
          initDate={{dateFormat}}
          //show initial date (default is today)
          scrollToFirst
          //scroll to first event of the day (default true)
        />
      </View>
    </SafeAreaView>
  );
};
export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
