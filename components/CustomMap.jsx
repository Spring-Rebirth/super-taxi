import { View, Text } from 'react-native'
import MapView, { PROVIDER_DEFAULT, Marker } from 'react-native-maps'
import { useLocationStore } from '../store/index'
import { calculateRegion, generateMarkersFromData } from '../lib/map'
import { useEffect, useState } from 'react'
import { driverMock } from '../constants/MockDrivers'
import { useDriverStore } from '../store/index'
import markerIcon from '../assets/icons/marker.png'
import selectedMkIcon from '../assets/icons/selected-marker.png'

export default function CustomMap() {
    const { userLongitude, userLatitude, destinationLongitude, destinationLatitude } = useLocationStore();
    const region = calculateRegion({ userLatitude, userLongitude, destinationLatitude, destinationLongitude });
    const { selectedDriver, setDrivers } = useDriverStore();
    const drivers = driverMock;

    const [markers, setMarkers] = useState([]);

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
        <MapView
            className='w-full h-full rounded-2xl'
            provider={PROVIDER_DEFAULT}
            initialRegion={region}
            showsUserLocation={true}
        >
            {markers.map(marker => (
                <Marker
                    key={marker.id}
                    coordinate={{
                        latitude: marker.latitude,
                        longitude: marker.longitude
                    }}
                    image={marker.id === selectedDriver ? selectedMkIcon : markerIcon}
                />
            ))}
        </MapView>
    )
}