import React, {useState} from 'react'
import { View, Text, Modal, Alert, KeyboardAvoidingView, StyleSheet, TouchableOpacity, Dimensions, } from 'react-native'
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

let  width  = Dimensions.get('window').width;
let height = Dimensions.get("window").height;

const InputModal = ({
    getInit,
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
        setRoutineFrom("start time")
        setRoutineTo("end time")
        setImportance(0)
        setDate("select date")
        setTodoToBeEdited(null);
    }


    const newTodos = todos;
    const [isTimeTo, setIsTimeTo] = useState(false)
    const [isTimeFrom, setIsTimeFrom] = useState(false)
    const [isDateOpen, setDateOpen] = useState(false)
    const [from12Format, setFrom12format] = useState()
    const [to12Format, setTo12Format] = useState();
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
                    setDate("select date")
                }
            }
            else {
                alert("check your month! you cannot be in the past")
                setDate("select date")
            }
        }
        else{
        alert("check your year! you cannot be in the past")
        setDate("select date")

        }


    }

    const handleConfirmFrom = (selectedTime) => {
        setIsTimeFrom(false)
        const time = new Date(selectedTime)
        let hours = time.getHours()
        let minutes = time.getMinutes()
        let toUsehours = hours
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

        if(toUsehours > 12){
            toUsehours = toUsehours - 12;
            toUsehours = toUsehours + ":" + minutes + " PM";
        }
        else if (toUsehours < 10){
            toUsehours = "0" + toUsehours + ":" + minutes + " AM";
        }
        else{
            toUsehours = toUsehours + ":" + minutes + " AM";
        }

        setFrom12format(toUsehours)
    }

    const handleConfirmTo = (selectedTime) => {
        setIsTimeTo(false)
        const time = new Date(selectedTime)
        let hours = time.getHours()
        let minutes = time.getMinutes()
        const toNumMin = (hours*60) + minutes
        let toUsehours = hours
        if(hours < 10){
            hours = "0" + hours
        }
        if(minutes < 10){
            minutes = "0" + minutes
        }
        const format = hours + ":" + minutes
        setRoutineTo(format)
        setToNum(toNumMin)
        
        if(toUsehours > 12){
            toUsehours = toUsehours - 12;
            toUsehours = toUsehours + ":" + minutes + " PM";
        }
        else if (toUsehours < 10){
            toUsehours = "0" + toUsehours + ":" + minutes + " AM";
        }
        else{
            toUsehours = toUsehours + ":" + minutes + " AM";
        }

        setTo12Format(toUsehours)
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
            if(routineFrom === "start time"){
                alert("please select the start time")
                return;
            }
            if(routineTo === "end time"){
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
                fromDisplay: from12Format,
                toDisplay: to12Format,
                key: key,
                type: 'apps', 
                status: "pending"
            })
            setTodoInputValue()
            setImportance(0)
            setDate("select date")
            setRoutineFrom("start time")
            setRoutineTo("end time")        
        } else {

            if(todoInputvalue + "" === ""){
                alert("please enter the task")
                return;
            }
            if(routineFrom === "start time"){
                alert("please select the start time")
                return;
            }
            if(routineTo === "end time"){
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
                fromDisplay: from12Format,
                toDisplay: to12Format,      
                key: todoToBeEdited.key,
                type: 'apps',
                status: "pending"
            })
            setTodoInputValue()
            setRoutineFrom("start time")
            setRoutineTo("end time")  
            setImportance(0)    
            setDate("select date") 
        }
        }

        const plusHandle = () => {
            getInit
            setModalVisible(true)
        }

    return (
        <>
            <View style = {{justifyContent: 'flex-end', flexDirection: 'row', marginTop: -100}}>
 
                {todos.length == 0 && 
                    <TouchableOpacity style = {styles.modalAction} onPress = {() => {setModalVisible(true)}}>
                        <AntDesign name = "pluscircle" size = {28} color = {colors.secondary}/>
                    </TouchableOpacity>
                }

                {todos.length != 0 && 
                    <TouchableOpacity style = {styles.modalActionText} onPress = {() => {setModalVisible(true)}}>
                        <AntDesign name = "pluscircle" size = {28} color = {colors.secondary}/>
                    </TouchableOpacity>
                }

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
                        placeholderTextColor = {colors.modalText}
                        selectionColor = {colors.modalText}
                        autoFocus = {true}
                        onChangeText = {(text) => setTodoInputValue(text)}
                        value = {todoInputvalue}
                    />
                    <View style = {{marginTop: 40}}>
                    <Text style = {{fontSize: 25, color: colors.tertiary, fontWeight: '700', letterSpacing: 1}}>
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
                        trackStyle={{ height: 10, borderRadius: 10, borderWidth: 5, borderColor: colors.secondary, backgroundColor: colors.secondary}}
                        thumbStyle={{ height: 30, width: 30, backgroundColor: colors.secondary }}                    
                    />
                    <View style = {{marginTop: 35, flexDirection: 'row'}}>
                        <AntDesign name= 'calendar' size={40} color = {colors.secondary} style = {{marginRight: 20}}/>
                        <TouchableOpacity
                            style = {styles.DateButton1}
                            onPress={() => {setDateOpen(true)}}
                        > 
                        <Text style = {{color: 'white'}}>{shortDate}</Text>
                        </TouchableOpacity>

                    </View>
                    <View style = {{flexDirection: 'row', marginTop: 60, alignSelf: 'center'}}>
                        <View style = {{marginRight: 10, flexDirection: 'row'}}>
                        <TouchableOpacity style = {styles.DateButton} onPress= {()=>{setIsTimeFrom(true)}}>
                            <Text style = {{color: 'white'}}>{routineFrom}</Text>
                        </TouchableOpacity>
                        </View>
                        <View style = {{marginLeft: 10, flexDirection: 'row'}}>
                        <TouchableOpacity style = {styles.DateButton} onPress= {()=>{setIsTimeTo(true)}}>
                            <Text style = {{color: 'white'}}>{routineTo}</Text>
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

                <View style = {styles.closeCheckContainer}>
                    <TouchableOpacity style = {styles.Close} onPress = {handleCloseModal}>
                        <AntDesign name = "close" size = {28} color={colors.primary}/>
                    </TouchableOpacity>
                    <TouchableOpacity style = {styles.Close} onPress = {handleSubmit}>
                        <AntDesign name = 'check' size = {28} color={colors.primary}/>
                    </TouchableOpacity>
                </View>
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
        backgroundColor: colors.secondary,
        borderColor: colors.primary,
        width: 140,
        borderRadius: 10,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    DateButton1: {
        flexDirection: 'row',
        backgroundColor: colors.secondary,
        borderColor: colors.secondary,
        width: 130,
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
        fontSize: 15,
        color: colors.modalText,
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
    modalAction: {
        width: 60,
        height: 60,
        backgroundColor: 'black',
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        alignItems: 'center',
        position: 'absolute',
        left: width - 104, 
        top:  height - 330  
    },
    modalActionText: {
        width: 60,
        height: 60,
        backgroundColor: 'black',
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        alignItems: 'center',
        position: 'relative',
        marginBottom: 20
    },
    closeCheckContainer: {
        flexDirection: 'row',
        marginTop: 15,
        alignContent: 'center',
        justifyContent: 'space-around'
    },
    Close:{
        width: 60,
        height: 60,
        backgroundColor: colors.secondary,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        margin: 30
        
    }
})


export default InputModal
