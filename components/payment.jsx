import React, { useEffect, useState } from 'react';
import { View, Button, Alert, StyleSheet } from 'react-native';
import { useStripe } from '@stripe/stripe-react-native';
import { fetchAPI } from '../lib/fetch';

export default function Payment({ fullName, email, amount, driverId, rideTime }) {
    const { initPaymentSheet, presentPaymentSheet } = useStripe();
    const [loading, setLoading] = useState(false);


    const fetchPaymentSheetParams = async () => {
        try {
            const data = await fetchAPI(`/(api)/create-payment-intent`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    amount: Math.round(amount * 100), // 将金额转换为最小货币单位（分）
                    currency: 'usd',
                    driverId,
                    rideTime,
                }),
            });
            const { clientSecret } = data;
            return clientSecret;
        } catch (error) {
            console.error('Error fetching payment intent client secret:', error);
            Alert.alert('Error', '无法初始化支付');
            return null;
        }
    };

    const initializePaymentSheet = async () => {
        setLoading(true);
        try {
            const { paymentIntent, ephemeralKey, customer } = await fetchPaymentSheetParams();

            const { error } = await initPaymentSheet({
                customerId: customer,
                customerEphemeralKeySecret: ephemeralKey,
                paymentIntentClientSecret: paymentIntent,
                merchantDisplayName: 'Super Taxi',
                // 其他配置
            });

            if (error) {
                Alert.alert('Error', error.message);
            }
        } catch (error) {
            console.error('Error initializing payment sheet:', error);
            Alert.alert('Error', '无法初始化支付表');
        } finally {
            setLoading(false);
        }
    };

    const openPaymentSheet = async () => {
        const { error } = await presentPaymentSheet();

        if (error) {
            Alert.alert('Error', error.message);
        } else {
            Alert.alert('Success', 'Your payment is confirmed!');
            // 在此处执行支付成功后的操作，例如导航到订单确认页面
        }
    };

    useEffect(() => {
        initializePaymentSheet();
    }, []);

    return (
        <View style={styles.container}>
            <Button onPress={openPaymentSheet} title="Confirm Ride" disabled={loading} />
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        width: '100%',
        paddingHorizontal: 16,
        marginTop: 20,
    },
});
