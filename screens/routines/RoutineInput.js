import React, {useState} from 'react'
import {View, Text, Modal, KeyboardAvoidingView, StyleSheet, TouchableOpacity, Dimensions} from 'react-native'
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
import DateTimePicker from '@react-native-community/datetimepicker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {TapGestureHandler} from 'react-native-gesture-handler';
import {Slider} from 'react-native-elements';

let width = Dimensions.get('window').width;
let height = Dimensions.get("window").height;
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
                        routineImportance,
                        setImportance,
                        handleEditTodo,
                        todos
                    }) => {

    const handleCloseModal = () => {
        setModalVisible(false);
        setTodoInputValue()
        setRoutineFrom("select start time")
        setRoutineTo("select end time")
        setImportance(1)
        setTodoToBeEdited(null);
    }

    const [Fromin12Format, setFrom12Fromat] = useState()
    const [to12Format, setTo12Format] = useState()
    const newTodos = todos;
    const [isTimeTo, setIsTimeTo] = useState(false)
    const [isTimeFrom, setIsTimeFrom] = useState(false)


    const handleConfirmFrom = (selectedTime) => {
        setIsTimeFrom(false)
        const time = new Date(selectedTime)
        let hours = time.getHours()
        let minutes = time.getMinutes()

        setFrom12Fromat(format12Hour(hours, minutes))
        setFromNum(hours * 60 + minutes)

        setRoutineFrom(hours + ":" + (minutes < 10 ? "0" : "") + minutes)
    }

    const format12Hour = (hours, minutes) => {
        let pm = hours > 11
        hours %= 12
        if (hours === 0) hours = 12
        if (minutes < 10) minutes = "0" + minutes
        return hours + ":" + minutes + " " + (pm ? "PM" : "AM")
    }

    const handleConfirmTo = (selectedTime) => {
        setIsTimeTo(false)
        const time = new Date(selectedTime)
        let hours = time.getHours()
        let minutes = time.getMinutes()

        setTo12Format(format12Hour(hours, minutes))
        setToNum(hours * 60 + minutes)

        setRoutineTo(hours + ":" + (minutes < 10 ? "0" : "") + minutes)


    }

    const hideTimePicker = () => {
        setIsTimeTo(false)
        setIsTimeFrom(false)
    }
    const handleSubmit = () => {
        let key = 0

        // noinspection EqualityComparisonWithCoercionJS
        if (todoInputvalue == "" || todoInputvalue == undefined) {
            alert("Please provide a title for this routine.")
            return;
        } else if (routineFrom === "select start time") {
            console.log("|" + todoInputvalue + "|")
            alert("Please select the start time for this routine.")
            return;
        } else if (routineTo === "select end time") {
            alert("Please select the end time for this routine.")
            return;
        } else if (fromNum >= toNum) {
            alert("The end time of the routine must be after the start time.")
            return;
        }
        try {
            key = newTodos[newTodos.length - 1].key + 1
        } catch (error) {
            key = 1
        }
        let event = {
            title: todoInputvalue,
            to: routineTo,
            from: routineFrom,
            fromNum: fromNum,
            toNum: toNum,
            key: key,
            fromDisplay: Fromin12Format,
            toDisplay: to12Format,
            importance: routineImportance,
            type: 'routine',
            status: "pending"
        }
        if (todoToBeEdited) {
            handleEditTodo(event)
        } else {
            handleAddTodo(event)
        }
        setTodoInputValue()
        setImportance(1)
        setRoutineFrom("select start time")
        setRoutineTo("select end time")
    }


    return (
        <>

            <View style={{justifyContent: 'flex-end', flexDirection: 'row', marginTop: -100}}
                  onTouchStart={() => console.log(width, height)}>

                {todos.length == 0 &&
                <TouchableOpacity style={styles.modalAction} onPress={() => {
                    setModalVisible(true)
                }}>
                    <AntDesign name='plus' size={40} color={colors.secondary}/>
                </TouchableOpacity>
                }

                {todos.length != 0 &&
                <TouchableOpacity style={styles.modalActionText} onPress={() => {
                    setModalVisible(true)
                }}>
                    <AntDesign name='plus' size={40} color={colors.secondary}/>
                </TouchableOpacity>
                }
            </View>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={handleCloseModal}
            >

                <ModalContainer>
                    <KeyboardAvoidingView>
                        <ModalView>

                            <ModalIcon>
                                <HeaderTitle>Task Entry</HeaderTitle>
                                <AntDesign name="edit" size={30} color={colors.tertiary}/>
                            </ModalIcon>

                            <StyledInput
                                placeholder="Routine Title"
                                placeholderTextColor={colors.modalText}
                                selectionColor={colors.modalText}
                                autoFocus={true}
                                onChangeText={(text) => setTodoInputValue(text)}
                                value={todoInputvalue}
                            />

                            <View style={{marginTop: 45}}>
                                <Text
                                    style={{fontSize: 25, color: colors.tertiary, fontWeight: '700', letterSpacing: 1}}>
                                    importance : {routineImportance}
                                </Text>

                                <Slider
                                    value={routineImportance}
                                    onValueChange={(num) => {
                                        setImportance(num)
                                    }}
                                    maximumValue={10}
                                    minimumValue={1}
                                    step={1}
                                    onSlidingComplete={(num) => {
                                        setImportance(num)
                                    }}
                                    allowTouchTrack
                                    trackStyle={{
                                        height: 10,
                                        borderRadius: 10,
                                        borderWidth: 5,
                                        borderColor: colors.secondary,
                                        backgroundColor: colors.secondary
                                    }}
                                    thumbStyle={{height: 30, width: 30, backgroundColor: colors.secondary}}
                                />
                            </View>
                            <View style={{flexDirection: 'row', marginTop: 45, marginBottom: 45}}>
                                <View style={{marginRight: 10}}>
                                    <TouchableOpacity style={styles.DateButton} onPress={() => {
                                        setIsTimeFrom(true)
                                    }}>
                                        <Text style={{color: 'white'}}>{routineFrom}</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={{marginLeft: 10}}>
                                    <TouchableOpacity style={styles.DateButton} onPress={() => {
                                        setIsTimeTo(true)
                                    }}>
                                        <Text style={{color: 'white'}}>{routineTo}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <DateTimePickerModal
                                isVisible={isTimeTo}
                                mode='time'
                                onConfirm={(date) => {
                                    handleConfirmTo(date)
                                }}
                                onCancel={hideTimePicker}
                            />
                            <DateTimePickerModal
                                isVisible={isTimeFrom}
                                mode='time'
                                onConfirm={(date) => {
                                    handleConfirmFrom(date)
                                }}
                                onCancel={hideTimePicker}
                            />


                            <View style={styles.closeCheckContainer}>
                                <TouchableOpacity style={styles.Close} onPress={handleCloseModal}>
                                    <AntDesign name="close" size={28} color={colors.primary}/>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.Close} onPress={handleSubmit}>
                                    <AntDesign name='check' size={28} color={colors.primary}/>
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
        width: 160,
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
    modalAction: {
        width: 60,
        height: 60,
        backgroundColor: 'black',
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        left: width - 104,
        top: height - 260
    },
    modalActionText: {
        width: 60,
        height: 60,
        backgroundColor: 'black',
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        marginBottom: 20
    },
    closeCheckContainer: {
        flexDirection: 'row',
        alignContent: 'center',
        justifyContent: 'space-around'
    },
    Close: {
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
