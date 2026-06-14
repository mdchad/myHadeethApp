import BottomSheet, {BottomSheetBackdrop, BottomSheetView, type BottomSheetBackdropProps} from "@gorhom/bottom-sheet";
import {Text, TouchableHighlight, View} from "react-native";
import {t} from "i18next";
import SHARED_TEXT from "../i18n";
import React, {useCallback, useMemo, useRef} from "react";
import {Portal} from "@gorhom/portal";

interface SheetProps {
  setSelectedBooks: (books: string) => void;
  books: string[];
  setBooks: React.Dispatch<React.SetStateAction<string[]>>;
  bottomSheetRef: React.RefObject<BottomSheet | null>;
}

function Sheet({ setSelectedBooks, books, setBooks, bottomSheetRef}: SheetProps) {
  // variables
  const snapPoints = useMemo(() => ['25%', '50%'], [])

  // callbacks
  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop {...props} pressBehavior={'close'} opacity={0.5} />
    ),
    []
  )

  function selectBooks() {
    setSelectedBooks(books.join(','))
    bottomSheetRef.current?.close()
  }

  function onClickBook(book: string) {
    if (books.some(val => val === book)) {
      setBooks(prevState => prevState.filter(prev => prev !== book))
    } else {
      setBooks((prevState) => prevState.concat([book]))
    }
  }

  return (
    <Portal hostName={'root'}>
      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        index={-1}
        backdropComponent={renderBackdrop}
      >
        <BottomSheetView style={{ padding: 10, paddingBottom: 20, height: '100%', display: 'flex', justifyContent: 'space-between' }}>
          <View className="flex flex-row gap-2 flex-wrap">
            <TouchableHighlight
              underlayColor="#f9fafb"
              className={`${books.some(val => val === 'sahih_bukhari') && 'bg-gray-200'} rounded-lg px-4 py-2  border border-gray-200`}
              onPress={() => onClickBook('sahih_bukhari')}
            >
              <Text>Sahih Bukhari</Text>
            </TouchableHighlight>
            <TouchableHighlight
              underlayColor="#f9fafb"
              className={`${books.some(val => val === 'sahih_muslim') && 'bg-gray-200'} rounded-lg px-4 py-2  border border-gray-200`}
              onPress={() => onClickBook('sahih_muslim')}
            >
              <Text>Sahih Muslim</Text>
            </TouchableHighlight>
            <TouchableHighlight
              underlayColor="#f9fafb"
              className={`${books.some(val => val === 'sunan_abi_daud') && 'bg-gray-200'} rounded-lg px-4 py-2 border border-gray-200`}
              onPress={() => onClickBook('sunan_abi_daud')}
            >
              <Text>Sunan Abu Dawud</Text>
            </TouchableHighlight>
            <TouchableHighlight
              underlayColor="#f9fafb"
              className={`${books.some(val => val === 'jami_al_tirmidhi') && 'bg-gray-200'} rounded-lg px-4 py-2  border border-gray-200`}
              onPress={() => onClickBook('jami_al_tirmidhi')}
            >
              <Text>Jami’ Al-Tirmidhi</Text>
            </TouchableHighlight>
            <TouchableHighlight
              underlayColor="#f9fafb"
              className={`${books.some(val => val === 'sunan_ibnu_majah') && 'bg-gray-200'} rounded-lg px-4 py-2  border border-gray-200`}
              onPress={() => onClickBook('sunan_ibnu_majah')}
            >
              <Text>Sunan Ibn Majah</Text>
            </TouchableHighlight>
            <TouchableHighlight
              underlayColor="#f9fafb"
              className={`${books.some(val => val === 'sunan_an_nasai') && 'bg-gray-200'} rounded-lg px-4 py-2  border border-gray-200`}
              onPress={() => onClickBook('sunan_an_nasai')}
            >
              <Text>Sunan Al-Nasai</Text>
            </TouchableHighlight>
          </View>
          <TouchableHighlight underlayColor="#333" className="bg-royal-blue-950 mb-4 rounded-3xl p-2" onPress={selectBooks}>
            <Text className="text-white text-lg text-center">{t(SHARED_TEXT.SEARCH_APPLY)} ({(books.length)})</Text>
          </TouchableHighlight>
        </BottomSheetView>
      </BottomSheet>
    </Portal>
  )
}

export default Sheet