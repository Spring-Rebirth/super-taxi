import { Tabs } from 'expo-router'

import { View, Text } from 'react-native'
import React from 'react'

export default function TabsLayout() {
    return (
        <Tabs

        >
            <Tabs.Screen
                name='home'
                options={{
                    title: 'Home',
                    headerShown: false,
                    tabBarIcon: ({ color, focused }) => (
                        <TabIcon
                            name={'Home'}
                            // icon={icons.home}
                            color={color}
                            focused={focused} />
                    )
                }}
            />
        </Tabs>
    )
}