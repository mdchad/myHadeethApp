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
  endOfMonth,
  formatDistanceToNow,
  isBefore,
  startOfMonth
} from "date-fns";
import parse from 'date-fns/parse'
import { format } from "date-fns-tz";
import React, { useEffect, useState } from "react";
import { Image, Pressable, SafeAreaView, Text, View } from "react-native";
import { useAuth } from "../../../../context/auth";
import { Coordinates, CalculationMethod, PrayerTimes } from 'adhan';
import Page from "@components/page";
import {ChevronLeft, ChevronRight, MapPin, Pin, Volume} from "lucide-react-native";

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
  const [date, setDate] = useState(new Date())
  const { userLocation, userPlace } = useAuth()

  useEffect(() => {
    const currentDate = new Date()
    const endDate = addDays(currentDate, 60)
    const datesInRange = eachDayOfInterval({ start: currentDate, end: endDate })
    console.log(datesInRange)

    if (userLocation) {
      fetchPrayer(date);
    }
  }, [userLocation]);

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

  async function nextDay() {
    let setNextDay = date.setDate(date.getDate() + 1)
    await fetchPrayer(new Date(setNextDay))
    setDate(new Date(setNextDay))
  }

  async function previousDay() {
    let setPreviousDay = date.setDate(date.getDate() - 1)
    await fetchPrayer(new Date(setPreviousDay))
    setDate(new Date(setPreviousDay))
  }

  return (
    <Page class="bg-gray-100">
      {!userLocation ?
        (
          <Text>Loading</Text>
        ) :
        (
          <SafeAreaView>
            <View className="h-full w-full pt-16 px-8 bg-gray-100">
              {/*<View className="w-full flex flex-row items-center justify-between mb-5">*/}
              {/*  <Pressable onPress={() => previousDay()}>*/}
              {/*    <ChevronLeftIcon height={20} width={20} color={"#000"} />*/}
              {/*  </Pressable>*/}
              {/*  <View className="flex items-center">*/}
              {/*    <Text className="mb-1 text-md">*/}
              {/*      {format(date, "cccc, d LLL")}*/}
              {/*    </Text>*/}
              {/*    <Text>{formatHijri.format(date)}</Text>*/}
              {/*  </View>*/}
              {/*  <Pressable onPress={() => nextDay()}>*/}
              {/*    <ChevronRightIcon height={20} width={20} color={"#000"} />*/}
              {/*  </Pressable>*/}
              {/*</View>*/}
              <View className="bg-[#b59d4b] rounded-xl w-full p-6 mb-4">
                <View className="flex flex-row justify-between mb-4">
                  <Text className="font-bold text-white text-3xl">{nextPrayer?.name}</Text>
                  <Text className="font-bold text-white text-3xl">{nextPrayer?.prayerTime}</Text>
                </View>
                <Text className="text-white text-md mb-1 font-bold">{formatHijri.format(date)}</Text>
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
              <View className="mt-8 flex flex-col items-center">
                <Text className="text-xl font-bold">{format(new Date(), 'LLL')}</Text>
                <View className="space-x-2 flex flex-row mt-4">
                  <View className="rounded-lg bg-white p-2">
                    <Pressable onPress={() => previousDay()}>
                      <ChevronLeft height={20} width={20} color={"#000"} />
                    </Pressable>
                  </View>
                  <View className="rounded-lg bg-white p-2">

                  </View>
                  <View className="rounded-lg bg-white p-2"></View>
                  <View className="rounded-lg bg-white p-2"></View>
                  <View className="rounded-lg bg-white p-2"></View>
                  <View className="rounded-lg bg-white p-2"></View>
                  <View className="rounded-lg bg-white p-2">
                    <Pressable onPress={() => nextDay()}>
                      <ChevronRight height={20} width={20} color={"#000"} />
                    </Pressable>
                  </View>
                </View>
              </View>
            </View>
          </SafeAreaView>
        )
      }
    </Page>
  );
}