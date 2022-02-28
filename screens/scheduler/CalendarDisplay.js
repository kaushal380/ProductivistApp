
import React, { useState, useEffect } from 'react';

import { SafeAreaView, StyleSheet, View, Dimensions, Alert } from 'react-native';
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

  const getEvents = (initSchedule) => {
    
    
        let initialEvents = initSchedule;
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
          let type = initialEvents[index].type
          let from = year + '-' + month + '-' + Date1 + " " +initialEvents[index].from +":00"
          let to = year + '-' + month + '-' + Date1 + " " +initialEvents[index].to + ":00"
          let mylist = {start: from, end: to, title: title, summary: "", type: type}
      
          calendarInpu1 = [...calendarInpu1,mylist]
      }
      
        return calendarInpu1;
}

    useEffect(() => {
      getInit()
    }, [])

    // this function is run everytime the user touches the screen or the first time they load the app
    const getInit = async () => {
      setInitEvents([])
      let todayDate = new Date()
      let initialTodos = []
      let initialRoutines = []
      let initialApps = []
      let initialSchedule = []
  
        // fetching todos from firebase
          const documentSnapshot = await firebase.firestore()
              .collection('users')
              .doc(firebase.auth().currentUser.uid)
              .collection('userData')
              .doc('todos')
              .get()
          
              initialTodos = Object.values(Object.seal(documentSnapshot.data()))
          
        // fetching routines 
          const documentSnapshot1 = await firebase.firestore()
              .collection('users')
              .doc(firebase.auth().currentUser.uid)
              .collection('userData')
              .doc('routines')
              .get()
          
              initialRoutines = Object.values(Object.seal(documentSnapshot1.data())) 

        // fetching appointments
          const documentSnapshot2 = await firebase.firestore()
              .collection('users')
              .doc(firebase.auth().currentUser.uid)
              .collection('userData')
              .doc('shortTerm')
              .get()
          
              initialApps = Object.values(Object.seal(documentSnapshot2.data()))  

      /* these set methods are called to set the raw data to it's respective lists */
      setTasks(initialTodos) 
      setRoutines(initialRoutines)
      setApps(initialApps)

      initialRoutines = SortElementsFromNum(initialRoutines); // sorts the elements from morning to night based on start time
      initialSchedule = initialRoutines;
      initialApps = GetDaysApps(initialApps); // get the appointments of the current day
      initialSchedule = initialSchedule.concat(initialApps) // adding routines and appointments to the same list
      let futureEvents = GetCurrentAndFutureEvents(SortElementsFromNum(initialSchedule))[0]; // getting the current and future events
      
      let pastEvents = GetCurrentAndFutureEvents(SortElementsFromNum(initialSchedule))[1]; // getting the past events
      
      // the schedule is set to current and future events
      initialSchedule = futureEvents
      // get the items that are not marked done, so basically the ones that are pending
      initialSchedule = getPendingItems(initialSchedule) // this method is only ran on current and future events
      initialTodos = getPendingItems(initialTodos)

      // combines the schedule and todos into one list and sorts it based on time again
      initialSchedule = SortElementsFromNum(combineTodos(initialSchedule, initialTodos, pastEvents))
     
      // reassignign the indexes to the items, so every element is unique
      for (let index = 0; index < initialSchedule.length; index++) {
          initialSchedule[index].key = index+1 
      }
      
      // getEvents method converts this final list into object that can be displayed by the calendar UI
      let initialEvents = getEvents(initialSchedule)
      
      // finally setting the events which is used by the calendar
      setEvents(initialEvents);
  }
  
  const getPendingItems = (list) => {
    let finalList = []
    for (let index = 0; index < list.length; index++) {
      if(list[index].status !== "done"){
        finalList = [...finalList,list[index]]
      }
    }
 
    return finalList;
  }
  // sorts the elements from time
  const SortElementsFromNum = (array) => {
      let timeSort = []
      let sortedArray = []
      for (let index = 0; index < array.length; index++) {
          timeSort = [...timeSort,array[index].fromNum] 
      }
  
      timeSort = timeSort.sort(function(a,b) {return a-b})
      timeSort = [...new Set(timeSort)];
      
      for (let index = 0; index < timeSort.length; index++) {
          for(let i = 0; i < array.length; i++){
              if(array[i].fromNum === timeSort[index]){
                  sortedArray = [...sortedArray,array[i]]
              }
          }  
      }
  
      return sortedArray;
  }
  // get events of current date
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
  
  // get the events starting from current time with index 0
  // get the past events from index 1
  const GetCurrentAndFutureEvents = (array) => {
  
      let date = new Date();
      let time = (date.getHours() * 60) + (date.getMinutes());
      let timeArray = []
      let pastArray = []
      for (let index = 0; index < array.length; index++) {
          if(array[index].toNum > time){
              timeArray = [...timeArray, array[index]];
          }
          else {
            pastArray = [...pastArray, array[index]]
          }  
      }
      let finalArray = [timeArray, pastArray]
      return finalArray;
  }
  
  // this method is used to sort the elements from highest time taken to lowest 
  const SortBasedOnTime = (array) => {
      let timeTaken = []
      let sortedArray = []
      array.forEach(element => {
          timeTaken = [...timeTaken, element.time];
      });
  
      timeTaken = timeTaken.sort(function(a,b) {return b-a})
      timeTaken = [...new Set(timeTaken)];
     
      for (let index = 0; index < timeTaken.length; index++) {
          for(let i = 0; i < array.length; i++){
              if(timeTaken[index]===array[i].time){
                  sortedArray = [...sortedArray, array[i]]
               
              }
          } 
      }
      return sortedArray;
  }
  
  const combineTodos = (initSchedule, Alltodo, pastArray) => {
    /**
     so the way it works:
     1. we have 3 @param initSchedule, Alltodo, pastArray

     2. if the initSchedule is null, it is populated with the first item on todo
     3. based on the schedule, it keeps adding the tasks to the next available spot
     4. if all the tasks cannot be added, they are added to the missed lists
     5. combines the final schedule with past elements
     6. @returns a final combined list
     */
      
      let date = new Date();
      let Starttime = (date.getHours() * 60) + (date.getMinutes()); // current time in minutes
      let endTime = 1439; //11:59
      let schedule = initSchedule
      //let todo = SortBasedOnTime(GetDaysApps(Alltodo)); // gets today's tasks that are due and sorts them
      let todo = Alltodo
      
      let finalCombo = []
      let pastEvents = pastArray
      let missedList = []
      // layer one algorithm: combines tasks of current date
      for (let index = 0; index < todo.length; index++) {
          
          let start = Starttime;
          if(schedule.length === 0){
            todo[index].fromNum = start + 5; 
            todo[index].toNum = todo[index].fromNum + todo[index].time;
            todo[index].from = convertNumToTime(todo[index])[0];
            todo[index].to = convertNumToTime(todo[index])[1];
            schedule = [...schedule, todo[index]]
            continue;
          }
          for (let i = 0; i < schedule.length; i++) {
              if((start + todo[index].time + 5) <= schedule[i].fromNum){
                  todo[index].fromNum = start + 5; 
                  todo[index].toNum = todo[index].fromNum + todo[index].time;
                  todo[index].from = convertNumToTime(todo[index])[0];
                  todo[index].to = convertNumToTime(todo[index])[1];
                  schedule = [...schedule, todo[index]]
                  schedule = SortElementsFromNum(schedule)
                  
                  break;
              }       
              start = schedule[i].toNum;
              
              if(i === (schedule.length-1)){
        
                  let end = start+5 + todo[index].time;
                  if(end <= endTime){
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
      
      finalCombo = schedule.concat(pastEvents);
      
      return finalCombo;
  }
  // convert the minutes to hours and time format
  const convertNumToTime = (element) => {
      let FromHours = Math.trunc((element.fromNum/60));
      let FromMins = element.fromNum - (FromHours * 60);
      if(FromHours < 10){
          FromHours = "0" + FromHours;
      }
      else{
          FromHours = "" + FromHours;
      }
      if(FromMins < 10){
          FromMins = "0" + FromMins;
      }
      else{
          FromMins = "" + FromMins;
      }
      let ToHours = Math.trunc((element.toNum/60));
      let Tomins = element.toNum - (ToHours * 60);
      if(ToHours < 10){
          ToHours = "0" + ToHours;
      }
      else{
          ToHours = "" + ToHours;
      }
      if(Tomins < 10){
          Tomins = "0" + Tomins;
      }
      else{
          Tomins = "" + Tomins;
      }
      let from = FromHours+":"+FromMins;
      let to = ToHours+":"+Tomins;
      let structure = [from, to];
      return structure;
  }  

  
  const [initialEvents, setInitEvents] = useState([])
  const [tasks, setTasks] = useState()
  const [routines, setRoutines] = useState()
  const [apps, setApps] = useState()

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

  const markStatusDone = (event) => {
    const firebaseAccess = firebase.firestore()
    let accessEvents = []
    let doc = ""
    if(event.type === "apps"){
      accessEvents = apps
      doc = "shortTerm"
    }
    else if(event.type === "routine"){
      accessEvents = routines
      doc = "routines"
    }
    else{
      accessEvents = tasks
      doc = "todos"
    }

    for (let index = 0; index < accessEvents.length; index++) {
      if(accessEvents[index].title === event.title){
        accessEvents[index].status = "done"
      }
    }
    const resetStatus = Object.assign({}, accessEvents)
    firebaseAccess
        .collection('users')
        .doc(firebase.auth().currentUser.uid)
        .collection('userData')
        .doc(doc)
        .set(resetStatus)

    getInit()
  }

  const eventClicked = (event) => {
    //On Click oC a event showing alert from here
    Alert.alert(
      event.title,
      event.type,
      [
          {
              text: "cancel",
              onPress: () => {return},
              style: 'cancel'
          },
          {text: "mark as done", onPress: () => {markStatusDone(event)}} 
      ]
  );
  }


  return (
    <SafeAreaView style={styles.container} onTouchStart={getInit}>
      <View style={styles.container}>
        <EventCalendar
          eventTapped={(event) => eventClicked(event)}
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
