import React, { useEffect, useState, useCallback } from "react";
import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    Text,
    TouchableOpacity,
    View,
    RefreshControl,
    ActivityIndicator
} from "react-native";
import styles from "./style";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SH, SW, SF } from "../../../utils/Dimensions";
import COLORS from "../../../utils/constant";
import { useIsFocused } from "@react-navigation/native";
import { DashBoardScreenProps } from "../../../navigations/types";
import { SvgXml } from "react-native-svg";
import { SVG_ICON } from "../../../assets/Svg/svgIcon";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { providerService } from "../../../services/providerService";
import { userService } from "../../../services/userService";
import LinearGradient from "react-native-linear-gradient";
import { Provider, Analytics, Service } from "../../../types";

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

    const fetchData = useCallback(async () => {
        try {
            setIsLoading(true);
            if (type === 'dhobi') {
                const providerId = user?.mainUserId || user?._id || '';
                const [analyticsData, profileData] = await Promise.all([
                    providerService.getAnalytics(),
                    providerService.getProfile(providerId)
                ]);
                setAnalytics(analyticsData);
                setProviderProfile(profileData.provider);
                setServices(profileData.provider?.services || []);
            } else {
                const [profile, allProviders] = await Promise.all([
                    userService.getProfile(),
                    providerService.getAll()
                ]);
                setProviders(allProviders.providers || []);
                console.log("profile", profile);
            }
        } catch (error) {
            console.error("Dashboard fetch error:", error);
        } finally {
            setIsLoading(false);
            setRefreshing(false);
        }
    }, [type, user?._id, user?.mainUserId]);

    useEffect(() => {
        if (isFocused) {
            StatusBar.setBarStyle('dark-content');
            StatusBar.setBackgroundColor('transparent');
            StatusBar.setTranslucent(true);
            fetchData();
        }
    }, [isFocused, fetchData]);

    const onRefresh = () => {
        setRefreshing(true);
        fetchData();
    };

    const renderDhobiDashboard = () => (
        <ScrollView
            contentContainerStyle={{ flexGrow: 1, paddingBottom: SH(100) }}
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
                        <SvgXml xml={SVG_ICON.Orders_Icon(COLORS.BLUE_600)} width={SW(24)} height={SH(24)} />
                    </View>
                </LinearGradient>

                <LinearGradient
                    colors={['#DCFCE7', '#D1FAE5']}
                    style={[styles.card, { borderLeftColor: '#10B981' }]}
                >
                    <View style={styles.cardContent}>
                        <View>
                            <Text style={styles.cardTitle}>EARNINGS</Text>
                            <Text style={styles.cardValue}>₹{analytics?.earnings || 0}</Text>
                        </View>
                        <SvgXml xml={SVG_ICON.Check_Circle(COLORS.GREEN_600)} width={SW(24)} height={SH(24)} />
                    </View>
                </LinearGradient>
            </View>

            <View style={styles.rowCardContainer}>
                <LinearGradient
                    colors={['#FEF3C7', '#FFEDD5']}
                    style={[styles.card, { borderLeftColor: '#F59E0B' }]}
                >
                    <View style={styles.cardContent}>
                        <View>
                            <Text style={styles.cardTitle}>COMPLETED</Text>
                            <Text style={styles.cardValue}>{analytics?.completedOrders || 0}</Text>
                        </View>
                        <SvgXml xml={SVG_ICON.Star_Icon(COLORS.AMBER_600)} width={SW(24)} height={SH(24)} />
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
                        <SvgXml xml={SVG_ICON.Setting_Icon(COLORS.PURPLE_600)} width={SW(24)} height={SH(24)} />
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
                        <SvgXml xml={SVG_ICON.Call_Icon(COLORS.GRAY_500)} width={SW(16)} height={SH(16)} style={styles.icon} />
                        <Text style={styles.contact}>{providerProfile?.mobile || user?.mobile}</Text>
                    </View>
                    <View style={styles.iconRow}>
                        <SvgXml xml={SVG_ICON.mail_Icon(COLORS.GRAY_500)} width={SW(16)} height={SH(16)} style={styles.icon} />
                        <Text style={styles.contact}>{providerProfile?.email || user?.email}</Text>
                    </View>
                </View>
            </View>

            <View style={styles.servicesContainer}>
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
            contentContainerStyle={{ flexGrow: 1, paddingBottom: SH(100) }}
            showsVerticalScrollIndicator={false}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
            <View style={styles.headerSection}>
                <Text style={styles.title}>Hello, {user?.name?.split(' ')[0]}!</Text>
                <Text style={styles.subtitle}>Get your clothes cleaned professionally</Text>
            </View>

            <View style={styles.categorySection}>
                <Text style={styles.sectionTitle}>Quick Services</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: SH(10) }}>
                    {['Wash & Fold', 'Dry Clean', 'Ironing', 'Express'].map((cat, i) => (
                        <TouchableOpacity key={i} style={styles.catCard}>
                            <LinearGradient colors={['#F6F0FC', '#FFFFFF']} style={styles.catGradient}>
                                <SvgXml xml={SVG_ICON.Check_Circle(COLORS.PURPLE_600)} width={SW(24)} height={SH(24)} />
                                <Text style={styles.catText}>{cat}</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            <View style={[styles.profileContainer, { marginTop: SH(20) }]}>
                <View style={styles.promoCard}>
                    <LinearGradient colors={[COLORS.PURPLE_600, COLORS.PINK_600]} style={styles.promoGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
                        <View>
                            <Text style={styles.promoTitle}>20% OFF</Text>
                            <Text style={styles.promoSubtitle}>On your first order</Text>
                            <TouchableOpacity style={styles.promoButton}>
                                <Text style={styles.promoButtonText}>Redeem</Text>
                            </TouchableOpacity>
                        </View>
                        <SvgXml xml={SVG_ICON.Star_Icon(COLORS.WHITE)} width={SW(60)} height={SH(60)} opacity={0.3} />
                    </LinearGradient>
                </View>
            </View>

            <View style={styles.servicesContainer}>
                <View style={styles.servicesHeader}>
                    <Text style={styles.sectionTitle}>Laundry Partners Near You</Text>
                    <TouchableOpacity><Text style={styles.editProfile}>See All</Text></TouchableOpacity>
                </View>
                <View style={{ marginTop: SH(10) }}>
                    {providers.length > 0 ? (
                        providers.map((p) => (
                            <TouchableOpacity
                                key={p._id}
                                style={styles.nearCard}
                                onPress={() => navigation.navigate('ProviderDetail', { providerId: p._id })}
                            >
                                <View style={styles.profileRow}>
                                    <LinearGradient
                                        colors={[COLORS.PURPLE_100, COLORS.WHITE]}
                                        style={[styles.avatar, { borderRadius: 12 }]}
                                    >
                                        <Text style={[styles.avatarText, { color: COLORS.PURPLE_600, fontSize: SF(18) }]}>
                                            {p.name?.charAt(0).toUpperCase()}
                                        </Text>
                                    </LinearGradient>
                                    <View style={{ flex: 1, marginLeft: SW(12) }}>
                                        <Text style={styles.profileName}>{p.name}</Text>
                                        <Text style={styles.owner}>{p.serviceAreas || 'Local Service'}</Text>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: SH(4) }}>
                                            <SvgXml xml={SVG_ICON.Star_Icon(COLORS.AMBER_600)} width={SW(12)} height={SH(12)} />
                                            <Text style={[styles.owner, { marginLeft: 4, color: COLORS.BLACK }]}>4.5 (20+)</Text>
                                        </View>
                                    </View>
                                    <View style={[styles.addButton, { backgroundColor: COLORS.PURPLE_600, paddingVertical: SH(6) }]}>
                                        <Text style={[styles.addButtonText, { fontSize: SF(11) }]}>SELECT</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        ))
                    ) : (
                        <View style={{ padding: 20, alignItems: 'center' }}>
                            <Text style={styles.emptyText}>No laundry partners found in your area yet.</Text>
                        </View>
                    )}
                </View>
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