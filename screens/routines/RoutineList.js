import React, {useState} from 'react'

// stylecomponenst
import {
    ListView,
    RoutineText,
    RoutineTime,
    HiddenButton,
    SwipedTodoText,
    colors,
    ListViewHidden,
    TodoDate
} from "../../styles/AppStyles";

import { SwipeListView } from 'react-native-swipe-list-view'
import {Entypo} from "@expo/vector-icons"
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
            .doc('routines')
            .set(deleteTodos)
    }
    return (
        <>
        {todos.length === 0 && <RoutineText>You have not added any routines</RoutineText>}
        {todos.length !== 0 &&<SwipeListView
            data = {todos}
            renderItem = {(data) => {
                const RowText = data.item.key === swipedRow? SwipedTodoText: RoutineText;
            return(
                <ListView
                    underlayColor = {colors.primary}//
                    onPress = {() => {
                        handleTriggerEdit(data.item)
                    }}
                >
                    <>
                        <RowText>{data.item.title}</RowText>
                        <RoutineTime>{data.item.fromDisplay} - {data.item.toDisplay}</RoutineTime>
                        {/* <TodoDate>{data.item.fromNum} - {data.item.toNum}</TodoDate> */}
                        <TodoDate>importance: {data.item.importance}</TodoDate>
                        {/* <TodoDate>key: {data.item.key}</TodoDate> */}
                        {/* <TodoDate>type: {data.item.type}</TodoDate> */}
                        {/* <TodoDate>status: {data.item.status}</TodoDate> */}

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
