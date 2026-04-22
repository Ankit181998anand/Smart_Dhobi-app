import { Platform, PermissionsAndroid } from "react-native";
import { PERMISSIONS, request, RESULTS, check, openSettings } from 'react-native-permissions';
import Geolocation from 'react-native-geolocation-service';

/**
 * Modernized Location Permission Helper
 * On Android: Uses built-in PermissionsAndroid for maximum reliability with system popups.
 * On iOS: Uses react-native-permissions.
 */
const requestLocationPermission = async () => {
    try {
        if (Platform.OS === 'android') {
            console.log("Checking Android location permission...");
            const status = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
            console.log("Current Android permission status:", status);

            if (status) return true;

            console.log("Requesting Android location permission popup...");
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    title: 'Location Permission',
                    message: 'SmartDhobi needs access to your location to find nearby services.',
                    buttonPositive: 'Allow',
                    buttonNegative: 'Deny',
                }
            );

            console.log("Android request result:", granted);
            
            if (granted === PermissionsAndroid.RESULTS.GRANTED) return true;
            if (granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) return 'BLOCKED';
            return false;
        } else {
            // iOS Logic
            const status = await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
            if (status === RESULTS.GRANTED) return true;
            if (status === RESULTS.DENIED) {
                const newStatus = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
                return newStatus === RESULTS.GRANTED;
            }
            if (status === RESULTS.BLOCKED) return 'BLOCKED';
            return false;
        }
    } catch (err) {
        console.warn('Permission error:', err);
        return false;
    }
};

export interface LocationResult {
    coords?: {
        latitude: number;
        longitude: number;
        altitude: number | null;
        accuracy: number;
        altitudeAccuracy?: number | null;
        heading?: number | null;
        speed?: number | null;
    };
    error?: 'PERMISSION_BLOCKED' | 'PERMISSION_DENIED' | 'LOCATION_ERROR' | 'UNEXPECTED_ERROR';
    details?: any;
}

export const requestAndFetchLocation = async (): Promise<LocationResult> => {
    try {
        // Ensure library is ready
        if (Platform.OS === 'ios') {
            await Geolocation.requestAuthorization('whenInUse');
        }

        const permissionStatus = await requestLocationPermission();

        if (permissionStatus === 'BLOCKED') {
            return { error: 'PERMISSION_BLOCKED' };
        }

        if (permissionStatus !== true) {
            return { error: 'PERMISSION_DENIED' };
        }

        // Permission is GRANTED, now fetch with high accuracy
        return new Promise((resolve) => {
            Geolocation.getCurrentPosition(
                (position) => {
                    console.log("Location fetch success:", position.coords);
                    resolve({ coords: position.coords });
                },
                (error) => {
                    console.log("Location fetch error:", error);
                    resolve({ error: 'LOCATION_ERROR', details: error });
                },
                {
                    enableHighAccuracy: true,
                    timeout: 20000,
                    maximumAge: 0, // Force fresh location
                    forceRequestLocation: true,
                    showLocationDialog: true,
                }
            );
        });
    } catch (error) {
        console.error("requestAndFetchLocation unexpected error:", error);
        return { error: 'UNEXPECTED_ERROR', details: error };
    }
};

export const getAddressFromCoordinates = async (latitude: number, longitude: number) => {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000);

        const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
            {
                headers: {
                    "User-Agent": "SmartDhobi/1.0",
                },
                signal: controller.signal,
            }
        );
        clearTimeout(timeoutId);

        const data = await response.json();
        if (data?.display_name) return data.display_name;

        return `Lat: ${latitude.toFixed(5)}, Lon: ${longitude.toFixed(5)}`;
    } catch (error) {
        console.error("Geocoding error:", error);
        return `Lat: ${latitude.toFixed(5)}, Lon: ${longitude.toFixed(5)}`;
    }
};

export { openSettings };