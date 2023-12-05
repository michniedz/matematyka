import * as React from 'react';
import {View, Text, ImageBackground, StyleSheet} from "react-native";

const Home = ({navigation}) => {
    return (
        <View style={styles.container}>
            <ImageBackground source={require('../assets/background.png')}
                             resizeMode="cover"
                             style={styles.image} />
            <Text
                onPress={() => alert('Przejdź do zakładki GRY')}
                style={styles.text}>Aplikacja do nauki liczenia</Text>

        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    image: {
        flex: 1,
        justifyContent: 'center',
    },
    text: {
        color: 'white',
        fontSize: 42,
        lineHeight: 84,
        fontWeight: 'bold',
        textAlign: 'center',
        backgroundColor: '#0000009F',
    },
});
export default Home;