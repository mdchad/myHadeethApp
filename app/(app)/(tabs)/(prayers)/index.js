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
  differenceInMilliseconds,
  eachDayOfInterval,
  isBefore, isSameDay,
} from "date-fns";
import parse from 'date-fns/parse'
import { format } from "date-fns-tz";
import React, { useEffect, useState } from "react";
import {FlatList, Image, Pressable, SafeAreaView, Text, View} from "react-native";
import { useAuth } from "../../../../context/auth";
import { Coordinates, CalculationMethod, PrayerTimes } from 'adhan';
import Page from "@components/page";
import {ChevronLeft, ChevronRight, MapPin, Pin, Volume} from "lucide-react-native";
import {FlashList} from "@shopify/flash-list";
import {ScrollView} from "react-native-web";

const prayerNames = ["Subuh", "Syuruk", "Zohor", "Asar", "Maghrib", "Isyak"];
const prayerIcon = [
  require("@assets/prayer-fajr.png"),
  require("@assets/prayer-fajr.png"),
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
  const { userLocation, userPlace } = useAuth()
  const currentDate = new Date()
  const endDate = addDays(currentDate, 60)
  const datesInRange = eachDayOfInterval({ start: currentDate, end: endDate })
  const [ calendarDate, setCalendarDate ] = useState(new Date())
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
      fetchPrayer(calendarDate);
    }
  }, [userLocation, calendarDate]);

  async function fetchPrayer(currentDate) {
    try {
      const coordinates = new Coordinates(userLocation.coords.latitude, userLocation.coords.longitude);
      const params = CalculationMethod.MoonsightingCommittee();
      const prayerTimesResult = new PrayerTimes(coordinates, currentDate, params);

      const prayers = [];
      ['fajr', 'sunrise', 'dhuhr', 'asr', 'maghrib', 'isha'].forEach((time, i) => {

        const currentTime = new Date()
        let elapsed = isBefore(new Date(prayerTimesResult[time]), currentTime);


        const formattedPrayer = format(new Date(prayerTimesResult[time]), "hh:mm a", { timeZone: "Asia/Kuala_Lumpur" });

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
      // }
    } catch (error) {
      console.error(error);
    }
  }

  function RenderItem({ item }) {
    return (
      <Pressable onPress={() => setCalendarDate(item?.date)}>
        <View className={`mx-2 flex items-center rounded-lg bg-white w-14 h-18 py-4 px-2 ${isSameDay(item?.date, calendarDate) ? 'bg-[#EDEEC0]' : 'bg-white'}`}>
          <Text className="text-md">{item?.dayName}</Text>
          <Text className="text-md font-semibold mt-1">{item?.day}</Text>
        </View>
      </Pressable>
    )
  }

  return (
    <Page class="bg-gray-100">
      <SafeAreaView>
        <View className="h-full w-full pt-12 px-4 bg-gray-100">
          <View className="bg-[#b59d4b] rounded-xl w-full p-6 mb-4">
            <View className="flex flex-row justify-between mb-4">
              <Text className="font-bold text-white text-3xl">{nextPrayer?.name}</Text>
              <Text className="font-bold text-white text-3xl">{nextPrayer?.prayerTime}</Text>
            </View>
            <Text className="text-white text-md mb-1 font-bold">{formatHijri.format(calendarDate)}</Text>
            <View className="flex flex-row">
              <MapPin color={'white'} size={16}/>
              {userPlace && <Text className="ml-1 font-bold text-white text-xs text-center mr-2">{userPlace[0].city}{userPlace[0].city && ','} {userPlace[0].country}</Text>}
            </View>
          </View>

          <View className="bg-white rounded-xl p-6">
            {prayerTimes.length
              ? prayerTimes.map((prayer, i) => (
                <View
                  key={i}
                  className={`flex flex-row justify-between pt-4 pb-4 ${i + 1 === prayerTimes.length && "border-b-0"
                    } ${i === 0 && "pt-0"}`}
                >
                  <View className="w-1/3 flex flex-row space-x-2">
                    <Image
                      source={prayer.icon}
                      style={{ width: 22, height: 22 }}
                    />
                    <Text className="text-sm">{prayer.name}</Text>
                  </View>
                  <View className="space-x-2 w-2/3 flex flex-row justify-end items-center">
                    <Text>{prayer.prayerTime}</Text>
                    {/*<Volume color={'black'} strokeWidth={1}/>*/}
                  </View>
                </View>
              ))
              : null}
          </View>
          <View className="mt-6 flex flex-col items-center">
            <Text className="text-xl font-bold">{format(calendarDate, 'LLL')}</Text>
            <View className="mt-4">
              <FlatList
                data={formattedDates}
                keyExtractor={item => item.id}
                renderItem={({ item }) => <RenderItem item={item}/>}
                horizontal
              />
            </View>
          </View>
        </View>
      </SafeAreaView>
    </Page>
  );
}