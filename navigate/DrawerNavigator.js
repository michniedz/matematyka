import React from 'react';
import {createDrawerNavigator} from "@react-navigation/drawer";
import DodawanieDo100 from "../screen/DodawanieDo100";

const Drawer = createDrawerNavigator();
const DrawerNavigator = () => {
    return (
        <Drawer.Navigator>
            <Drawer.Screen name="Feed" component={Home} />
            <Drawer.Screen name="Article" component={DodawanieDo100} />
        </Drawer.Navigator>
    );
};

export default DrawerNavigator;
