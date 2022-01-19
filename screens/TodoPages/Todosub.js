import React, {useState, useEffect} from 'react'
import { View, Text, Button, Alert } from 'react-native'
//components
import Header from './Header'
import Listitems from './Listitems'
import InputModal from './InputModal'
import todo from './Todo'
import { DrawerContent } from '@react-navigation/drawer'
import {colors} from '../../styles/AppStyles';
import {AntDesign} from "@expo/vector-icons"
import { firebase } from '../../firebase/config'
import { Row } from 'native-base'


const Todosub = () => {
    const firebaseAccess = firebase.firestore() 
       
    const sortThings = (array) => {
        let date = new Date()
        let DateArray = []
        let importanceArray = []
        let importanceList = []
        let importanceArraySet = []
        let timeLeftArray = []
        let timeLeftArraySet = []
        let timeLeftList = []
        let timeTakeArray = []
        let timeTakeArraySet = []
        let timeTakenList = []

        array.forEach(element => {
            importanceArray = [...importanceArray, element.importance]
            let selectedDate = new Date(element.date)
            element.timeleft = Math.round(((selectedDate.getTime()-date.getTime())/(1000 * 3600 * 24)));
            // console.log(element.timeleft)
            timeLeftArray = [...timeLeftArray, element.timeleft]
            timeTakeArray = [...timeTakeArray, element.time]
            // console.log(timeLeftArray)
        });
        // console.log("timeLeftArray" + timeLeftArray)
        importanceArray = importanceArray.sort(function(a,b) {return b-a})
        importanceArraySet = [...new Set(importanceArray)];

        timeLeftArray = timeLeftArray.sort(function(a,b) {return a-b})
        timeLeftArraySet = [...new Set(timeLeftArray)];

        timeTakeArray = timeTakeArray.sort(function(a,b) {return b-a})
        timeTakeArraySet = [...new Set(timeTakeArray)];
        // console.log(timeLeftArraySet)
        importanceArraySet.forEach(element => {
            array.forEach(element1 => {
                if(element1.importance === element){
                    importanceList = [...importanceList, element1]
                }
            });
        });

        timeLeftArraySet.forEach(element => {
            array.forEach(element1 => {
                if(element1.timeleft === element){
                    timeLeftList = [...timeLeftList, element1]
                }
            })
        })

        timeTakeArraySet.forEach(element => {
            array.forEach(element1 => {
                if(element1.time === element){
                    timeTakenList = [...timeTakenList, element1]
                }
            })
        })
        
        // 1) importance ranks: importanceList
        // 2) urgency ranks: timeLeftList
        // 3) effor ranks: timeTakenList
        // algorithm below 
        let ObjTitles = []
        let ObjtoElements = []
        for (let index = 0; index < timeLeftList.length; index++) {
            for (let i = 0; i < importanceList.length; i++) {
                if(timeLeftList[index] === importanceList[i]){
                    let MyList = {title: timeLeftList[index].title, value: index+i}
                    ObjTitles = [...ObjTitles, MyList]
                }  
            }
        }
        let valSort = []
        let valSortSet = []
        ObjTitles.forEach(element => {
            valSort = [...valSort, element.value]
        });
        valSort = valSort.sort(function(a,b) {return a-b})
        valSortSet = [...new Set(valSort)]
        let ObjTitleSorted = []
        valSortSet.forEach(element => {
            ObjTitles.forEach(element1 => {
                if(element1.value === element){
                    ObjTitleSorted = [...ObjTitleSorted, element1]
                }
            })
        })
        console.log(ObjTitleSorted)
        ObjTitleSorted.forEach(element => {
            array.forEach(element1 => {
                if(element.title === element1.title){
                    ObjtoElements = [...ObjtoElements, element1]
                }
            });
        });
        let finalList = []
        let rankingList = []

        ObjtoElements.forEach(element => {
            let date = new Date(element.date);
            let currentDate = new Date();
            if((date.getFullYear() === currentDate.getFullYear()) && (date.getMonth() === currentDate.getMonth()) && (date.getDate() === currentDate.getDate())){
                finalList = [...finalList,element]
            }
            else{
                rankingList = [...rankingList, element]
            }
        })

        finalList = finalList.concat(rankingList)
        console.log(finalList)
        return finalList;
    }

    const getInit = async (loc) => {
        // alert("getting init")
        const date =  new Date();
        let initialTodos
        let finalTodos = []
        const documentSnapshot = await firebase.firestore()
            .collection('users')
            .doc(firebase.auth().currentUser.uid)
            .collection('userData')
            .doc('todos')
            .get()
            initialTodos = Object.values(Object.seal(documentSnapshot.data()))



        initialTodos.forEach(element => {
            let selectedDate = new Date(element.date);
            let dateCheck = true;

            if(selectedDate.getFullYear() > date.getFullYear()){
                dateCheck = true;
                
            }
            else if (selectedDate.getFullYear() === date.getFullYear()){
                if(selectedDate.getMonth() > date.getMonth()){
                    dateCheck = true;
                    
                }
                else if(selectedDate.getMonth() === date.getMonth()){
                    if(selectedDate.getDate() >= date.getDate()){
                        dateCheck = true;     
                    }
                    else{ dateCheck = false;
                    }
                }
                else { dateCheck = false;
                }
            }
            else{
                dateCheck = false;
            }

            if(dateCheck && (element.status === "pending")){
                finalTodos = [...finalTodos, element]
            }
        });
    
    finalTodos = sortThings(finalTodos) 
    for (let index = 0; index < finalTodos.length; index++) {
        finalTodos[index].key = index+1;
        // finalTodos[index].timeleft = Math.round(finalTodos[index].timeleft)
    }
    setTodos(finalTodos)
           
    }
    
    useEffect(() => {
        getInit("init")
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
            .doc('todos')
            .set(data1)
    }

    const [modalVisible, setModalVisible] = useState(false);
    const [todoInputvalue, setTodoInputValue] = useState();
    const [todoImportance, setImportance] = useState(1);
    const [todoDate, setDate] = useState("select a date");
    const [todoTimeTaken, setTimeTaken] = useState(0);
    const [todoTimeLeft, settodoTimeLeft] = useState();
    const [sortModalVisible, setSortModal] = useState(false);
 
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
    const handleAddTodo = (todo) =>{
        const newTodos = [...todos, todo];
        let newSortedTodos = sortThings(newTodos)
        setTodos(newSortedTodos)
        const addTodo = Object.assign({}, newSortedTodos)
        firebaseAccess
            .collection('users')
            .doc(firebase.auth().currentUser.uid)
            .collection('userData')
            .doc('todos')
            .set(addTodo)
        setModalVisible(false)
    }

    const handleEditTodo = (editedTodo) =>{
        const newTodos = [...todos]
        const todoIndex = todos.findIndex((todo) => todo.key === editedTodo.key)
        newTodos.splice(todoIndex, 1, editedTodo)
        let newSortedTodos = sortThings(newTodos)
        setTodos(newSortedTodos)
        const editTodo = Object.assign({}, newSortedTodos)
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
        setImportance((item.importance))
        setDate(item.date)
        setTimeTaken((item.time))
    }
    return (
        <>
        <Header 
            handleClearTodos = {createDeleteAlert}
            getInit = {getInit}
            />
        <Listitems 
            // displayed = {selectranking}
            todos = {todos}
            setTodos = {setTodos}
            handleTriggerEdit = {handleTriggerEdit}
            editStatus={handleEditTodo}
            
        />

        {/* <AntDesign style = {{marginBottom: 20, marginTop:0}} name= 'pluscircle' size={25} color={'white'}/> */}
        {/* <View style = {{flexDirection: 'row', justifyContent: 'flex-end'}}>
            <AntDesign style = {{marginBottom: 5, marginTop: -70}} name= 'pluscircle' size={55} color={'white'}/>
        </View> */}
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

