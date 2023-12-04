import * as React from 'react';
import {View, Text, ImageBackground} from "react-native";

const Home = ({navigation}) => {
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <ImageBackground source={require('../assets/background.png')} resizeMode="cover" />
            <Text
                onPress={() => alert('Ekran główny')}
                style={{fontSize:26, fontWeight: 'bold'}}>Ekran główny</Text>

        </View>
    );
};

export default Home;