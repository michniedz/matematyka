import React, {useEffect, useState} from 'react';
import {Alert, StyleSheet, Text, TextInput, View} from "react-native";
import { theme, Toast, Button, Input } from 'galio-framework';

const generateRandomNumber = () => Math.floor(Math.random() * 100) + 1;
const OdejmowanieDo100 = () => {
    const [number1, setNumber1] = useState(generateRandomNumber());
    const [number2, setNumber2] = useState(generateRandomNumber());
    const [userInput, setUserInput] = useState('');
    const [score, setScore] = useState(0);
    const [blad, setBlad] = useState(0);

    useEffect(() => {
        setNumber1(generateRandomNumber());
        setNumber2(generateRandomNumber());
        setUserInput('');
    }, [score]);
    const sprSum = () => {
        let roznica = 0;
        if (number1 >= number2){
             roznica = number1 - number2;
        }else{
             roznica = number2 - number1;
        }

        if (parseInt(userInput) === roznica) {
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
                <Text style={{fontSize: 40}}>{String(number1>=number2?number1:number2)}  -  {String(number1<number2?number1:number2)} = </Text>
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

export default OdejmowanieDo100;
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
