import React, { useCallback, useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
    ActivityIndicator,
    StatusBar,
    Alert
} from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../navigations/types';
import COLORS, { FONT_FAMILY_EXTRABOLD, FONT_FAMILY_MEDIUM, FONT_FAMILY_SEMIBOLD } from '../../../utils/constant';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { orderService } from '../../../services/orderService';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { SvgXml } from 'react-native-svg';
import { SVG_ICON } from '../../../assets/Svg/svgIcon';
import Header from '../../../components/Header';
import { Order } from '../../../types';
import { showMessage } from 'react-native-flash-message';
import LinearGradient from 'react-native-linear-gradient';
import moment from 'moment';

type OrderDetailsRouteProp = RouteProp<RootStackParamList, 'OrderDetails'>;

const OrderDetailsScreen = () => {
    const route = useRoute<OrderDetailsRouteProp>();
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const { orderId } = route.params;
    const insets = useSafeAreaInsets();
    const { user } = useSelector((state: RootState) => state.auth);

    const [isLoading, setIsLoading] = useState(true);
    const [order, setOrder] = useState<Order | null>(null);
    const [updatingStatus, setUpdatingStatus] = useState(false);

    const fetchOrderDetails = useCallback(async () => {
        try {
            setIsLoading(true);
            const response = await orderService.getDetails(orderId);
            setOrder(response.data);
        } catch (error) {
            console.error("Fetch order details error:", error);
            showMessage({
                message: "Error",
                description: "Failed to load order details",
                type: "danger",
            });
        } finally {
            setIsLoading(false);
        }
    }, [orderId]);

    useEffect(() => {
        fetchOrderDetails();
    }, [fetchOrderDetails]);

    const handleUpdateStatus = async (newStatus: string) => {
        if (newStatus === 'cancelled') {
            Alert.alert(
                "Cancel Order",
                "Are you sure you want to cancel this order?",
                [
                    { text: "No", style: "cancel" },
                    {
                        text: "Yes, Cancel",
                        style: "destructive",
                        onPress: async () => {
                            try {
                                setUpdatingStatus(true);
                                await orderService.updateStatus(orderId, newStatus);
                                await fetchOrderDetails();
                                showMessage({
                                    message: "Cancelled",
                                    description: "Order has been cancelled",
                                    type: "warning",
                                });
                            } catch (error) {
                                showMessage({
                                    message: "Error",
                                    description: "Failed to cancel order",
                                    type: "danger",
                                });
                            } finally {
                                setUpdatingStatus(false);
                            }
                        }
                    }
                ]
            );
            return;
        }

        try {
            setUpdatingStatus(true);
            await orderService.updateStatus(orderId, newStatus);
            await fetchOrderDetails();
            showMessage({
                message: "Success",
                description: `Order status updated to ${newStatus}`,
                type: "success",
            });
        } catch (error) {
            showMessage({
                message: "Error",
                description: "Failed to update status",
                type: "danger",
            });
        } finally {
            setUpdatingStatus(false);
        }
    };

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.PRIMARY} />
                <Text style={styles.loadingText}>Loading details...</Text>
            </View>
        );
    }

    if (!order) {
        return (
            <View style={styles.loadingContainer}>
                <Text>Order not found</Text>
            </View>
        );
    }

    const isDhobi = user?.role === 'dhobi';

    const statusColors: any = {
        'pending': COLORS.AMBER_500,
        'accepted': COLORS.BLUE_500,
        'in_progress': COLORS.PURPLE_500,
        'ready': COLORS.PURPLE_600,
        'delivered': COLORS.GREEN_500,
        'cancelled': COLORS.RED,
    };

    return (
        <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
            <StatusBar barStyle="dark-content" />
            <Header
                title={`Order Details`}
                subtitle={`#${order._id?.slice(-8).toUpperCase()}`}
                isLeftIcon
                leftIconSource={SVG_ICON.arrow_back(COLORS.BLACK)}
                onLeftPress={() => navigation.goBack()}
            />

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}
            >
                {/* Header Background Gradient */}
                <LinearGradient
                    colors={[COLORS.PURPLE_700, COLORS.PURPLE_300]}
                    style={styles.premiumHeader}
                >
                    <View style={styles.headerContent}>
                        <View style={[styles.statusBadgeUltra, { backgroundColor: statusColors[order.status] || COLORS.GRAY_400 }]}>
                            <Text style={styles.statusTextUltra}>{order.status?.toUpperCase()}</Text>
                        </View>
                        <Text style={styles.orderIdHeader}>{order.orderId}</Text>
                        <View style={styles.orderMetaRow}>
                            <SvgXml xml={SVG_ICON.clock_Icon(COLORS.PURPLE_100)} width={14} height={14} />
                            <Text style={styles.orderMetaText}>
                                {moment(order.createdAt).format('DD MMM YYYY, hh:mm A')}
                            </Text>
                        </View>
                    </View>
                </LinearGradient>

                <View style={styles.contentOverlay}>
                    {/* Customer Card */}
                    <View style={styles.premiumCard}>
                        <View style={styles.cardHeaderRow}>
                            <Text style={styles.cardTitlePremium}>{isDhobi ? 'Customer Info' : 'Partner Info'}</Text>
                            <TouchableOpacity style={styles.iconCircle}>
                                <SvgXml xml={SVG_ICON.Call_Icon(COLORS.PURPLE_600)} width={16} height={16} />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.userSection}>
                            <LinearGradient
                                colors={[COLORS.PURPLE_100, COLORS.PURPLE_50]}
                                style={styles.avatarLarge}
                            >
                                <Text style={styles.avatarTextLarge}>
                                    {(isDhobi ? (order.userId as any)?.name : (order.providerId as any)?.name || 'V')?.charAt(0)}
                                </Text>
                            </LinearGradient>
                            <View style={styles.userDetails}>
                                <Text style={styles.nameHeader}>{isDhobi ? (order.userId as any)?.name : (order.providerId as any)?.name || 'Smart Dhobi Partner'}</Text>
                                <Text style={styles.phoneHeader}>{isDhobi ? (order.userId as any)?.mobile : (order.providerId as any)?.mobile || 'Service Partner'}</Text>
                            </View>
                        </View>
                    </View>

                    {/* Order Items Card */}
                    <View style={styles.premiumCard}>
                        <View style={styles.cardHeaderRow}>
                            <Text style={styles.cardTitlePremium}>Items Ordered</Text>
                            <View style={styles.itemCountBadge}>
                                <Text style={styles.itemCountText}>{order.services?.length || 0} Items</Text>
                            </View>
                        </View>
                        {order.services?.map((item: any, i: number) => (
                            <View key={i} style={styles.premiumItemRow}>
                                <View style={styles.itemInfo}>
                                    <Text style={styles.premiumItemName}>{item.name}</Text>
                                    <Text style={styles.premiumItemQty}>Qty: {item.quantity || 1}</Text>
                                </View>
                                <Text style={styles.premiumItemPrice}>₹{item.price * (item.quantity || 1)}</Text>
                            </View>
                        ))}

                        <LinearGradient
                            colors={[COLORS.PURPLE_50, COLORS.WHITE]}
                            style={styles.totalSectionPremium}
                        >
                            <Text style={styles.totalLabelPremium}>Total Amount</Text>
                            <Text style={styles.totalValuePremium}>₹{order.amount}</Text>
                        </LinearGradient>
                    </View>

                    {/* Locations Card */}
                    <View style={styles.premiumCard}>
                        <Text style={styles.cardTitlePremium}>Tracking Details</Text>
                        <View style={styles.trackingContainer}>
                            <View style={styles.trackingLine} />
                            <View style={styles.trackingPoint}>
                                <View style={[styles.dotLarge, { backgroundColor: COLORS.PURPLE_600 }]} />
                                <View style={styles.trackingText}>
                                    <Text style={styles.trackingLabel}>Pickup Location</Text>
                                    <Text style={styles.trackingValue}>{order.pickupAddress}</Text>
                                    <View style={styles.timeBadge}>
                                        <Text style={styles.timeBadgeText}>{moment(order.pickupTime).format('ddd, hh:mm A')}</Text>
                                    </View>
                                </View>
                            </View>
                            <View style={[styles.trackingPoint, { marginTop: 25 }]}>
                                <View style={[styles.dotLarge, { backgroundColor: COLORS.GREEN_600 }]} />
                                <View style={styles.trackingText}>
                                    <Text style={styles.trackingLabel}>Delivery Location</Text>
                                    <Text style={styles.trackingValue}>{order.deliveryAddress}</Text>
                                    <View style={[styles.timeBadge, { backgroundColor: COLORS.GREEN_50 }]}>
                                        <Text style={[styles.timeBadgeText, { color: COLORS.GREEN_700 }]}>{moment(order.deliveryTime).format('ddd, hh:mm A')}</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Dhobi Actions */}
                    {isDhobi && order.status !== 'Completed' && (
                        <View style={styles.actionSectionPremium}>
                            <Text style={styles.cardTitlePremium}>Update Status</Text>
                            <View style={styles.actionButtons}>
                                {order.status === 'pending' && (
                                    <TouchableOpacity
                                        style={[styles.primaryActionBtn, { backgroundColor: COLORS.BLUE_600 }]}
                                        onPress={() => handleUpdateStatus('accepted')}
                                        disabled={updatingStatus}
                                    >
                                        <LinearGradient
                                            colors={['#3B82F6', '#2563EB']}
                                            style={styles.actionGradient}
                                        >
                                            {updatingStatus ? <ActivityIndicator color={COLORS.WHITE} /> : <Text style={styles.actionButtonText}>Accept Order</Text>}
                                        </LinearGradient>
                                    </TouchableOpacity>
                                )}
                                {order.status === 'accepted' && (
                                    <TouchableOpacity
                                        style={styles.primaryActionBtn}
                                        onPress={() => handleUpdateStatus('in_progress')}
                                        disabled={updatingStatus}
                                    >
                                        <LinearGradient
                                            colors={['#8B5CF6', '#7C3AED']}
                                            style={styles.actionGradient}
                                        >
                                            <Text style={styles.actionButtonText}>Start Washing (In Progress)</Text>
                                        </LinearGradient>
                                    </TouchableOpacity>
                                )}
                                {order.status === 'in_progress' && (
                                    <TouchableOpacity
                                        style={styles.primaryActionBtn}
                                        onPress={() => handleUpdateStatus('ready')}
                                        disabled={updatingStatus}
                                    >
                                        <LinearGradient
                                            colors={['#A855F7', '#9333EA']}
                                            style={styles.actionGradient}
                                        >
                                            <Text style={styles.actionButtonText}>Mark as Ready</Text>
                                        </LinearGradient>
                                    </TouchableOpacity>
                                )}
                                {order.status === 'ready' && (
                                    <TouchableOpacity
                                        style={styles.primaryActionBtn}
                                        onPress={() => handleUpdateStatus('delivered')}
                                        disabled={updatingStatus}
                                    >
                                        <LinearGradient
                                            colors={['#10B981', '#059669']}
                                            style={styles.actionGradient}
                                        >
                                            <Text style={styles.actionButtonText}>Mark as Delivered</Text>
                                        </LinearGradient>
                                    </TouchableOpacity>
                                )}

                                {/* Cancel Option */}
                                {['pending', 'accepted', 'in_progress'].includes(order.status) && (
                                    <TouchableOpacity
                                        style={styles.cancelActionBtn}
                                        onPress={() => handleUpdateStatus('cancelled')}
                                        disabled={updatingStatus}
                                    >
                                        <Text style={styles.cancelActionText}>Cancel Order</Text>
                                    </TouchableOpacity>
                                )}

                                {order.status === 'delivered' && (
                                    <View style={styles.successBannerPremium}>
                                        <SvgXml xml={SVG_ICON.Check_Circle(COLORS.GREEN_600)} width={24} height={24} />
                                        <Text style={styles.successBannerText}>Order Completed Successfully</Text>
                                    </View>
                                )}

                                {order.status === 'cancelled' && (
                                    <View style={styles.errorBannerPremium}>
                                        <SvgXml xml={SVG_ICON.Cancel_Icon(COLORS.RED_600)} width={24} height={24} />
                                        <Text style={styles.errorBannerText}>Order has been Cancelled</Text>
                                    </View>
                                )}
                            </View>
                        </View>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
        fontFamily: FONT_FAMILY_MEDIUM,
        color: COLORS.GRAY_600,
    },
    premiumHeader: {
        height: 120,
        paddingHorizontal: 20,
        justifyContent: 'center',
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40,
    },
    headerContent: {
        marginTop: 10,
    },
    statusBadgeUltra: {
        alignSelf: 'flex-start',
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 20,
        marginBottom: 10,
    },
    statusTextUltra: {
        color: COLORS.WHITE,
        fontFamily: FONT_FAMILY_EXTRABOLD,
        fontSize: 11,
        letterSpacing: 0.5,
    },
    orderIdHeader: {
        fontSize: 18,
        fontFamily: FONT_FAMILY_EXTRABOLD,
        color: COLORS.WHITE,
        marginBottom: 5,
    },
    orderMetaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
    },
    orderMetaText: {
        color: COLORS.PURPLE_100,
        fontSize: 13,
        marginLeft: 6,
        fontFamily: FONT_FAMILY_MEDIUM,
    },
    contentOverlay: {
        marginTop: -40,
        paddingHorizontal: 16,
    },
    premiumCard: {
        backgroundColor: COLORS.WHITE,
        borderRadius: 24,
        padding: 20,
        marginBottom: 16,
        elevation: 8,
        shadowColor: COLORS.PURPLE_300,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.08,
        shadowRadius: 20,
    },
    cardHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    cardTitlePremium: {
        fontSize: 16,
        fontFamily: FONT_FAMILY_EXTRABOLD,
        color: COLORS.BLACK,
    },
    iconCircle: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: COLORS.PURPLE_50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    userSection: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    userDetails: {
        flex: 1,
    },
    avatarLarge: {
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    avatarTextLarge: {
        fontSize: 24,
        fontFamily: FONT_FAMILY_EXTRABOLD,
        color: COLORS.PURPLE_600,
    },
    nameHeader: {
        fontSize: 17,
        fontFamily: FONT_FAMILY_EXTRABOLD,
        color: COLORS.BLACK,
    },
    phoneHeader: {
        fontSize: 14,
        color: COLORS.GRAY_500,
        marginTop: 2,
    },
    itemCountBadge: {
        backgroundColor: COLORS.PURPLE_50,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    itemCountText: {
        fontSize: 12,
        color: COLORS.PURPLE_600,
        fontFamily: FONT_FAMILY_EXTRABOLD,
    },
    premiumItemRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    itemInfo: {
        flex: 1,
    },
    premiumItemName: {
        fontSize: 15,
        fontFamily: FONT_FAMILY_SEMIBOLD,
        color: COLORS.BLACK,
    },
    premiumItemQty: {
        fontSize: 12,
        color: COLORS.GRAY_400,
        marginTop: 2,
    },
    premiumItemPrice: {
        fontSize: 16,
        fontFamily: FONT_FAMILY_EXTRABOLD,
        color: COLORS.BLACK,
    },
    totalSectionPremium: {
        marginTop: 15,
        padding: 15,
        borderRadius: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    totalLabelPremium: {
        fontSize: 15,
        fontFamily: FONT_FAMILY_SEMIBOLD,
        color: COLORS.GRAY_600,
    },
    totalValuePremium: {
        fontSize: 22,
        fontFamily: FONT_FAMILY_EXTRABOLD,
        color: COLORS.PURPLE_600,
    },
    trackingContainer: {
        paddingLeft: 10,
        marginTop: 10,
    },
    trackingLine: {
        position: 'absolute',
        left: 14,
        top: 10,
        bottom: 10,
        width: 2,
        backgroundColor: '#F1F5F9',
    },
    trackingPoint: {
        flexDirection: 'row',
    },
    dotLarge: {
        width: 12,
        height: 12,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: COLORS.WHITE,
        elevation: 2,
        marginTop: 4,
    },
    trackingText: {
        marginLeft: 20,
        flex: 1,
    },
    trackingLabel: {
        fontSize: 12,
        color: COLORS.GRAY_400,
        fontFamily: FONT_FAMILY_SEMIBOLD,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    trackingValue: {
        fontSize: 15,
        color: COLORS.BLACK,
        fontFamily: FONT_FAMILY_MEDIUM,
        marginTop: 4,
        lineHeight: 22,
    },
    timeBadge: {
        backgroundColor: COLORS.PURPLE_50,
        alignSelf: 'flex-start',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 6,
        marginTop: 8,
    },
    timeBadgeText: {
        fontSize: 12,
        color: COLORS.PURPLE_600,
        fontFamily: FONT_FAMILY_EXTRABOLD,
    },
    actionSectionPremium: {
        marginTop: 10,
        marginBottom: 40,
    },
    actionButtons: {
        marginTop: 10,
    },
    primaryActionBtn: {
        borderRadius: 16,
        overflow: 'hidden',
        marginTop: 15,
        elevation: 6,
        shadowColor: COLORS.PURPLE_600,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
    },
    actionGradient: {
        paddingVertical: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
    actionButtonText: {
        color: COLORS.WHITE,
        fontFamily: FONT_FAMILY_EXTRABOLD,
        fontSize: 16,
    },
    cancelActionBtn: {
        paddingVertical: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 15,
        borderWidth: 1.5,
        borderColor: '#FEE2E2',
        borderRadius: 16,
        backgroundColor: '#FFF1F2',
    },
    cancelActionText: {
        color: COLORS.RED_600,
        fontFamily: FONT_FAMILY_EXTRABOLD,
        fontSize: 15,
    },
    successBannerPremium: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F0FDF4',
        padding: 20,
        borderRadius: 20,
        marginTop: 20,
        borderWidth: 1,
        borderColor: '#DCFCE7',
    },
    successBannerText: {
        marginLeft: 12,
        fontSize: 15,
        fontFamily: FONT_FAMILY_EXTRABOLD,
        color: '#166534',
    },
    errorBannerPremium: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF1F2',
        padding: 20,
        borderRadius: 20,
        marginTop: 20,
        borderWidth: 1,
        borderColor: '#FEE2E2',
    },
    errorBannerText: {
        marginLeft: 12,
        fontSize: 15,
        fontFamily: FONT_FAMILY_EXTRABOLD,
        color: '#991B1B',
    },
});

export default OrderDetailsScreen;
