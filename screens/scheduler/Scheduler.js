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
    let currentTime
    let todayDate = new Date()
    let timeCheck = false;
    let initialTodos = []
    let initialRoutines = []
    let initialSchedule = []
    let sortedInitialRoutines = []
    let finalScheduleFromRT = []
    let timeSort = []
    
    const docSnap = await firebase.firestore()
        .collection('users')
        .doc(firebase.auth().currentUser.uid)
        .collection('userData')
        .doc('schedule') 
        .get()

        initialSchedule = Object.values(Object.seal(docSnap.data()))
        
        finalScheduleFromRT = initialSchedule

    const docSnap1 = await firebase.firestore()
        .collection('users')
        .doc(firebase.auth().currentUser.uid)
        .collection('userData')
        .doc('currentTime')
        .get()
    
        currentTime = new Date(Object.values(Object.seal(docSnap1.data()))[0])

    if(currentTime.getFullYear() != todayDate.getFullYear()){
        timeCheck = true;
    }
    else{
        if(currentTime.getMonth() != todayDate.getMonth()){
            timeCheck = true
        }
        else{
            if(currentTime.getDate() != todayDate.getDate()){
                timeCheck = true
            }
        }
    }
    
    if((initialSchedule.length === 0) || timeCheck){
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

            finalScheduleFromRT = initialRoutines
            const SetSchedule = Object.assign({}, finalScheduleFromRT)
            firebaseAccess
                .collection('users')
                .doc(firebase.auth().currentUser.uid)
                .collection('userData')
                .doc('schedule') 
                .set(SetSchedule)
            
            firebaseAccess
                .collection('users')
                .doc(firebase.auth().currentUser.uid)
                .collection('userData')
                .doc('currentTime')
                .set(Object.assign({}, [todayDate.toDateString()]))
    }

    for (let index = 0; index < finalScheduleFromRT.length; index++) {
        finalScheduleFromRT[index].key = index+1 
    }
    //  sorting routines algorithm
    for (let index = 0; index < finalScheduleFromRT.length; index++) {
        timeSort = [...timeSort,finalScheduleFromRT[index].fromNum] 
    }

    timeSort = timeSort.sort(function(a,b) {return a-b})
    timeSort = [...new Set(timeSort)];
    // console.log(timeSort)
    for (let index = 0; index < timeSort.length; index++) {
        for(let i = 0; i < finalScheduleFromRT.length; i++){
            if(finalScheduleFromRT[i].fromNum === timeSort[index]){
                sortedInitialRoutines = [...sortedInitialRoutines,finalScheduleFromRT[i]]
            }
        }  
    }
    finalScheduleFromRT = sortedInitialRoutines
    // console.log(sortedInitialRoutines)
    for (let index = 0; index < finalScheduleFromRT.length; index++) {
        finalScheduleFromRT[index].key = index+1 
    }
    setSchedule(finalScheduleFromRT)
}   

const handleAddSchedule = (add) => {
    // console.log(add.fromNum)
    // console.log(add.toNum)
    for (let index = 0; index < customSchedule.length; index++) {
        if(((customSchedule[index].fromNum <= add.fromNum) && (add.fromNum <= customSchedule[index].toNum))
        ||((customSchedule[index].fromNum <= add.toNum) && (add.toNum <= customSchedule[index].toNum)))
        {
            alert("sorry! there is already a task scheduled at that time")
            setModalVisible(false)
            return;
        }
        
    }
    for (let index = 0; index < customSchedule.length; index++) {

        if((( add.fromNum <= customSchedule[index].fromNum) && (customSchedule[index].fromNum <= add.toNum))
        ||((add.fromNum <=  customSchedule[index].toNum) && (customSchedule[index].toNum <= add.toNum)))
        {
            alert("sorry! there is already a task scheduled at that time")
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
            alert("sorry! there is already a task scheduled at that time")
            setModalVisible(false)
            return;
        }
        
    }
    for (let index = 0; index < debugList.length; index++) {

        if((( editedTodo.fromNum <= debugList[index].fromNum) && (debugList[index].fromNum <= editedTodo.toNum))
        ||((editedTodo.fromNum <=  debugList[index].toNum) && (debugList[index].toNum <= editedTodo.toNum)))
        {
            alert("sorry! there is already a task scheduled at that time")
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
    setScheduleToBeEdited(item);
    setModalVisible(true)
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