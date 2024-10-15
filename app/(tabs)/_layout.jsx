import React from 'react'
import { Tabs } from 'expo-router'
import TabIcon from '../../components/TabIcon'
import homeIcon from '../../assets/icons/home.png'
import chatIcon from '../../assets/icons/chat.png'
import listIcon from '../../assets/icons/list.png'
import profileIcon from '../../assets/icons/profile.png'

export default function TabsLayout() {
    return (
        <Tabs>
            <Tabs.Screen
                name='home'
                options={{
                    title: 'Home',
                    headerShown: false,
                    tabBarLabel: () => null,
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