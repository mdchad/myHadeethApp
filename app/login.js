import { View, Text } from 'react-native'
import React from 'react'
import Page from './components/page'
import { Link } from 'expo-router'

const login = () => {

    return (
        <Page>
            <Text>Login</Text>
            <Link href="/Content">Content</Link>
        </Page>
    )
}

export default login