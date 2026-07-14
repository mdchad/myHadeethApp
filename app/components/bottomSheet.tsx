import BottomSheet, {BottomSheetBackdrop, BottomSheetView, type BottomSheetBackdropProps} from "@gorhom/bottom-sheet";
import {Text, Pressable, View} from "react-native";
import {t} from "i18next";
import SHARED_TEXT from "../i18n";
import React, {useCallback} from "react";
import {Portal} from "@gorhom/portal";
import {Check} from "lucide-react-native";

interface SheetProps {
  setSelectedBooks: (books: string) => void;
  books: string[];
  setBooks: React.Dispatch<React.SetStateAction<string[]>>;
  bottomSheetRef: React.RefObject<BottomSheet | null>;
}

const BOOK_OPTIONS = [
  { id: 'sahih_bukhari', title: 'Sahih Bukhari', arabic: 'صحيح البخاري' },
  { id: 'sahih_muslim', title: 'Sahih Muslim', arabic: 'صحيح مسلم' },
  { id: 'sunan_abi_daud', title: 'Sunan Abu Dawud', arabic: 'سنن أبي داود' },
  { id: 'jami_al_tirmidhi', title: 'Jami’ Al-Tirmidhi', arabic: 'جامع الترمذي' },
  { id: 'sunan_ibnu_majah', title: 'Sunan Ibn Majah', arabic: 'سنن ابن ماجه' },
  { id: 'sunan_an_nasai', title: 'Sunan Al-Nasai', arabic: 'سنن النسائي' },
]

function Sheet({ setSelectedBooks, books, setBooks, bottomSheetRef}: SheetProps) {
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

  function clearBooks() {
    setBooks([])
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
        enableDynamicSizing={true}
        enablePanDownToClose={true}
        index={-1}
        backdropComponent={renderBackdrop}
      >
        <BottomSheetView style={{ paddingHorizontal: 20, paddingBottom: 32 }}>
          {/* Header */}
          <View className="flex flex-row justify-between items-center pt-1 pb-2">
            <Text className="text-xl font-semibold text-gray-900">
              {t(SHARED_TEXT.SEARCH_FILTER_BY_BOOK)}
            </Text>
            {books.length > 0 && (
              <Pressable
                onPress={clearBooks}
                hitSlop={8}
                style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
              >
                <Text className="text-sm font-medium text-royal-blue-950">
                  {t(SHARED_TEXT.SEARCH_CLEAR_ALL)}
                </Text>
              </Pressable>
            )}
          </View>

          {/* Book list */}
          {BOOK_OPTIONS.map((book, index) => {
            const isSelected = books.some(val => val === book.id)
            return (
              <Pressable
                key={book.id}
                onPress={() => onClickBook(book.id)}
                style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
                className={`flex flex-row items-center justify-between py-3.5 ${
                  index < BOOK_OPTIONS.length - 1 ? 'border-b border-gray-100' : ''
                }`}
              >
                <View className="flex-1 flex flex-row items-baseline gap-3">
                  <Text
                    className={`text-base ${
                      isSelected ? 'font-semibold text-gray-900' : 'text-gray-700'
                    }`}
                  >
                    {book.title}
                  </Text>
                  <Text className="text-sm text-gray-400 font-arabic-regular">
                    {book.arabic}
                  </Text>
                </View>
                <View
                  className={`w-6 h-6 rounded-md items-center justify-center border-2 ${
                    isSelected
                      ? 'bg-royal-blue-950 border-royal-blue-950'
                      : 'bg-white border-gray-300'
                  }`}
                >
                  {isSelected && <Check size={14} color="white" strokeWidth={3.5} />}
                </View>
              </Pressable>
            )
          })}

          {/* Apply */}
          <Pressable
            style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
            className="bg-royal-blue-950 mt-5 rounded-2xl py-4"
            onPress={selectBooks}
          >
            <Text className="text-white text-base font-semibold text-center">
              {t(SHARED_TEXT.SEARCH_APPLY)}
              {books.length > 0 ? ` (${books.length})` : ''}
            </Text>
          </Pressable>
        </BottomSheetView>
      </BottomSheet>
    </Portal>
  )
}

export default Sheet
