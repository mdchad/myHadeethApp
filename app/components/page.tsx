import { SafeAreaView, Edge } from 'react-native-safe-area-context';
import React from 'react'
import { withUniwind } from 'uniwind'

// this component is used to wrap the content of each page
// with keyboard dismiss and to prevent code repetition

interface PageProps {
  children: React.ReactNode;
  edges?: Edge[];
  className?: string;
}

const StyledSafeAreaView = withUniwind(SafeAreaView);

const Page: React.FC<PageProps> = ({ children, className, edges = [], ...props }) => {
  return (
    <StyledSafeAreaView
      className={`${className} flex-1`}
      edges={[...edges]}
    >
      {children}
    </StyledSafeAreaView>
  )
}

export default Page

