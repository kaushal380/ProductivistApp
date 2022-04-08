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
} from '../../../styles/AppStyles';

import { SwipeListView } from 'react-native-swipe-list-view'
import {Entypo} from "@expo/vector-icons"
import todo from './Todo';
import { firebase } from '../../../firebase/config'
import { View } from 'react-native';

const Listitems = ({todos, setTodos, handleTriggerEdit, editStatus}) => {
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

    const UpdateStatus = (rowMap, rowkey) => {
        // alert(rowkey.title)
        let status = "done"
        if(rowkey.status === "done"){
            status = "pending"
        }
        editStatus({
            title: rowkey.title,
            date: rowkey.date,
            time: rowkey.time,
            timeleft: rowkey.timeleft,
            importance: rowkey.importance,
            status: status,
            key: rowkey.key,
            type: 'todo',
            toNum: 0,
            fromNum: 0,
            from: '00:00',
            to: '00:00'
        })
    }

    const checkColor = (rowMap, rowKey) => {
        if(rowKey.status === "done"){
            return "green";
        }
        if(rowKey.status === "pending"){
            return colors.secondary;
        }
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
                         <TodoDate>Duration: {data.item.time} Mins</TodoDate>
                        {/* <TodoDate>timeleft: {data.item.timeleft}</TodoDate> */}
                        <TodoDate>importance: {data.item.importance}</TodoDate>
                        {/* <TodoDate>key: {data.item.key}</TodoDate>  */}
                        {/*<TodoDate>status: {data.item.status}</TodoDate>*/}
                        {/* <TodoDate>type: {data.item.type}</TodoDate> */}
                        {/* <TodoDate>{data.item.fromNum} - {data.item.toNum}</TodoDate> */}
                        {/* <TodoDate>{data.item.from} - {data.item.to}</TodoDate> */}
                    </>
                </ListView>
            )
            }}
            renderHiddenItem={(data, rowMap) => {
              return(
                <View
                    style = {{backgroundColor: 'black', height: 100, justifyContent: 'center', borderRadius: 10}}
                >
                    <View style = {{flexDirection: 'row', justifyContent: 'flex-start',}}>

                    <Entypo
                        style = {{marginLeft: 20, marginRight: 25}}
                        name = "trash"
                        size = {35}
                        color = {colors.secondary}
                        onPress = {() => handleDeleteTodo(rowMap, data.item.key)}
                    />


                    <Entypo
                        style = {{marginRight: 30}}
                        name = 'check'
                        size = {35}
                        color = {checkColor(rowMap, data.item)}
                        onPress = {() => UpdateStatus(rowMap, data.item)}
                    />

                    </View>
                </View>
              )
            }}
            leftOpenValue={140}
            previewRowKey = {'1'}
            previewOpenValue = {100}
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
