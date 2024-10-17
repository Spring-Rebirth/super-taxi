import { View, Text } from 'react-native'
import MapView, { PROVIDER_DEFAULT } from 'react-native-maps'

export default function CustomMap() {
    return (
        <MapView
            className='w-full h-full rounded-2xl'
            provider={PROVIDER_DEFAULT}
        >
            <Text>Map</Text>
        </MapView>
    )
}