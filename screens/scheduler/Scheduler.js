import React, {useState, useEffect} from 'react'
import { Button, View, Text, StyleSheet, ScrollView, FlatList } from 'react-native';
import SchedularList from './SchedulerList';
import { firebase } from '../../firebase/config';
import ScheduleHeader from './ScheduleHeader';
import ScheduleInput from './ScheduleInput';
import { Container } from '../../styles/AppStyles';

const scheduler = ({navigation}) => {

  const [routines, setRoutines] = useState([])
  const [todos, setTodos] = useState([])
  const [customSchedule, setSchedule] = useState([])
  const [modalVisible, setModalVisible] = useState(false)
  const [todoInputvalue, setTodoInputValue] = useState();
  const [routineTo, setRoutineTo] = useState("select end time");
  const [routineFrom, setRoutineFrom] = useState("select start time");
  const [fromNum, setFromNum] = useState(0)
  const [toNum, setToNum] = useState(0)
  const [ScheduleToBeEdited, setScheduleToBeEdited] = useState(null)

  const firebaseAccess = firebase.firestore()

  const getInit = async () => {
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

    // console.log(sortedInitialRoutines)
    initialRoutines = SortElementsFromNum(initialRoutines);
    initialSchedule = initialRoutines;
    initialApps = GetDaysApps(initialApps);
    initialSchedule = GetCurrentAndFutureEvents(SortElementsFromNum(initialSchedule.concat(initialApps)));

    initialSchedule = SortElementsFromNum(combineTodos(initialSchedule, initialTodos))
    // console.log(initialSchedule)
    for (let index = 0; index < initialSchedule.length; index++) {
        initialSchedule[index].key = index+1
    }
    setSchedule(initialSchedule)
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
    // console.log(timeSort)
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
    console.log(timeTaken);
    for (let index = 0; index < timeTaken.length; index++) {
        for(let i = 0; i < array.length; i++){
            if(timeTaken[index]===array[i].time){
                sortedArray = [...sortedArray, array[i]]
                console.log(sortedArray)
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
    console.log(todo)
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
const handleAddSchedule = (add) => {
    // console.log(add.fromNum)
    // console.log(add.toNum)
    for (let index = 0; index < customSchedule.length; index++) {
        if(((customSchedule[index].fromNum <= add.fromNum) && (add.fromNum <= customSchedule[index].toNum))
        ||((customSchedule[index].fromNum <= add.toNum) && (add.toNum <= customSchedule[index].toNum)))
        {
            alert("Sorry! There is already a task scheduled at that time.")
            setModalVisible(false)
            return;
        }

    }
    for (let index = 0; index < customSchedule.length; index++) {

        if((( add.fromNum <= customSchedule[index].fromNum) && (customSchedule[index].fromNum <= add.toNum))
        ||((add.fromNum <=  customSchedule[index].toNum) && (customSchedule[index].toNum <= add.toNum)))
        {
            alert("Sorry! There is already a task scheduled at that time.")
            setModalVisible(false)
            return;
        }

    }


    const newSchedule = [...customSchedule, add];
    firebaseAccess
        .collection('users')
        .doc(firebase.auth().currentUser.uid)
        .collection('userData')
        .doc('schedule')
        .set(Object.assign({}, newSchedule))

    setSchedule(newSchedule)
    setModalVisible(false)

}

const handleEditSchedule = (editedTodo) => {
    const newTodos = [...customSchedule]
    const debugList = [...customSchedule]
    const todoIndex = customSchedule.findIndex((todo) => todo.key === editedTodo.key)
    debugList.splice(todoIndex,1)
    // console.log(debugList)

    for (let index = 0; index < debugList.length; index++) {
        if(((debugList[index].fromNum <= editedTodo.fromNum) && (editedTodo.fromNum <= debugList[index].toNum))
        ||((debugList[index].fromNum <= editedTodo.toNum) && (editedTodo.toNum <= debugList[index].toNum)))
        {
            alert("Sorry! There is already a task scheduled at that time.")
            setModalVisible(false)
            return;
        }

    }
    for (let index = 0; index < debugList.length; index++) {

        if((( editedTodo.fromNum <= debugList[index].fromNum) && (debugList[index].fromNum <= editedTodo.toNum))
        ||((editedTodo.fromNum <=  debugList[index].toNum) && (debugList[index].toNum <= editedTodo.toNum)))
        {
            alert("Sorry! There is already a task scheduled at that time.")
            setModalVisible(false)
            return;
        }

    }



    newTodos.splice(todoIndex, 1, editedTodo)

    firebaseAccess
        .collection('users')
        .doc(firebase.auth().currentUser.uid)
        .collection('userData')
        .doc('schedule')
        .set(Object.assign({}, newTodos))

    setSchedule(newTodos)
    setScheduleToBeEdited(null)
    setModalVisible(false)
}

useEffect(() => {
    getInit()
  }, [])

  const handleTriggerEdit = (item) => {
    alert(new Date().getHours() + " " + new Date().getMinutes())

    setScheduleToBeEdited(item);
    // setModalVisible(true)
    setTodoInputValue (item.title)
    setRoutineTo((item.to) + "")
    setRoutineFrom((item.from) + "")
    setFromNum(item.fromNum)
    setToNum(item.toNum)
  }
  const deleteSchedule = () => {
      setSchedule([])
      firebaseAccess
      .collection('users')
      .doc(firebase.auth().currentUser.uid)
      .collection('userData')
      .doc('schedule')
      .set({})

  }
  return(
    <>
    <Container>
        <ScheduleHeader
        getInit={getInit}
        deleteSchedule={deleteSchedule}
        />

    <SchedularList
        todos = {customSchedule}
        setTodos={setSchedule}
        handleTriggerEdit = {handleTriggerEdit}
    />

    <ScheduleInput
        modalVisible = {modalVisible}
        setModalVisible = {setModalVisible}
        todoInputvalue = {todoInputvalue}
        setTodoInputValue = {setTodoInputValue}
        handleAddTodo = {handleAddSchedule}
        routineTo = {routineTo}
        setRoutineTo = {setRoutineTo}
        routineFrom = {routineFrom}
        setRoutineFrom = {setRoutineFrom}
        fromNum = {fromNum}
        setFromNum = {setFromNum}
        toNum = {toNum}
        setToNum = {setToNum}
        todoToBeEdited = {ScheduleToBeEdited}
        setTodoToBeEdited = {setScheduleToBeEdited}
        handleEditTodo = {handleEditSchedule}
        todos = {customSchedule}
    />

    </Container>

    </>
  );
}

const styles = StyleSheet.create({
    item:{
        marginTop: 25,
        padding: 30,
        backgroundColor: 'pink',
        fontSize: 24,
        width: 500
    },
    scroll: {
        width: 300,

    }
})
export default scheduler;
