import React, {useEffect, useState} from 'react';
import {Alert, Button, StyleSheet, Text, TextInput, View} from "react-native";

const generateRandomNumber = () => Math.floor(Math.random() * 10) + 1;
const DzielenieDo100 = () => {
    const [number1, setNumber1] = useState(generateRandomNumber());
    const [number2, setNumber2] = useState(generateRandomNumber());
    const [userInput, setUserInput] = useState('');
    const [userInput2, setUserInput2] = useState('');
    const [score, setScore] = useState(0);
    const [blad, setBlad] = useState(0);

    useEffect(() => {
        setNumber1(generateRandomNumber());
        setNumber2(generateRandomNumber());
        setUserInput('');
        setUserInput2('');
    }, [score]);
    const sprSum = () => {
        let iloraz = 0, reszta = 0;
        if (number1 >= number2){
            iloraz = Math.floor(number1 / number2);
            reszta = number1 % number2
        }else{
            iloraz = Math.floor(number2 / number1);
            reszta = number2 % number1
        }

        if (parseInt(userInput) === iloraz) {
            setScore(score + 1);
            Alert.alert('Poprawna odpowiedź!', `Twój wynik: ${score + 1}`);
        } else {
            Alert.alert('Błędna odpowiedź!', `Spróbuj ponownie. Ilość błędów: ${blad + 1}`);
            setBlad(blad + 1);
        }
    };
    const resetScore = () => {
        setScore(0);
        setBlad(0);
    }
    return (
        <View style={styles.container}>
            <View style={styles.dzialanie}>
                <Text style={{fontSize: 40}}>{String(number1>=number2?number1:number2)}  :  {String(number1<number2?number1:number2)} = </Text>
                <TextInput
                    style={{ fontSize:40, height: 40, borderColor: 'gray', borderWidth: 1, marginTop: 10, marginBottom: 10, textAlign: 'center' }}
                    keyboardType="numeric"
                    onChangeText={(text) => setUserInput(text)}
                    value={userInput}
                />
                <Text style={{fontSize: 30}}>reszty</Text>
                <TextInput
                    style={{ fontSize:40, height: 40, borderColor: 'gray', borderWidth: 1, marginTop: 10, marginBottom: 10, textAlign: 'center' }}
                    keyboardType="numeric"
                    onChangeText={(text) => setUserInput2(text)}
                    value={userInput2}
                />
            </View>
            <View style={styles.przyciski}>
                <Button style={{fontSize: 40}} title="Sprawdź wynik" onPress={sprSum} />
                <Button style={{fontSize: 40}} title="Resetuj odpowiedzi" onPress={resetScore} />
            </View>
            <View style={styles.odpowiedzi}>
                <Text style={{fontSize: 20, color: 'green'}}>Poprawne odpowiedzi: {score}</Text>
                <Text style={{fontSize: 20, color: 'red'}}>Błędne odpowiedzi: {blad}</Text>
            </View>

        </View>
    );
};

export default DzielenieDo100;
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
