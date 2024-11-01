import { View, TouchableOpacity, Image, ActivityIndicator } from 'react-native'
import MapView, { PROVIDER_OSM, Marker, Polyline } from 'react-native-maps'
import { useLocationStore } from '../store/index'
import { calculateDriverTimes, calculateRegion, generateMarkersFromData } from '../lib/map'
import { useEffect, useRef, useState } from 'react'
import { useDriverStore } from '../store/index'
import pointIcon from '../assets/icons/point.png'
import * as Location from 'expo-location';
import userLocationIcon from '../assets/icons/target.png';
import { driverMock } from '../constants/MockDrivers'
import pinIcon from '../assets/icons/pin.png'
import axios from 'axios';
import polyline from '@mapbox/polyline';
import { useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import UserLocationIcon from '../components/UserLocationIcon';

export default function CustomMap({ myLocationHeight = 60 }) {
    // 试试改用模拟数据
    const drivers = driverMock;

    const { userLongitude, userLatitude, destinationLongitude, destinationLatitude } = useLocationStore();
    const region = calculateRegion({ userLatitude, userLongitude, destinationLatitude, destinationLongitude });
    const route = useRoute();
    const { setDrivers } = useDriverStore();
    const [routeCoordinates, setRouteCoordinates] = useState([]);
    const [markers, setMarkers] = useState([]);
    const mapRef = useRef(null);

    // 获取用户位置并将地图中心移动到该位置
    const goToUserLocation = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            console.log('Permission to access location was denied');
            return;
        }

        let location = await Location.getCurrentPositionAsync({});
        const userRegion = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.005,  // 可以根据需要调整
            longitudeDelta: 0.005,  // 可以根据需要调整
        };

        mapRef.current.animateToRegion(userRegion, 1000); // 动画移动到用户位置
    };

    useEffect(() => {
        const initializeDrivers = async () => {
            try {
                const existingDrivers = await AsyncStorage.getItem('drivers');
                if (existingDrivers === null) {
                    await AsyncStorage.setItem('drivers', JSON.stringify(driverMock));
                    console.log('司机数据已初始化');
                }
            } catch (error) {
                console.error('初始化司机数据失败:', error);
            }
        };

        initializeDrivers();
    }, []);

    useEffect(() => {
        if (Array.isArray(drivers)) {
            if (!userLatitude || !userLongitude) return;

            const newMarkers = generateMarkersFromData({
                data: drivers,
                userLatitude,
                userLongitude
            });

            setMarkers(newMarkers);
        }
    }, [drivers, userLatitude, userLongitude])

    useEffect(() => {
        if (markers.length > 0 && destinationLatitude && destinationLongitude) {
            calculateDriverTimes({
                markers,
                userLatitude,
                userLongitude,
                destinationLatitude,
                destinationLongitude
            }).then((drivers) => {
                setDrivers(drivers);
            })
        }
    }, [markers, destinationLatitude, destinationLongitude, userLatitude, userLongitude, setDrivers])

    const routeCache = useRef({});
    const debounceTimer = useRef(null);
    const lastRequestTime = useRef(0);

    const getRouteFromOSRM = async (origin, destination) => {
        // 清空条件
        if (!origin || !destination) {
            setRouteCoordinates([]); // 如果没有提供起点或终点，清空路线
            return;
        }

        // 防抖机制
        clearTimeout(debounceTimer.current);
        debounceTimer.current = setTimeout(async () => {
            const cacheKey = `${origin};${destination}`;

            // 如果缓存中已有结果，则直接返回缓存中的数据
            if (routeCache.current[cacheKey]) {
                setRouteCoordinates(routeCache.current[cacheKey]);  // 直接从缓存中获取路线数据
                return;
            }

            const now = new Date().getTime();

            // 检查是否距离上次请求超过1秒
            if (now - lastRequestTime.current < 1000) {
                console.log('请求太频繁，请稍后再试');
                return;
            }

            lastRequestTime.current = now;  // 更新最后请求时间

            // 发起请求
            try {
                const response = await axios.get(
                    `https://router.project-osrm.org/route/v1/driving/${origin};${destination}?overview=full&geometries=polyline`,
                    {
                        headers: {
                            'User-Agent': 'super-taxi/1.0 (https://uber.com)',  // 提供有效的 User-Agent
                        }
                    }
                );

                // 解码 polyline 字符串
                const coordinates = polyline.decode(response.data.routes[0].geometry);
                const routeCoords = coordinates.map(([lat, lng]) => ({
                    latitude: lat,
                    longitude: lng
                }));

                // 缓存结果
                routeCache.current[cacheKey] = routeCoords;

                // 设置解码后的路线坐标
                setRouteCoordinates(routeCoords);

            } catch (error) {
                console.error("Error fetching route:", error);
            }

        }, 500);  // 500 毫秒的防抖时间
    };

    useEffect(() => {
        // 检查所有必需的经纬度是否存在
        if (userLatitude && userLongitude && destinationLatitude && destinationLongitude) {
            const origin = `${userLongitude},${userLatitude}`;  // 起点
            const destination = `${destinationLongitude},${destinationLatitude}`;  // 终点

            // 调用 getRouteFromOSRM 获取路线
            getRouteFromOSRM(origin, destination);
        }
    }, [userLatitude, userLongitude, destinationLatitude, destinationLongitude]);  // 当这些值变化时重新调用


    useEffect(() => {
        if (routeCoordinates.length > 0 && mapRef.current) {
            mapRef.current.fitToCoordinates(routeCoordinates, {
                edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
                animated: true,
            });
        }
    }, [routeCoordinates]);


    if (!userLatitude || !userLongitude) {
        return (
            <View className='w-full h-full justify-center items-center'>
                <ActivityIndicator size={'small'} color={'#000'} />
            </View>
        );
    }

    return (
        <>
            <MapView
                ref={mapRef}
                className='w-full h-full rounded-2xl'
                provider={PROVIDER_OSM}
                initialRegion={region}
                showsUserLocation={false}
                tintColor={'black'}
                userInterfaceStyle={'light'}
                showsPointsOfInterest={false}
            >

                {userLatitude && userLongitude && (
                    <Marker
                        key={'currentLocation'}
                        title='Your Location'
                        coordinate={{
                            latitude: userLatitude,
                            longitude: userLongitude
                        }}
                    >
                        <UserLocationIcon />
                    </Marker>
                )}

                {destinationLatitude && destinationLongitude && route.name !== 'home' && (
                    <>
                        <Marker
                            key={'destination'}
                            title='Destination'
                            coordinate={{
                                latitude: destinationLatitude,
                                longitude: destinationLongitude
                            }}
                        >
                            <Image source={pinIcon} style={{ width: 26, height: 26 }} resizeMode='contain' />
                        </Marker>

                        {/* 显示路线 */}
                        {routeCoordinates.length > 0 && (
                            <Polyline
                                coordinates={routeCoordinates}
                                strokeWidth={4}
                                strokeColor="#1E90FF"
                            />
                        )}
                    </>
                )}
            </MapView>

            <TouchableOpacity
                style={{
                    position: 'absolute',
                    bottom: myLocationHeight,  // 控制按钮的垂直位置
                    right: 20, // 控制按钮的水平位置
                    backgroundColor: 'white',
                    padding: 10,
                    borderRadius: 50,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.3,
                    shadowRadius: 4,
                    elevation: 5,
                }}
                onPress={goToUserLocation}  // 点击按钮时移动到用户位置
            >
                <Image source={userLocationIcon} style={{ width: 20, height: 20 }} />
            </TouchableOpacity>
        </>
    )
}