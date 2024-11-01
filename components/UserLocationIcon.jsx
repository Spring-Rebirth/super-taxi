import React from 'react';
import { View, StyleSheet } from 'react-native';

const LocationIndicator = () => {
    return (
        <View style={[styles.outerCircle, styles.scaled]}>
            <View style={styles.innerCircle} />
        </View>
    );
};
const styles = StyleSheet.create({
    outerCircle: {
        width: 40, // 外圈直径
        height: 40, // 外圈直径
        borderRadius: 20, // 圆形
        backgroundColor: 'white', // 外圈颜色
        justifyContent: 'center',
        alignItems: 'center',
    },
    innerCircle: {
        width: 24, // 内圈直径
        height: 24, // 内圈直径
        borderRadius: 12, // 圆形
        backgroundColor: '#1E90FF', // 内圈颜色
    },
    scaled: {
        transform: [{ scale: 0.5 }], // 缩小 40%
    },
});

export default LocationIndicator;
