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
import { SF, SH, SW } from '../../../utils/Dimensions';
import { providerService } from '../../../services/providerService';
import { SvgXml } from 'react-native-svg';
import { SVG_ICON } from '../../../assets/Svg/svgIcon';
import Header from '../../../components/Header';
import LinearGradient from 'react-native-linear-gradient';
import { Provider, Service } from '../../../types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type ProviderDetailRouteProp = RouteProp<RootStackParamList, 'ProviderDetail'>;

const ProviderDetailScreen = () => {
    const route = useRoute<ProviderDetailRouteProp>();
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const { providerId } = route.params;
    const insets = useSafeAreaInsets();

    const [isLoading, setIsLoading] = useState(true);
    const [provider, setProvider] = useState<Provider | null>(null);
    const [cart, setCart] = useState<(Service & { quantity: number })[]>([]);

    const fetchProviderDetails = useCallback(async () => {
        try {
            setIsLoading(true);
            const response = await providerService.getProfile(providerId);
            setProvider(response.provider);
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
            const existingIndex = prevCart.findIndex(item => item._id === service._id);
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
                return [...prevCart, { ...service, quantity: 1 }];
            }
            return prevCart;
        });
    };

    const getItemQty = (serviceId: string) => {
        const item = cart.find(i => i._id === serviceId);
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

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: SH(100) }}>
                {/* Provider Header Card */}
                <View style={styles.providerInfoCard}>
                    <LinearGradient 
                        colors={['#8B5CF6', '#EC4899']} 
                        style={styles.headerGradient}
                        start={{x:0, y:0}} end={{x:1, y:1}}
                    >
                        <View style={styles.avatar}>
                            <Text style={styles.avatarText}>{provider?.name?.charAt(0).toUpperCase()}</Text>
                        </View>
                        <View style={styles.headerTextWrapper}>
                            <Text style={styles.providerName}>{provider?.name}</Text>
                            <View style={styles.ratingRow}>
                                <SvgXml xml={SVG_ICON.Star_Icon(COLORS.WHITE)} width={SW(14)} height={SH(14)} />
                                <Text style={styles.ratingText}>{provider?.rating || '4.5'} (20+ reviews)</Text>
                            </View>
                        </View>
                    </LinearGradient>
                    <View style={styles.detailsSection}>
                        <View style={styles.detailItem}>
                            <SvgXml xml={SVG_ICON.Location_Icon(COLORS.GRAY_500)} width={SW(16)} height={SH(16)} />
                            <Text style={styles.detailText}>{provider?.serviceAreas}</Text>
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
                <View style={[styles.bottomBar, { bottom: insets.bottom + SH(10) }]}>
                    <LinearGradient 
                        colors={['#4F46E5', '#7C3AED']} 
                        style={styles.cartGradient}
                        start={{x:0, y:0}} end={{x:1, y:0}}
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
                            <SvgXml xml={SVG_ICON.arrow_Right(COLORS.WHITE)} width={SW(16)} height={SH(16)} />
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
        marginTop: SH(10),
        fontFamily: FONT_FAMILY_MEDIUM,
        color: COLORS.GRAY_500,
    },
    providerInfoCard: {
        margin: SW(16),
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
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: SW(60),
        height: SH(60),
        borderRadius: 30,
        backgroundColor: COLORS.WHITE,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: SW(16),
    },
    avatarText: {
        fontSize: SF(24),
        fontFamily: FONT_FAMILY_EXTRABOLD,
        color: COLORS.PURPLE_600,
    },
    headerTextWrapper: {
        flex: 1,
    },
    providerName: {
        fontSize: SF(20),
        fontFamily: FONT_FAMILY_EXTRABOLD,
        color: COLORS.WHITE,
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: SH(4),
    },
    ratingText: {
        marginLeft: SW(4),
        fontSize: SF(12),
        color: COLORS.WHITE,
        fontFamily: FONT_FAMILY_MEDIUM,
    },
    detailsSection: {
        padding: 15,
        backgroundColor: COLORS.WHITE,
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    detailText: {
        marginLeft: SW(8),
        fontSize: SF(13),
        color: COLORS.GRAY_600,
        fontFamily: FONT_FAMILY_MEDIUM,
    },
    serviceSection: {
        paddingHorizontal: SW(16),
        marginTop: SH(10),
    },
    sectionTitle: {
        fontSize: SF(18),
        fontFamily: FONT_FAMILY_EXTRABOLD,
        color: COLORS.BLACK,
        marginBottom: SH(15),
    },
    serviceItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: SH(15),
        borderBottomWidth: 1,
        borderBottomColor: COLORS.GRAY_100,
    },
    serviceInfo: {
        flex: 1,
    },
    serviceName: {
        fontSize: SF(15),
        fontFamily: FONT_FAMILY_SEMIBOLD,
        color: COLORS.BLACK,
    },
    servicePrice: {
        fontSize: SF(13),
        color: COLORS.PURPLE_600,
        fontFamily: FONT_FAMILY_EXTRABOLD,
        marginTop: SH(2),
    },
    qtyContainer: {
        width: SW(100),
        alignItems: 'flex-end',
    },
    addBtn: {
        borderWidth: 1,
        borderColor: COLORS.PURPLE_600,
        paddingHorizontal: SW(15),
        paddingVertical: SH(6),
        borderRadius: 8,
    },
    addBtnText: {
        color: COLORS.PURPLE_600,
        fontFamily: FONT_FAMILY_EXTRABOLD,
        fontSize: SF(12),
    },
    qtyRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.PURPLE_50,
        borderRadius: 8,
        paddingHorizontal: SW(5),
    },
    qtyBtn: {
        padding: SW(8),
    },
    qtyBtnText: {
        fontSize: SF(18),
        color: COLORS.PURPLE_600,
        fontFamily: FONT_FAMILY_EXTRABOLD,
    },
    qtyValue: {
        paddingHorizontal: SW(10),
        fontSize: SF(14),
        fontFamily: FONT_FAMILY_EXTRABOLD,
        color: COLORS.BLACK,
    },
    emptyText: {
        textAlign: 'center',
        marginTop: SH(40),
        color: COLORS.GRAY_400,
        fontFamily: FONT_FAMILY_MEDIUM,
    },
    bottomBar: {
        position: 'absolute',
        left: SW(16),
        right: SW(16),
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
        fontSize: SF(12),
        fontFamily: FONT_FAMILY_MEDIUM,
        opacity: 0.9,
    },
    cartTotal: {
        color: COLORS.WHITE,
        fontSize: SF(18),
        fontFamily: FONT_FAMILY_EXTRABOLD,
    },
    checkoutBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: SW(15),
        paddingVertical: SH(8),
        borderRadius: 10,
    },
    checkoutBtnText: {
        color: COLORS.WHITE,
        fontFamily: FONT_FAMILY_EXTRABOLD,
        fontSize: SF(14),
        marginRight: SW(5),
    },
});

export default ProviderDetailScreen;
