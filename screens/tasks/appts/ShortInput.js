import React, {useState} from 'react'
import {View, Text, Modal, KeyboardAvoidingView, StyleSheet, TouchableOpacity, Dimensions,} from 'react-native'
import {
    ModalContainer,
    ModalView,
    StyledInput,
    ModalIcon,
    HeaderTitle,
    colors,

} from '../../../styles/AppStyles'

import {AntDesign} from "@expo/vector-icons"
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {Slider} from 'react-native-elements'

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
                        shortImportance,
                        setImportance,
                        shortDate,
                        setDate,
                        todoToBeEdited,
                        setTodoToBeEdited,
                        handleEditTodo,
                        todos
                    }) => {

    const handleCloseModal = () => {
        setModalVisible(false);
        setTodoInputValue()
        setRoutineFrom("Start Time")
        setRoutineTo("End Time")
        setFrom12format("Start Time")
        setTo12Format("End Time")
        setImportance(0)
        setDate("Select Date")
        setTodoToBeEdited(null);
    }


    const newTodos = todos;
    const [isTimeTo, setIsTimeTo] = useState(false)
    const [isTimeFrom, setIsTimeFrom] = useState(false)
    const [isDateOpen, setDateOpen] = useState(false)
    const [from12Format, setFrom12format] = useState("Start Time")
    const [to12Format, setTo12Format] = useState("End Time");

    const handleConfirm = (selectedDate) => {
        setDateOpen(false)
        const selectDate = new Date(selectedDate)
        const currentDate = new Date()

        selectDate.setHours(0, 0, 0, 0)
        selectDate.setTime(selectDate.getTime() + 85399999) // 23:59:59.999 of the given date

        if (selectDate.getTime() > currentDate.getTime()) {
            setDate(selectDate.toDateString())
        } else {
            alert("Make sure you're due date isn't in the past!")
            setDate("Select a Date")
        }

    }

    const handleConfirmFrom = (selectedTime) => {
        setIsTimeFrom(false)
        const time = new Date(selectedTime)

        let hours = time.getHours()
        let minutes = time.getMinutes()
        setFrom12format(format12Hour(hours, minutes))
        setFromNum(hours * 60 + minutes)

        if (hours < 10) hours = "0" + hours
        if (minutes < 10) minutes = "0" + minutes

        const format = hours + ":" + minutes
        setRoutineFrom(format)
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

        if (hours < 10) hours = "0" + hours
        if (minutes < 10) minutes = "0" + minutes

        const format = hours + ":" + minutes
        setRoutineTo(format)
    }

    const hideTimePicker = () => {
        setIsTimeTo(false)
        setIsTimeFrom(false)
        setDateOpen(false)
    }
    const handleSubmit = () => {
        let key = 0

        if (todoInputvalue + "" === "") {
            alert("Please provide a title for this appointment.")
            return;
        }
        if (routineFrom === "Start Time") {
            alert("Please select the start time for this appointment.")
            return;
        }
        if (routineTo === "End Time") {
            alert("Please select the end time for this appointment.")
            return;
        }
        if (fromNum >= toNum) {
            alert("The end time of the appointment must be after the start time.")
            return;
        }
        try {
            key = newTodos[newTodos.length - 1].key + 1
        } catch (error) {
            key = 1
        }
        let todo = {
            title: todoInputvalue,
            to: routineTo,
            from: routineFrom,
            fromNum: fromNum,
            toNum: toNum,
            importance: shortImportance,
            date: shortDate,
            fromDisplay: from12Format,
            toDisplay: to12Format,
            key: todoToBeEdited ? todoToBeEdited.key : key,
            type: 'appt',
            status: "pending"
        }
        if (todoToBeEdited) handleEditTodo(todo)
        else handleAddTodo(todo)
        setTodoInputValue()
        setImportance(0)
        setDate("Select Date")
        setRoutineFrom("Start Time")
        setRoutineTo("End Time")
    }


    return (
        <>
            <View style={{justifyContent: 'flex-end', flexDirection: 'row', marginTop: -100}}>

                {todos.length === 0 &&
                <TouchableOpacity style={styles.modalAction} onPress={() => {
                    setModalVisible(true)
                }}>
                    <AntDesign name='plus' size={40} color={colors.secondary}/>
                </TouchableOpacity>
                }

                {todos.length !== 0 &&
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
                                placeholder="Appointment Title"
                                placeholderTextColor={colors.modalText}
                                selectionColor={colors.modalText}
                                autoFocus={true}
                                onChangeText={(text) => setTodoInputValue(text)}
                                value={todoInputvalue}
                            />
                            <View style={{marginTop: 40}}>
                                <Text
                                    style={{fontSize: 25, color: colors.tertiary, fontWeight: '700', letterSpacing: 1}}>
                                    importance : {shortImportance}
                                </Text>
                            </View>
                            <Slider
                                value={shortImportance}
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
                            <View style={{marginTop: 35, flexDirection: 'row'}}>
                                <AntDesign name='calendar' size={40} color={colors.secondary}
                                           style={{marginRight: 20}}/>
                                <TouchableOpacity
                                    style={styles.DateButton1}
                                    onPress={() => {
                                        setDateOpen(true)
                                    }}
                                >
                                    <Text style={{color: 'white'}}>{shortDate}</Text>
                                </TouchableOpacity>

                            </View>
                            <View style={{flexDirection: 'row', marginTop: 60, alignSelf: 'center'}}>
                                <View style={{marginRight: 10, flexDirection: 'row'}}>
                                    <TouchableOpacity style={styles.DateButton} onPress={() => {
                                        setIsTimeFrom(true)
                                    }}>
                                        <Text style={{color: 'white'}}>{from12Format}</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={{marginLeft: 10, flexDirection: 'row'}}>
                                    <TouchableOpacity style={styles.DateButton} onPress={() => {
                                        setIsTimeTo(true)
                                    }}>
                                        <Text style={{color: 'white'}}>{to12Format}</Text>
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

                            <DateTimePickerModal
                                isVisible={isDateOpen}
                                mode='date'
                                onConfirm={(date) => {
                                    handleConfirm(date)
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
        position: 'absolute',
        left: width - 104,
        top: height - 330
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
        marginTop: 15,
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
