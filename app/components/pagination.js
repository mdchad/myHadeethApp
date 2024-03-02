import React from 'react';
import {Text, View, TouchableHighlight} from 'react-native'
import {t} from "i18next";
import SHARED_TEXT from "../i18n";

const Pagination = ({ count, currentPage = 1, setPage, books = '' }) => {
  const totalCount = count; // Replace with the actual total count of collections
  const itemsPerPage = 10;
  const totalPages = Math.ceil(totalCount / itemsPerPage);
  const maxPageNumberWindow = 3;
  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(startIndex + itemsPerPage - 1, totalCount);

  let pageNumbers = [];
  let startPage = Math.max(1, currentPage - Math.floor(maxPageNumberWindow / 2));
  let endPage = Math.min(totalPages, startPage + maxPageNumberWindow - 1);

  if (endPage - startPage + 1 < maxPageNumberWindow) {
    startPage = Math.max(1, endPage - maxPageNumberWindow + 1);
  }

  if (startPage > 1) {
    pageNumbers = [1, '...'];
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  if (endPage < totalPages) {
    pageNumbers.push('...');
    pageNumbers.push(totalPages);
  }

  return (
    <View className="flex px-5 pb-2">
      <Text className="text-right my-2 font-sans text-sm">{t(SHARED_TEXT.SEARCH_SHOWING_RESULTS)} {startIndex} - {endIndex} {t(SHARED_TEXT.SEARCH_OF)} {totalCount}</Text>
      <View className='flex flex-row list-none justify-end'>
        {pageNumbers.map((number, i) => (
          <View key={i}>
            {number === '...' ? (
              <Text className="px-4 py-2 mx-1">{number}</Text>
            ) : (
              <TouchableHighlight
                onPress={() => setPage(number)}
                underlayColor={'#f3f4f6'}
                className={`${currentPage === number ? 'bg-royal-blue' : 'bg-white'} text-sm px-2 py-1 mx-1 rounded`}
              >
                <Text className={`${currentPage === number ? 'text-white' : 'text-black'}`}>{number}</Text>
              </TouchableHighlight>
            )}
          </View>
        ))}
      </View>
    </View>
  );
};

export default Pagination;