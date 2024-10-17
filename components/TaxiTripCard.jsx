import { View, Text, Image } from 'react-native'
import React from 'react'

export default function TaxiTripCard({ data }) {
    const {
        destination_latitude, destination_longitude,
        ride_id, origin_address, destination_address,
        origin_latitude, origin_longitude, ride_time,
        fare_price, payment_status, driver_id, user_id,
        created_at, driver
    } = data;
    const { first_name, last_name, profile_image_url, car_image_url, car_seats, rating } = driver;

    const mapImageUrl = [
        'https://maps.geoapify.com/v1/staticmap?',
        'style=osm-bright-smooth',
        'width=600',
        'height=400',
        `center=lonlat:${destination_longitude},${destination_latitude}`,
        'zoom=14',
        `apiKey=${process.env.EXPO_PUBLIC_GEOAPIFY_API_KEY}`,
    ].join('&');


    return (
        <View className='mb-4 mx-4'>
            <View className='flex-row'>
                <Image
                    className='w-[80px] h-[90px] rounded-lg'
                    source={{ uri: mapImageUrl }}
                />
            </View>
        </View>
    )
}