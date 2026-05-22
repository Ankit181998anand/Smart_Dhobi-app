import React, { useCallback, useEffect, useState } from "react";
import { OrdersScreenProps } from "../../../navigations/types";
import { ActivityIndicator, FlatList, RefreshControl, SafeAreaView, StatusBar, Text, TouchableOpacity, View } from "react-native";
import styles from "./style";
import { SvgXml } from "react-native-svg";
import { SVG_ICON } from "../../../assets/Svg/svgIcon";
import COLORS from "../../../utils/constant";
import { orderService } from "../../../services/orderService";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import Header from "../../../components/Header";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useIsFocused } from "@react-navigation/native";
import { Order } from "../../../types";

const OrdersScreen: React.FC<OrdersScreenProps> = ({ route, navigation }) => {
    const { type } = route.params;
    const isFocused = useIsFocused();
    const insets = useSafeAreaInsets();
    const { user } = useSelector((state: RootState) => state.auth);

    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchOrders = useCallback(async () => {
        try {
            setLoading(true);
            let response;
            if (type === 'dhobi') {
                const providerId = user?.mainUserId || user?._id || '';
                response = await orderService.getDhobiOrders(providerId);
            } else {
                response = await orderService.getUserOrders(user?._id || '');
            }
            setOrders(response.data || []);
        } catch (error) {
            console.error("Fetch orders error:", error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [type, user?._id, user?.mainUserId]);

    useEffect(() => {
        if (isFocused) {
            StatusBar.setBarStyle('dark-content');
            StatusBar.setBackgroundColor('transparent');
            StatusBar.setTranslucent(true);
            fetchOrders();
        }
    }, [isFocused, fetchOrders]);

    const onRefresh = () => {
        setRefreshing(true);
        fetchOrders();
    };

    const renderOrderItem = ({ item }: { item: Order }) => {
        const statusColors: Record<string, string> = {
            'pending': COLORS.AMBER_500,
            'accepted': COLORS.BLUE_500,
            'ready': COLORS.PURPLE_500,
            'delivered': COLORS.GREEN_500,
            'cancelled': COLORS.RED,
        };

        const displayDate = item.createdAt ? new Date(item.createdAt).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        }) : 'N/A';

        return (
            <TouchableOpacity
                style={styles.orderCard}
                activeOpacity={type === 'dhobi' ? 0.7 : 1}
                onPress={() => {
                    if (type === 'dhobi') {
                        navigation.navigate('OrderDetails', { orderId: item._id });
                    }
                }}
            >
                <View style={styles.orderHeader}>
                    <View>
                        <Text style={styles.orderId}>{item.orderId || `#${item._id?.slice(-8).toUpperCase()}`}</Text>
                        <Text style={styles.orderDate}>{displayDate}</Text>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: statusColors[item.status] || COLORS.GRAY_400 }]}>
                        <Text style={styles.statusText}>{item.status?.toUpperCase()}</Text>
                    </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.orderDetailsRow}>
                    <Text style={styles.detailLabel}>{type === 'dhobi' ? 'Customer:' : 'Service Partner:'}</Text>
                    <Text style={styles.detailValue}>
                        {type === 'dhobi' ? (item.userId as any)?.name : (item.providerId as any)?.name || 'N/A'}
                    </Text>
                </View>

                <View style={styles.orderDetailsRow}>
                    <Text style={styles.detailLabel}>Services:</Text>
                    <Text style={styles.detailValue}>
                        {item.services?.map((s: any) => s.name).join(', ') || 'Laundry'} ({item.services?.length || 0})
                    </Text>
                </View>

                <View style={[styles.orderDetailsRow, { flexDirection: 'column', alignItems: 'flex-start' }]}>
                    <Text style={styles.detailLabel}>Pickup From:</Text>
                    <Text style={[styles.detailValue, { textAlign: 'left', marginTop: 2 }]}>{item.pickupAddress}</Text>
                </View>

                <View style={styles.divider} />

                <View style={styles.orderFooter}>
                    <View>
                        <Text style={styles.detailLabel}>Amount Paid</Text>
                        <Text style={styles.detailValueAmount}>₹{item.amount}</Text>
                    </View>

                    <View style={{ alignItems: 'flex-end' }}>
                        <Text style={styles.detailLabel}>Payment Status</Text>
                        <Text style={[styles.paymentStatus, { color: item.paymentStatus === 'completed' ? COLORS.GREEN_600 : COLORS.PURPLE_600 }]}>
                            {item.paymentStatus?.toUpperCase()}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
            <Header
                title={type === 'dhobi' ? 'Service Orders' : 'My Laundry Orders'}
                isRightIcon
                rightIconSource={SVG_ICON.Refresh_Icon(COLORS.BLACK)}
                onRightPress={onRefresh}
            />

            <View style={styles.ordersSummary}>
                <Text style={styles.totalOrdersText}>
                    {type === 'dhobi' ? 'Active Jobs' : 'Your Orders'}: {loading ? '...' : orders.length}
                </Text>
            </View>

            {loading && !refreshing ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={COLORS.PRIMARY} />
                    <Text style={styles.loadingText}>Fetching orders...</Text>
                </View>
            ) : orders.length === 0 ? (
                <View style={styles.emptyListContainer}>
                    <SvgXml xml={SVG_ICON.Orders_Icon(COLORS.GRAY_300)} width={80} height={80} />
                    <Text style={styles.emptyListText}>No orders found yet.</Text>
                </View>
            ) : (
                <FlatList
                    data={orders}
                    keyExtractor={(item) => item._id}
                    renderItem={renderOrderItem}
                    contentContainerStyle={[styles.listContent, { paddingBottom: 100 }]}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            colors={[COLORS.PRIMARY]}
                        />
                    }
                />
            )}
        </SafeAreaView>
    )
};

export default OrdersScreen;