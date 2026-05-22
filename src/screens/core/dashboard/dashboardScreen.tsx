import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    Text,
    TouchableOpacity,
    View,
    RefreshControl,
    ActivityIndicator,
    Alert
} from "react-native";
import styles from "./style";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import COLORS, { FONT_FAMILY_SEMIBOLD } from "../../../utils/constant";
import { useIsFocused } from "@react-navigation/native";
import { DashBoardScreenProps } from "../../../navigations/types";
import { SvgXml } from "react-native-svg";
import { SVG_ICON } from "../../../assets/Svg/svgIcon";
import { useSelector } from "react-redux";
import type { RootState } from "../../../redux/store";
import { providerService } from "../../../services/providerService";
import { userService } from "../../../services/userService";
import LinearGradient from "react-native-linear-gradient";
import GradientButton from "../../../components/GradientButton";
import { Provider, Analytics, Service } from "../../../types";

import { requestAndFetchLocation, getAddressFromCoordinates, LocationResult } from "../../../utils/locationHelper";

const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (R * c).toFixed(1);
};

const DashBoardScreen: React.FC<DashBoardScreenProps> = ({ route, navigation }) => {
    const { type } = route.params;
    const isFocused = useIsFocused();
    const insets = useSafeAreaInsets();
    const { user } = useSelector((state: RootState) => state.auth);

    const [providers, setProviders] = useState<Provider[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [analytics, setAnalytics] = useState<Analytics | null>(null);
    const [services, setServices] = useState<Service[]>([]);
    const [providerProfile, setProviderProfile] = useState<Provider | null>(null);
    const [showAllProviders, setShowAllProviders] = useState(false);

    // Filter States
    const [maxDistance, setMaxDistance] = useState(10);
    const [userCoords, setUserCoords] = useState<{ lat: number, lon: number } | null>(null);
    const [detectedAddress, setDetectedAddress] = useState<string>('');
    const [locLoading, setLocLoading] = useState(false);
    const [showDistanceDropdown, setShowDistanceDropdown] = useState(false);
    const [hasAttemptedAutoLoc, setHasAttemptedAutoLoc] = useState(false);

    const distanceOptions = [1, 2, 5, 10, 25];

    const fetchData = useCallback(async () => {
        try {
            setIsLoading(true);
            if (type === 'dhobi') {
                const providerId = user?.mainUserId || user?._id || '';
                const [analyticsData, profileData] = await Promise.all([
                    providerService.getAnalytics(),
                    providerService.getProfile(providerId)
                ]);
                console.log("[DHOBI DASHBOARD] Analytics:", analyticsData);
                console.log("[DHOBI DASHBOARD] Profile:", profileData);
                setAnalytics(analyticsData.data);
                const providerData = (profileData.data || profileData.provider || profileData) as any;
                setProviderProfile(providerData);
                setServices(providerData.services || []);
            } else {
                const params = userCoords ? {
                    lat: userCoords.lat,
                    lon: userCoords.lon,
                    maxDistance: maxDistance
                } : undefined;

                const [profile, allProviders] = await Promise.all([
                    userService.getProfile(),
                    providerService.getAll(params)
                ]);
                console.log("[CUSTOMER DASHBOARD] Profile:", profile);
                console.log("[CUSTOMER DASHBOARD] All Providers:", allProviders);
                setProviders(allProviders.data || allProviders.providers || []);
            }
        } catch (error) {
            console.error("Dashboard fetch error:", error);
        } finally {
            setIsLoading(false);
            setRefreshing(false);
        }
    }, [type, user?._id, user?.mainUserId, userCoords, maxDistance]);

    const handleUseCurrentLocation = async () => {
        try {
            setLocLoading(true);
            const result: LocationResult = await requestAndFetchLocation();
            if (result.coords) {
                const { latitude, longitude } = result.coords;
                setUserCoords({ lat: latitude, lon: longitude });
                const address = await getAddressFromCoordinates(latitude, longitude);
                setDetectedAddress(address);
            } else if (result.error) {
                Alert.alert("Location Error", "Please enable location permissions to use this feature.");
            }
        } catch (error) {
            console.error("Location error:", error);
        } finally {
            setLocLoading(false);
        }
    };

    useEffect(() => {
        if (isFocused) {
            StatusBar.setBarStyle('dark-content');
            StatusBar.setBackgroundColor('transparent');
            StatusBar.setTranslucent(true);
            
            // Auto-detect location for customers on first load
            if (type === 'customer' && !userCoords && !hasAttemptedAutoLoc) {
                setHasAttemptedAutoLoc(true);
                handleUseCurrentLocation();
            } else {
                fetchData();
            }
        }
    }, [isFocused, fetchData, type, userCoords, hasAttemptedAutoLoc]);

    const onRefresh = () => {
        setRefreshing(true);
        fetchData();
    };

    const filteredAndSortedProviders = useMemo(() => {
        let result = [...providers];
        if (userCoords) {
            // Filter by maxDistance
            result = result.filter(p => {
                if (!p.location?.coordinates) return false;
                const distance = parseFloat(calculateDistance(userCoords.lat, userCoords.lon, p.location.coordinates[1], p.location.coordinates[0]));
                return distance <= maxDistance;
            });

            // Sort by distance
            result.sort((a, b) => {
                const distA = calculateDistance(userCoords.lat, userCoords.lon, a.location?.coordinates[1] || 0, a.location?.coordinates[0] || 0);
                const distB = calculateDistance(userCoords.lat, userCoords.lon, b.location?.coordinates[1] || 0, b.location?.coordinates[0] || 0);
                return parseFloat(distA) - parseFloat(distB);
            });
        }
        return result;
    }, [providers, userCoords, maxDistance]);

    const renderDhobiDashboard = () => (
        <ScrollView
            contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }}
            showsVerticalScrollIndicator={false}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
            <View style={styles.headerSection}>
                <Text style={styles.title}>Vendor Dashboard</Text>
                <Text style={styles.subtitle}>Track your performance and manage services</Text>
            </View>

            <View style={styles.rowCardContainer}>
                <LinearGradient
                    colors={['#E0F2FE', '#DBEAFE']}
                    style={[styles.card, { borderLeftColor: '#3B82F6' }]}
                >
                    <View style={styles.cardContent}>
                        <View>
                            <Text style={styles.cardTitle}>TOTAL ORDERS</Text>
                            <Text style={styles.cardValue}>{analytics?.totalOrders || 0}</Text>
                        </View>
                        <SvgXml xml={SVG_ICON.Orders_Icon(COLORS.BLUE_600)} width={24} height={24} />
                    </View>
                </LinearGradient>

                <LinearGradient
                    colors={['#FEF3C7', '#FEF9C3']}
                    style={[styles.card, { borderLeftColor: '#F59E0B' }]}
                >
                    <View style={styles.cardContent}>
                        <View>
                            <Text style={styles.cardTitle}>RATING</Text>
                             <Text style={styles.cardValue}>{analytics?.rating || '0.0'}</Text>
                        </View>
                        <SvgXml xml={SVG_ICON.Star_Icon(COLORS.AMBER_600)} width={24} height={24} />
                    </View>
                </LinearGradient>
            </View>

            <View style={styles.rowCardContainer}>
                <LinearGradient
                    colors={['#DCFCE7', '#F0FDF4']}
                    style={[styles.card, { borderLeftColor: '#10B981' }]}
                >
                    <View style={styles.cardContent}>
                        <View>
                            <Text style={styles.cardTitle}>EARNINGS</Text>
                            <Text style={styles.cardValue}>₹{analytics?.totalEarnings || 0}</Text>
                        </View>
                        <SvgXml xml={SVG_ICON.Doller_Icon(COLORS.GREEN_600)} width={24} height={24} />
                    </View>
                </LinearGradient>

                <LinearGradient
                    colors={['#F3E8FF', '#FAE8FF']}
                    style={[styles.card, { borderLeftColor: '#9333EA' }]}
                >
                    <View style={styles.cardContent}>
                        <View>
                            <Text style={styles.cardTitle}>SERVICES</Text>
                            <Text style={styles.cardValue}>{services.length}</Text>
                        </View>
                        <SvgXml xml={SVG_ICON.Setting_Icon(COLORS.PURPLE_600)} width={24} height={24} />
                    </View>
                </LinearGradient>
            </View>

            <View style={styles.profileContainer}>
                <View style={styles.profileCard}>
                    <View style={styles.profileHeader}>
                        <Text style={styles.sectionTitle}>Business Profile</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Profile', { type: 'dhobi' })}>
                            <Text style={styles.editProfile}>View More</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.profileRow}>
                        <View style={[styles.avatar, { backgroundColor: COLORS.PURPLE_100 }]}>
                            <Text style={[styles.avatarText, { color: COLORS.PURPLE_700 }]}>
                                {(providerProfile?.name || user?.name)?.charAt(0).toUpperCase()}
                            </Text>
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.profileName}>{providerProfile?.name || user?.name}</Text>
                            <Text style={styles.owner}>{providerProfile?.serviceAreas || 'Business Owner'}</Text>
                        </View>
                    </View>
                    <View style={styles.iconRow}>
                        <SvgXml xml={SVG_ICON.Call_Icon(COLORS.GRAY_500)} width={16} height={16} style={styles.icon} />
                        <Text style={styles.contact}>{providerProfile?.mobile || user?.mobile}</Text>
                    </View>
                    <View style={styles.iconRow}>
                        <SvgXml xml={SVG_ICON.mail_Icon(COLORS.GRAY_500)} width={16} height={16} style={styles.icon} />
                        <Text style={styles.contact}>{providerProfile?.email || user?.email}</Text>
                    </View>
                </View>
            </View>

            <View style={[styles.servicesContainer, { paddingTop: 10 }]}>
                <View style={styles.servicesHeader}>
                    <Text style={styles.sectionTitle}>My Services</Text>
                    <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('Profile', { type: 'dhobi' })}>
                        <Text style={styles.addButtonText}>Manage</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.servicesGrid}>
                    {services.length > 0 ? services.map((service, index) => (
                        <View key={index} style={styles.serviceCard}>
                            <View style={styles.serviceHeader}>
                                <Text style={styles.serviceName}>{service.name}</Text>
                            </View>
                            <Text style={styles.servicePrice}>₹{service.price}</Text>
                        </View>
                    )) : (
                        <Text style={styles.emptyText}>No services added yet.</Text>
                    )}
                </View>
            </View>
        </ScrollView>
    );

    const renderCustomerDashboard = () => (
        <ScrollView
            contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }}
            showsVerticalScrollIndicator={false}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
            <View style={styles.headerSection}>
                <Text style={styles.title}>Hello, {user?.name?.split(' ')[0]}!</Text>
                <Text style={styles.subtitle}>Get your clothes cleaned professionally</Text>
            </View>

            {/* Filter Section */}
            <View style={styles.filterContainer}>
                <View style={[styles.filterRow, { alignItems: 'center' }]}>
                    <Text style={[styles.sectionTitle, { fontSize: 16 }]}>Filter Services</Text>
                    <View style={[styles.dropdownWrapper, { flex: 1, justifyContent: 'flex-end' }]}>
                        <Text style={[styles.label, { fontSize: 13 }]}>Search within:</Text>
                        <TouchableOpacity
                            style={[styles.picker, { minWidth: 90 }]}
                            onPress={() => setShowDistanceDropdown(!showDistanceDropdown)}
                        >
                            <Text style={styles.pickerText}>{maxDistance} km</Text>
                            <SvgXml
                                xml={SVG_ICON.arrow_Right(COLORS.GRAY_500)}
                                width={12}
                                height={12}
                                style={{ transform: [{ rotate: showDistanceDropdown ? '270deg' : '90deg' }] }}
                            />
                        </TouchableOpacity>

                        {showDistanceDropdown && (
                            <View style={styles.dropdownMenu}>
                                {distanceOptions.map((opt) => (
                                    <TouchableOpacity
                                        key={opt}
                                        style={styles.dropdownItem}
                                        onPress={() => {
                                            setMaxDistance(opt);
                                            setShowDistanceDropdown(false);
                                        }}
                                    >
                                        <Text style={[styles.dropdownItemText, maxDistance === opt && { color: COLORS.PURPLE_600, fontFamily: FONT_FAMILY_SEMIBOLD }]}>
                                            {opt} km
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}
                    </View>
                </View>

                <View style={[styles.actionRow, { marginTop: 5 }]}>
                    <TouchableOpacity style={styles.locationBtn} onPress={handleUseCurrentLocation} disabled={locLoading}>
                        {locLoading ? (
                            <ActivityIndicator size="small" color="#4B5563" />
                        ) : (
                            <SvgXml xml={SVG_ICON.Location_Icon('#4B5563')} width={16} height={16} />
                        )}
                        <Text style={styles.locationBtnText}>Detect Location</Text>
                    </TouchableOpacity>

                    <GradientButton
                        title="Find Dhobis"
                        onPress={fetchData}
                        icon={SVG_ICON.Search_Icon(COLORS.WHITE)}
                        containerStyle={{ flex: 1.2 }}
                    />
                </View>
            </View>

            {/* Location Badge */}
            {detectedAddress ? (
                <View style={styles.locationBadge}>
                    <Text style={styles.locationBadgeTitle}>Location detected successfully!</Text>
                    <Text style={styles.locationBadgeText} numberOfLines={2}>Location: {detectedAddress}</Text>
                </View>
            ) : null}


            <View style={styles.servicesContainer}>
                {!userCoords ? (
                    <View style={{ padding: 30, alignItems: 'center', backgroundColor: COLORS.WHITE, borderRadius: 20, marginTop: 10, borderWidth: 1, borderColor: '#E5E7EB', borderStyle: 'dashed' }}>
                        <View style={{ backgroundColor: '#F3E8FF', padding: 15, borderRadius: 50, marginBottom: 15 }}>
                            <SvgXml xml={SVG_ICON.Location_Icon('#9333EA')} width={40} height={40} />
                        </View>
                        <Text style={[styles.sectionTitle, { textAlign: 'center', marginBottom: 8 }]}>Find Dhobis Near You</Text>
                        <Text style={[styles.subtitle, { textAlign: 'center', marginBottom: 20, paddingHorizontal: 20 }]}>
                            Please detect your current location to see laundry partners available in your area.
                        </Text>
                        <GradientButton
                            title="Fetch Nearby Vendors"
                            onPress={handleUseCurrentLocation}
                            loading={locLoading}
                            icon={SVG_ICON.Location_Icon(COLORS.WHITE)}
                            containerStyle={{ width: '90%', marginTop: 10 }}
                        />
                    </View>
                ) : (
                    <>
                        <View style={styles.servicesHeader}>
                            <View>
                                <Text style={styles.sectionTitle}>
                                    Available Dhobis ({filteredAndSortedProviders.length})
                                </Text>
                                <Text style={styles.scrollMessage}>Sorted by proximity to your detected location</Text>
                            </View>
                            {filteredAndSortedProviders.length > 5 && (
                                <TouchableOpacity onPress={() => setShowAllProviders(!showAllProviders)}>
                                    <Text style={styles.editProfile}>{showAllProviders ? "See Less" : "See All"}</Text>
                                </TouchableOpacity>
                            )}
                        </View>

                        <View style={{ marginTop: 10 }}>
                            {filteredAndSortedProviders.length > 0 ? (
                                (showAllProviders ? filteredAndSortedProviders : filteredAndSortedProviders.slice(0, 5)).map((p) => {
                                    const distance = calculateDistance(userCoords.lat, userCoords.lon, p.location?.coordinates[1] || 0, p.location?.coordinates[0] || 0);

                                    return (
                                        <TouchableOpacity
                                            key={p._id}
                                            style={styles.nearCard}
                                            onPress={() => navigation.navigate('ProviderDetail', { providerId: p._id })}
                                        >
                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                <Text style={[styles.profileName, { fontSize: 17 }]}>{p.name}</Text>
                                                <View style={{ backgroundColor: '#F0FDF4', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#BBF7D0' }}>
                                                    <SvgXml xml={SVG_ICON.Check_Circle('#166534')} width={12} height={12} />
                                                    <Text style={{ fontSize: 11, color: '#166534', fontFamily: FONT_FAMILY_SEMIBOLD, marginLeft: 4 }}>Active</Text>
                                                </View>
                                            </View>

                                            <Text style={styles.ownerName}>Owner: {p.owner || p.name}</Text>

                                            <View style={styles.infoRow}>
                                                <SvgXml xml={SVG_ICON.Location_Icon('#6B7280')} width={14} height={14} />
                                                <Text style={styles.infoText} numberOfLines={2}>{p.serviceAreas || p.address}</Text>
                                                <Text style={styles.distanceText}>({distance} km away)</Text>
                                            </View>

                                            <View style={styles.infoRow}>
                                                <SvgXml xml={SVG_ICON.Call_Icon('#6B7280')} width={14} height={14} />
                                                <Text style={styles.infoText}>{p.mobile}</Text>
                                            </View>

                                            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                                                <SvgXml xml={SVG_ICON.Star_Icon('#F59E0B')} width={16} height={16} />
                                                <Text style={[styles.statText, { color: COLORS.BLACK, fontFamily: FONT_FAMILY_SEMIBOLD, marginLeft: 4 }]}>{p.rating || '0'}</Text>
                                                <Text style={styles.statText}>{p.ordersCompleted || '0'} orders completed</Text>
                                            </View>

                                            {p.services && p.services.length > 0 && (
                                                <View style={{ marginTop: 12 }}>
                                                    <Text style={{ fontSize: 13, fontFamily: FONT_FAMILY_SEMIBOLD, color: COLORS.BLACK, marginBottom: 6 }}>Services:</Text>
                                                    <View style={styles.serviceTagContainer}>
                                                        {p.services.slice(0, 3).map((s, idx) => (
                                                            <View key={idx} style={styles.serviceTag}>
                                                                 <Text style={styles.serviceTagText}>{s.name} - ₹{s.price}</Text>
                                                            </View>
                                                        ))}
                                                        {p.services.length > 3 && (
                                                            <Text style={[styles.serviceTagText, { alignSelf: 'center', marginBottom: 6 }]}>+{p.services.length - 3} more</Text>
                                                        )}
                                                    </View>
                                                </View>
                                            )}

                                            <GradientButton
                                                title="Book Service"
                                                onPress={() => navigation.navigate('ProviderDetail', { providerId: p._id })}
                                                containerStyle={{ marginTop: 15 }}
                                                gradientColors={['#8B5CF6', '#EC4899']}
                                            />
                                        </TouchableOpacity>
                                    );
                                })
                            ) : (
                                <View style={{ padding: 40, alignItems: 'center', backgroundColor: COLORS.WHITE, borderRadius: 15 }}>
                                    <Text style={[styles.emptyText, { textAlign: 'center' }]}>No laundry partners found within {maxDistance}km of your location.</Text>
                                    <TouchableOpacity style={{ marginTop: 15 }} onPress={() => setMaxDistance(25)}>
                                        <Text style={{ color: COLORS.PURPLE_600, fontFamily: FONT_FAMILY_SEMIBOLD }}>Try increasing search radius</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>
                    </>
                )}
            </View>
        </ScrollView>
    );

    if (isLoading && !refreshing) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.PURPLE_600} />
            </View>
        );
    }

    return (
        <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
            <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
            {type === 'dhobi' ? renderDhobiDashboard() : renderCustomerDashboard()}
        </SafeAreaView>
    );
};

export default DashBoardScreen;