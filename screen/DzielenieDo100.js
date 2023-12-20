import React, {useEffect, useState} from 'react';
import {Alert, StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import { theme, Toast, Button, Input } from 'galio-framework';
import {Odpowiedzi, Przyciski, Dzialanie} from "../components/StyleComponentow";
import {LinearGradient} from "expo-linear-gradient";
import Icon from "react-native-vector-icons/FontAwesome";

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
        <LinearGradient colors={['#ADA996', '#F2F2F2', '#DBDBDB', '#EAEAEA']} style={styles.container}>
            <Dzialanie>
                <Text style={{fontSize: 40, fontWeight: 'bold'}}>{String(number1>=number2?number1:number2)}  :  {String(number1<number2?number1:number2)} = </Text>
                <Input color={theme.COLORS.SUCCESS}
                    fontSize={30}
                    style={{ borderColor: theme.COLORS.SUCCESS, width: 70  }}
                    placeholderTextColor={theme.COLORS.SUCCESS}
                    onChangeText={(text) => setUserInput(text)}
                    value={userInput}
                />
                <Text style={{fontSize: 30, fontWeight: 'bold'}}>reszty</Text>
                <Input color={theme.COLORS.SUCCESS}
                    fontSize={30}
                    style={{ borderColor: theme.COLORS.SUCCESS, width: 70 }}
                    placeholderTextColor={theme.COLORS.SUCCESS}
                    onChangeText={(text) => setUserInput2(text)}
                    value={userInput2}
                />
            </Dzialanie>
            <Przyciski>
                <TouchableOpacity onPress={sprSum} style={{marginVertical: 10}}>
                    <LinearGradient
                        colors={['green', 'rgb(0,255,0)', 'green' ]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 0.9, y: 0.9 }}
                        style={{
                            padding: 15,
                            alignItems: 'center',
                            borderRadius: 5,
                        }}
                    >
                        <Text
                            style={{ color: 'white', fontWeight: 'bold', fontSize: 20}}>
                            <Icon color='white' name='check' style={{fontSize: 20}} />
                            Sprawdź wynik
                        </Text>
                    </LinearGradient>
                </TouchableOpacity>
                <TouchableOpacity onPress={resetScore} style={{marginVertical: 10}}>
                    <LinearGradient
                        colors={['rgb(155,0,0)', 'red', 'rgb(155,0,0)' ]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={{
                            padding: 15,
                            alignItems: 'center',
                            borderRadius: 5,
                        }}
                    >
                        <Text
                            style={{ color: 'white', fontWeight: 'bold', fontSize: 20 }}>
                            <Icon color='white' name='remove' style={{fontSize: 20}} />
                            Czyść odpowiedzi
                        </Text>
                    </LinearGradient>
                </TouchableOpacity>
            </Przyciski>
            <Odpowiedzi>
                {
                    //score > 0 ? <Text style={{fontSize: 20, color: 'green'}}>Poprawne odpowiedzi: {score} </Text> : null
                    score > 0 ? <View>
                        <Text style={{fontSize: 40, color: 'green', fontWeight: 'bold'}}>
                            <Icon color='green' name='check' style={{fontSize: 40}} />{score} </Text>
                    </View> : null
                }
                {
                    //blad > 0 ? <Text style={{fontSize: 20, color: 'red'}}>Błędne odpowiedzi: {blad}</Text> : null
                    blad > 0 ? <View>
                        <Text style={{fontSize: 40, color: 'red', fontWeight: 'bold'}}>
                            <Icon color='red' name='remove' style={{fontSize: 40}} />{blad} </Text>
                    </View> : null
                }
            </Odpowiedzi>

        </LinearGradient>
    );
};

export default DzielenieDo100;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        flexDirection: 'column',
    },
    dzialanie: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
    },
});
