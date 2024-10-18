// cSpell:words zustand
import { create } from "zustand";

export const useLocationStore = create((set) => ({
    userAddress: null,
    userLongitude: null,
    userLatitude: null,
    destinationLongitude: null,
    destinationLatitude: null,
    destinationAddress: null,
    setUserLocation: ({ latitude, longitude, address }) => {
        set(() => ({
            userLatitude: latitude,
            userLongitude: longitude,
            userAddress: address
        }))
    },
    setDestinationLocation: ({ latitude, longitude, address }) => {
        set(() => ({
            destinationLatitude: latitude,
            destinationLongitude: longitude,
            destinationAddress: address
        }))
    }
}))