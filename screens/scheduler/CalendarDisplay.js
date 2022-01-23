
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
      
          let from = year + '-' + month + '-' + Date1 + " " +initialEvents[index].from +":00"
          let to = year + '-' + month + '-' + Date1 + " " +initialEvents[index].to + ":00"
          let mylist = {start: from, end: to, title: title, summary: ""}
      
          calendarInpu1 = [...calendarInpu1,mylist]
      }
      
        return calendarInpu1;
}

    useEffect(() => {
      getInit()
    }, [])
  
    const getInit = async () => {
      setInitEvents([])
      let todayDate = new Date()
      let initialTodos = []
      let initialRoutines = []
      let initialApps = []
      let initialSchedule = []
  
      
          const documentSnapshot = await firebase.firestore()
              .collection('users')
              .doc(firebase.auth().currentUser.uid)
              .collection('userData')
              .doc('todos')
              .get()
          
              initialTodos = Object.values(Object.seal(documentSnapshot.data()))
          
  
          const documentSnapshot1 = await firebase.firestore()
              .collection('users')
              .doc(firebase.auth().currentUser.uid)
              .collection('userData')
              .doc('routines')
              .get()
          
              initialRoutines = Object.values(Object.seal(documentSnapshot1.data()))  
  
          const documentSnapshot2 = await firebase.firestore()
              .collection('users')
              .doc(firebase.auth().currentUser.uid)
              .collection('userData')
              .doc('shortTerm')
              .get()
          
              initialApps = Object.values(Object.seal(documentSnapshot2.data()))  
  
     
      initialRoutines = SortElementsFromNum(initialRoutines);
      initialSchedule = initialRoutines;
      initialApps = GetDaysApps(initialApps);    
      initialSchedule = GetCurrentAndFutureEvents(SortElementsFromNum(initialSchedule.concat(initialApps)));
      
      initialSchedule = SortElementsFromNum(combineTodos(initialSchedule, initialTodos))

      for (let index = 0; index < initialSchedule.length; index++) {
          initialSchedule[index].key = index+1 
      }

      let initialEvents = getEvents(initialSchedule)

      setEvents(initialEvents);
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
  
  // get the events starting from current time
  const GetCurrentAndFutureEvents = (array) => {
  
      let date = new Date();
      let time = (date.getHours() * 60) + (date.getMinutes());
      let timeArray = []
      for (let index = 0; index < array.length; index++) {
          if(array[index].toNum > time){
              timeArray = [...timeArray, array[index]];
          }  
      }
  
      return timeArray;
  }
  
  const SortBasedOnTime = (array) => {
      let timeTaken = []
      let sortedArray = []
      array.forEach(element => {
          timeTaken = [...timeTaken, element.time];
      });
  
      timeTaken = timeTaken.sort(function(a,b) {return b-a})
      timeTaken = [...new Set(timeTaken)];
      // console.log(timeTaken);
      for (let index = 0; index < timeTaken.length; index++) {
          for(let i = 0; i < array.length; i++){
              if(timeTaken[index]===array[i].time){
                  sortedArray = [...sortedArray, array[i]]
                  // console.log(sortedArray)
              }
          } 
      }
      return sortedArray;
  }
  
  const combineTodos = (initSchedule, Alltodo) => {
      // alert("hello")
      let date = new Date();
      let Starttime = (date.getHours() * 60) + (date.getMinutes());
      let endTime = 1439; //11:59
      let schedule = initSchedule
      let todo = SortBasedOnTime(GetDaysApps(Alltodo));
      // console.log(todo)
      let finalCombo = []
      let missedList = []
      for (let index = 0; index < todo.length; index++) {
          // console.log(index)
          let start = Starttime;
          for (let i = 0; i < schedule.length; i++) {
              if((start + todo[index].time + 5) <= schedule[i].fromNum){
                  todo[index].fromNum = start + 5; 
                  todo[index].toNum = todo[index].fromNum + todo[index].time;
                  todo[index].from = convertNumToTime(todo[index])[0];
                  todo[index].to = convertNumToTime(todo[index])[1];
                  schedule = [...schedule, todo[index]]
                  schedule = SortElementsFromNum(schedule)
                  // console.log(schedule)
                  break;
              }       
              start = schedule[i].toNum;
              // console.log(i)
              if(i === (schedule.length-1)){
                 // console.log(start)
                  // console.log("last schedule" + i)
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
                      // console.log("adding to missed task")
                      missedList = [...missedList, todo[index]];
                  }
                  break; 
              }
              // console.log(start)  
             // continue;           
          }  
      }
      finalCombo = schedule;
      return finalCombo;
  }
  
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
