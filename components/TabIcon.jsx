import React from 'react';
import { View, Text, Image } from 'react-native';

// TabIcon 组件
export default function TabIcon({ name, icon, color, focused }) {
    return (
        <View style={{ alignItems: 'center' }}>
            {icon && (
                <Image
                    source={icon}
                    resizeMode="contain"
                    style={{
                        width: 24,
                        height: 24,
                        tintColor: focused ? color : '#999', // 根据 focused 状态改变颜色
                    }}
                />
            )}
            <Text style={{ color: focused ? color : '#999', fontSize: 12 }}>
                {name}
            </Text>
        </View>
    );
}
