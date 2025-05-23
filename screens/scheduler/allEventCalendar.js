import React, { useState, useEffect } from 'react';

import { SafeAreaView, StyleSheet, View, Dimensions, Alert, Text } from 'react-native';
import { firebase } from '../../firebase/config';

import EventCalendar from 'react-native-events-calendar';

let { width } = Dimensions.get('window');
import WeekView, { addLocale, createFixedWeekDate } from 'react-native-week-view';

const allEventCalendar = () => {
    const getDateFormat = () => {
        let date = new Date()
        let date1 = date.getDate()
        let month = date.getMonth() + 1
        let year = date.getFullYear()
        let dateFormat = ""

        if (month < 10) {
            month = '0' + month
        }
        if (date1 < 10) {
            date1 = '0' + date1
        }
        dateFormat = year + '-' + month + '-' + date1
        setDateFormat(dateFormat);
    }
    const getEvents = (initSchedule) => {
        let initialEvents = initSchedule;
        let calendarInput = []

        for (let index = 0; index < initialEvents.length; index++) {
            let date = new Date(initialEvents[index].date)
            let month = date.getMonth()
            let Date1 = date.getDate()
            let year = date.getFullYear()

            let hourFrom = Math.trunc(((initialEvents[index].fromNum) / 60))
            let minFrom = ((initialEvents[index].fromNum) - (hourFrom * 60))
            let hourTo = Math.trunc(((initialEvents[index].toNum) / 60))
            let minTo = ((initialEvents[index].toNum) - (hourTo * 60))

            let fromDate = new Date(year, month, Date1, hourFrom, minFrom);
            let toDate = new Date(year, month, Date1, hourTo, minTo);


            let description = initialEvents[index].title
            let type = initialEvents[index].type

            let mylist = {
                id: index + 1,
                description: description,
                startDate: fromDate,
                endDate: toDate,
                color: '#94A285',
                type: type

            }

            calendarInput = [...calendarInput, mylist]

            // break;
        }
        return calendarInput;
    }

    const getInit = async () => {
        getDateFormat();
        let date = new Date();
        // fetching todos from firebase
        const documentSnapshot = await firebase.firestore()
            .collection('users')
            .doc(firebase.auth().currentUser.uid)
            .collection('userData')
            .doc('todos')
            .get()

        let initialTodos = Object.values(Object.seal(documentSnapshot.data()))
        initialTodos = getPendingItems(initialTodos)
        // fetching routines
        const documentSnapshot1 = await firebase.firestore()
            .collection('users')
            .doc(firebase.auth().currentUser.uid)
            .collection('userData')
            .doc('routines')
            .get()

        let initialRoutines = Object.values(Object.seal(documentSnapshot1.data()))
        initialRoutines = getPendingItems(initialRoutines)
        // fetching appointments
        const documentSnapshot2 = await firebase.firestore()
            .collection('users')
            .doc(firebase.auth().currentUser.uid)
            .collection('userData')
            .doc('shortTerm')
            .get()

        let initialApps = Object.values(Object.seal(documentSnapshot2.data()))

        initialApps = getPendingItems(initialApps)
        setTasks(initialTodos);
        setRoutines(initialRoutines);
        setApps(initialApps);

        initialRoutines = SortElementsFromNum(initialRoutines); // sorting routines from morning to night based on the time
        initialTodos = getCurrentAndFutureTodos(initialTodos, date); // getting the current and future todos interms of date



        let schedule = createSchedule(initialTodos, initialRoutines, initialApps)


        let events = getEvents(schedule)
        setEvents(events)
        // console.log(events)
        console.log(Calendarevents)

    }

    const createSchedule = (todos, routines, apps) => {
        let finalSchedule = []
        let missedList = todos;
        let date = new Date();
        let keyVal = 1;

        do {
            let Day_schedule = []
            Day_schedule = routines;
            let Day_apps = GetDaysApps(apps, date)
            Day_apps = getPendingItems(Day_apps)
            Day_schedule = Day_schedule.concat(Day_apps)

            let date1 = new Date()
            let past = []
            if (date.toString() === date1.toString()) {

                past = GetCurrentAndFutureEvents(SortElementsFromNum(Day_schedule))[1];
                Day_schedule = GetCurrentAndFutureEvents(SortElementsFromNum(Day_schedule))[0];
            }



            // missedList = getCurrentAndFutureTodos(missedList, date);

            let fetchFromCombine = combineTodos(Day_schedule, missedList, past, date)

            let currentDaySchedule = fetchFromCombine[0]



            currentDaySchedule.forEach(element => {
                element.key = keyVal;


                let elementString = JSON.stringify(element)
                finalSchedule = finalSchedule.concat(elementString)


                keyVal++;
            });


            // finalSchedule = [...finalSchedule, currentDaySchedule]
            missedList = fetchFromCombine[1];


            var nextDay = new Date(date.getTime() + 24 * 60 * 60 * 1000);
            date = nextDay;

        } while (missedList.length > 0);


        for (let i = 0; i < 30; i++) {
            let looping_Schedule = []
            for (let index = 0; index < routines.length; index++) {
                routines[index].date = date.toDateString();
                let elementString = JSON.stringify(routines[index])
                looping_Schedule = [...looping_Schedule, elementString];
            }

            let currentApps = GetDaysApps(apps, date)

            for (let index = 0; index < currentApps.length; index++) {
                let elementString = JSON.stringify(currentApps[index])
                looping_Schedule = [...looping_Schedule, elementString]
            }


            finalSchedule = finalSchedule.concat(looping_Schedule)

            var nextDay = new Date(date.getTime() + 24 * 60 * 60 * 1000);
            date = nextDay;
        }

        let conversionArray = []
        for (let index = 0; index < finalSchedule.length; index++) {
            let object = JSON.parse(finalSchedule[index])
            conversionArray = [...conversionArray, object]
        }
        return conversionArray;
    }

    /**
 so the way it works:
1. we have 3 @param initSchedule, Alltodo, pastArray

2. if the initSchedule is null, it is populated with the first item on todo
3. based on the schedule, it keeps adding the tasks to the next available spot
4. if all the tasks cannot be added, they are added to the missed lists
5. combines the final schedule with past elements
6. @returns a final combined list
*/
    const combineTodos = (initSchedule, Alltodo, pastArray, date) => {

        let Currentdate = new Date();
        let Starttime = 0
        if (Currentdate.toString() === date.toString()) {
            Starttime = (date.getHours() * 60) + (date.getMinutes()); // current time in minutes
        }
        let endTime = 1439; //11:59
        let schedule = initSchedule
        //let todo = SortBasedOnTime(GetDaysApps(Alltodo)); // gets today's tasks that are due and sorts them
        let todo = Alltodo

        let finalCombo = []
        let pastEvents = pastArray
        let missedList = []

        // layer one algorithm: combines tasks of current date
        for (let index = 0; index < todo.length; index++) {

            let start = Starttime;
            if (schedule.length === 0) {
                todo[index].fromNum = start + 5;
                todo[index].toNum = todo[index].fromNum + todo[index].time;
                todo[index].from = convertNumToTime(todo[index])[0];
                todo[index].to = convertNumToTime(todo[index])[1];
                schedule = [...schedule, todo[index]]
                continue;
            }
            for (let i = 0; i < schedule.length; i++) {
                if ((start + todo[index].time + 5) <= schedule[i].fromNum) {
                    todo[index].fromNum = start + 5;
                    todo[index].toNum = todo[index].fromNum + todo[index].time;
                    todo[index].from = convertNumToTime(todo[index])[0];
                    todo[index].to = convertNumToTime(todo[index])[1];
                    schedule = [...schedule, todo[index]]
                    schedule = SortElementsFromNum(schedule)

                    break;
                }
                start = schedule[i].toNum;

                if (i === (schedule.length - 1)) {

                    let end = start + 5 + todo[index].time;
                    if (end <= endTime) {
                        todo[index].fromNum = start + 5;
                        todo[index].toNum = todo[index].fromNum + todo[index].time;
                        todo[index].from = convertNumToTime(todo[index])[0];
                        todo[index].to = convertNumToTime(todo[index])[1];
                        schedule = [...schedule, todo[index]]
                        schedule = SortElementsFromNum(schedule)
                    }
                    else {

                        missedList = [...missedList, todo[index]];
                    }
                    break;
                }
            }
        }
        // layer 2 algorith: get all the future tasks and assigns it if time permits
        finalCombo = schedule.concat(pastEvents); // adds the past tasks, if the pastEvents is not null
        for (let index = 0; index < finalCombo.length; index++) {
            finalCombo[index].date = date.toDateString();
            finalCombo[index].elementIndex = date.getDate();
        }

        let returnItems = [finalCombo, missedList]
        return returnItems;
    }
    // convert the minutes to hours and time format
    const convertNumToTime = (element) => {
        let FromHours = Math.trunc((element.fromNum / 60));
        let FromMins = element.fromNum - (FromHours * 60);
        if (FromHours < 10) {
            FromHours = "0" + FromHours;
        }
        else {
            FromHours = "" + FromHours;
        }
        if (FromMins < 10) {
            FromMins = "0" + FromMins;
        }
        else {
            FromMins = "" + FromMins;
        }
        let ToHours = Math.trunc((element.toNum / 60));
        let Tomins = element.toNum - (ToHours * 60);
        if (ToHours < 10) {
            ToHours = "0" + ToHours;
        }
        else {
            ToHours = "" + ToHours;
        }
        if (Tomins < 10) {
            Tomins = "0" + Tomins;
        }
        else {
            Tomins = "" + Tomins;
        }
        let from = FromHours + ":" + FromMins;
        let to = ToHours + ":" + Tomins;
        let structure = [from, to];
        return structure;
    }
    const SortElementsFromNum = (array) => {
        let timeSort = []
        let sortedArray = []
        for (let index = 0; index < array.length; index++) {
            timeSort = [...timeSort, array[index].fromNum]
        }

        timeSort = timeSort.sort(function (a, b) { return a - b })
        timeSort = [...new Set(timeSort)];

        for (let index = 0; index < timeSort.length; index++) {
            for (let i = 0; i < array.length; i++) {
                if (array[i].fromNum === timeSort[index]) {
                    sortedArray = [...sortedArray, array[i]]
                }
            }
        }

        return sortedArray;
    }
    const GetDaysApps = (array, date) => {
        let filteredArray = []
        for (let index = 0; index < array.length; index++) {
            let selectedDate = new Date(array[index].date);
            if ((date.getFullYear() === selectedDate.getFullYear()) &&
                (date.getMonth() === selectedDate.getMonth()) &&
                (date.getDate() === selectedDate.getDate())) {
                filteredArray = [...filteredArray, array[index]]
            }
        }
        // filteredArray = SortElementsFromNum(filteredArray)
        return filteredArray;
    }

    // get the events starting from current time with index 0
    // get the past events from index 1
    const GetCurrentAndFutureEvents = (array) => {

        let date = new Date();
        let time = (date.getHours() * 60) + (date.getMinutes());
        let timeArray = []
        let pastArray = []
        for (let index = 0; index < array.length; index++) {
            if (array[index].toNum > time) {
                timeArray = [...timeArray, array[index]];
            }
            else {
                pastArray = [...pastArray, array[index]]
            }
        }


        let finalArray = [timeArray, pastArray]
        return finalArray;
    }

    const getPendingItems = (list) => {
        let finalList = []
        for (let index = 0; index < list.length; index++) {
            if (list[index].status !== "done") {
                finalList = [...finalList, list[index]]
            }
        }

        return finalList;
    }
    const getCurrentAndFutureTodos = (todos, date) => {
        let finalTodos = []
        let initialTodos = todos;
        // let date = new Date();
        initialTodos.forEach(element => {
            let selectedDate = new Date(element.date);
            let dateCheck = true;

            if (selectedDate.getFullYear() > date.getFullYear()) {
                dateCheck = true;

            }
            else if (selectedDate.getFullYear() === date.getFullYear()) {
                if (selectedDate.getMonth() > date.getMonth()) {
                    dateCheck = true;

                }
                else if (selectedDate.getMonth() === date.getMonth()) {
                    if (selectedDate.getDate() >= date.getDate()) {
                        dateCheck = true;
                    }
                    else {
                        dateCheck = false;
                    }
                }
                else {
                    dateCheck = false;
                }
            }
            else {
                dateCheck = false;
            }

            if (dateCheck) {
                finalTodos = [...finalTodos, element]
            }
        });
        return finalTodos;
    }

    const markStatusDone = (event) => {
        const firebaseAccess = firebase.firestore()
        let accessEvents = []
        let doc = ""
        if (event.type === "appt") {
            accessEvents = appsState
            doc = "shortTerm"
        }
        else if (event.type === "routine") {
            accessEvents = routinesState
            doc = "routines"
        }
        else {
            accessEvents = tasksState
            doc = "todos"
        }

        for (let index = 0; index < accessEvents.length; index++) {
            if (accessEvents[index].title === event.description) {
                accessEvents[index].status = "done"
            }
        }
        const resetStatus = Object.assign({}, accessEvents)
        firebaseAccess
            .collection('users')
            .doc(firebase.auth().currentUser.uid)
            .collection('userData')
            .doc(doc)
            .set(resetStatus)

        getInit()
    }

    const eventClicked = (event) => {
        //On Click oC a event showing alert from here
        Alert.alert(
            capitalize(event.type),
            event.description,
            [
                {
                    text: "cancel",
                    onPress: () => { return },
                    style: 'cancel'
                },
                { text: "mark as done", onPress: () => { markStatusDone(event) } }
            ]
        );
    }

    const capitalize = (string) => {
        if(string.charCodeAt(0) > 96 && string.charCodeAt(0) < 123) {
            string = String.fromCharCode(string.charCodeAt(0) - 32) + string.substring(1)
        }
        return string
    }

    const [tasksState, setTasks] = useState()
    const [routinesState, setRoutines] = useState()
    const [appsState, setApps] = useState()
    const [dateFormat, setDateFormat] = useState();
    const [Calendarevents, setEvents] = useState([
        {
            id: 1,
            description: 'Event',
            startDate: new Date(),
            endDate: new Date(2022, 2, 18, 19, 30),
            color: '#ff005d',
            // ... more properties if needed,
        },
    ]);
    return (

        <SafeAreaView style={styles.container} onTouchStart={getInit}>
            <View style={styles.calendarContainer}>
                <WeekView
                    events={Calendarevents}
                    selectedDate={new Date()}
                    numberOfDays={1}
                    timeStep={30}
                    formatTimeLabel={'h:mm A'}
                    showNowLine
                    nowLineColor={'black'}
                    onEventPress={(event) => { eventClicked(event) }}
                    headerStyle={styles.calendarHeaderStyle}
                    headerTextStyle={styles.headerTextStyle}
                    hourTextStyle={styles.hourTextStyle}
                />
            </View>
        </SafeAreaView>
    );
}

export default allEventCalendar

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    calendarContainer: {
        marginHorizontal: 30,
        marginBottom: 20,
        marginTop: 30
    },
    calendarHeaderStyle: {
        backgroundColor: '#94A285',
        color: '#fff',
        borderColor: '#fff'
    },
    headerTextStyle: {
        fontSize: 15,
        color: 'white'
    },
    hourTextStyle: {
        color: '#94A285'
    }
})
