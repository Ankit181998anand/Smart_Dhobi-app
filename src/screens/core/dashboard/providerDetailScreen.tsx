import React, { useEffect, useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
    ActivityIndicator,
    Alert,
    StatusBar,
} from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../../navigations/types';
import COLORS, { FONT_FAMILY_EXTRABOLD, FONT_FAMILY_MEDIUM, FONT_FAMILY_SEMIBOLD } from '../../../utils/constant';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { providerService } from '../../../services/providerService';
import { SvgXml } from 'react-native-svg';
import { SVG_ICON } from '../../../assets/Svg/svgIcon';
import Header from '../../../components/Header';
import LinearGradient from 'react-native-linear-gradient';
import { Provider, Service, OrderItem } from '../../../types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type ProviderDetailRouteProp = RouteProp<RootStackParamList, 'ProviderDetail'>;

const ProviderDetailScreen = () => {
    const route = useRoute<ProviderDetailRouteProp>();
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const { providerId } = route.params;
    const insets = useSafeAreaInsets();

    const [isLoading, setIsLoading] = useState(true);
    const [provider, setProvider] = useState<Provider | null>(null);
    const [cart, setCart] = useState<OrderItem[]>([]);

    const fetchProviderDetails = useCallback(async () => {
        try {
            setIsLoading(true);
            const response = await providerService.getProfile(providerId);
            const providerData = (response.data || response.provider || response) as any;
            setProvider(providerData);
        } catch (error) {
            console.error("Fetch provider details error:", error);
            Alert.alert("Error", "Failed to load provider details");
        } finally {
            setIsLoading(false);
        }
    }, [providerId]);

    useEffect(() => {
        fetchProviderDetails();
    }, [fetchProviderDetails]);

    const updateCart = (service: Service, delta: number) => {
        setCart(prevCart => {
            const existingIndex = prevCart.findIndex(item => item.serviceId === service._id);
            if (existingIndex > -1) {
                const newCart = [...prevCart];
                const newQty = (newCart[existingIndex].quantity || 1) + delta;
                if (newQty <= 0) {
                    newCart.splice(existingIndex, 1);
                } else {
                    newCart[existingIndex] = { ...newCart[existingIndex], quantity: newQty };
                }
                return newCart;
            } else if (delta > 0) {
                return [...prevCart, {
                    serviceId: service._id,
                    name: service.name,
                    price: service.price,
                    quantity: 1
                }];
            }
            return prevCart;
        });
    };

    const getItemQty = (serviceId: string) => {
        const item = cart.find(i => i.serviceId === serviceId);
        return item ? item.quantity : 0;
    };

    const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.PURPLE_600} />
                <Text style={styles.loadingText}>Loading services...</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
            <StatusBar barStyle="dark-content" />
            <Header
                title={provider?.name || 'Laundry Partner'}
                isLeftIcon
                leftIconSource={SVG_ICON.arrow_back(COLORS.BLACK)}
                onLeftPress={() => navigation.goBack()}
            />

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
                {/* Provider Header Card */}
                <View style={styles.providerInfoCard}>
                    <LinearGradient
                        colors={['#8B5CF6', '#EC4899']}
                        style={styles.headerGradient}
                        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                    >
                        <View style={styles.headerTop}>
                            <View style={styles.avatar}>
                                <Text style={styles.avatarText}>{provider?.name?.charAt(0).toUpperCase()}</Text>
                            </View>
                            <View style={styles.headerTextWrapper}>
                                <Text style={styles.providerName}>{provider?.name}</Text>
                                <View style={styles.ratingRow}>
                                    <SvgXml xml={SVG_ICON.Star_Icon(COLORS.WHITE)} width={14} height={14} />
                                    <Text style={styles.ratingText}>{provider?.rating || '0'} ({provider?.totalReviews || '0'} reviews)</Text>
                                </View>
                            </View>
                        </View>
                    </LinearGradient>

                    <View style={styles.detailsSection}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitleSmall}>Business Details</Text>
                            <View style={styles.verifiedBadge}>
                                <SvgXml xml={SVG_ICON.Check_Circle('#059669')} width={10} height={10} />
                                <Text style={styles.verifiedText}>Verified</Text>
                            </View>
                        </View>

                        <View>
                            <View style={styles.compactInfoRow}>
                                <View style={styles.compactIconContainer}>
                                    <SvgXml xml={SVG_ICON.Location_Icon('#8B5CF6')} width={16} height={16} />
                                </View>
                                <Text style={styles.infoValueCompact} numberOfLines={2}>{provider?.serviceAreas || provider?.address}</Text>
                            </View>

                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                                <View style={[styles.compactInfoRow, { flex: 1, marginRight: 10 }]}>
                                    <View style={styles.compactIconContainer}>
                                        <SvgXml xml={SVG_ICON.Experts('#8B5CF6')} width={16} height={16} />
                                    </View>
                                    <Text style={styles.infoValueCompact} numberOfLines={1}>{provider?.owner || 'Partner'}</Text>
                                </View>
                                <View style={[styles.compactInfoRow, { flex: 1 }]}>
                                    <View style={styles.compactIconContainer}>
                                        <SvgXml xml={SVG_ICON.Call_Icon('#8B5CF6')} width={16} height={16} />
                                    </View>
                                    <Text style={styles.infoValueCompact} numberOfLines={1}>{provider?.mobile}</Text>
                                </View>
                            </View>

                            {provider?.email && (
                                <View style={[styles.compactInfoRow, { marginTop: 10 }]}>
                                    <View style={styles.compactIconContainer}>
                                        <SvgXml xml={SVG_ICON.mail_Icon('#8B5CF6')} width={16} height={16} />
                                    </View>
                                    <Text style={styles.infoValueCompact} numberOfLines={1}>{provider?.email}</Text>
                                </View>
                            )}
                        </View>
                    </View>
                </View>

                {/* Service List */}
                <View style={styles.serviceSection}>
                    <Text style={styles.sectionTitle}>Available Services</Text>
                    {provider?.services && provider.services.length > 0 ? (
                        provider.services.map((service) => (
                            <View key={service._id} style={styles.serviceItem}>
                                <View style={styles.serviceInfo}>
                                    <Text style={styles.serviceName}>{service.name}</Text>
                                    <Text style={styles.servicePrice}>₹{service.price} / item</Text>
                                </View>
                                <View style={styles.qtyContainer}>
                                    {getItemQty(service._id) > 0 ? (
                                        <View style={styles.qtyRow}>
                                            <TouchableOpacity
                                                style={styles.qtyBtn}
                                                onPress={() => updateCart(service, -1)}
                                            >
                                                <Text style={styles.qtyBtnText}>-</Text>
                                            </TouchableOpacity>
                                            <Text style={styles.qtyValue}>{getItemQty(service._id)}</Text>
                                            <TouchableOpacity
                                                style={styles.qtyBtn}
                                                onPress={() => updateCart(service, 1)}
                                            >
                                                <Text style={styles.qtyBtnText}>+</Text>
                                            </TouchableOpacity>
                                        </View>
                                    ) : (
                                        <TouchableOpacity
                                            style={styles.addBtn}
                                            onPress={() => updateCart(service, 1)}
                                        >
                                            <Text style={styles.addBtnText}>ADD</Text>
                                        </TouchableOpacity>
                                    )}
                                </View>
                            </View>
                        ))
                    ) : (
                        <Text style={styles.emptyText}>No services listed by this partner yet.</Text>
                    )}
                </View>
            </ScrollView>

            {/* Bottom Cart Bar */}
            {cart.length > 0 && (
                <View style={[styles.bottomBar, { bottom: insets.bottom + 10 }]}>
                    <LinearGradient
                        colors={['#4F46E5', '#7C3AED']}
                        style={styles.cartGradient}
                        start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                    >
                        <View>
                            <Text style={styles.cartQty}>{cart.length} item(s) selected</Text>
                            <Text style={styles.cartTotal}>₹{totalAmount}</Text>
                        </View>
                        <TouchableOpacity
                            style={styles.checkoutBtn}
                            onPress={() => navigation.navigate('Checkout', { providerId, items: cart })}
                        >
                            <Text style={styles.checkoutBtnText}>Checkout</Text>
                            <SvgXml xml={SVG_ICON.arrow_Right(COLORS.WHITE)} width={16} height={16} />
                        </TouchableOpacity>
                    </LinearGradient>
                </View>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.WHITE,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.WHITE,
    },
    loadingText: {
        marginTop: 10,
        fontFamily: FONT_FAMILY_MEDIUM,
        color: COLORS.GRAY_500,
    },
    providerInfoCard: {
        margin: 16,
        backgroundColor: COLORS.WHITE,
        borderRadius: 20,
        overflow: 'hidden',
        elevation: 5,
        shadowColor: COLORS.BLACK,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
    },
    headerGradient: {
        padding: 20,
        paddingVertical: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerTop: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
    },
    avatar: {
        width: 30,
        height: 30,
        borderRadius: 30,
        backgroundColor: COLORS.WHITE,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    avatarText: {
        fontSize: 15,
        fontFamily: FONT_FAMILY_EXTRABOLD,
        color: COLORS.PURPLE_600,
    },
    headerTextWrapper: {
        flex: 1,
    },
    providerName: {
        fontSize: 15,
        fontFamily: FONT_FAMILY_EXTRABOLD,
        color: COLORS.WHITE,
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    ratingText: {
        marginLeft: 4,
        fontSize: 12,
        color: COLORS.WHITE,
        fontFamily: FONT_FAMILY_MEDIUM,
    },
    detailsSection: {
        padding: 15,
        backgroundColor: COLORS.WHITE,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    sectionTitleSmall: {
        fontSize: 16,
        fontFamily: FONT_FAMILY_EXTRABOLD,
        color: COLORS.BLACK,
    },
    verifiedBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#D1FAE5',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 20,
    },
    verifiedText: {
        fontSize: 11,
        color: '#059669',
        fontFamily: FONT_FAMILY_SEMIBOLD,
        marginLeft: 4,
    },
    compactInfoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
        paddingVertical: 8,
        paddingHorizontal: 10,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#F3F4F6',
    },
    compactIconContainer: {
        width: 28,
        height: 28,
        borderRadius: 8,
        backgroundColor: '#EDE9FE',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
    },
    infoValueCompact: {
        fontSize: 12,
        color: COLORS.BLACK,
        fontFamily: FONT_FAMILY_SEMIBOLD,
        flex: 1,
    },
    serviceSection: {
        paddingHorizontal: 16,
        marginTop: 10,
    },
    sectionTitle: {
        fontSize: 18,
        fontFamily: FONT_FAMILY_EXTRABOLD,
        color: COLORS.BLACK,
        marginBottom: 15,
    },
    serviceItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.GRAY_100,
    },
    serviceInfo: {
        flex: 1,
    },
    serviceName: {
        fontSize: 15,
        fontFamily: FONT_FAMILY_SEMIBOLD,
        color: COLORS.BLACK,
    },
    servicePrice: {
        fontSize: 13,
        color: COLORS.PURPLE_600,
        fontFamily: FONT_FAMILY_EXTRABOLD,
        marginTop: 2,
    },
    qtyContainer: {
        width: 100,
        alignItems: 'flex-end',
    },
    addBtn: {
        borderWidth: 1,
        borderColor: COLORS.PURPLE_600,
        paddingHorizontal: 15,
        paddingVertical: 6,
        borderRadius: 8,
    },
    addBtnText: {
        color: COLORS.PURPLE_600,
        fontFamily: FONT_FAMILY_EXTRABOLD,
        fontSize: 12,
    },
    qtyRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.PURPLE_50,
        borderRadius: 8,
        paddingHorizontal: 5,
    },
    qtyBtn: {
        padding: 8,
    },
    qtyBtnText: {
        fontSize: 18,
        color: COLORS.PURPLE_600,
        fontFamily: FONT_FAMILY_EXTRABOLD,
    },
    qtyValue: {
        paddingHorizontal: 10,
        fontSize: 14,
        fontFamily: FONT_FAMILY_EXTRABOLD,
        color: COLORS.BLACK,
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 40,
        color: COLORS.GRAY_400,
        fontFamily: FONT_FAMILY_MEDIUM,
    },
    bottomBar: {
        position: 'absolute',
        left: 16,
        right: 16,
        zIndex: 100,
    },
    cartGradient: {
        padding: 15,
        borderRadius: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        elevation: 10,
        shadowColor: COLORS.BLACK,
        shadowOffset: { width: 0, height: -5 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
    },
    cartQty: {
        color: COLORS.WHITE,
        fontSize: 12,
        fontFamily: FONT_FAMILY_MEDIUM,
        opacity: 0.9,
    },
    cartTotal: {
        color: COLORS.WHITE,
        fontSize: 18,
        fontFamily: FONT_FAMILY_EXTRABOLD
    },
    checkoutBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 10,
    },
    checkoutBtnText: {
        color: COLORS.WHITE,
        fontFamily: FONT_FAMILY_EXTRABOLD,
        fontSize: 14,
        marginRight: 5,
    },
});

export default ProviderDetailScreen;
