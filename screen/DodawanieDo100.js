import React, { useState} from 'react';
import {Alert, Text, View, StyleSheet, TouchableOpacity} from "react-native";
import { theme, Button, Input } from 'galio-framework';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from "react-native-vector-icons/FontAwesome";
import {Dzialanie, Przyciski, Odpowiedzi} from "../components/StyleComponentow";

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
    }

    const sprSum = () => {
        calc()
        const sum = number1 + number2;
        //setShow(!isShow);
        if (parseInt(userInput) === sum) {
            setScore(score + 1);
            //{<Toast isShow={isShow} positionIndicator="top">Odpowiedź błędna</Toast>}
            //Alert.alert('Poprawna odpowiedź!', `Twój wynik: ${score + 1}`);
        } else {
            setBlad(blad + 1);
            //{<Toast isShow={isShow} positionIndicator="top">Odpowiedź błędna</Toast>}
            //Alert.alert('Błędna odpowiedź!', `Spróbuj ponownie. Ilość błędów: ${blad + 1}`);
        }
    };
    const resetScore = () => {
        setScore(0);
        setBlad(0);
    }
    return (
        <LinearGradient colors={['#ADA996', '#F2F2F2', '#DBDBDB', '#EAEAEA']} style={styles.container}>
            <Dzialanie>
                <Text style={{fontSize: 40 , fontWeight: 'bold'}}>{String(number1)}  +  {String(number2)} = </Text>
                <Input color={theme.COLORS.SUCCESS}
                       fontSize={30}
                       style={{ borderColor: theme.COLORS.SUCCESS, width: 100, textAlign: 'center', fontWeight: 'bold' }}
                       placeholderTextColor={theme.COLORS.SUCCESS}
                       onChangeText={(text) => setUserInput(text)}
                       value={userInput} />
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
                {/*<Button color="success"*/}
                {/*        size="large"*/}
                {/*        round*/}
                {/*        icon="check" iconFamily="check" iconSize={20} iconColor="#fff"*/}
                {/*        onPress={sprSum}>Sprawdź wynik</Button>*/}
                {/*<Button color="#F00"*/}
                {/*        size="large"*/}
                {/*        round*/}
                {/*        icon="clear" iconFamily="clear" iconSize={20} iconColor="#fff"*/}
                {/*        onPress={resetScore}>Czyść odpowiedzi</Button>*/}
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

export default DodawanieDo100;
const styles = StyleSheet.create({
   container: {
       flex: 1,
       alignItems: 'center',
       justifyContent: 'flex-start',
       flexDirection: 'column',
   },
});
