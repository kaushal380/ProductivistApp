import React, {useState, useEffect} from 'react'
import { View, Text, Button } from 'react-native'
//components
import Header from './Header'
import Listitems from './Listitems'
import InputModal from './InputModal'
import todo from './Todo'
import { DrawerContent } from '@react-navigation/drawer'
import {colors} from '../../styles/AppStyles';
import {AntDesign} from "@expo/vector-icons"
import { firebase } from '../../firebase/config'


const Todosub = () => {
    const firebaseAccess = firebase.firestore()

    const getInit = async (loc) => {
        let initialTodos
        let finalTodos = []
        let currentDate = new Date()
        const documentSnapshot = await firebase.firestore()
            .collection('users')
            .doc(firebase.auth().currentUser.uid)
            .collection('userData')
            .doc('todos')
            .get()
            initialTodos = Object.values(Object.seal(documentSnapshot.data()))

        for (let index = 0; index < initialTodos.length; index++) {
            let selectedDate = new Date(initialTodos[index].date)
            const timeleft = selectedDate.getTime() - currentDate.getTime();
            // 8.64e+7 greater than 24 hours
            if(timeleft > -86400000){
                initialTodos[index].timeleft = timeleft;
                if(loc === "init"){
                finalTodos = [...finalTodos,initialTodos[index]]
                } 
            } 
        }
        
    
    if(loc === "init"){
        setTodos(finalTodos);
        alert("some of your tasks might have been deleted as they passed the deadline! click on database icon to retrieve them and make sure to change the date as they will be deleted in 12 hours")
    }
    else {setTodos(initialTodos)}            
    }
    
    useEffect(() => {
        getInit("init")
      }, [])
    
    const [fireBaseTodo, setFireBaseTodo] = useState()
    const [todos, setTodos] = useState([{}])
    const [rankImportance, setRankImportance] = useState()
    const [rankTime, setRankTime]  = useState()
    const [rankDate, setRankDate] = useState()

    

    
    const sortThings = () => {
        let rankImportance = []
        let rankDate = []
        let sortDate = []
        let sortTime = []
        let rankTime = []

        for (let index = 0; index < todos.length; index++) {
            sortDate = todos[index].timeleft;
            sortTime = todos[index].time;
        }
        
        sortDate = sortDate.sort(function(a,b) {return a-b})
        sortTime = sortTime.sort(function(a,b) {return b-a})

        for (let index = 0; index <= 5; index++) {
            for(let i = 0; i < todos.length; i++){
                if(todos[i].importance === index){
                    rankImportance = [...rankImportance,todos[i]]
                }
            }            
        }

        for (let index = 0; index < sortTime.length; index++) {
            for (let index = 0; index < todos.length; index++) {
                const element = array[index];
            }
            
        }

    }

    // clearing all todos
    const handleClearTodos = () => {
        setTodos([]);
        const data1 = {}
        firebaseAccess
            .collection('users')
            .doc(firebase.auth().currentUser.uid)
            .collection('userData')
            .doc('todos')
            .set(data1)
    }

    const [modalVisible, setModalVisible] = useState(false);
    const [todoInputvalue, setTodoInputValue] = useState();
    const [todoImportance, setImportance] = useState();
    const [todoDate, setDate] = useState("select a date");
    const [todoTimeTaken, setTimeTaken] = useState();
    const [todoTimeLeft, settodoTimeLeft] = useState();
    const [sortModalVisible, setSortModal] = useState(false);
 
    const handleAddTodo = (todo) =>{
        const newTodos = [...todos, todo];
        setTodos(newTodos)
        const addTodo = Object.assign({}, newTodos)
        firebaseAccess
            .collection('users')
            .doc(firebase.auth().currentUser.uid)
            .collection('userData')
            .doc('todos')
            .set(addTodo)
        setModalVisible(false)
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
            .doc('todos')
            .set(editTodo)
        setTodoToBeEdited(null)
        setModalVisible(false)
    }

    const [todoToBeEdited, setTodoToBeEdited] = useState(null)
    const handleTriggerEdit = (item) => {
        setTodoToBeEdited(item);
        setModalVisible(true)
        setTodoInputValue(item.title)
        setImportance((item.importance) + "")
        setDate(item.date)
        setTimeTaken((item.time) + "")
    }
    return (
        <>
        <Header 
            handleClearTodos = {handleClearTodos}
            getInit = {getInit}
            />
        <Listitems 
            // displayed = {selectranking}
            todos = {todos}
            setTodos = {setTodos}
            handleTriggerEdit = {handleTriggerEdit}
            
        />
        <InputModal
            modalVisible = {modalVisible}
            setModalVisible = {setModalVisible}
            sortModalVisible = {sortModalVisible}
            setSortModal = {setSortModal}
            todoInputvalue = {todoInputvalue}
            setTodoInputValue = {setTodoInputValue}
            handleAddTodo = {handleAddTodo}
            todoImportance = {todoImportance}
            setImportance = {setImportance}
            todoDate = {todoDate}
            setDate = {setDate}
            todoTimeTaken = {todoTimeTaken}
            setTimeTaken = {setTimeTaken}
            todoTimeLeft = {todoTimeLeft}
            settodoTimeLeft = {settodoTimeLeft}
            todoToBeEdited = {todoToBeEdited}
            setTodoToBeEdited = {setTodoToBeEdited}
            handleEditTodo = {handleEditTodo}
            sortThings = {sortThings}
            todos = {todos}

        />


        </>
    )
}

export default Todosub

