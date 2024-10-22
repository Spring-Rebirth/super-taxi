import { Driver, MarkerData } from "@/types/type";
import axios from 'axios';

const directionsAPI = process.env.EXPO_PUBLIC_GOOGLE_API_KEY;

export const generateMarkersFromData = ({
    data,
    userLatitude,
    userLongitude,
}: {
    data: Driver[];
    userLatitude: number;
    userLongitude: number;
}): MarkerData[] => {
    return data.map((driver) => {
        const latOffset = (Math.random() - 0.5) * 0.01; // Random offset between -0.005 and 0.005
        const lngOffset = (Math.random() - 0.5) * 0.01; // Random offset between -0.005 and 0.005

        return {
            latitude: userLatitude + latOffset,
            longitude: userLongitude + lngOffset,
            title: `${driver.first_name} ${driver.last_name}`,
            ...driver,
        };
    });
};

export const calculateRegion = ({
    userLatitude,
    userLongitude,
    destinationLatitude,
    destinationLongitude,
}: {
    userLatitude: number | null;
    userLongitude: number | null;
    destinationLatitude?: number | null;
    destinationLongitude?: number | null;
}) => {
    if (!userLatitude || !userLongitude) {
        return {
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
        };
    }

    if (!destinationLatitude || !destinationLongitude) {
        return {
            latitude: userLatitude,
            longitude: userLongitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
        };
    }

    const minLat = Math.min(userLatitude, destinationLatitude);
    const maxLat = Math.max(userLatitude, destinationLatitude);
    const minLng = Math.min(userLongitude, destinationLongitude);
    const maxLng = Math.max(userLongitude, destinationLongitude);

    const latitudeDelta = (maxLat - minLat) * 1.3; // Adding some padding
    const longitudeDelta = (maxLng - minLng) * 1.3; // Adding some padding

    const latitude = (userLatitude + destinationLatitude) / 2;
    const longitude = (userLongitude + destinationLongitude) / 2;

    return {
        latitude,
        longitude,
        latitudeDelta,
        longitudeDelta,
    };
};



export const calculateDriverTimes = async ({
    markers,
    userLatitude,
    userLongitude,
    destinationLatitude,
    destinationLongitude,
}: any) => {
    if (
        !userLatitude ||
        !userLongitude ||
        !destinationLatitude ||
        !destinationLongitude
    )
        return;

    try {
        const timesPromises = markers.map(async (marker: { longitude: any; latitude: any; }) => {
            // 请求用户到目的地的路线
            const responseToUser = await axios.get(
                `https://router.project-osrm.org/route/v1/driving/${marker.longitude},${marker.latitude};${userLongitude},${userLatitude}?overview=false&geometries=polyline`
            );
            const dataToUser = responseToUser.data;

            if (!dataToUser.routes || dataToUser.routes.length === 0) {
                console.error('No routes found for marker to user');
                return null;
            }

            const timeToUser = dataToUser.routes[0].duration / 60; // Time in minutes

            // 请求用户到目的地的路线
            const responseToDestination = await axios.get(
                `https://router.project-osrm.org/route/v1/driving/${userLongitude},${userLatitude};${destinationLongitude},${destinationLatitude}?overview=false&geometries=polyline`
            );
            const dataToDestination = responseToDestination.data;

            if (!dataToDestination.routes || dataToDestination.routes.length === 0) {
                console.error('No routes found for user to destination');
                return null;
            }

            const timeToDestination = dataToDestination.routes[0].duration / 60; // Time in minutes

            const totalTime = timeToUser + timeToDestination; // Total time in minutes
            const price = (totalTime * 0.5).toFixed(2); // 计算基于时间的价格

            return { ...marker, time: totalTime, price };
        });

        return (await Promise.all(timesPromises)).filter(marker => marker !== null);
    } catch (error) {
        console.error('Error calculating driver times:', error);
    }
};
