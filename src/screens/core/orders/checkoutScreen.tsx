import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
    Alert,
    StatusBar,
    ActivityIndicator,
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
import LinearGradient from 'react-native-linear-gradient';

type CheckoutRouteProp = RouteProp<RootStackParamList, 'Checkout'>;

const CheckoutScreen = () => {
    const route = useRoute<CheckoutRouteProp>();
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const { providerId, items } = route.params;
    const insets = useSafeAreaInsets();
    const { user } = useSelector((state: RootState) => state.auth);

    const [isPlacingOrder, setIsPlacingOrder] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState(user?.serviceAreas || 'Select Address');

    useEffect(() => {
        if (route.params?.selectedAddress) {
            setSelectedAddress(route.params.selectedAddress);
        }
    }, [route.params?.selectedAddress]);

    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryCharge = 30;
    const tax = Math.round(subtotal * 0.05); // 5% GST
    const total = subtotal + deliveryCharge + tax;

    const handlePlaceOrder = async () => {
        try {
            setIsPlacingOrder(true);
            const payload = {
                provider: providerId,
                items: items.map(i => ({
                    name: i.name,
                    price: i.price,
                    quantity: i.quantity
                })),
                totalAmount: total,
                pickupAddress: selectedAddress,
                deliveryAddress: selectedAddress, // For simplicity
                status: 'Pending',
                paymentStatus: 'Pending',
            };

            const response = await orderService.create(payload);
            console.log("response", response);

            Alert.alert(
                "Order Placed!",
                "Your laundry is scheduled for pickup.",
                [{ text: "View Order", onPress: () => navigation.navigate('MainTabs', { type: 'customer', screen: 'Orders', params: { type: 'customer' } }) }]
            );
        } catch (error) {
            console.error("Place order error:", error);
            Alert.alert("Error", "Failed to place order. Please try again.");
        } finally {
            setIsPlacingOrder(false);
        }
    };

    return (
        <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
            <StatusBar barStyle="dark-content" />
            <Header
                title="Checkout"
                isLeftIcon
                leftIconSource={SVG_ICON.arrow_back(COLORS.BLACK)}
                onLeftPress={() => navigation.goBack()}
            />

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: SH(120) }}>
                {/* Order Summary */}
                <View style={[styles.section, { marginTop: SH(10) }]}>
                    <Text style={styles.sectionTitle}>Order Summary</Text>
                    {items.map((item, index) => (
                        <View key={index} style={styles.itemRow}>
                            <View style={styles.itemInfo}>
                                <Text style={styles.itemName}>{item.name}</Text>
                                <Text style={styles.itemQty}>x{item.quantity}</Text>
                            </View>
                            <Text style={styles.itemPrice}>₹{item.price * item.quantity}</Text>
                        </View>
                    ))}
                </View>

                {/* Delivery Info */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Pickup & Delivery Address</Text>
                    <TouchableOpacity 
                        style={styles.addressCard}
                        onPress={() => navigation.navigate('AddressList', { fromCheckout: true })}
                    >
                        <View style={styles.addressIconWrapper}>
                            <SvgXml xml={SVG_ICON.Location_Icon(COLORS.PURPLE_600)} width={SW(20)} height={SH(20)} />
                        </View>
                        <View style={styles.addressTextWrapper}>
                            <Text style={styles.addressLabel}>Primary Address</Text>
                            <Text style={styles.addressText} numberOfLines={2}>
                                {selectedAddress}
                            </Text>
                        </View>
                        <Text style={styles.changeText}>CHANGE</Text>
                    </TouchableOpacity>
                </View>

                {/* Payment Breakdown */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Price Details</Text>
                    <View style={styles.priceRow}>
                        <Text style={styles.priceLabel}>Items Total</Text>
                        <Text style={styles.priceValue}>₹{subtotal}</Text>
                    </View>
                    <View style={styles.priceRow}>
                        <Text style={styles.priceLabel}>Delivery Partner Fee</Text>
                        <Text style={styles.priceValue}>₹{deliveryCharge}</Text>
                    </View>
                    <View style={styles.priceRow}>
                        <Text style={styles.priceLabel}>Taxes & Charges</Text>
                        <Text style={styles.priceValue}>₹{tax}</Text>
                    </View>
                    <View style={[styles.priceRow, styles.totalRow]}>
                        <Text style={styles.totalLabel}>Grand Total</Text>
                        <Text style={styles.totalValue}>₹{total}</Text>
                    </View>
                </View>

                {/* Secure Trust Badge */}
                <View style={styles.trustBadge}>
                    <SvgXml xml={SVG_ICON.Check_Circle(COLORS.GREEN_600)} width={SW(16)} height={SH(16)} />
                    <Text style={styles.trustText}>Secure & Hygienic Laundry Standards</Text>
                </View>
            </ScrollView>

            {/* Fixed Bottom Bar */}
            <View style={[styles.bottomBar, { paddingBottom: insets.bottom + SH(10) }]}>
                <View style={styles.bottomInfo}>
                    <View>
                        <Text style={styles.grandTotalLabel}>TOTAL AMOUNT</Text>
                        <Text style={styles.grandTotalValue}>₹{total}</Text>
                    </View>
                    <TouchableOpacity
                        style={styles.payBtnWrapper}
                        onPress={handlePlaceOrder}
                        disabled={isPlacingOrder}
                    >
                        <LinearGradient
                            colors={['#4F46E5', '#7C3AED']}
                            style={styles.payBtn}
                            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                        >
                            {isPlacingOrder ? (
                                <ActivityIndicator color={COLORS.WHITE} />
                            ) : (
                                <>
                                    <Text style={styles.payBtnText}>PLACE ORDER</Text>
                                    <SvgXml xml={SVG_ICON.arrow_Right(COLORS.WHITE)} width={SW(18)} height={SH(18)} />
                                </>
                            )}
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.GRAY_50,
    },
    section: {
        backgroundColor: COLORS.WHITE,
        padding: 20,
        marginBottom: SH(10),
    },
    sectionTitle: {
        fontSize: SF(16),
        fontFamily: FONT_FAMILY_EXTRABOLD,
        color: COLORS.BLACK,
        marginBottom: SH(15),
    },
    itemRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: SH(12),
    },
    itemInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    itemName: {
        fontSize: SF(14),
        fontFamily: FONT_FAMILY_MEDIUM,
        color: COLORS.GRAY_800,
    },
    itemQty: {
        fontSize: SF(12),
        color: COLORS.GRAY_400,
        marginLeft: SW(10),
        fontFamily: FONT_FAMILY_SEMIBOLD,
    },
    itemPrice: {
        fontSize: SF(14),
        fontFamily: FONT_FAMILY_SEMIBOLD,
        color: COLORS.BLACK,
    },
    addressCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        backgroundColor: COLORS.GRAY_50,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: COLORS.GRAY_100,
    },
    addressIconWrapper: {
        width: SW(40),
        height: SH(40),
        borderRadius: 20,
        backgroundColor: COLORS.PURPLE_50,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: SW(12),
    },
    addressTextWrapper: {
        flex: 1,
    },
    addressLabel: {
        fontSize: SF(12),
        fontFamily: FONT_FAMILY_SEMIBOLD,
        color: COLORS.GRAY_400,
    },
    addressText: {
        fontSize: SF(14),
        fontFamily: FONT_FAMILY_MEDIUM,
        color: COLORS.BLACK,
        marginTop: SH(2),
    },
    changeText: {
        fontSize: SF(12),
        fontFamily: FONT_FAMILY_EXTRABOLD,
        color: COLORS.PURPLE_600,
    },
    priceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: SH(10),
    },
    priceLabel: {
        fontSize: SF(14),
        color: COLORS.GRAY_500,
        fontFamily: FONT_FAMILY_REGULAR,
    },
    priceValue: {
        fontSize: SF(14),
        color: COLORS.BLACK,
        fontFamily: FONT_FAMILY_MEDIUM,
    },
    totalRow: {
        marginTop: SH(10),
        paddingTop: SH(10),
        borderTopWidth: 1,
        borderTopColor: COLORS.GRAY_100,
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
    trustBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: SH(20),
    },
    trustText: {
        marginLeft: SW(8),
        fontSize: SF(12),
        color: COLORS.GRAY_500,
        fontFamily: FONT_FAMILY_MEDIUM,
    },
    bottomBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: COLORS.WHITE,
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: COLORS.GRAY_100,
        shadowColor: COLORS.BLACK,
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 10,
    },
    bottomInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    grandTotalLabel: {
        fontSize: SF(11),
        fontFamily: FONT_FAMILY_EXTRABOLD,
        color: COLORS.GRAY_400,
    },
    grandTotalValue: {
        fontSize: SF(20),
        fontFamily: FONT_FAMILY_EXTRABOLD,
        color: COLORS.BLACK,
    },
    payBtnWrapper: {
        width: '60%',
    },
    payBtn: {
        paddingVertical: SH(15),
        borderRadius: 15,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    payBtnText: {
        color: COLORS.WHITE,
        fontSize: SF(15),
        fontFamily: FONT_FAMILY_EXTRABOLD,
        marginRight: SW(8),
    },
});

export default CheckoutScreen;
