import { View, Text, StyleSheet, TextInput, FlatList, TouchableWithoutFeedback, Keyboard, ScrollView, VirtualizedList, Button, KeyboardAvoidingView, Pressable, SectionList } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Link, useRouter } from "expo-router";
import datas from '@data/hadeeth.json'

// convert datas to section list
const sectionListData = datas.reduce((acc, data) => {
	const category = data.category[0]
	const chapter = category.chapter

	const section = {
		title: chapter,
		data: [data]
	}

	const index = acc.findIndex(item => item.title === chapter)

	if (index === -1) {
		acc.push(section)
	} else {
		acc[index].data.push(data)
	}

	return acc
}, [])

const Search = () => {
	const router = useRouter();
	const [value, setValue] = useState('');

	const highlightText = (text, query) => {
		if (!query.trim()) {
			return text;
		}

		const regex = new RegExp(`(${query})`, 'gi');
		const parts = text.split(regex);

		return (
			<Text>
				{parts.map((part, i) =>
					regex.test(part) ? (
						<Text key={i} style={{ backgroundColor: 'yellow' }}>
							{part}
						</Text>
					) : (
						part
					)
				)}
			</Text>
		);
	};

	return (
		<SafeAreaView className="flex-1 flex gap-5 bg-white">
			<View className="flex flex-row gap-3 items-center px-3">
				<View className="flex-1 relative flex items-center justify-center">
					<View className="bg-white flex-1 rounded-lg shadow w-full">
						<TextInput
							className="flex-1 px-3"
							placeholder="Search..."
							value={value}
							onChangeText={(text) => setValue(text)}
						/>
					</View>
					{value.length > 0 && (
						<View className="absolute right-0 top-0 bottom-0 flex justify-center pr-2">
							<Pressable onPress={() => { setValue('') }}>
								<MaterialIcons name="cancel" size={16} color="black" />
							</Pressable>
						</View>
					)}
				</View>
				<Link href="../" className="p-2">
					Cancel
				</Link>
			</View>
			{/* {value.length > 0 && ( */}
			{/* <FlatList
				className="px-5"
				data={sectionListData.filter((data) =>
					data.name.toLowerCase().includes(value.toLowerCase()) || data.continent.toLowerCase().includes(value.toLowerCase()) || data.description.toLowerCase().includes(value.toLowerCase())
				)}
				renderItem={({ item }) => (
					console.log(item.category[0])
				)}
				keyExtractor={(item) => item.name}
				scrollEnabled={true}
				ListEmptyComponent={() => (
					<View className="flex-1 flex items-center justify-center">
						<Text className="text-lg">No results found.</Text>
						<Text className="text-sm"> Try something else instead?</Text>
					</View>
				)}
			/> */}

			<SectionList
				className="px-5"
				sections={sectionListData}
				renderSectionHeader={({ section, index }) => (
					<Text className="text-xl bg-red-500">{section.data[0].title}</Text>
					// console.log(section.data[0].category[0].title.en)
					// console.log(section.data[0].title)
				)}
				renderItem={({ item }) => (
					// console.log(item.id)
					<View>
						<Link href={`/(tabs)/(hadeeth)/content/${item.id}`}>
							<Text>{item.category[0].title.en}</Text>
						</Link>
						<Text>{item.category[0].chapter[0].hadeeth[0].content.ms}</Text>
					</View>
				)}
				keyExtractor={(item) => item.id.toString()}
			/>
			{/* )} */}
		</SafeAreaView>
	)
}

export default Search

const styles = StyleSheet.create({
	container: {
		// flex: 1,
		// height: '100%',
		// backgroundColor: 'red',
	},
	dataInfo: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginBottom: 4,
	},
	countryDescription: {
		marginBottom: 8,
	},
	boldText: {
		fontWeight: 'bold',
	},
});



