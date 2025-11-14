import { SafeAreaView, Edge } from 'react-native-safe-area-context';
import React from 'react'

// this component is used to wrap the content of each page
// with keyboard dismiss and to prevent code repetition

interface PageProps {
  children: React.ReactNode;
  edges?: Edge[];
  class?: string;
}

const Page: React.FC<PageProps> = ({ children, edges = [], ...props }) => {
  return (
    <SafeAreaView
      className={`${props.class}`}
      edges={[ 'top', ...edges]}
      style={{ flex: 1, backgroundColor: 'white' }}
    >
      {children}
    </SafeAreaView>
  )
}

export default Page

