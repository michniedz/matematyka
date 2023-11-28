import React from 'react';
import {createStackNavigator} from "@react-navigation/stack";
import Home from "../screen/Home";
import DodawanieDo100 from "../screen/DodawanieDo100";
import {createNativeStackNavigator} from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();
const StackNavigator = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="Dodawanie" component={DodawanieDo100} />
        </Stack.Navigator>
    );
};

export default StackNavigator;
