import { View, Text } from 'react-native'
import MapView, { PROVIDER_DEFAULT } from 'react-native-maps'
import { useLocationStore } from '../store/index'
import { calculateRegion } from '../lib/map'

export default function CustomMap() {
    const { userLongitude, userLatitude, destinationLongitude, destinationLatitude } = useLocationStore();
    const region = calculateRegion({
        userLatitude, userLongitude, destinationLatitude, destinationLongitude
    })

    return (
        <MapView
            className='w-full h-full rounded-2xl'
            provider={PROVIDER_DEFAULT}
            region={region}
        >
            <Text>Map</Text>
        </MapView>
    )
}