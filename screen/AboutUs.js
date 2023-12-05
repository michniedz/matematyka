import React, {useState} from 'react';
import {View, StyleSheet, Text, Linking, TextInput, Button, Alert} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";


const AboutUs = () => {
    const [temat, setTemat] = useState('');
    const [wiadomosc, setWiadomosc] = useState('');
    const odbiorca = 'michniedz@gmail.com';



    return (
        <View style={styles.inputView}>
            <View style={styles.ikony}>
                <View style={styles.blok}>
                    <Icon name="youtube" size={50} />
                    <Text
                        onPress={() => Linking.openURL('http://youtube.com/@egzaminyInf')}>
                        @egzaminyINF
                    </Text>
                </View>
                <View style={styles.blok}>
                    <Icon name="github" size={50} />
                    <Text
                        onPress={() => Linking.openURL('http://github.com/egzaminyInf')}>
                        @egzaminyINF
                    </Text>
                </View>
                <View style={styles.blok}>
                    <Icon name="facebook" size={50} />
                    <Text
                        onPress={() => Linking.openURL('http://facebook.com/egzaminyINF/')}>
                        @egzaminyINF
                    </Text>
                </View>
            </View>
            <View style={styles.form}>
                <Text style={{fontSize: 25, textAlign:"left"}}>Temat:</Text>
                <TextInput
                    style={styles.inputText}
                    label={"Temat"}
                    onChangeText={(text) => setTemat(text)}
                />
                <Text style={{fontSize: 25, textAlign:"left"}}>Wiadomość:</Text>
                <TextInput
                    style={styles.inputText2}
                    label={"Wiadomość"}
                    multiline={true}
                    onChangeText={(text) => setWiadomosc(text)}
                />
                <Button title={"Wyślij"} textStyle={{color: 'white'}}  />
            </View>
        </View>
    );
};

export default AboutUs;
const styles = StyleSheet.create({
    inputView: {
        width: '100%',
        paddingTop: 50,
        backgroundColor: 'white',
        height: '100%',
        display: 'flex',
    },
    ikony: {
        alignItems: 'center',
        paddingVertical: 40,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
    },
    blok: {
        alignItems: 'center',
    },
    form: {

        flexDirection: 'column',
    },
    inputText: {
        fontSize:20,
        height: 40,
        width: "100%",
        borderColor: 'gray',
        borderWidth: 1,
        marginTop: 10,
        marginBottom: 10,
        textAlign: 'left',
    },
    inputText2: {
        fontSize:20,
        height: 120,
        width: "100%",
        borderColor: 'gray',
        borderWidth: 1,
        marginTop: 10,
        marginBottom: 10,
        textAlign: 'left',
    },
});
