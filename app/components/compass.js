import React, { useState, useEffect } from 'react';
import { Image, View, Text, Dimensions, SafeAreaView, TouchableOpacity, StyleSheet } from 'react-native';
import { Grid, Col, Row } from 'react-native-easy-grid';
import { Magnetometer } from 'expo-sensors';
import * as Haptics from 'expo-haptics';
import ZeroDegree from './ZeroDegree--extracted-from-package.js';
import { useSegments } from 'expo-router';

const { height, width } = Dimensions.get('window');
let _Mecca = { latitude: 21.42252, longitude: 39.82621 };

export default App = () => {
    const [subscription, setSubscription] = useState(null);
    const [magnetometer, setMagnetometer] = useState(0);

    const [err, setError] = useState(null);
    const [degree, setDegree] = useState(0);
    const [log, setLog] = useState(null);

    const routes = useSegments();

    const _slow = () => Magnetometer.setUpdateInterval(1000);
    const _fast = () => Magnetometer.setUpdateInterval(16);

    useEffect(() => {
        _toggle();
        return () => {
            _unsubscribe();
        };
    }, []);

    const _toggle = () => {
        if (subscription) {
            _unsubscribe();
        } else {
            _subscribe();
        }
    };

    const _subscribe = () => {
        setSubscription(
            Magnetometer.addListener(result => {
                setMagnetometer(_angle(result));
            })
        );

        // console.log('subscribed');
    };

    const _unsubscribe = () => {
        subscription && subscription.remove();
        setSubscription(null);

        // console.log('unsubscribed');
    };

    const FILTER_SIZE = 5;

    const _angle = (magnetometer) => {
        let angle = 0;
        if (magnetometer) {
            let { x, y, z } = magnetometer;
            if (Math.atan2(y, x) >= 0) {
                angle = Math.atan2(y, x) * (180 / Math.PI);
            } else {
                angle = (Math.atan2(y, x) + 2 * Math.PI) * (180 / Math.PI);
            }
        }

        // console.log('angle', angle);
        return Math.round(smooth(angle));
    };

    const smooth = (() => {
        const buffer = new Array(FILTER_SIZE).fill(0);
        let index = 0;
        let sum = 0;

        return (value) => {
            sum = sum - buffer[index] + value;
            buffer[index] = value;
            index = (index + 1) % FILTER_SIZE;
            return sum / FILTER_SIZE;
        };
    })();

    const _direction = (degree) => {
        if (degree >= 22.5 && degree < 67.5) {
            return 'NE';
        }
        else if (degree >= 67.5 && degree < 112.5) {
            return 'E';
        }
        else if (degree >= 112.5 && degree < 157.5) {
            return 'SE';
        }
        else if (degree >= 157.5 && degree < 202.5) {
            return 'S';
        }
        else if (degree >= 202.5 && degree < 247.5) {
            return 'SW';
        }
        else if (degree >= 247.5 && degree < 292.5) {
            return 'W';
        }
        else if (degree >= 292.5 && degree < 337.5) {
            return 'NW';
        }
        else {
            return 'N';
        }
    };

    // Match the device top with pointer 0° degree. (By default 0° starts from the right of the device.)
    const _degree = (magnetometer) => {
        return magnetometer - 90 >= 0 ? magnetometer - 90 : magnetometer + 271;
    };

    // Getting qibla direction
    useEffect(() => {
        let zeroDegree;
        async function initZeroDegree() {
            zeroDegree = new ZeroDegree(_Mecca);
            zeroDegree._getLogData = log => setLog(log);

            await zeroDegree.watchAsync(
                degree => {
                    let rounded = Math.round(degree);
                    let finalDegree = rounded < 0 ? rounded + 360 : rounded;
                    finalDegree -= 5;
                    if (finalDegree < 0) {
                        finalDegree += 360;
                    }
                    setDegree(finalDegree);

                    if (finalDegree === 0)
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
                },
                err => setError(err));
        }

        initZeroDegree();

        return () => zeroDegree.unwatch();
    }, []);

    useEffect(() => {
        // if routes has qibla in it, then it means we are in qibla screen
        if (routes.includes('Qibla')) {
            // subscribe to magnetometer
            _subscribe();
        } else {
            // unsubscribe from magnetometer
            _unsubscribe();
        }
    }, [routes]);


    return (
        <SafeAreaView className="w-full h-full ">
            <Grid style={{ backgroundColor: 'black' }}>
                <Row style={{ alignItems: 'center' }} size={.9}>
                    <Col style={{ alignItems: 'center' }}>
                        <Text
                            style={{
                                color: '#fff',
                                fontSize: height / 26,
                                fontWeight: 'bold'
                            }}>
                            {_direction(_degree(magnetometer))}
                        </Text>
                    </Col>
                </Row>

                <Row style={{ alignItems: 'center' }} size={.1}>
                    <Col style={{ alignItems: 'center' }}>
                        <View style={{ position: 'absolute', width: width, alignItems: 'center', top: -50 }}>
                            <Image source={require('./../../assets/compass_pointer.png')} style={{
                                height: height / 15,
                                resizeMode: 'contain'
                            }} />
                        </View>
                    </Col>
                </Row>

                <Row style={{ alignItems: 'center' }} size={2}>
                    <Text style={{
                        color: '#fff',
                        fontSize: height / 27,
                        width: width,
                        position: 'absolute',
                        textAlign: 'center'
                    }}>
                        {degree}°
                    </Text>

                    <Col style={{ alignItems: 'center' }}>

                        <Image source={require("@assets/compass_bg.png")} style={{
                            height: width,
                            justifyContent: 'center',
                            alignItems: 'center',
                            resizeMode: 'contain',
                            transform: [{ rotate: 360 - magnetometer + 'deg' }],
                            position: 'relative'
                        }} />

                    </Col>
                </Row>

                <Row style={{ alignItems: 'center' }} size={1}>
                    <Col style={{ alignItems: 'center' }}>
                        <Text style={{ color: '#fff' }}>Magnetometer : {_degree(magnetometer)}°</Text>
                    </Col>
                    {/* <Col style={{ alignItems: 'center' }}>
                        <TouchableOpacity onPress={subscription ? _unsubscribe : _subscribe} style={styles.button}>
                            <Text>{subscription ? 'On' : 'Off'}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={_slow} style={[styles.button, styles.middleButton]}>
                            <Text>Slow</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={_fast} style={styles.button}>
                            <Text>Fast</Text>
                        </TouchableOpacity>
                    </Col> */}
                </Row>
            </Grid>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    button: {
        alignItems: 'center',
        backgroundColor: '#DDDDDD',
        padding: 10,
        margin: 5,
        borderRadius: 5
    },
    middleButton: {
        marginHorizontal: 0
    }
});
