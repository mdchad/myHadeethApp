// import { View, Text } from 'react-native'
// import React from 'react'
// import Page from '../../../components/page'
// import Audio from '../../../components/audio'
//
// const Prayers = () => {
//   return (
//     <Page>
//       <Text>Prayers</Text>
//
//         <Audio />
//     </Page>
//   )
// }
//
// export default Prayers

import {
    addDays,
    eachDayOfInterval,
    isBefore, isSameDay,
} from "date-fns";
import { format } from "date-fns-tz";
import React, { useEffect, useState } from "react";
import {FlatList, Image, Pressable, SafeAreaView, Text, View, ImageBackground, Linking, Button} from "react-native";
import { useAuth } from "@context/auth";
import Page from "@components/page";
import { MapPin} from "lucide-react-native";
import { ScrollView } from "react-native";
import {Skeleton } from "moti/skeleton";
import Spacer from "@components/Spacer";
import Header from "../../../components/header";

const prayerNames = ["Subuh", "Syuruk", "Zohor", "Asar", "Maghrib", "Isyak"];
const prayerIcon = [
    require("@assets/prayer-fajr.png"),
    require("@assets/prayer-syuruk.png"),
    require("@assets/prayer-dhuhr.png"),
    require("@assets/prayer-asr.png"),
    require("@assets/prayer-maghrib.png"),
    require("@assets/prayer-isha.png"),
]

const options = { year: "numeric", month: "long", day: "numeric" };
const formatHijri = new Intl.DateTimeFormat(
    "ms-MY-u-ca-islamic-nu-latn",
    options
);

export default function Prayer() {
    const [prayerTimes, setPrayerTimes] = useState([]);
    const [nextPrayer, setNextPrayer] = useState(null);
    const [error, setError] = useState(false);
    const { userLocation, userPlace, permissionStatus } = useAuth()
    const currentDate = new Date()
    const month = format(currentDate, "L", { timeZone: "Asia/Kuala_Lumpur" });
    const year = format(currentDate, "y", { timeZone: "Asia/Kuala_Lumpur" });
    const endDate = addDays(currentDate, 6)
    const datesInRange = eachDayOfInterval({ start: currentDate, end: endDate })
    const [calendarDate, setCalendarDate] = useState(new Date())
    const [monthlyPrayerTimes, setMonthlyPrayerTimes] = useState(null)
    const formattedDates = datesInRange.map((date, i) => {
        return {
            date,
            id: i,
            day: date.getDate(),
            month: format(date, 'MMM'),
            dayName: format(date, 'E')
        }
    })

    useEffect(() => {
        if (userLocation) {
            fetchPrayer();
        }
    }, [userLocation]);

    const fetchPrayer = async () => {
        if (userPlace[0].country !== 'Malaysia') {
            setError(true)
            return
        }

        try {
            const response = await fetch(
              `https://mpt-server.vercel.app/api/zones/gps?lat=${userLocation.coords.latitude}&long=${userLocation.coords.longitude}`,
            );
            const json = await response.json();

            const prayerMonthly = await fetch(
              `https://mpt-server.vercel.app/api/v2/solat/${json.zone}?year=${year}&month=${month}`,
            );
            const result = await prayerMonthly.json();
            setMonthlyPrayerTimes(result)
            await calculatePrayer(format(currentDate, "d", { timeZone: "Asia/Kuala_Lumpur" }), result)
        } catch (error) {
            console.error(error);
        }
    };

    async function calculatePrayer(day, monthlyPrayerTimes) {
        const prayers = [];
        ['fajr', 'syuruk', 'dhuhr', 'asr', 'maghrib', 'isha'].forEach((time, i) => {
            const currentTime = new Date()
            const getPrayerDate = monthlyPrayerTimes.prayers.find(prayer => prayer.day === parseInt(day))
            const getWaktu = getPrayerDate[time]

            let elapsed = isBefore(new Date(getPrayerDate[time] * 1000), currentTime);

            const formattedPrayer = format(new Date(getWaktu * 1000), "h:mm a", { timeZone: "Asia/Kuala_Lumpur" });

            const prayerMeta = {
                name: prayerNames[i],
                timezoneDate: time,
                prayerTime: formattedPrayer,
                icon: prayerIcon[i],
                hasElapsed: elapsed
            };

            prayers.push(prayerMeta);
        });
        const nextAvailablePrayer = prayers.find(prayer => prayer.hasElapsed === false)
        setPrayerTimes(prayers);
        setNextPrayer(nextAvailablePrayer);
        if (!nextAvailablePrayer) {
            // if isya, it will be undefined for next prayer. So check for the next day prayer
            calculatePrayer(format(addDays(currentDate, 1), "d", { timeZone: "Asia/Kuala_Lumpur" }), monthlyPrayerTimes)
        }
    }

    function onClickIndividualDay(item) {
        setCalendarDate(item?.date)
        calculatePrayer(format(item?.date, "d", { timeZone: "Asia/Kuala_Lumpur" }), monthlyPrayerTimes)
    }

    async function openSettings() {
        await Linking.openSettings();
    }

    function RenderItem({ item }) {
        return (
            <Pressable onPress={() => onClickIndividualDay(item)}>
                {/*<View className={`mx-2 flex items-center py-4 px-2 ${isSameDay(item?.date, calendarDate) ? 'bg-[#EDEEC0]' : 'bg-white'}`}>*/}
                <View className={`mx-2 flex items-center py-4`}>
                    <Text className={`${isSameDay(item?.date, calendarDate) ? 'text-royal-blue' : 'text-[#008080]'}`}>{item?.dayName.toUpperCase()}</Text>
                    <Text className="text-lg mt-2">{item?.day}</Text>
                </View>
            </Pressable>
        )
    }

    return (
        <Page class="bg-gray-100">
            <ScrollView>
                <Header rounded={false} title={'Prayer Times'}/>
                <View className={`px-6 lex flex-row justify-between items-end rounded-b-2xl py-6 shadow-lg bg-royal-blue overflow-hidden`}>
                    <View>
                        <Text className="text-white mb-1">Next Prayer</Text>
                        <Text className="text-white font-semibold text-2xl">{nextPrayer?.name}</Text>
                        <Text className="text-white text-xs">{formatHijri.format(calendarDate)}</Text>
                    </View>
                    <View className="flex items-end">
                        <Text className="text-white font-semibold text-2xl">{nextPrayer?.prayerTime}</Text>
                        <View className="flex flex-row">
                            <MapPin color={'white'} size={16} />
                            {userPlace && <Text className="ml-1 text-white text-xs text-center">{userPlace[0].city}{userPlace[0].city && ','} {userPlace[0].country}</Text>}
                        </View>
                    </View>
                </View>
                    <View className="w-full h-full mt-4">
                        {permissionStatus === 'denied' ? (
                            <View className="mt-4 w-full">
                              <Button title="Enable Location" onPress={openSettings} />
                            </View>
                        ) : error ? (
                              <View className="w-full h-full mt-4 p-8">
                                  <Text className="text-xl font-bold text-center">You need to be in Malaysia to access the prayer times</Text>
                              </View>
                          ) : (
                            <ImageBackground source={require("@assets/book-background.png")} resizeMode="cover" style={{ flex: 1, justifyContent: 'end', alignItems: 'end' }}>
                                <View className="px-2">
                                    <View className="flex flex-col items-center mb-4">
                                      <View className="flex flex-row items-center space-x-2">
                                          {/*<ChevronLeftCircle color={"#1C2A4F"} />*/}
                                          <Text className="text-xl font-bold">{format(calendarDate, 'LLL yyyy')}</Text>
                                          {/*<ChevronRightCircle color={"#1C2A4F"}/>*/}
                                      </View>
                                      <View className="flex flex-row items-center justify-between mb-4 mt-4 border-y-2 border-y-black">
                                          {/*<ChevronLeft color={"#1C2A4F"}/>*/}
                                          {
                                              formattedDates.map((date, i) => {
                                                  return (
                                                    <RenderItem key={i} item={date} />
                                                  )
                                              })
                                          }
                                          {/*<FlatList*/}
                                          {/*  data={formattedDates}*/}
                                          {/*  keyExtractor={item => item.id}*/}
                                          {/*  renderItem={({ item }) => <RenderItem item={item} />}*/}
                                          {/*  horizontal*/}
                                          {/*/>*/}
                                          {/*<ChevronRight color={"#1C2A4F"}/>*/}
                                      </View>
                                    </View>

                                    <View className="mx-12 bg-white border border-b-royal-blue rounded-xl p-4 space-y-6">
                                      {prayerTimes.length
                                        ? prayerTimes.map((prayer, i) => (
                                          <View
                                            key={i}
                                            className={`flex flex-row justify-between ${i + 1 === prayerTimes.length && "border-b-0"
                                            } ${i === 0 && "pt-0"}`}
                                          >
                                              <View className="w-1/3 flex flex-row items-center">
                                                  <Image
                                                    source={prayer.icon}
                                                    style={{ width: 35, height: 36 }}
                                                  />
                                                  <Text className="ml-2 text-sm text-royal-blue">{prayer.name}</Text>
                                              </View>
                                              <View className="w-2/3 flex flex-row justify-end items-center">
                                                  <Text className="text-royal-blue">{prayer.prayerTime}</Text>
                                                  {/*<Volume color={'black'} strokeWidth={1}/>*/}
                                              </View>
                                          </View>
                                        )) : (
                                          <>
                                              <Skeleton colorMode={'light'} width={'100%'} />
                                              <Spacer height={20}/>
                                              <Skeleton colorMode={'light'} width={'100%'} />
                                              <Spacer height={20}/>
                                              <Skeleton colorMode={'light'} width={'100%'} />
                                              <Spacer height={20}/>
                                              <Skeleton colorMode={'light'} width={'100%'} />
                                          </>
                                        )}
                                    </View>
                                </View>
                            </ImageBackground>
                        )}
                    </View>
            </ScrollView>
        </Page>
    );
}