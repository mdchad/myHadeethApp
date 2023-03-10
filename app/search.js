import { View, Text, StyleSheet, TextInput, FlatList, TouchableWithoutFeedback, Keyboard, ScrollView, VirtualizedList, Button, KeyboardAvoidingView } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from "expo-router";
import { useAuth } from "./context/auth";

const Search = () => {
    const router = useRouter();
    const [value, setValue] = useState('');
    const { user } = useAuth()

    const countries = [
        { name: "Belgium", continent: "Europe", description: "حَدَّثَنَا يَحْيَى بْنُ يَحْيَى، وَأَبُو بَكْرِ بْنُ أَبِي شَيْبَةَ، وَإِسْحَاقُ بْنُ إِبْرَاهِيمَ، وَاللَّفْظُ لِيَحْيَى، قَالَ يَحْيَى: أَخْبَرَنَا، وقَالَ الْآخَرَانِ: حَدَّثَنَا ابْنُ عُيَيْنَةَ، عَنِ الزُّهْرِيِّ، عَنْ عَلِيِّ بْنِ حُسَيْنٍ، عَنْ عَمْرِو بْنِ عُثْمَانَ، عَنْ أُسَامَةَ بْنِ زَيْدٍ، أَنَّ النَّبِيَّ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ، قَالَ: لَا يَرِثُ الْمُسْلِمُ الْكَافِرَ، وَلَا يَرِثُ الْكَافِرُ الْمُسْلِمَ." },
        { name: "India", continent: "Asia", description: "India, officially the Republic of India, is a country in South Asia. It is the seventh-largest country by area, the second-most populous country (with over 1.2 billion people), and the most populous democracy in the world. Bounded by the Indian Ocean on the south, the Arabian Sea on the southwest, and the Bay of Bengal on the southeast, it shares land borders with Pakistan to the west; China, Nepal, and Bhutan to the northeast; and Bangladesh and Myanmar to the east. In the Indian Ocean, India is in the vicinity of Sri Lanka and the Maldives; its Andaman and Nicobar Islands share a maritime border with Thailand and Indonesia." },
        { name: "Bolivia", continent: "South America", description: "Bolivia, officially known as the Plurinational State of Bolivia, is a landlocked country located in western-central South America. It is bordered to the north and east by Brazil, to the southeast by Paraguay, to the south by Argentina, to the southwest by Chile, and to the northwest by Peru. One-third of the country is the Andean mountain range. The capital and largest city is Sucre, while the seat of government and principal city is La Paz. With an estimated population of 11 million, Bolivia is the fifth most populous country in South America." },
        { name: "Ghana", continent: "Africa", description: "Ghana, officially the Republic of Ghana, is a country located along the Gulf of Guinea and the Atlantic Ocean, in the subregion of West Africa. Spanning a land mass of 238,535 km2 (92,099 sq mi), Ghana is bordered by the Ivory Coast in the west, Burkina Faso in the north, Togo in the east, the Gulf of Guinea and the Atlantic Ocean in the south. Ghana means Warrior King in the Soninke language." },
        { name: "Japan", continent: "Asia", description: "Japan is an island country in East Asia located in the northwest Pacific Ocean. It lies off the eastern coast of the Asian continent and stretches from the Sea of Okhotsk in the north to the East China Sea and the Philippine Sea in the south. The characters that make up Japan's name mean 'sun origin', which is why Japan is often referred to as the 'Land of the Rising Sun'." },
        { name: "Canada", continent: "North America", description: "Canada is a country in the northern part of North America. Its ten provinces and three territories extend from the Atlantic to the Pacific and northward into the Arctic Ocean, covering 9.98 million square kilometres (3.85 million square miles), making it the world's second-largest country by total area. Its southern and western border with the United States, stretching 8,891 kilometres (5,525 mi), is the world's longest bi-national land border." },
        { name: "New Zealand", continent: "Australasia", description: "New Zealand is an island country in the southwestern Pacific Ocean. The country geographically comprises two main landmasses—that of the North Island, or Te Ika-a-Māui, and that of the South Island, or Te Waipounamu—and numerous smaller islands. Because of its remoteness, it was one of the last lands to be settled by humans. It was discovered and settled by Polynesians, who developed a distinct Māori culture." },
        { name: "Italy", continent: "Europe", description: "Italy, officially the Italian Republic, is a country consisting of a peninsula delimited by the Alps and surrounded by several islands. Italy is located in southern Europe, and is also considered part of Western Europe. A unitary parliamentary republic with Rome as its capital, the country covers a total area of 301,340 km2 (116,350 sq mi) and shares land borders with France, Switzerland, Austria, Slovenia, and the enclaved microstates of Vatican City and San Marino. Italy has a territorial exclave in Switzerland (Campione) and a maritime exclave in Tunisian waters (Lampedusa)." },
        { name: "South Africa", continent: "Africa", description: "South Africa is the southernmost country in Africa. It is the 25th-largest country in the world by land area, and with close to 56 million people, is the world's 24th-most populous nation. The World Bank classifies South Africa as an upper-middle-income economy, and a newly industrialised country. Its economy is the second-largest in Africa, and the 34th-largest in the world." },
        { name: "China", continent: "Asia", description: "China is the southernmost country in Africa. It is the 25th-largest country in the world by land area, and with close to 56 million people, is the world's 24th-most populous nation. The World Bank classifies South Africa as an upper-middle-income economy, and a newly industrialised country. Its economy is the second-largest in Africa, and the 34th-largest in the world." },
        { name: "Paraguay", continent: "South America", description: "Paraguay, officially the Republic of Paraguay, is a landlocked country in South America. It is bordered by Argentina to the south and southwest, Brazil to the east and northeast, and Bolivia to the northwest. As of 2019, Paraguay's estimated population was around 7 million, most of whom are concentrated in the southeast region of the country. The capital and largest city is Asunción, followed by Ciudad del Este." },
        { name: "Usa", continent: "North America", description: "The United States of America (USA), commonly known as the United States (U.S. or US) or America, is a country primarily located in North America, consisting of 50 states, a federal district, five major self-governing territories, and various possessions. At 3.8 million square miles, it is the world's third or fourth-largest country by total area and is slightly smaller than the entire continent of Europe." },
        { name: "France", continent: "Europe", description: "France, officially the French Republic, is a country whose territory consists of metropolitan France in Western Europe and several overseas regions and territories. The metropolitan area of France extends from the Mediterranean Sea to the English Channel and the North Sea, and from the Rhine to the Atlantic Ocean. It is bordered by Belgium, Luxembourg and Germany to the northeast, Switzerland and Italy to the east, and Andorra and Spain to the south." },
        { name: "Botswana", continent: "Africa", description: "Botswana, officially the Republic of Botswana, is a landlocked country located in Southern Africa. The citizens refer to themselves as Batswana. Formerly the British protectorate of Bechuanaland, Botswana adopted its new name after becoming independent within the Commonwealth on 30 September 1966. Since then, it has maintained a strong tradition of stable democracy, with a consistent record of democratic elections and a stable political system." },
        { name: "Spain", continent: "Europe", description: "Spain, officially the Kingdom of Spain, is a country in Southwestern Europe with some pockets of territory across the Strait of Gibraltar and the Atlantic Ocean. Its continental European territory is situated on the Iberian Peninsula. Its territory also includes two archipelagos: the Canary Islands off the coast of North Africa, and the Balearic Islands in the Mediterranean Sea. The African enclaves of Ceuta, Melilla, and Peñón de Vélez de la Gomera make Spain the only European country to have a physical border with an African country (Morocco)." },
        { name: "Senegal", continent: "Africa", description: "Senegal, officially the Republic of Senegal, is a country in West Africa. Senegal is bordered by Mauritania in the north, Mali to the east, Guinea to the southeast, and Guinea-Bissau to the southwest. Senegal also borders The Gambia, a country occupying a narrow sliver of land along the banks of the Gambia River, which separates Senegal from the Gambia. Senegal also shares a maritime border with Cape Verde." },
        { name: "Brazil", continent: "South America", description: "Brazil, officially the Federative Republic of Brazil, is the largest country in both South America and Latin America. At 8.5 million square kilometers (3.2 million square miles), Brazil is the world's fifth-largest country by area and the largest in the Americas. It is the only country in the Americas to have the entire territory in the Western Hemisphere and the only one in the Americas with Portuguese as an official language." },
        { name: "Denmark", continent: "Europe", description: "Denmark, officially the Kingdom of Denmark, is a Nordic country in Northern Europe. Denmark proper, which is the southernmost of the Scandinavian countries, consists of a peninsula, Jutland, and an archipelago of 443 named islands, with the largest being Zealand, Funen and the North Jutlandic Island. The islands are characterised by flat, arable land and sandy coasts, low elevation and a temperate climate." },
        { name: "Mexico", continent: "South America", description: "Mexico, officially the United Mexican States, is a country in the southern portion of North America. It is bordered to the north by the United States; to the south and west by the Pacific Ocean; to the southeast by Guatemala, Belize, and the Caribbean Sea; and to the east by the Gulf of Mexico. Covering almost 2,000,000 square kilometers (almost 761,000 square miles), Mexico is the fifth-largest country in the Americas by total area and the 13th-largest independent state in the world." },
        { name: "Australia", continent: "Australasia", description: "Australia, officially the Commonwealth of Australia, is a sovereign country comprising the mainland of the Australian continent, the island of Tasmania, and numerous smaller islands. It is the largest country in Oceania and the world's sixth-largest country by total area. The neighbouring countries are Papua New Guinea, Indonesia and East Timor to the north; the Solomon Islands and Vanuatu to the north-east; and New Zealand to the south-east." },
        { name: "Tanzania", continent: "Africa", description: "Tanzania, officially the United Republic of Tanzania, is a country in Eastern Africa within the African Great Lakes region. It borders Uganda to the north; Kenya to the northeast; Comoros, the Indian Ocean, and Mozambique to the east; Zambia, Malawi, and Mozambique to the south; Rwanda, Burundi, and the Democratic Republic of the Congo to the west; and the African Great Lakes region to the northwest." },
        { name: "Bangladesh", continent: "Asia", description: "Bangladesh, officially the People's Republic of Bangladesh, is a country in South Asia. It is the eighth-most populous country in the world, with a population exceeding 164 million people, and is one of the most densely populated countries in the world. Located in the fertile Bengal delta, it is bordered by India to the west, north, and east, Myanmar to the southeast, and the Bay of Bengal to the south." },
        { name: "Portugal", continent: "Europe", description: "Portugal, officially the Portuguese Republic, is a country on the Iberian Peninsula, in Southwestern Europe. It is the westernmost country of mainland Europe. To the west and south, it is bordered by the Atlantic Ocean; to the north and east, it is bordered by Spain. The country also includes the Atlantic archipelagos of the Azores and Madeira, both autonomous regions with their own regional governments." },
        { name: "Pakistan", continent: "Asia", description: "Pakistan, officially the Islamic Republic of Pakistan, is a country in South Asia. It is the world's fifth-most populous country with a population exceeding 212.2 million people, and has the world's second-largest Muslim population. Pakistan is the 33rd-largest country by area, spanning 881,913 square kilometres (340,509 square miles). It has a 1,046-kilometre (650-mile) coastline along the Arabian Sea and Gulf of Oman in the south and is bordered by India to the east, Afghanistan to the west, Iran to the southwest, and China in the far northeast." },
    ];

    const getItem = (countries, index) => {
        return countries[index];
    };

    const getItemCount = (countries) => {
        return countries.length;
    };

    const renderItem = ({ item }) => {
        const highlightedText = highlight(item.name, value);
        return <Text>{highlightedText}</Text>;
    };

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
        <View className="h-auto">
            {/* <HeaderSearchBar
                onChangeText={value => setValue(value)}
                searchBoxText="Search..."
                backgroundColor={"#EDEEC0"}
                className="block"
                firstTitle="Assalamualaikum"
                secondTitle={user.full_name}
            /> */}
            {value.length > 0 && (
                <SafeAreaView className="">
                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        style={styles.container}>
                        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                            <FlatList
                                className="p-4 h-full"
                                data={countries.filter((country) =>
                                    country.name.toLowerCase().includes(value.toLowerCase())
                                )}
                                renderItem={({ item }) => (
                                    <View className="">
                                        <View className="flex flex-col">
                                            <Text className="font-bold text-lg">{highlightText(item.name, value)}</Text>
                                            <Text className="text-sm">{highlightText(item.continent, value)}</Text>
                                        </View>
                                        <View className="flex flex-col">
                                            <Text className="text-sm">{highlightText(item.description, value)}</Text>
                                        </View>
                                    </View>
                                )}
                                keyExtractor={(item) => item.name}
                                scrollEnabled={true}
                            />
                        </TouchableWithoutFeedback>
                    </KeyboardAvoidingView>
                </SafeAreaView>
            )}
        </View>
    )
}

export default Search

const styles = StyleSheet.create({
    container: {
        // flex: 1,
        // height: '100%',
        // backgroundColor: 'red',
    },
    countryInfo: {
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



