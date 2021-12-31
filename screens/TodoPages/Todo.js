import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Container } from '../../styles/AppStyles';
import Todosub from './Todosub';

const todo = () => {
    return (
        <Container>
            <Todosub/>
            <StatusBar style = 'light'/>
        </Container>
    )
}

export default todo