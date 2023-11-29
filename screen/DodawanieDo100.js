import React, {useEffect, useState} from 'react';
import {Alert, Text, TextInput, View, StyleSheet} from "react-native";
import { Button } from '@rneui/themed';



const DodawanieDo100 = () => {
    const generateRandomNumber = () => Math.floor(Math.random() * 100) + 1;
    const generateRandomNumber2 = () => Math.floor(Math.random() * (100-generateRandomNumber()) + 1);

    const [number1, setNumber1] = useState(generateRandomNumber);
    const [number2, setNumber2] = useState(generateRandomNumber2);
    const [userInput, setUserInput] = useState('');
    const [score, setScore] = useState(0);
    const [blad, setBlad] = useState(0);

    useEffect(() => {
        setNumber1(generateRandomNumber);
        setNumber2(generateRandomNumber2);
        setUserInput('');
    }, [score]);

    const sprSum = () => {
        const sum = number1 + number2;
        if (parseInt(userInput) === sum) {
            setScore(score + 1);
            Alert.alert('Poprawna odpowiedź!', `Twój wynik: ${score + 1}`);
        } else {
            setBlad(blad + 1);
            alert('Błędna odpowiedź!', `Spróbuj ponownie. Ilość błędów: ${blad + 1}`);
        }
    };
    const resetScore = () => {
        setScore(0);
        setBlad(0);
    }

    return (

        <View style={styles.container}>
            <View style={styles.dzialanie}>
                <Text style={{fontSize: 40}}>{String(number1)}  +  {String(number2)} = </Text>
                <TextInput
                    style={{ fontSize:40, height: 40, borderColor: 'gray', borderWidth: 1, marginTop: 10, marginBottom: 10, textAlign: 'center' }}
                    keyboardType="numeric"
                    onChangeText={(text) => setUserInput(text)}
                    value={userInput}
                />
            </View>
            <View style={styles.przyciski}>
                <Button type="outline" style={{fontSize: 40}} title="Sprawdź wynik" onPress={sprSum} />
                <Button type="clear" style={{fontSize: 40}} title="Resetuj odpowiedzi" onPress={resetScore} />
            </View>
            <View style={styles.odpowiedzi}>
                <Text style={{fontSize: 20, color: 'green'}}>Poprawne odpowiedzi: {score}</Text>
                <Text style={{fontSize: 20, color: 'red'}}>Błędne odpowiedzi: {blad}</Text>
            </View>

        </View>
    );
};

export default DodawanieDo100;
const styles = StyleSheet.create({
   container: {
       flex: 1,
       alignItems: 'center',
       justifyContent: 'center',
   },
    dzialanie: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
    },
    przyciski: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 5,
        marginHorizontal: 10,
    },
    odpowiedzi: {
        flexDirection: 'column',
    }
});
