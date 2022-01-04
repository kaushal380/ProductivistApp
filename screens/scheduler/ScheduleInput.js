import React, {useState} from 'react'
import { View, Text, Modal, Alert, KeyboardAvoidingView, StyleSheet } from 'react-native'
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
    ModalLeftview,
    StyledInput_Time

} from '../../styles/AppStyles'

import {AntDesign} from "@expo/vector-icons"
// import DateTimePickerModal from "react-native-modal-datetime-picker";
import DateTimePickerModal from 'react-native-modal-datetime-picker'
import { TapGestureHandler } from 'react-native-gesture-handler';
import DateTimePicker from '@react-native-community/datetimepicker';


const InputModal = ({
    modalVisible, 
    setModalVisible,
    todoInputvalue, 
    setTodoInputValue, 
    handleAddTodo, 
    routineTo,
    setRoutineTo,
    routineFrom,
    setRoutineFrom,
    fromNum,
    setFromNum,
    toNum,
    setToNum,
    todoToBeEdited, 
    setTodoToBeEdited, 
    handleEditTodo,
    todos}) => {

    const handleCloseModal = () => {
        setModalVisible(false);
        setTodoInputValue()
        setRoutineFrom("select start time")
        setRoutineTo("select end time")
        setTodoToBeEdited(null);
    }


    const newTodos = todos;
    const [isTimeTo, setIsTimeTo] = useState(false)
    const [isTimeFrom, setIsTimeFrom] = useState(false)


    const handleConfirmFrom = ( selectedTime) => {
        setIsTimeFrom(false)
        const time = new Date(selectedTime)
        let hours = time.getHours()
        let minutes = time.getMinutes()
        const fromNumMin = (hours*60) + minutes
        if(hours < 10){
            hours = "0" + hours
        }
        if(minutes < 10){
            minutes = "0" + minutes
        }
        const format = hours + ":" + minutes
        setRoutineFrom(format)
        setFromNum(fromNumMin)
    }

    const handleConfirmTo = (selectedTime) => {
        setIsTimeTo(false)
        const time = new Date(selectedTime)
        let hours = time.getHours()
        let minutes = time.getMinutes()
        const toNumMin = (hours*60) + minutes
        if(hours < 10){
            hours = "0" + hours
        }
        if(minutes < 10){
            minutes = "0" + minutes
        }
        const format = hours + ":" + minutes
        setRoutineTo(format)
        setToNum(toNumMin)
    }

    const hideTimePicker = () => {
        setIsTimeTo(false)
        setIsTimeFrom(false)
    }
    const handleSubmit = () => {
        let key = 0
        if (!todoToBeEdited) {

            if(todoInputvalue + "" === ""){
                alert("please enter the task")
                return;
            }
            if(routineFrom === "select start time"){
                alert("please select the start time")
                return;
            }
            if(routineTo === "select end time"){
                alert("please select the end time")
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
                to: routineTo,
                from: routineFrom,
                fromNum: fromNum,
                toNum: toNum,
                key: key
            })
            setTodoInputValue()
            setRoutineFrom("select start time")
            setRoutineTo("select end time")        
        } else {

            if(todoInputvalue + "" === ""){
                alert("please enter the task")
                return;
            }
            if(routineFrom === "select start time"){
                alert("please select the start time")
                return;
            }
            if(routineTo === "select end time"){
                alert("please select the end time")
                return;
            }
            handleEditTodo({
                title: todoInputvalue,
                to: routineTo,
                from: routineFrom,
                fromNum: fromNum,
                toNum: toNum,                
                key: todoToBeEdited.key
            })
            setTodoInputValue()
            setRoutineFrom("select start time")
            setRoutineTo("select end time")       
        }
        }



    return (
        <>

            <ModalActionGroup>

                <ModalAction color = {colors.tertiary} onPress = {() => {setModalVisible(true)}}>
                    <AntDesign name = "pluscircle" size = {28} color = {colors.secondary}/>
                </ModalAction>
            </ModalActionGroup>
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
                        placeholder = "title: Add a task"
                        placeholderTextColor = {colors.alternative}
                        selectionColor = {colors.secondary}
                        autoFocus = {true}
                        onChangeText = {(text) => setTodoInputValue(text)}
                        value = {todoInputvalue}
                    />

        
                    <ModalLeftview>
                    <StyledInput_Time                        
                        placeholder = {routineFrom}                        
                        placeholderTextColor = {colors.alternative}
                        selectionColor = {colors.secondary}
                        autoFocus = {true}
                        value = {routineFrom}
                    />

                    <AntDesign name = "clockcircle" size = {35} color={colors.tertiary} onPress = {() => {setIsTimeFrom(true)}}/>
                    </ModalLeftview>

                    <ModalLeftview>
                    <StyledInput_Time
                    
                        placeholder = {routineTo}
                        placeholderTextColor = {colors.alternative}
                        selectionColor = {colors.secondary}
                        autoFocus = {true}
                        value = {routineTo}
                    />
                    
                    <AntDesign name = "clockcircle" size = {35} color={colors.tertiary} onPress = {() => {setIsTimeTo(true)}}/>
                    </ModalLeftview>
         
                    <DateTimePickerModal
                        isVisible = {isTimeTo}
                        mode='time'
                        onConfirm = {(date) => {handleConfirmTo(date)}}
                        onCancel = {hideTimePicker} 
                    />
                    <DateTimePickerModal
                        isVisible = {isTimeFrom}
                        mode='time'
                        onConfirm = {(date)=> {handleConfirmFrom(date)}}
                        onCancel = {hideTimePicker}
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

        </>

    )
}


export default InputModal
