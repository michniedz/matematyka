import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import DodawanieDo100 from "../screen/DodawanieDo100";
import OdejmowanieDo100 from "../screen/OdejmowanieDo100";
import DzielenieDo100 from "../screen/DzielenieDo100";
import MnozenieDo100 from "../screen/MnozenieDo100";
import Icon from "react-native-vector-icons/FontAwesome5";
import Icon2 from "react-native-vector-icons/MaterialCommunityIcons";
import Icon3 from "react-native-vector-icons/Ionicons";
import React from "react";

const Tab = createMaterialTopTabNavigator();



function TopTabNavigator() {
    return (
        <Tab.Navigator>
            <Tab.Screen name="Dodawanie" component={DodawanieDo100}
                        options={{
                            tabBarLabel: 'dodawanie',
                            tabBarIcon: () => (
                                <Icon3 name="add" color="black" size={32} />
                            ),
                        }}
            />
            <Tab.Screen name="Odejmowanie" component={OdejmowanieDo100}
                        options={{
                            tabBarLabel: 'odejmowanie',
                            tabBarIcon: () => (
                                <Icon name="minus" color="black" size={24} />
                            ),
                        }}
            />
            <Tab.Screen name="Mnożenie" component={MnozenieDo100}
                        options={{
                            tabBarLabel: 'mnożenie',
                            tabBarIcon: () => (
                                <Icon2 name="multiplication" color="black" size={24} />
                            ),
                        }}
            />
            <Tab.Screen name="Dzielenie" component={DzielenieDo100}
                        options={{
                            tabBarLabel: 'dzielenie',
                            tabBarIcon: () => (
                                <Icon name="divide" color="black" size={24} />
                            ),
                        }}
            />
        </Tab.Navigator>
    );
}
export default TopTabNavigator;