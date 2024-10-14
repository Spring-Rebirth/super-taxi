import React from 'react'
import { Tabs } from 'expo-router'
import TabIcon from '../../components/TabIcon'
import homeIcon from '../../assets/icons/pin.png'

export default function TabsLayout() {
    return (
        <Tabs>
            <Tabs.Screen
                name='home'
                options={{
                    title: 'Home',
                    headerShown: false,
                    tabBarLabel: '',
                    tabBarIcon: ({ color, focused }) => (
                        <TabIcon
                            name={'Home'}
                            icon={homeIcon}
                            color={color}
                            focused={focused} />
                    )
                }}
            />
        </Tabs>
    )
}