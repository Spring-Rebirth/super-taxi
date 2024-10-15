import React from 'react';
import { View, Image } from 'react-native';

// TabIcon 组件
export default function TabIcon({ icon, color, focused }) {
    return (
        <View className={`flex-row justify-center items-center rounded-full
            ${focused ? 'bg-green-300' : ''}`}>
            <View className={`rounded-full w-12 h-12 justify-center items-center
                ${focused ? 'bg-green-400' : ''} `}>
                {icon && (
                    <Image
                        source={icon}
                        resizeMode="contain"
                        style={{
                            width: 24,
                            height: 24,
                            tintColor: focused ? color : '#fff', // 根据 focused 状态改变颜色
                        }}
                    />
                )}
            </View>
        </View>
    );
}
