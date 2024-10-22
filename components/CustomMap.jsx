import { View, Text, TouchableOpacity, Image } from 'react-native'
import MapView, { PROVIDER_OSM, Marker } from 'react-native-maps'
import { useLocationStore } from '../store/index'
import { calculateRegion, generateMarkersFromData } from '../lib/map'
import { useEffect, useRef, useState } from 'react'
import { driverMock } from '../constants/MockDrivers'
import { useDriverStore } from '../store/index'
import markerIcon from '../assets/icons/marker.png'
import selectedMkIcon from '../assets/icons/selected-marker.png'
import * as Location from 'expo-location'; // 用于获取用户位置
import userLocationIcon from '../assets/icons/target.png';


export default function CustomMap({ myLocationHeight = 20 }) {
    const { userLongitude, userLatitude, destinationLongitude, destinationLatitude } = useLocationStore();
    const region = calculateRegion({ userLatitude, userLongitude, destinationLatitude, destinationLongitude });
    const { selectedDriver, setDrivers } = useDriverStore();
    const drivers = driverMock;

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
                {markers.map(marker => (
                    <Marker
                        key={marker.id}
                        coordinate={{
                            latitude: marker.latitude,
                            longitude: marker.longitude
                        }}
                        title={marker.title}
                        image={marker.id === selectedDriver ? selectedMkIcon : markerIcon}
                    />
                ))}
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