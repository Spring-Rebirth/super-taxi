import React from 'react'
import { Tabs } from 'expo-router'
import TabIcon from '../../components/TabIcon'
import homeIcon from '../../assets/icons/home.png'
import chatIcon from '../../assets/icons/chat.png'
import listIcon from '../../assets/icons/list.png'
import profileIcon from '../../assets/icons/profile.png'
import useKeyboardVisibility from '../../hooks/useKeyboardVisibility'

export default function TabsLayout() {
    const keyboardVisible = useKeyboardVisibility();

    return (
        <Tabs
            initialRouteName='home'
            screenOptions={{
                tabBarActiveTintColor: 'white',
                tabBarInactiveTintColor: 'white',
                tabBarShowLabel: false,
                tabBarStyle: {
                    display: keyboardVisible ? 'none' : 'flex',
                    backgroundColor: '#333333',
                    borderRadius: 50,
                    paddingBottom: 0,
                    overflow: 'hidden',
                    marginHorizontal: 20,
                    marginBottom: 20,
                    height: 78,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }
            }}
        >
            <Tabs.Screen
                name='home'
                options={{
                    title: 'home',
                    headerShown: false,
                    tabBarLabel: () => null,
                    tabBarIcon: ({ color, focused }) => (
                        <TabIcon
                            icon={homeIcon}
                            color={color}
                            focused={focused} />
                    )
                }}
            />
            <Tabs.Screen
                name='rides'
                options={{
                    title: 'rides',
                    headerShown: false,
                    tabBarLabel: () => null,
                    tabBarIcon: ({ color, focused }) => (
                        <TabIcon
                            name={'rides'}
                            icon={listIcon}
                            color={color}
                            focused={focused} />
                    )
                }}
            />
            <Tabs.Screen
                name='chat'
                options={{
                    title: 'chat',
                    headerShown: false,
                    tabBarLabel: () => null,
                    tabBarIcon: ({ color, focused }) => (
                        <TabIcon
                            name={'chat'}
                            icon={chatIcon}
                            color={color}
                            focused={focused} />
                    )
                }}
            />
            <Tabs.Screen
                name='profile'
                options={{
                    title: 'profile',
                    headerShown: false,
                    tabBarLabel: () => null,
                    tabBarIcon: ({ color, focused }) => (
                        <TabIcon
                            name={'profile'}
                            icon={profileIcon}
                            color={color}
                            focused={focused} />
                    )
                }}
            />
        </Tabs>
    )
}