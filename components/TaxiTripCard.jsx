import { View, Text, Image } from 'react-native'
import React from 'react'
import toIcon from '../assets/icons/to.png'
import pinIcon from '../assets/icons/pin.png'
import { formatDate } from '../lib/utils'


export default function TaxiTripCard({ data }) {
    const {
        destination_latitude, destination_longitude,
        origin_address, destination_address,
        ride_time,
        payment_status,
        created_at, driver
    } = data;
    const { first_name, last_name, car_seats } = driver;

    const mapImageUrl = [
        'https://maps.geoapify.com/v1/staticmap?',
        'style=osm-bright-smooth',
        'width=600',
        'height=400',
        `center=lonlat:${destination_longitude},${destination_latitude}`,
        'zoom=14',
        `apiKey=8243fccfee5043dd8bc2e7628bd886c8`,
    ].join('&');

    return (
        <View className='mb-4 mx-4 bg-[#FFFFFF] rounded-xl'>

            <View
                className='flex-row mx-4 mt-4'
                testID='top_main'
            >
                <Image
                    className='w-[80px] h-[80px] rounded-lg'
                    source={{ uri: mapImageUrl }}
                />
                <View
                    className='justify-around ml-4'
                    testID='right_top_container'
                >
                    <View
                        className='flex-row gap-4'
                        testID='icon_and_text'
                    >
                        <Image
                            className='w-5 h-5'
                            source={toIcon}
                            resizeMode='contain'
                        />
                        <Text className='w-40' numberOfLines={2} ellipsizeMode={'tail'}>
                            {destination_address}
                        </Text>
                    </View>

                    <View
                        className='flex-row gap-4'
                        testID='icon_and_text'
                    >
                        <Image
                            className='w-5 h-5'
                            source={pinIcon}
                            resizeMode='contain'
                        />
                        <Text className='w-40' numberOfLines={2} ellipsizeMode={'tail'}>
                            {origin_address}
                        </Text>
                    </View>
                </View>
            </View>
            <View
                testID='info_content'
                className='gap-y-1 bg-[#F6F8FA] m-2 h-44 rounded-xl overflow-hidden'
            >
                {/* 1 */}
                <View className='flex-row justify-between items-center flex-1 mx-4'>
                    <Text className='text-[#858585]'>
                        Date & Time
                    </Text>
                    <Text className='text-xs'>
                        {formatDate(created_at)}, {ride_time}
                    </Text>
                </View>
                <View className='bg-[#FFFFFF] h-[1px]' />
                {/* 2 */}
                <View className='flex-row justify-between items-center flex-1 mx-4'>
                    <Text className='text-[#858585]'>
                        Driver
                    </Text>
                    <Text className='text-xs'>
                        {first_name + ' ' + last_name}
                    </Text>
                </View>
                <View className='bg-[#FFFFFF] h-[1px]' />
                {/* 3 */}
                <View className='flex-row justify-between items-center flex-1 mx-4'>
                    <Text className='text-[#858585]'>
                        Car seats
                    </Text>
                    <Text className='text-xs'>
                        {car_seats}
                    </Text>
                </View>
                <View className='bg-[#FFFFFF] h-[1px]' />
                {/* 4 */}
                <View className='flex-row justify-between items-center flex-1 mx-4'>
                    <Text className='text-[#858585]'>
                        Payment Status
                    </Text>
                    <Text className={`capitalize text-xs ${payment_status ? 'text-green-500' : 'text-red-500'}`}>
                        {payment_status}
                    </Text>
                </View>
            </View>
        </View>
    )
}