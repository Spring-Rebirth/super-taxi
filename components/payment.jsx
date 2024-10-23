import React, { useState } from 'react';
import { View, Button, Alert, StyleSheet } from 'react-native';
import { CardField, useConfirmPayment } from '@stripe/stripe-react-native';
import { fetchAPI } from '../lib/fetch';

export default function Payment({ fullName, email, amount, driverId, rideTime }) {
    const [cardDetails, setCardDetails] = useState();
    const { confirmPayment, loading } = useConfirmPayment();


    const fetchPaymentIntentClientSecret = async () => {
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

    const handlePayPress = async () => {
        // 1. 获取客户端密钥
        const clientSecret = await fetchPaymentIntentClientSecret();
        if (!clientSecret) return;
        // 2. 确认支付
        const { paymentIntent, error } = await confirmPayment(clientSecret, {
            paymentMethodType: 'Card',
            paymentMethodData: {
                billingDetails: {
                    name: fullName,
                    email: email,
                },
            },
        });

        if (error) {
            Alert.alert(`支付失败：${error.message}`);
        } else if (paymentIntent) {
            Alert.alert('支付成功', `支付状态：${paymentIntent.status}`);
            // 在此处执行任何额外操作，例如更新数据库或导航到其他页面
        }
    };

    return (
        <View style={styles.container}>
            <CardField
                postalCodeEnabled={false}
                placeholder={{
                    number: '4242 4242 4242 4242',
                }}
                cardStyle={{
                    backgroundColor: '#FFFFFF',
                    textColor: '#000000',
                }}
                style={styles.cardField}
                onCardChange={(cardDetails) => {
                    setCardDetails(cardDetails);
                }}
            />
            <Button onPress={handlePayPress} title="Pay" disabled={loading} />
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        width: '100%',
        paddingHorizontal: 16,
        marginTop: 20,
    },
    cardField: {
        height: 50,
        marginVertical: 30,
    },
});
