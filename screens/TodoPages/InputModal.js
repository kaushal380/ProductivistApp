import React, {useRef, useState} from 'react'
import { TextInput, View, Text, Modal, Alert, KeyboardAvoidingView, StyleSheet, TouchableOpacity, Button } from 'react-native'
import {
    ModalButton,
    ModalContainer,
    ModalView,
    StyledInput,
    StyledInput_imp,
    ModalAction,
    ModalActionGroup,
    TextRowStyle,
    ModalIcon,
    HeaderTitle,
    colors,
    StyledInput_Date,
    ModalLeftview,
    HeaderButton,
    HeaderView,
    ModalImageView

} from '../../styles/AppStyles'


import {AntDesign, Entypo} from "@expo/vector-icons"
import DatePicker from 'react-native-date-picker'
import { TapGestureHandler } from 'react-native-gesture-handler';
import DateTimePicker from '@react-native-community/datetimepicker';
import DateTimePickerModal from 'react-native-modal-datetime-picker'
import { Slider } from 'react-native-elements'
import { color } from 'react-native-reanimated'

const InputModal = ({
    modalVisible, 
    setModalVisible,
    sortModalVisible,
    setSortModal, 
    todoInputvalue, 
    setTodoInputValue, 
    handleAddTodo, 
    todoImportance, 
    setImportance, 
    todoDate,
    setDate,
    todoTimeTaken,
    setTimeTaken,
    todoTimeLeft,
    settodoTimeLeft,
    todoToBeEdited, 
    setTodoToBeEdited, 
    handleEditTodo,
    sortThings,
    todos}) => {

    const handleCloseModal = () => {
        setModalVisible(false);
        setTodoInputValue("")
        setImportance(0)
        setDate("select a date")
        setTimeTaken(0)
        setTodoToBeEdited(null);
    }


    const sortModalClose = () => {
        setSortModal(false);
    }

    const newTodos = todos;
    const [isDatePickerVisible, setisDatePickerVisible] = useState(false)
    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate
        console.log(currentDate)
        setisDatePickerVisible(false)
        // console.log(currentDate)
    }
    const handleConfirm = ( selectedDate) => {
        setisDatePickerVisible(false)
        const selectDate = new Date(selectedDate)
        const currentDate = new Date()
        let timeleft = selectDate.getTime() - currentDate.getTime();
        let daysLeft = Math.round(timeleft/ ((1000 * 3600 * 24)));

        // alert("timeleft: " + timeleft)
        if(selectedDate.getFullYear() > currentDate.getFullYear()){
            setDate(selectDate.toDateString())
            settodoTimeLeft(daysLeft)
            
            
        }
        else if (selectedDate.getFullYear() === currentDate.getFullYear()){
            if(selectDate.getMonth() > currentDate.getMonth()){
                setDate(selectDate.toDateString())
                settodoTimeLeft(daysLeft)
                
            }
            else if(selectDate.getMonth() === currentDate.getMonth()){
                if(selectDate.getDate() >= currentDate.getDate()){
                    setDate(selectDate.toDateString())
                    settodoTimeLeft(daysLeft)
                    
                }
                // else if(selectDate.getDate() === currentDate.getDate()){
                //     alert("if your task is due today, add it directly to your schedule!")
                //     setDate("select a date")
                // }
                else{
                    alert("check your date! you cannot be in the past")
                    setDate("select a date")
                }
            }
            else {
                alert("check your month! you cannot be in the past")
                setDate("select a date")
            }
        }
        else{
        alert("check your year! you cannot be in the past")
        setDate("select a date")

        }


    }

    const hideDatePicker = () => {
        setisDatePickerVisible(false)
    }
    const handleSubmit = () => {
        let key = 1;
        if (!todoToBeEdited) {
            if(todoInputvalue + "" === ""){
                alert("please enter the task")
                return;
            }
            if(isNaN(parseInt(todoTimeTaken)) || parseInt(todoTimeTaken) < 0){
                alert("enter a valid time")
                return;
            }
            if( isNaN(parseInt(todoImportance))  || parseInt(todoImportance) > 10){
                alert("importance should be ranked between 1 to 10")
                return;
            }
            if(todoDate === "select a date"){
                alert("please select the due date")
                return;
            }
            try {
                key = newTodos[newTodos.length - 1].key + 1
            } catch (error) {
                console.log("erroed")
                key = 1
            }            
            handleAddTodo({
                title: todoInputvalue,
                date: todoDate,
                time: parseInt(todoTimeTaken),
                timeleft: todoTimeLeft,
                importance: todoImportance,
                status: 'pending',
                key: key
            })
            setTodoInputValue("")
            setImportance(1)
            setDate("select a date")
            setTimeTaken(0)
        } else {

            if(todoInputvalue + "" === ""){
                alert("please enter the task")
                return;
            }
            if(isNaN(parseInt(todoTimeTaken)) || parseInt(todoTimeTaken) < 0){
                alert("enter a valid time")
                return;
            }
            if(isNaN(parseInt(todoImportance))  || parseInt(todoImportance) > 10){
                alert("importance should be ranked between 1 to 5")
                return;
            }
            if(todoDate === "select a date"){
                alert("please select the due date")
                return;
            }
            handleEditTodo({
                title: todoInputvalue,
                date: todoDate,
                time: parseInt(todoTimeTaken),
                timeleft: todoTimeLeft,
                importance: todoImportance,
                status: 'pending',
                key: todoToBeEdited.key
            })
            setTodoInputValue("")
            setImportance(1)
            setDate("select a date")
            setTimeTaken(0)        
        }
        }



    return (
        <>

            <View style = {{justifyContent: 'flex-end', flexDirection: 'row'}}>

                <ModalAction color = {colors.tertiary} onPress = {() => {setModalVisible(true)}}>
                    <AntDesign name = "pluscircle" size = {28} color = {colors.secondary}/>
                </ModalAction>
            </View>
            <Modal
                animationType= "slide"
                transparent = {true}
                visible = {modalVisible}
                onRequestClose = {handleCloseModal}
            >

                <ModalContainer >
                    <KeyboardAvoidingView>
                    <ModalView> 

                    <ModalIcon>
                        <HeaderTitle>task entry</HeaderTitle>
                        <AntDesign name = "edit" size = {30} color = {colors.tertiary}/>
                    </ModalIcon>

                    <StyledInput
                        placeholder = "title: Add a todo"
                        placeholderTextColor = {colors.alternative}
                        selectionColor = {colors.secondary}
                        autoFocus = {true}
                        onChangeText = {(text) => setTodoInputValue(text)}
                        value = {todoInputvalue}
                        // onSubmitEditing = {handleSubmit}
                    />
                    
                    <View style = {{marginTop: 20}}>
                    <Text style = {{fontSize: 25, color: "white", fontWeight: '700', letterSpacing: 1}}>
                        importance : {todoImportance}
                    </Text>

                    <Slider
                        value={todoImportance}
                        onValueChange = {(num) => {setImportance(num)}}
                        maximumValue={10}
                        minimumValue={1}
                        step={1}
                        onSlidingComplete = {(num) => {setImportance(num)}}
                        allowTouchTrack
                        trackStyle={{ height: 10}}
                        thumbStyle={{ height: 20, width: 20, backgroundColor: 'white' }}                    
                    />


                    <View style = {{marginTop: 20}}>
                    <Text style = {{fontSize: 25, color: "white", fontWeight: '700', letterSpacing: 1}}>
                        time taken (mins) : {todoTimeTaken}
                    </Text>

                    <Slider
                        value={todoTimeTaken}
                        onValueChange = {(num) => {setTimeTaken(num)}}
                        maximumValue={90}
                        minimumValue={5}
                        step={5}
                        onSlidingComplete = {(num) => {setTimeTaken(num)}}
                        allowTouchTrack
                        trackStyle={{ height: 10}}
                        thumbStyle={{ height: 20, width: 20, backgroundColor: 'white' }}                    
                    />
                    </View>
                <View style = {{flexDirection: 'row'}}>

                    <TouchableOpacity style = {styles.DateButton} onPress={() => {setisDatePickerVisible(true)}}>
                        <Text>{todoDate}</Text>
                    </TouchableOpacity>
                </View>

                    </View>

                    <DateTimePickerModal
                        isVisible = {isDatePickerVisible}
                        mode='date'
                        onConfirm = {(date) => {handleConfirm(date)}}
                        onCancel = {hideDatePicker}
                    />

                    <ModalActionGroup>
                        <ModalAction color = {colors.primary} onPress = {handleCloseModal}>
                            <AntDesign name = "close" size = {28} color={colors.tertiary}/>
                        </ModalAction>

                        <ModalAction color = {colors.tertiary} onPress = {handleSubmit}>
                            <AntDesign name = "check" size = {28} color = {colors.secondary}/>
                        </ModalAction>
                    </ModalActionGroup>
                    </ModalView>
                    </KeyboardAvoidingView>
                </ModalContainer>
                

            </Modal>

            <Modal
                animationType= "slide"
                transparent = {false}
                visible = {sortModalVisible}
                onRequestClose = {sortModalClose}            
            >
                <ModalAction color = {colors.primary} onPress = {sortModalClose}>
                    <AntDesign name = "close" size = {28} color={colors.tertiary}/>
                </ModalAction>

            </Modal>
        </>

    )
}

const styles = StyleSheet.create({
    DateButton: {
        flexDirection: 'row',
        backgroundColor: 'white',
        borderColor: colors.primary,
        marginTop: 45,
        width: 160,
        marginBottom: 30,
        borderRadius: 10,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center'
    },
    DateButtonText: {
        alignSelf: 'center',
        alignContent: 'center',
        alignItems: 'center',
        fontWeight: '100',
        fontSize: 15
    },

    input: {
        width: 100,
        height: 50,
        marginRight: 60,
        backgroundColor: colors.secondary,
        padding: 10,
        fontSize: 12,
        borderRadius: 10,
        color: colors.secondary,
        letterSpacing: 1
    },


})

export default InputModal


