import React, {useState, useEffect} from 'react'
import { View, Text, Button, Alert } from 'react-native'
import { Slider } from 'react-native-elements'
//components
import Header from './RoutineHeader'
import Listitems from './RoutineList'
import InputModal from './RoutineInput'
import { DrawerContent } from '@react-navigation/drawer'
import {colors} from '../../styles/AppStyles';
import {AntDesign} from "@expo/vector-icons"
import { firebase } from '../../firebase/config'
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });

const RoutineSub = () => {
    const firebaseAccess = firebase.firestore()
    let date = new Date()
    const getInit = async () => {
        let initialTodos
        const documentSnapshot = await firebase.firestore()
            .collection('users')
            .doc(firebase.auth().currentUser.uid)
            .collection('userData')
            .doc('routines')
            .get()
        
            initialTodos = Object.values(Object.seal(documentSnapshot.data()))
    
            // console.log(initialTodos)
            setTodos(initialTodos);
            
    }
    
    useEffect(() => {
        getInit()
        
      }, [])
    
    const [todos, setTodos] = useState([{}])

    async function schedulePushNotification(list) {
        alert("scheduled!")
        let hours = new Date().getHours();
        let min = new Date().getMinutes();
        let secs = new Date().getSeconds();
        let seconds = (((hours*60)+min) * 60)+secs;
        let secondsOfRoutines = (list.fromNum - 5) * 60
        let title = list.title;
        let triggerSeconds = secondsOfRoutines - seconds
        await Notifications.scheduleNotificationAsync({
          content: {
            title: title,//"You've got routines! 📬",
            body: 'there is a routine due!',
            data: { data: 'goes here' },
          },
          trigger: {seconds: triggerSeconds},
        });
      }

      async function scheduleEditedNotification(list) {
        let hours = new Date().getHours();
        let min = new Date().getMinutes();
        let secs = new Date().getSeconds();
        let seconds = (((hours*60)+min) * 60)+secs;
        let secondsOfRoutines = (list.fromNum - 5) * 60
        let title = list.title;
        let triggerSeconds = secondsOfRoutines - seconds

          alert(list.title)
          await Notifications.scheduleNotificationAsync({
              content: {
                  title: list.title,
                  body: 'there is a routine due!',
                  data: {data: 'goes here'},
              },
              trigger: {seconds: triggerSeconds},
          });
      }
    
    // clearing all todos
    const handleClearTodos = () => {
        setTodos([]);
        const data1 = {}
        firebaseAccess
            .collection('users')
            .doc(firebase.auth().currentUser.uid)
            .collection('userData')
            .doc('routines')
            .set(data1)
    }

    const [modalVisible, setModalVisible] = useState(false);
    const [todoInputvalue, setTodoInputValue] = useState();
    const [routineTo, setRoutineTo] = useState("select end time");
    const [routineFrom, setRoutineFrom] = useState("select start time");
    const [fromNum, setFromNum] = useState(0)
    const [toNum, setToNum] = useState(0)
    const [routineImportance, setImportance] = useState(1);
 
    const handleAddTodo = (todo) =>{
        schedulePushNotification(todo)
        const newTodos = [...todos, todo];
        setTodos(newTodos)
        const addTodo = Object.assign({}, newTodos)
        firebaseAccess
            .collection('users')
            .doc(firebase.auth().currentUser.uid)
            .collection('userData')
            .doc('routines')
            .set(addTodo)
        setModalVisible(false)
    }

    const handleEditTodo = (editedTodo) =>{
        scheduleEditedNotification(editedTodo)
        console.log(editedTodo)
        const newTodos = [...todos]
        const todoIndex = todos.findIndex((todo) => todo.key === editedTodo.key)
        newTodos.splice(todoIndex, 1, editedTodo)
        setTodos(newTodos)
        const editTodo = Object.assign({}, newTodos)
        firebaseAccess
            .collection('users')
            .doc(firebase.auth().currentUser.uid)
            .collection('userData')
            .doc('routines')
            .set(editTodo)
        setTodoToBeEdited(null)
        setModalVisible(false)
    }

    const createDeleteAlert = () => {
        Alert.alert(
            "Delete Alert",
            "Are you sure you want to delete all the tasks?",
            [
                {
                    text: "cancel",
                    onPress: () => {return},
                    style: 'cancel'
                },
                {text: "yes", onPress: () => {handleClearTodos()}} 
            ]
        );
    }

    const [todoToBeEdited, setTodoToBeEdited] = useState(null)
    const handleTriggerEdit = (item) => {
        setTodoToBeEdited(item);
        setModalVisible(true)
        setTodoInputValue(item.title)
        setRoutineTo((item.to) + "")
        setRoutineFrom((item.from) + "")
        setFromNum(item.fromNum)
        setImportance(item.importance)
        setToNum(item.toNum)
    }
    return (
        <>
        <Header 
            handleClearTodos = {createDeleteAlert}
            getInit = {getInit}
            />
        <Listitems 
            todos = {todos}
            setTodos = {setTodos}
            handleTriggerEdit = {handleTriggerEdit}
            
        />
        <InputModal
            modalVisible = {modalVisible}
            setModalVisible = {setModalVisible}
            todoInputvalue = {todoInputvalue}
            setTodoInputValue = {setTodoInputValue}
            handleAddTodo = {handleAddTodo}
            todoToBeEdited = {todoToBeEdited}
            setTodoToBeEdited = {setTodoToBeEdited}
            routineTo = {routineTo}
            setRoutineTo = {setRoutineTo}
            routineFrom = {routineFrom}
            setRoutineFrom = {setRoutineFrom}
            fromNum={fromNum}
            setFromNum={setFromNum}
            toNum={toNum}
            setToNum={setToNum}
            routineImportance={routineImportance}
            setImportance= {setImportance}
            handleEditTodo = {handleEditTodo}
            todos = {todos}

        />


        </>
    )
}

export default RoutineSub

