import React, {useState} from 'react'

// stylecomponenst
import {
    ListView,
    TodoText,
    TodoDate,
    HiddenButton,
    SwipedTodoText,
    colors,
    ListViewHidden
} from "../../styles/AppStyles";

import { SwipeListView } from 'react-native-swipe-list-view'
import {Entypo} from "@expo/vector-icons"
import todo from './Todo';
import { firebase } from '../../firebase/config'

const Listitems = ({todos, setTodos, handleTriggerEdit}) => {
    const firebaseAccess = firebase.firestore()

    const [swipedRow, setSwipedRow] = useState(null)
    const handleDeleteTodo = (rowMap, rowkey) => {
        const newTodos = [...todos]
        const todoIndex = todos.findIndex((todo) => todo.key === rowkey);
        newTodos.splice(todoIndex, 1);
        setTodos(newTodos);
        const deleteTodos = Object.assign({}, newTodos)
        
        firebaseAccess
            .collection('users')
            .doc(firebase.auth().currentUser.uid)
            .collection('userData')
            .doc('todos')
            .set(deleteTodos)
    }
    return (
        <>
        {todos.length == 0 && <TodoText>You have no todos today</TodoText>}
        {todos.length != 0 &&<SwipeListView 
            data = {todos}
            
            renderItem = {(data) => {
                const RowText = data.item.key == swipedRow? SwipedTodoText: TodoText;
            return(
                <ListView
                    underlayColor = {colors.primary}
                    onPress = {() => {
                        handleTriggerEdit(data.item)
                    }}
                >
                    <>
                        <RowText>{data.item.title}</RowText>
                        <TodoDate>{data.item.date}</TodoDate>
                        <TodoDate>time: {data.item.time}</TodoDate>
                        <TodoDate>timeleft: {data.item.timeleft}</TodoDate>
                        <TodoDate>importance: {data.item.importance}</TodoDate>
                        <TodoDate>key: {data.item.key}</TodoDate> 
                    </>
                </ListView>
            )
            }}
            renderHiddenItem={(data, rowMap) => {
              return(  
                <ListViewHidden>
                    <HiddenButton
                        onPress = {() => handleDeleteTodo(rowMap, data.item.key)}
                    >
                        <Entypo name = "trash" size = {25} color = {colors.secondary}/>
                    </HiddenButton>

                </ListViewHidden>
              )
            }}
            leftOpenValue={70}
            previewRowKey = {'1'}
            previewOpenValue = {70}
            previewOpenDelay = {3000}
            disableLeftSwipe = {true}
            showsVerticalScrollIndicator = {false}
            style = {{
                flex: 1, paddingBottom: 30, marginBottom: 40
            }}
            onRowOpen = {(rowkey) =>{
                setSwipedRow(rowkey)
            }}
            onRowClose = {() => {
                setSwipedRow(null)
            }}
        />}
        </>

    )
        
}

export default Listitems
