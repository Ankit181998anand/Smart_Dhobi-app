import React, { useCallback, useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
    ActivityIndicator,
    StatusBar
} from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../navigations/types';
import COLORS, { FONT_FAMILY_EXTRABOLD, FONT_FAMILY_MEDIUM, FONT_FAMILY_REGULAR, FONT_FAMILY_SEMIBOLD } from '../../../utils/constant';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SF, SH, SW } from '../../../utils/Dimensions';
import { orderService } from '../../../services/orderService';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { SvgXml } from 'react-native-svg';
import { SVG_ICON } from '../../../assets/Svg/svgIcon';
import Header from '../../../components/Header';
import { showMessage } from 'react-native-flash-message';

type OrderDetailsRouteProp = RouteProp<RootStackParamList, 'OrderDetails'>;

const OrderDetailsScreen = () => {
    const route = useRoute<OrderDetailsRouteProp>();
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const { orderId } = route.params;
    const insets = useSafeAreaInsets();
    const { user } = useSelector((state: RootState) => state.auth);

    const [isLoading, setIsLoading] = useState(true);
    const [order, setOrder] = useState<any>(null);
    const [updatingStatus, setUpdatingStatus] = useState(false);

    const fetchOrderDetails = useCallback(async () => {
        try {
            setIsLoading(true);
            const response = await orderService.getDetails(orderId);
            setOrder(response.order);
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
        'Pending': COLORS.AMBER_500,
        'Accepted': COLORS.BLUE_500,
        'In Process': COLORS.PURPLE_500,
        'Ready': COLORS.PURPLE_600,
        'Completed': COLORS.GREEN_500,
        'Cancelled': COLORS.RED,
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
                contentContainerStyle={{ flexGrow: 1, paddingBottom: SH(40) }}
            >
                {/* Status Section */}
                <View style={styles.statusSection}>
                    <View style={[styles.statusIndicator, { backgroundColor: statusColors[order.status] || COLORS.GRAY_400 }]}>
                        <Text style={styles.statusTextLarge}>{order.status.toUpperCase()}</Text>
                    </View>
                    <Text style={styles.updatedAt}>Last updated: {new Date(order.updatedAt).toLocaleString()}</Text>
                </View>

                {/* Vendor/Customer Details */}
                <View style={styles.sectionCard}>
                    <Text style={styles.sectionTitle}>{isDhobi ? 'Customer Details' : 'Service Provider'}</Text>
                    <View style={styles.userRow}>
                        <View style={styles.avatar}>
                            <Text style={styles.avatarText}>
                                {(isDhobi ? order.user?.name : order.provider?.name || 'V')?.charAt(0)}
                            </Text>
                        </View>
                        <View>
                            <Text style={styles.userName}>{isDhobi ? order.user?.name : order.provider?.name || 'Smart Dhobi Partner'}</Text>
                            <Text style={styles.userSub}>{isDhobi ? order.user?.mobile : 'Service Partner'}</Text>
                        </View>
                    </View>
                </View>

                {/* Service List */}
                <View style={styles.sectionCard}>
                    <Text style={styles.sectionTitle}>Items Ordered</Text>
                    {order.items?.map((item: any, i: number) => (
                        <View key={i} style={styles.itemRow}>
                            <View>
                                <Text style={styles.itemName}>{item.name}</Text>
                                <Text style={styles.itemQty}>Quantity: {item.quantity || 1}</Text>
                            </View>
                            <Text style={styles.itemPrice}>₹{item.price * (item.quantity || 1)}</Text>
                        </View>
                    ))}
                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>Total Amount</Text>
                        <Text style={styles.totalValue}>₹{order.totalAmount}</Text>
                    </View>
                </View>

                {/* Addresses */}
                <View style={styles.sectionCard}>
                    <Text style={styles.sectionTitle}>Locations</Text>
                    <View style={styles.locationItem}>
                        <SvgXml xml={SVG_ICON.Location_Icon(COLORS.GRAY_500)} width={SW(16)} height={SH(16)} />
                        <View style={styles.locationTextWrapper}>
                            <Text style={styles.locationLabel}>Pickup Address</Text>
                            <Text style={styles.locationValue}>{order.pickupAddress || 'Shared during pickup'}</Text>
                        </View>
                    </View>
                    <View style={styles.locationItem}>
                        <SvgXml xml={SVG_ICON.Location_Icon(COLORS.GREEN_600)} width={SW(16)} height={SH(16)} />
                        <View style={styles.locationTextWrapper}>
                            <Text style={styles.locationLabel}>Delivery Address</Text>
                            <Text style={styles.locationValue}>{order.deliveryAddress || 'Same as pickup'}</Text>
                        </View>
                    </View>
                </View>

                {/* Dhobi Actions */}
                {isDhobi && order.status !== 'Completed' && (
                    <View style={styles.actionSection}>
                        <Text style={styles.sectionTitle}>Update Status</Text>
                        <View style={styles.actionButtons}>
                            {order.status === 'Pending' && (
                                <TouchableOpacity
                                    style={[styles.actionButton, { backgroundColor: COLORS.BLUE_600 }]}
                                    onPress={() => handleUpdateStatus('Accepted')}
                                    disabled={updatingStatus}
                                >
                                    {updatingStatus ? <ActivityIndicator color={COLORS.WHITE} /> : <Text style={styles.actionButtonText}>Accept Order</Text>}
                                </TouchableOpacity>
                            )}
                            {order.status === 'Accepted' && (
                                <TouchableOpacity
                                    style={[styles.actionButton, { backgroundColor: COLORS.PURPLE_600 }]}
                                    onPress={() => handleUpdateStatus('In Process')}
                                    disabled={updatingStatus}
                                >
                                    <Text style={styles.actionButtonText}>Start Washing</Text>
                                </TouchableOpacity>
                            )}
                            {order.status === 'In Process' && (
                                <TouchableOpacity
                                    style={[styles.actionButton, { backgroundColor: COLORS.GREEN_600 }]}
                                    onPress={() => handleUpdateStatus('Completed')}
                                    disabled={updatingStatus}
                                >
                                    <Text style={styles.actionButtonText}>Mark as Completed</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.GRAY_50,
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
    statusSection: {
        alignItems: 'center',
        paddingVertical: SH(20),
        backgroundColor: COLORS.WHITE,
        marginBottom: SH(10),
    },
    statusIndicator: {
        paddingHorizontal: SW(20),
        paddingVertical: SH(8),
        borderRadius: 20,
    },
    statusTextLarge: {
        color: COLORS.WHITE,
        fontFamily: FONT_FAMILY_EXTRABOLD,
        fontSize: SF(16),
    },
    updatedAt: {
        marginTop: SH(8),
        fontSize: SF(12),
        color: COLORS.GRAY_400,
        fontFamily: FONT_FAMILY_REGULAR,
    },
    sectionCard: {
        backgroundColor: COLORS.WHITE,
        marginHorizontal: SW(16),
        marginTop: SH(10),
        padding: 16,
        borderRadius: 15,
        elevation: 2,
        shadowColor: COLORS.BLACK,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
    },
    sectionTitle: {
        fontSize: SF(15),
        fontFamily: FONT_FAMILY_EXTRABOLD,
        color: COLORS.BLACK,
        marginBottom: SH(12),
    },
    userRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: SW(44),
        height: SH(44),
        borderRadius: 22,
        backgroundColor: COLORS.PURPLE_100,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: SW(12),
    },
    avatarText: {
        fontSize: SF(20),
        fontFamily: FONT_FAMILY_EXTRABOLD,
        color: COLORS.PURPLE_600,
    },
    userName: {
        fontSize: SF(15),
        fontFamily: FONT_FAMILY_SEMIBOLD,
        color: COLORS.BLACK,
    },
    userSub: {
        fontSize: SF(13),
        color: COLORS.GRAY_500,
    },
    itemRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: SH(10),
        borderBottomWidth: 1,
        borderBottomColor: COLORS.GRAY_100,
    },
    itemName: {
        fontSize: SF(14),
        fontFamily: FONT_FAMILY_MEDIUM,
        color: COLORS.BLACK,
    },
    itemQty: {
        fontSize: SF(12),
        color: COLORS.GRAY_500,
    },
    itemPrice: {
        fontSize: SF(14),
        fontFamily: FONT_FAMILY_SEMIBOLD,
        color: COLORS.BLACK,
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: SH(15),
        paddingTop: SH(10),
    },
    totalLabel: {
        fontSize: SF(16),
        fontFamily: FONT_FAMILY_EXTRABOLD,
        color: COLORS.BLACK,
    },
    totalValue: {
        fontSize: SF(18),
        fontFamily: FONT_FAMILY_EXTRABOLD,
        color: COLORS.PURPLE_600,
    },
    locationItem: {
        flexDirection: 'row',
        marginBottom: SH(15),
    },
    locationTextWrapper: {
        marginLeft: SW(10),
        flex: 1,
    },
    locationLabel: {
        fontSize: SF(12),
        fontFamily: FONT_FAMILY_SEMIBOLD,
        color: COLORS.GRAY_400,
    },
    locationValue: {
        fontSize: SF(14),
        fontFamily: FONT_FAMILY_MEDIUM,
        color: COLORS.BLACK,
        marginTop: SH(2),
    },
    actionSection: {
        marginHorizontal: SW(16),
        marginTop: SH(20),
    },
    actionButtons: {
        marginTop: SH(10),
    },
    actionButton: {
        paddingVertical: SH(14),
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    actionButtonText: {
        color: COLORS.WHITE,
        fontFamily: FONT_FAMILY_EXTRABOLD,
        fontSize: SF(15),
    },
});

export default OrderDetailsScreen;
