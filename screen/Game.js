import * as React from 'react';
import {View, Text, TouchableOpacity} from "react-native";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {useLinkTo} from "@react-navigation/native";
import TopTabNavigator from "../navigate/TopTabNavigator";

const Stack = createNativeStackNavigator();

const Game = ({navigation}) => {
    const link = useLinkTo();
    return (
        <>
            <TopTabNavigator />
            {/*<View>*/}
            {/*    <Text>Drugi ekran</Text>*/}
            {/*    <TouchableOpacity onPress={() => link('/Dodawanie')}>*/}
            {/*        <Text>Przejdź do Dodawania</Text>*/}
            {/*    </TouchableOpacity>*/}

            {/*</View>*/}
        </>

    );
};

export default Game;