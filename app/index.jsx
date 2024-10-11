import { Image, Text, TouchableOpacity, View } from "react-native";
import Swiper from 'react-native-swiper'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRef, useState } from "react";
import { onboarding } from '../constants/WelcomeText'

export default function Index() {
  const swiperRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <SafeAreaView className="h-full items-center">
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <TouchableOpacity className="w-10 h-10 absolute top-12 right-6">
          <Text className="text-black text-lg font-bold">
            Skip
          </Text>
        </TouchableOpacity>

        <Swiper
          ref={swiperRef}
          loop={false}
          dot={
            <View className={'w-[32] h-[4] mx-1 bg-[#E2E8F0] rounded-full'} />
          }
          activeDot={
            <View className={'w-[32] h-[4] mx-1 bg-[#0286FF] rounded-full '} />
          }
        >
          {onboarding.map(item => {
            console.log(item);
            return (
              <View
                className="w-full h-auto items-center justify-start my-6"
                key={item.id}
              >
                <Image
                  className="w-full h-[300]"
                  source={item.image}
                  resizeMode="contain"
                />
                <View className={'px-16 space-y-2 mt-8'}>
                  <Text className={'text-2xl text-center font-bold'}>
                    {item.title}
                  </Text>

                  <Text className={'text-general-200 text-center text-sm'}>
                    {item.description}
                  </Text>
                </View>
              </View>
            )
          })}
        </Swiper>
      </View>
    </SafeAreaView>
  );
}
