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
    StyledInput_Date,
    ModalLeftview,
    HeaderButton,
    HeaderView,
    ModalImageView

} from '../../styles/AppStyles'

import {AntDesign} from "@expo/vector-icons"
import DatePicker from 'react-native-date-picker'
import { TapGestureHandler } from 'react-native-gesture-handler';
import DateTimePicker from '@react-native-community/datetimepicker';
import DateTimePickerModal from 'react-native-modal-datetime-picker'

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
        setImportance("")
        setDate("select a date")
        setTimeTaken("")
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
        const timeleft = selectDate.getTime() - currentDate.getTime();

        // alert("timeleft: " + timeleft)
        if(selectedDate.getFullYear() > currentDate.getFullYear()){
            setDate(selectDate.toDateString())
            settodoTimeLeft(timeleft)
            
            
        }
        else if (selectedDate.getFullYear() === currentDate.getFullYear()){
            if(selectDate.getMonth() > currentDate.getMonth()){
                setDate(selectDate.toDateString())
                settodoTimeLeft(timeleft)
                
            }
            else if(selectDate.getMonth() === currentDate.getMonth()){
                if(selectDate.getDate() >= currentDate.getDate()){
                    setDate(selectDate.toDateString())
                    settodoTimeLeft(timeleft)
                    
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
            if( isNaN(parseInt(todoImportance))  || parseInt(todoImportance) > 5){
                alert("importance should be ranked between 1 to 5")
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
                importance: parseInt(todoImportance),
                key: key
            })
            setTodoInputValue("")
            setImportance("")
            setDate("select a date")
            setTimeTaken("")
        } else {

            if(todoInputvalue + "" === ""){
                alert("please enter the task")
                return;
            }
            if(isNaN(parseInt(todoTimeTaken)) || parseInt(todoTimeTaken) < 0){
                alert("enter a valid time")
                return;
            }
            if(isNaN(parseInt(todoImportance))  || parseInt(todoImportance) > 5){
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
                importance: parseInt(todoImportance),
                key: todoToBeEdited.key
            })
            setTodoInputValue("")
            setImportance("")
            setDate("select a date")
            setTimeTaken("")        
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
                        placeholder = "title: Add a todo"
                        placeholderTextColor = {colors.alternative}
                        selectionColor = {colors.secondary}
                        autoFocus = {true}
                        onChangeText = {(text) => setTodoInputValue(text)}
                        value = {todoInputvalue}
                        // onSubmitEditing = {handleSubmit}
                    />
                    
                    <StyledInput_imp
                        placeholder = "importance"                        
                        placeholderTextColor = {colors.alternative}
                        selectionColor = {colors.secondary}
                        autoFocus = {true}
                        onChangeText = {(text) => setImportance(text)}
                        value = {todoImportance} 
                    />

                    <TextRowStyle>
                    <StyledInput_imp     
                        placeholder = "time taken: "
                        placeholderTextColor = {colors.alternative}
                        selectionColor = {colors.secondary}
                        autoFocus = {true}
                        onChangeText = {(text) => setTimeTaken(text)}
                        value = {todoTimeTaken}                   

                    />
                    <ModalLeftview>
                    <StyledInput_Date
                    
                        placeholder = {todoDate}
                        placeholderTextColor = {colors.alternative}
                        selectionColor = {colors.secondary}
                        autoFocus = {true}
                        // onChangeText = {}
                        value = {todoDate}
                        // onSubmitEditing = {handleSubmit}
                    />
                    
                    <AntDesign name = "calendar" size = {35} color={colors.tertiary} onPress = {() => {setisDatePickerVisible(true)}}/>
                    </ModalLeftview>
                    </TextRowStyle>


                    

                    {/* {isDatePickerVisible && (
                            <DateTimePicker
                                testID="dateTimePicker"
                                value={new Date()}
                                mode='date'
                                display="default"
                                onChange={handleConfirm}
                            />)}  */}
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


export default InputModal


