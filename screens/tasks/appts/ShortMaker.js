import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Container } from '../../../styles/AppStyles';
import RoutineSub from './ShortSub';

const todo = () => {
    return (
        <Container>
            <RoutineSub/>
            <StatusBar style = 'light'/>
        </Container>
    )
}

export default todo