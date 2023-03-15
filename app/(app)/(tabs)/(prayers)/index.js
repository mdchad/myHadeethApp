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

import { isAfter, formatDistanceToNow } from "date-fns";
import fromUnixTime from "date-fns/fromUnixTime";
import { utcToZonedTime, format } from "date-fns-tz";
import React, { useEffect, useState } from "react";
import { Image, SafeAreaView, Text, View } from "react-native";
import {
  ChevronRightIcon,
  ChevronLeftIcon,
} from "react-native-heroicons/solid";
import {useAuth} from "../../../../context/auth";
import { Coordinates, CalculationMethod, PrayerTimes } from 'adhan';

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
  console.log(userPlace)

  console.log('hoii', userLocation)
  useEffect(() => {
    if (userLocation) {
      fetchPrayer();
    }
  }, [userLocation]);

  async function fetchPrayer() {
    try {
      const coordinates = new Coordinates(userLocation.coords.latitude, userLocation.coords.longitude);
      const params = CalculationMethod.MoonsightingCommittee();
      const date = new Date();
      const prayerTimesResult = new PrayerTimes(coordinates, date, params);

      const prayers = [...prayerTimes];
      ['fajr', 'sunrise', 'dhuhr', 'asr', 'maghrib', 'isha'].forEach((time, i) => {
        const formattedPrayer = format(new Date(prayerTimesResult[time]), "hh:mm a", { timeZone: "Asia/Kuala_Lumpur" });

        const prayerMeta = {
          name: prayerNames[i],
          timezoneDate: time,
          prayerTime: formattedPrayer,
          icon: prayerIcon[i],
        };

        prayers.push(prayerMeta);
      });

      if (!prayerTimes.length) {
        const nextAvailablePrayer = prayers.find(
          (prayer) => prayer.hasElapsed === false
        );

        setPrayerTimes(prayers);
        setNextPrayer(nextAvailablePrayer);
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <SafeAreaView>
      <View className="h-full w-full pt-16 px-14 bg-[#EDEEC0]">
        <View className="w-64 flex flex-row items-center justify-between mb-5">
          <ChevronLeftIcon height={20} width={20} color={"#000"} />
          <View className="flex items-center">
            <Text className="mb-1 text-md">
              {format(new Date(), "cccc, d LLL")}
            </Text>
            <Text>{formatHijri.format(new Date())}</Text>
          </View>
          <ChevronRightIcon height={20} width={20} color={"#000"} />
        </View>
        {/*<Text className="text-2xl font-bold mb-4">Prayer Times</Text>*/}
        <View className="mx-6 flex flex-row justify-between">
          <Image
            source={require("@assets/muslim-prayer.png")}
            style={{
              resizeMode: "contain",
              height: 78,
              width: 77,
              display: "flex",
              alignItems: "center",
              alignContent: "center",
              justifyContent: "center",
            }}
          />
          {!!nextPrayer && (
            <View className="flex items-end">
              <Text className="mb-3">{nextPrayer.name} Prayer</Text>
              <View className="flex flex-row mb-3">
                <Image
                  source={nextPrayer.icon}
                  style={{ width: 22, height: 22 }}
                />
                <Text className="text-sm ml-1">{nextPrayer.prayerTime}</Text>
              </View>
              <Text className="text-[10px]">
                Countdown{" "}
                {formatDistanceToNow(nextPrayer.timezoneDate, {
                  addSuffix: true,
                })}
              </Text>
            </View>
          )}
        </View>
        <View className="my-6 flex flex-row items-center justify-center">
          <Text className="text-center mr-2">{userPlace[0].city}{userPlace[0].city && ','} {userPlace[0].country}</Text>
          <Image
            source={require("@assets/pin.png")}
            style={{ width: 14, height: 16 }}
          />
        </View>
        <View>
          {prayerTimes.length
            ? prayerTimes.map((prayer, i) => (
              <View
                key={i}
                className={`flex flex-row justify-between pt-4 pb-4 border-0 border-b border-[#7C9082] ${
                  i + 1 === prayerTimes.length && "border-b-0"
                } ${i === 0 && "pt-0"}`}
              >
                <Text className="text-sm">{prayer.name}</Text>
                <Image
                  source={prayer.icon}
                  style={{ width: 22, height: 22 }}
                />
                <Text>{prayer.prayerTime}</Text>
              </View>
            ))
            : null}
        </View>
      </View>
    </SafeAreaView>
  );
}