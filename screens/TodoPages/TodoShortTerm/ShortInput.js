import React, {useState} from 'react'
import { View, Text, Modal, Alert, KeyboardAvoidingView, StyleSheet, TouchableOpacity } from 'react-native'
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

} from '../../../styles/AppStyles'

import {AntDesign, Entypo} from "@expo/vector-icons"
// import DateTimePickerModal from "react-native-modal-datetime-picker";
import { TapGestureHandler } from 'react-native-gesture-handler';
import DateTimePicker from '@react-native-community/datetimepicker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { Slider } from 'react-native-elements'



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
    shortImportance,
    setImportance,
    shortDate,
    setDate,
    todoToBeEdited, 
    setTodoToBeEdited, 
    handleEditTodo,
    todos}) => {

    const handleCloseModal = () => {
        setModalVisible(false);
        setTodoInputValue()
        setRoutineFrom("select start time")
        setRoutineTo("select end time")
        setImportance(0)
        setDate("select the day of the appointment")
        setTodoToBeEdited(null);
    }


    const newTodos = todos;
    const [isTimeTo, setIsTimeTo] = useState(false)
    const [isTimeFrom, setIsTimeFrom] = useState(false)
    const [isDateOpen, setDateOpen] = useState(false)

    const handleConfirm = ( selectedDate) => {
        setDateOpen(false)
        const selectDate = new Date(selectedDate)
        const currentDate = new Date()
        const timeleft = selectDate.getTime() - currentDate.getTime();

        // alert("timeleft: " + timeleft)
        if(selectedDate.getFullYear() > currentDate.getFullYear()){
            setDate(selectDate.toDateString())
            
            
            
        }
        else if (selectedDate.getFullYear() === currentDate.getFullYear()){
            if(selectDate.getMonth() > currentDate.getMonth()){
                setDate(selectDate.toDateString())
                
                
            }
            else if(selectDate.getMonth() === currentDate.getMonth()){
                if(selectDate.getDate() >= currentDate.getDate()){
                    setDate(selectDate.toDateString())
                    
                    
                }

                else{
                    alert("check your date! you cannot be in the past")
                    setDate("select the day of the appointment")
                }
            }
            else {
                alert("check your month! you cannot be in the past")
                setDate("select the day of the appointment")
            }
        }
        else{
        alert("check your year! you cannot be in the past")
        setDate("select the day of the appointment")

        }


    }

    const handleConfirmFrom = (selectedTime) => {
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
        setDateOpen(false)
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
            if(fromNum >= toNum){
                alert("your end time has to be greater")
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
                importance: shortImportance,
                date: shortDate,
                key: key
            })
            setTodoInputValue()
            setImportance(0)
            setDate("select the day of the appointment")
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
            if(fromNum >= toNum){
                alert("your end time has to be greater")
                return;
            }
            handleEditTodo({
                title: todoInputvalue,
                to: routineTo,
                from: routineFrom,
                fromNum: fromNum,
                toNum: toNum,       
                importance: shortImportance,   
                date: shortDate,      
                key: todoToBeEdited.key
            })
            setTodoInputValue()
            setRoutineFrom("select start time")
            setRoutineTo("select end time")  
            setImportance(0)    
            setDate("select the day of the appointment") 
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
                        placeholder = "title: Add an appointment"
                        placeholderTextColor = {colors.alternative}
                        selectionColor = {colors.secondary}
                        autoFocus = {true}
                        onChangeText = {(text) => setTodoInputValue(text)}
                        value = {todoInputvalue}
                    />
                    <View style = {{marginTop: 35}}>
                    <Text style = {{fontSize: 25, color: "white", fontWeight: '700', letterSpacing: 1}}>
                        importance : {shortImportance}
                    </Text>
                    </View>
                    <Slider
                        value={shortImportance}
                        onValueChange = {(num) => {setImportance(num)}}
                        maximumValue={10}
                        minimumValue={1}
                        step={1}
                        onSlidingComplete = {(num) => {setImportance(num)}}
                        allowTouchTrack
                        trackStyle={{ height: 10}}
                        thumbStyle={{ height: 20, width: 20, backgroundColor: 'white' }}                    
                    />
                    <View style = {{marginTop: 25}}>
                        <TouchableOpacity
                            style = {styles.DateButton1}
                            onPress={() => {setDateOpen(true)}}
                        > 
                        <Text>{shortDate}</Text>
                        </TouchableOpacity>

                    </View>
                    <View style = {{flexDirection: 'row', marginTop: 30, marginBottom: 30}}>
                        <View style = {{marginRight: 10}}>
                        <TouchableOpacity style = {styles.DateButton} onPress= {()=>{setIsTimeFrom(true)}}>
                            <Text>{routineFrom}</Text>
                        </TouchableOpacity>
                        </View>
                        <View style = {{marginLeft: 10}}>
                        <TouchableOpacity style = {styles.DateButton} onPress= {()=>{setIsTimeTo(true)}}>
                            <Text>{routineTo}</Text>
                        </TouchableOpacity>
                        </View>                        
                    </View>
         
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
                    
                    <DateTimePickerModal
                        isVisible = {isDateOpen}
                        mode='date'
                        onConfirm = {(date)=> {handleConfirm(date)}}
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


const styles = StyleSheet.create({
    DateButton: {
        flexDirection: 'row',
        backgroundColor: 'white',
        borderColor: colors.primary,
        width: 160,
        borderRadius: 10,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center'
    },
    DateButton1: {
        flexDirection: 'row',
        backgroundColor: 'white',
        borderColor: colors.primary,
        width: 280,
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
