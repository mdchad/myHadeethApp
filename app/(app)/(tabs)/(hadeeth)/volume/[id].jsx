import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableHighlight, ActivityIndicator } from "react-native";
import { useSearchParams, useRouter } from "expo-router";
import volumes from '@data/volumes.json';
import AsyncStorage from '@react-native-async-storage/async-storage';
let he = require('he');

const VOLUMES_STORAGE_KEY = "CategoriesStorage";

const HadeethCategoryItem = ({ item, onPress }) => (
    <TouchableHighlight onPress={() => onPress(item)} underlayColor="#f9fafb" style={{ marginVertical: 6, borderRadius: 10, overflow: 'hidden' }}>
        <View style={{ padding: 16, backgroundColor: 'white' }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text className="capitalize text-lg font-semibold">{he.decode(item.title.ms)}</Text>
            </View>
        </View>
    </TouchableHighlight>
);

const storeData = async (key, value) => {
    try {
        await AsyncStorage.setItem(`${VOLUMES_STORAGE_KEY}:${key}`, JSON.stringify(value));
    } catch (error) {
        console.error("Error saving data to AsyncStorage", error);
    }
}

const retrieveData = async (key) => {
    try {
        const value = await AsyncStorage.getItem(`${VOLUMES_STORAGE_KEY}:${key}`);
        if (value !== null) {
            return JSON.parse(value);
        }
    } catch (error) {
        console.error("Error retrieving data from AsyncStorage", error);
    }
    return null;
}

const HadeethCategory = () => {
    const { id } = useSearchParams();
    const router = useRouter();
    const [filteredVolumes, setFilteredVolumes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const onPressHadith = (volume) => {
        router.push({
            pathname: `/(hadeeth)/content/${volume.id}`,
            params: {
                volumeId: volume.id,
                bookId: volume.book_id,
            }
        });
    };

    useEffect(() => {
        const fetchData = async () => {
            let cachedData = await retrieveData(id);
            if (cachedData) {
                // console.log('Data retrieved from cache.');
                setFilteredVolumes(cachedData);
            } else {
                // console.log('Data computed and cached.');
                const data = volumes.filter(volume => volume.book_id === id);
                setFilteredVolumes(data);
                storeData(id, data);
            }

            setIsLoading(false);
        };

        fetchData();
    }, [id]);

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return (
        <View style={{ flex: 1, backgroundColor: 'gray-100', paddingHorizontal: 16, paddingTop: 16 }}>
            <FlatList
                className="space-y-6"
                data={filteredVolumes}
                renderItem={({ item }) => <HadeethCategoryItem item={item} onPress={onPressHadith} />}
                keyExtractor={item => item.id.toString()}
                style={{ paddingRight: 10, marginRight: -10 }}
            />
        </View>
    );
};

export default HadeethCategory;
