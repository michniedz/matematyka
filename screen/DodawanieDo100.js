import React, {useEffect, useMemo, useState} from 'react';
import {Alert, Text, TextInput, View, StyleSheet} from "react-native";
import { theme, Toast, Button, Input } from 'galio-framework';

const generateRandomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const DodawanieDo100 = () => {
    const maxNumber = 100;
    const [number1, setNumber1] = useState(generateRandomNumber(1, maxNumber));
    const [number2, setNumber2] = useState(generateRandomNumber(1, maxNumber-number1));

    const [userInput, setUserInput] = useState('');
    const [score, setScore] = useState(0);
    const [blad, setBlad] = useState(0);

    const calc = () => {
        setUserInput('')
        const newNumber = generateRandomNumber(1, maxNumber)
        setNumber1(newNumber)
        setNumber2(generateRandomNumber(1, maxNumber - newNumber))
        console.log(number1, number2)
    }

    const sprSum = () => {
        calc()
        const sum = number1 + number2;
        //setShow(!isShow);
        if (parseInt(userInput) === sum) {
            setScore(score + 1);
            //{<Toast isShow={isShow} positionIndicator="top">Odpowiedź błędna</Toast>}
            Alert.alert('Poprawna odpowiedź!', `Twój wynik: ${score + 1}`);
        } else {
            setBlad(blad + 1);
            //{<Toast isShow={isShow} positionIndicator="top">Odpowiedź błędna</Toast>}
            Alert.alert('Błędna odpowiedź!', `Spróbuj ponownie. Ilość błędów: ${blad + 1}`);
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
                {/*<TextInput*/}
                {/*    style={{ fontSize:40, width: 100, height: 45, borderColor: 'gray', borderWidth: 1, marginTop: 10, marginBottom: 10, textAlign: 'center' }}*/}
                {/*    keyboardType="numeric"*/}
                {/*    onChangeText={(text) => setUserInput(text)}*/}
                {/*    value={userInput}*/}
                {/*/>*/}
                <Input color={theme.COLORS.SUCCESS}
                       fontSize={30}
                       style={{ borderColor: theme.COLORS.SUCCESS, width: 100 }}
                       placeholderTextColor={theme.COLORS.SUCCESS}
                       onChangeText={(text) => setUserInput(text)}
                       value={userInput} />
            </View>
            <View style={styles.przyciski}>
                <Button color="success"
                        round size="medium"
                        icon="check" iconFamily="check" iconSize={20} iconColor="#fff"
                        onPress={sprSum}>Sprawdź wynik</Button>
                <Button color="#F00"
                        round size="medium"
                        icon="clear" iconFamily="clear" iconSize={20} iconColor="#fff"
                        onPress={resetScore}>Czyść odpowiedzi</Button>
            </View>
            <View style={styles.odpowiedzi}>
                {
                    blad > 0 ? <Text style={{fontSize: 20, color: 'red'}}>Błędne odpowiedzi: {blad}</Text> : null
                }
                {
                    score > 0 ? <Text style={{fontSize: 20, color: 'green'}}>Poprawne odpowiedzi: {score}</Text> : null
                }
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
