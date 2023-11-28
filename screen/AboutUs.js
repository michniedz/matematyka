import React, {useState} from 'react';
import {View, StyleSheet, Text, Linking, TextInput, Button, Alert} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import MailCore from 'react-native-mailcore';
import SendIntentAndroid from 'react-native-send-intent';


const AboutUs = () => {
    const [temat, setTemat] = useState('');
    const [wiadomosc, setWiadomosc] = useState('');
    const odbiorca = 'michniedz@gmail.com';
    const handleSend = () => {
        const emailUri = `mailto:${odbiorca}?subject=${temat}&body=${wiadomosc}`;

        SendIntentAndroid.openChooserWithOptions(
            { temat, text: wiadomosc, title: 'Send Email' },
            'Send Email',
            emailUri
        )
            .then((isSent) => {
                if (isSent) {
                    Alert.alert('Email sent successfully');
                } else {
                    Alert.alert('Email not sent');
                }
            })
            .catch((error) => {
                console.error('Error sending email:', error);
                Alert.alert('Error sending email');
            });
    };


    // const handleSend = () => {
    //
    //     // Przykładowa funkcja fetch
    //     fetch('https://example.com/api/send-message', {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json',
    //         },
    //         body: JSON.stringify({
    //             subject: temat,
    //             message: wiadomosc,
    //         }),
    //     })
    //         .then((response) => response.json())
    //         .then((data) => {
    //             console.log('Success:', data);
    //             Alert.alert('Wiadomość wysłana!');
    //         })
    //         .catch((error) => {
    //             console.error('Error:', error);
    //             Alert.alert('Błąd wysyłania wiadomości. Spróbuj ponownie.');
    //         });
    // };
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
                <Button title={"Wyślij"} textStyle={{color: 'white'}} onPress={handleSend} />
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
