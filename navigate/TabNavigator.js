import React from 'react';
import Home from "../screen/Home";
import Icon from "react-native-vector-icons/FontAwesome";
import Icon2 from "react-native-vector-icons/MaterialIcons"
import Game from "../screen/Game";
import {NavigationContainer} from "@react-navigation/native";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import AboutUs from "../screen/AboutUs";

const Tab = createBottomTabNavigator();
const TabNavigator = () => {
    return (
        <NavigationContainer>
            <Tab.Navigator>
                <Tab.Screen name="Home" component={Home}
                            options={{
                                tabBarLabel: 'Home',
                                tabBarIcon: () => (
                                    <Icon name="home" color="black" size={26} />
                                ),
                            }}/>
                <Tab.Screen name="GRY - nauka liczenia" component={Game}
                            options={{
                                tabBarLabel: 'GRY',
                                tabBarIcon: () => (
                                    <Icon name="gamepad" color="black" size={26} />
                                ),
                            }}/>
                <Tab.Screen name="Kontakt" component={AboutUs}
                            options={{
                                tabBarLabel: 'Kontakt',
                                tabBarIcon: () => (
                                    <Icon2 name="contact-mail" color="black" size={26} />
                                ),
                            }}/>

            </Tab.Navigator>
        </NavigationContainer>
    );
};

export default TabNavigator;
