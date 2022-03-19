import React, { useState, useEffect } from 'react';

import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { firebase } from '../../firebase/config';


const UpcomingTasks = ({ todos, routines, apps }) => {

    const fetchUpcomingTasks = async () => {

        let date = new Date();

        const documentSnapshot = await firebase.firestore()
        .collection('users')
        .doc(firebase.auth().currentUser.uid)
        .collection('userData')
        .doc('todos')
        .get()
  
        let initialTodos = Object.values(Object.seal(documentSnapshot.data()))
        initialTodos = getPendingItems(initialTodos)

        const documentSnapshot1 = await firebase.firestore()
        .collection('users')
        .doc(firebase.auth().currentUser.uid)
        .collection('userData')
        .doc('routines')
        .get()
  
        let initialRoutines = Object.values(Object.seal(documentSnapshot1.data()))
        initialRoutines = getPendingItems(initialRoutines)

        const documentSnapshot2 = await firebase.firestore()
        .collection('users')
        .doc(firebase.auth().currentUser.uid)
        .collection('userData')
        .doc('shortTerm')
        .get()
  
        let initialApps = Object.values(Object.seal(documentSnapshot2.data()))

        initialApps = getPendingItems(initialApps)

        initialRoutines = SortElementsFromNum(initialRoutines); // sorting routines from morning to night based on the time
        initialTodos = getCurrentAndFutureTodos(initialTodos, date); // getting the current and future todos interms of date


        let schedule = createSchedule(initialTodos, initialRoutines, initialApps)

        let finalUpcomingTasks = [];
        if (schedule.length > 3) {
            for (let index = 0; index < 3; index++) {
                finalUpcomingTasks = [...finalUpcomingTasks, schedule[index]]
            }
        }
        else {
            for (let index = 0; index < schedule.length; index++) {
                finalUpcomingTasks = [...finalUpcomingTasks, schedule[index]]
            }
        }

        setUpcomingTasks(finalUpcomingTasks);
    }

    const createSchedule = (todos, routines, apps) => {
        let finalSchedule = []
        let missedList = todos;
        let date = new Date();
        let keyVal = 1;

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


    const [UpcomingTasks, setUpcomingTasks] = useState([])

    useEffect(() => {
        fetchUpcomingTasks()
    }, [])

    return (
            <>
                {UpcomingTasks.length == 0 && <Text>wohoo! you don't have any tasks today!</Text>}
                {UpcomingTasks.length != 0 &&
                    <ScrollView>
                        {
                            UpcomingTasks.map((element) =>
                                <TouchableOpacity style={styles.item}>
                                    <Text style={styles.text}>
                                        Title: {element.title}
                                        {/* {"\n"}
                                        Matches played: {`${element.matches}`} */}
                                    </Text>
                                </TouchableOpacity>
                            )
                        }
                    </ScrollView>
                }
            </>
    );
}

export default UpcomingTasks

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },

    item: {
        backgroundColor: '#0782F9',
        padding: 20,
        margin: 10,
        borderRadius: 20
    },
    text: {
        fontSize: 20,
        color: 'black',
        fontWeight: 'bold'
      },
})