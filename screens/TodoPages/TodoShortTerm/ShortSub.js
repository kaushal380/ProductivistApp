import React, {useState, useEffect} from 'react'
import { View, Text, Button, Alert } from 'react-native'
//components
import Header from './ShortHeader'
import Listitems from './ShortList'
import InputModal from './ShortInput'
import { DrawerContent } from '@react-navigation/drawer'
import {colors} from '../../../styles/AppStyles';
import {AntDesign} from "@expo/vector-icons"
import { firebase } from '../../../firebase/config'


const RoutineSub = () => {
    const firebaseAccess = firebase.firestore()

    const getInit = async () => {
        let initialTodos
        
        const documentSnapshot = await firebase.firestore()
            .collection('users')
            .doc(firebase.auth().currentUser.uid)
            .collection('userData')
            .doc('shortTerm')
            .get()
        
            initialTodos = Object.values(Object.seal(documentSnapshot.data()))
    
            // console.log(initialTodos)
        for (let index = 0; index < initialTodos.length; index++) {
            initialTodos[index].key = index+1;
        }
        // disregard past appointments
        
        setTodos(initialTodos);
            
    }
    
    useEffect(() => {
        getInit()
      }, [])
    
    const [todos, setTodos] = useState([{}])

    
    // clearing all todos
    const handleClearTodos = () => {
        setTodos([]);
        const data1 = {}
        firebaseAccess
            .collection('users')
            .doc(firebase.auth().currentUser.uid)
            .collection('userData')
            .doc('shortTerm')
            .set(data1)
    }

    const [modalVisible, setModalVisible] = useState(false);
    const [todoInputvalue, setTodoInputValue] = useState();
    const [routineTo, setRoutineTo] = useState("select end time");
    const [routineFrom, setRoutineFrom] = useState("select start time");
    const [fromNum, setFromNum] = useState(0)
    const [toNum, setToNum] = useState(0)
    const [shortImportance, setImportance] = useState(0);
    const [shortDate, setDate] = useState("select the day of the appointment")
 
    const handleAddTodo = (todo) =>{
        const newTodos = [...todos, todo];
        setTodos(newTodos)
        const addTodo = Object.assign({}, newTodos)
        firebaseAccess
            .collection('users')
            .doc(firebase.auth().currentUser.uid)
            .collection('userData')
            .doc('shortTerm')
            .set(addTodo)
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

    const handleEditTodo = (editedTodo) =>{
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
            .doc('shortTerm')
            .set(editTodo)
        setTodoToBeEdited(null)
        setModalVisible(false)
    }

    const [todoToBeEdited, setTodoToBeEdited] = useState(null)
    const handleTriggerEdit = (item) => {
        setTodoToBeEdited(item);
        setModalVisible(true)
        setTodoInputValue(item.title)
        setRoutineTo((item.to) + "")
        setRoutineFrom((item.from) + "")
        setFromNum(item.fromNum)
        setToNum(item.toNum)
        setImportance(item.importance)
        setDate(item.date)
    }
    return (
        <>
        <View style = {{height: '100%', width: '100%'}}
        
        >
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
            getInit= {getInit}
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
            shortImportance={shortImportance}
            setImportance= {setImportance}
            shortDate={shortDate}
            setDate={setDate}
            handleEditTodo = {handleEditTodo}
            todos = {todos}

        />
        </View>

        </>
    )
}

export default RoutineSub

