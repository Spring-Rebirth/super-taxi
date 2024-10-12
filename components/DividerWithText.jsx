import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function DividerWithText() {
    return (
        <View style={styles.container}>
            <View style={styles.line} />
            <Text style={styles.text}>Or</Text>
            <View style={styles.line} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 20, // 调整与其他元素的距离
        marginHorizontal: 15
    },
    line: {
        flex: 1,
        height: 1,
        backgroundColor: '#CED1DD', // 分隔线的颜色
    },
    text: {
        marginHorizontal: 10, // 文字与线条之间的间距
        fontSize: 16,
        color: '#333', // 文字颜色
    },
});
