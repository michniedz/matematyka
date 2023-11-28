import * as React from 'react';
import {View, Text } from "react-native";

const Home = ({navigation}) => {
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text
                onPress={() => alert('Ekran główny')}
                style={{fontSize:26, fontWeight: 'bold'}}>Ekran główny</Text>
        </View>
    );
};

export default Home;