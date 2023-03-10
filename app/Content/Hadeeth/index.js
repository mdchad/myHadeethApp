import { View, Text, TouchableWithoutFeedback, Keyboard, Image, ScrollView, useWindowDimensions, StyleSheet, FlatList } from 'react-native'
import React from 'react'
import { Link } from 'expo-router'
import { FontAwesome5, AntDesign } from '@expo/vector-icons';
import { useAuth } from "@context/auth";
// import Header from '@components/header';

const DATA = [
    {
        id: '1',
        title: 'Sunan Ad-Darimi',
    },
    {
        id: '2',
        title: 'Sunan Abi Daud',
    },
    {
        id: '3',
        title: 'Muwatta’ Malik',
    },
    {
        id: '4',
        title: 'Sunan Al-Nasa’i',
    },
    {
        id: '5',
        title: 'Sunan Al-Bayhaqi',
    },
    {
        id: '6',
        title: 'Sunan Al-Tirmidzi',
    },
    {
        id: '7',
        title: 'Sunan Ibn Majah',
    },
    {
        id: '8',
        title: 'Sunan Al-Darimi',
    },
];



const Hadeeth = () => {
    const { height, width, scale, fontScale } = useWindowDimensions();
    const styles = makeStyles(fontScale);
    const { user } = useAuth()

    const Item = ({ title, id }) => (
        <Link href={`Content/Hadeeth/${id}?title=${title}`}>
            <View className="space-x-3 flex flex-row font-xl p-3 justify-center items-center">
                <FontAwesome5 name="book" size={16} color="black" />
                <Text style={styles.title}>{title}</Text>
            </View>
        </Link >
    );

    return (
        <View className="flex-1 flex space-y-3 bg-white">
            {/* <Header user={user.full_name} /> */}

            {/* <ScrollView> */}
            <View className="flex-1">
                <FlatList
                    data={DATA}
                    renderItem={({ item }) => <Item title={item.title} id={item.id} />}
                    keyExtractor={item => item.id}
                    className="p-3 space-y-10"
                />
            </View>
            {/* </ScrollView> */}
        </View>
    );
};

const makeStyles = fontScale => StyleSheet.create({
    safeAreaViewContainer: {
        minWidth: '100%',
        minHeight: '100%',
        backgroundColor: 'red',
        justifyContent: 'center',
        alignItems: 'center',
    },
    screenContainer: {
        height: '100%',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 20,
    },
    boxContainer: {
        paddingHorizontal: 36,
        paddingVertical: 36,
        alignItems: 'center',
        backgroundColor: '#D0D0D0',
        width: '100%',
        height: '100%',
    },
    sectionTitle: {
        fontSize: 50 / fontScale, // divide the font size by the font scale
        fontWeight: '600',
    },
    imageTop: {
        height: 200,
        width: 300,
    },
    imageBot: {
        height: 200,
        width: 300,
        marginTop: 20,
    },
    item: {
        padding: 3,
        marginVertical: 8,
        marginHorizontal: 16,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    title: {
        fontSize: 20,
    },
});

export default Hadeeth