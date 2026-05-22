import React, { useState } from 'react';
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
import COLORS, { FONT_FAMILY_EXTRABOLD, FONT_FAMILY_MEDIUM, FONT_FAMILY_SEMIBOLD } from '../../../utils/constant';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { orderService } from '../../../services/orderService';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { SvgXml } from 'react-native-svg';
import { SVG_ICON } from '../../../assets/Svg/svgIcon';
import Header from '../../../components/Header';
import LinearGradient from 'react-native-linear-gradient';
import { getAddressFromCoordinates, requestAndFetchLocation } from '../../../utils/locationHelper';
// @ts-ignore
import RazorpayCheckout from 'react-native-razorpay';
import InputField from '../../../components/InputField';
import { Modal } from 'react-native';
import moment from 'moment';
import { showMessage } from 'react-native-flash-message';

type CheckoutRouteProp = RouteProp<RootStackParamList, 'Checkout'>;

const TIME_SLOTS = [
    { id: 'Morning', label: 'Morning', time: '7 – 9 AM' },
    { id: 'Noon', label: 'Noon', time: '12 – 2 PM' },
    { id: 'Evening', label: 'Evening', time: '5 – 7 PM' },
];

const CheckoutScreen = () => {
    const route = useRoute<CheckoutRouteProp>();
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const { providerId, items } = route.params;
    const insets = useSafeAreaInsets();
    const { user } = useSelector((state: RootState) => state.auth);

    const [isPlacingOrder, setIsPlacingOrder] = useState(false);
    const [pickupAddress, setPickupAddress] = useState(user?.serviceAreas || '');
    const [deliveryAddress, setDeliveryAddress] = useState(user?.serviceAreas || '');
    const [pickupCoords, setPickupCoords] = useState<number[] | null>(null);
    const [deliveryCoords, setDeliveryCoords] = useState<number[] | null>(null);
    const [selectedPickupSlot, setSelectedPickupSlot] = useState<string | null>(null);
    const [selectedDeliverySlot, setSelectedDeliverySlot] = useState<string | null>(null);
    const [loadingLocation, setLoadingLocation] = useState<'pickup' | 'delivery' | null>(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const total = subtotal;

    const handleUseCurrent = async (type: 'pickup' | 'delivery') => {
        try {
            setLoadingLocation(type);
            const result = await requestAndFetchLocation();
            if (result.coords) {
                const { latitude, longitude } = result.coords;
                const address = await getAddressFromCoordinates(latitude, longitude);
                if (type === 'pickup') {
                    setPickupAddress(address);
                    setPickupCoords([longitude, latitude]);
                } else {
                    setDeliveryAddress(address);
                    setDeliveryCoords([longitude, latitude]);
                }
            } else if (result.error) {
                Alert.alert('Error', 'Could not fetch location. Please enter address manually.');
            }
        } catch (error) {
            console.error("Location error:", error);
        } finally {
            setLoadingLocation(null);
        }
    };

    const handlePlaceOrder = async () => {
        if (!pickupAddress || !deliveryAddress) {
            Alert.alert("Error", "Please provide both pickup and delivery addresses.");
            return;
        }
        if (!selectedPickupSlot || !selectedDeliverySlot) {
            Alert.alert("Error", "Please select preferred time slots.");
            return;
        }

        try {
            setIsPlacingOrder(true);

            const formatTime = (slot: string) => {
                const hour = slot === 'Morning' ? 9 : slot === 'Noon' ? 13 : 18;
                return moment().set({ hour, minute: 0, second: 0 }).toISOString();
            };

            // 1. Create Order
            const orderPayload = {
                userId: user?._id || '',
                providerId: providerId,
                services: items.map(i => ({
                    name: i.name,
                    quantity: i.quantity,
                    price: i.price
                })),
                pickupAddress,
                deliveryAddress,
                pickupTime: selectedPickupSlot ? formatTime(selectedPickupSlot) : new Date().toISOString(),
                deliveryTime: selectedDeliverySlot ? formatTime(selectedDeliverySlot) : new Date().toISOString(),
                amount: total.toString(),
                status: 'pending',
                paymentStatus: 'pending',
                pickupLocation: pickupCoords ? { type: 'Point', coordinates: pickupCoords } : undefined,
                deliveryLocation: deliveryCoords ? { type: 'Point', coordinates: deliveryCoords } : undefined,
            };

            const createResponse = await orderService.create(orderPayload);
            if (!createResponse.success) throw new Error(createResponse.message);

            const platformOrderId = createResponse.data.orderId;

            showMessage({
                message: createResponse.message || "Order Created Successfully",
                description: "Initializing payment...",
                type: "success",
                icon: "success"
            });

            // 2. Initiate Payment
            const initiateResponse = await orderService.initiatePayment({ orderId: platformOrderId });
            if (!initiateResponse.success) throw new Error(initiateResponse.message);

            const { razorpayOrderId, key, amount, currency } = initiateResponse.data;

            // 3. Razorpay Checkout
            const options = {
                description: 'Laundry Service Payment',
                image: 'https://i.imgur.com/3g7nmJC.png',
                currency: currency,
                key: key,
                amount: amount,
                name: 'Smart Dhobi',
                order_id: razorpayOrderId,
                prefill: {
                    email: user?.email || '',
                    contact: user?.mobile || '',
                    name: user?.name || ''
                },
                theme: { color: COLORS.PURPLE_600 }
            };

            RazorpayCheckout.open(options).then(async (data: any) => {
                // 4. Verify Payment
                try {
                    const verifyResponse = await orderService.verifyPayment({
                        orderId: platformOrderId,
                        razorpayOrderId: data.razorpay_order_id,
                        razorpayPaymentId: data.razorpay_payment_id,
                        razorpaySignature: data.razorpay_signature
                    });

                    if (verifyResponse.success) {
                        setShowSuccessModal(true);
                    } else {
                        Alert.alert("Payment Error", "Verification failed. Please contact support.");
                    }
                } catch (err) {
                    Alert.alert("Payment Error", "Failed to verify payment.");
                }
            }).catch((error: any) => {
                Alert.alert("Payment Cancelled", error.description);
            });

        } catch (error: any) {
            console.error("Place order error:", error);
            showMessage({
                message: "Order Failed",
                description: error.message || "Failed to place order. Please try again.",
                type: "danger",
                icon: "danger"
            });
        } finally {
            setIsPlacingOrder(false);
        }
    };

    const renderTimeSlots = (selected: string | null, onSelect: (id: string) => void) => (
        <View style={styles.timeSlotGrid}>
            {TIME_SLOTS.map((slot) => (
                <TouchableOpacity
                    key={slot.id}
                    style={[
                        styles.timeSlotCard,
                        selected === slot.id && styles.activeTimeSlot
                    ]}
                    onPress={() => onSelect(slot.id)}
                >
                    <Text style={[styles.slotLabel, selected === slot.id && styles.activeText]}>{slot.label}</Text>
                    <Text style={[styles.slotTime, selected === slot.id && styles.activeText]}>{slot.time}</Text>
                </TouchableOpacity>
            ))}
        </View>
    );

    const isContinueDisabled = !pickupAddress || !deliveryAddress || !selectedPickupSlot || !selectedDeliverySlot || isPlacingOrder;

    return (
        <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
            <StatusBar barStyle="dark-content" />
            <Header
                title="Checkout"
                isLeftIcon
                leftIconSource={SVG_ICON.arrow_back(COLORS.BLACK)}
                onLeftPress={() => navigation.goBack()}
            />

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
                {/* Pickup & Delivery Section */}
                <View style={[styles.section, { marginTop: 10, borderRadius: 15, marginHorizontal: 15 }]}>
                    <View style={styles.sectionHeader}>
                        <SvgXml xml={SVG_ICON.Location_Icon(COLORS.PURPLE_600)} width={18} height={18} />
                        <Text style={[styles.sectionTitle, { marginLeft: 8, marginBottom: 0 }]}>Pickup & Delivery</Text>
                    </View>

                    <View style={styles.addressInputContainer}>
                        <View style={styles.labelRow}>
                            <Text style={styles.inputLabel}>Pickup address <Text style={{ color: COLORS.RED_600 }}>*</Text></Text>
                            <TouchableOpacity onPress={() => handleUseCurrent('pickup')} style={styles.useCurrentBtn}>
                                <SvgXml xml={SVG_ICON.arrow_Right(COLORS.PURPLE_600)} width={14} height={14} style={{ transform: [{ rotate: '-45deg' }] }} />
                                <Text style={styles.useCurrentText}>Use current</Text>
                            </TouchableOpacity>
                        </View>
                        <InputField
                            label=""
                            placeholder="Enter pickup address..."
                            value={pickupAddress}
                            onChangeText={setPickupAddress}
                            multiline
                            containerStyle={styles.addressInput}
                            loading={loadingLocation === 'pickup'}
                            iconSource={SVG_ICON.Location_Icon(COLORS.PURPLE_600)}
                        />
                    </View>

                    <View style={styles.addressInputContainer}>
                        <View style={styles.labelRow}>
                            <Text style={styles.inputLabel}>Delivery address <Text style={{ color: COLORS.RED_600 }}>*</Text></Text>
                            <TouchableOpacity onPress={() => handleUseCurrent('delivery')} style={styles.useCurrentBtn}>
                                <SvgXml xml={SVG_ICON.arrow_Right(COLORS.PURPLE_600)} width={14} height={14} style={{ transform: [{ rotate: '-45deg' }] }} />
                                <Text style={styles.useCurrentText}>Use current</Text>
                            </TouchableOpacity>
                        </View>
                        <InputField
                            label=""
                            placeholder="Enter delivery address..."
                            value={deliveryAddress}
                            onChangeText={setDeliveryAddress}
                            multiline
                            containerStyle={styles.addressInput}
                            loading={loadingLocation === 'delivery'}
                            iconSource={SVG_ICON.Location_Icon(COLORS.PURPLE_600)}
                        />
                    </View>

                    <Text style={styles.subSectionTitle}>PREFERRED PICKUP ADDRESS TIME <Text style={{ color: COLORS.RED_600 }}>*</Text></Text>
                    {renderTimeSlots(selectedPickupSlot, setSelectedPickupSlot)}

                    <Text style={[styles.subSectionTitle, { marginTop: 15 }]}>PREFERRED DELIVERY ADDRESS TIME <Text style={{ color: COLORS.RED_600 }}>*</Text></Text>
                    {renderTimeSlots(selectedDeliverySlot, setSelectedDeliverySlot)}
                </View>

                {/* Order Summary */}
                <View style={[styles.section, { borderRadius: 15, marginHorizontal: 15 }]}>
                    <View style={styles.sectionHeader}>
                        <SvgXml xml={SVG_ICON.Bag_Timer(COLORS.PURPLE_600)} width={18} height={18} />
                        <Text style={[styles.sectionTitle, { marginLeft: 8, marginBottom: 0 }]}>Order Summary</Text>
                    </View>

                    {items.map((item, index) => (
                        <View key={index} style={styles.itemRow}>
                            <View>
                                <Text style={styles.itemName}>{item.name}</Text>
                                <Text style={styles.itemQtyDetail}>₹{item.price} × {item.quantity}</Text>
                            </View>
                            <Text style={styles.itemPrice}>₹{item.price * item.quantity}</Text>
                        </View>
                    ))}

                    <View style={[styles.priceRow, styles.totalRow, { borderTopWidth: 1, borderTopColor: COLORS.GRAY_100, paddingTop: 15 }]}>
                        <Text style={styles.totalLabel}>Total</Text>
                        <Text style={styles.totalValue}>₹{total}</Text>
                    </View>

                    <TouchableOpacity
                        style={[styles.payBtnWrapper, { marginTop: 20 }, isContinueDisabled && { opacity: 0.5 }]}
                        onPress={handlePlaceOrder}
                        disabled={isContinueDisabled}
                    >
                        <LinearGradient
                            colors={['#4F46E5', '#7C3AED']}
                            style={styles.payBtn}
                            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                        >
                            {isPlacingOrder ? (
                                <ActivityIndicator color={COLORS.WHITE} />
                            ) : (
                                <Text style={styles.payBtnText}>
                                    {!pickupAddress || !deliveryAddress ? 'Add address to continue' : `Confirm Booking — ₹${total}`}
                                </Text>
                            )}
                        </LinearGradient>
                    </TouchableOpacity>
                </View>

            </ScrollView>


            {/* Success Modal */}
            <Modal visible={showSuccessModal} transparent animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.successIconWrapper}>
                            <LinearGradient
                                colors={['#10B981', '#059669']}
                                style={styles.successGradient}
                            >
                                <SvgXml xml={SVG_ICON.Check_Circle(COLORS.WHITE)} width={40} height={40} />
                            </LinearGradient>
                        </View>
                        <Text style={styles.modalTitle}>Order Placed Successfully!</Text>
                        <Text style={styles.modalSubtitle}>Your laundry order has been scheduled. You can track its status in the Orders tab.</Text>

                        <TouchableOpacity
                            style={styles.modalBtn}
                            onPress={() => {
                                setShowSuccessModal(false);
                                navigation.navigate('MainTabs', {
                                    type: 'customer',
                                    screen: 'Orders',
                                    params: { type: 'customer' }
                                } as any);
                            }}
                        >
                            <LinearGradient
                                colors={['#4F46E5', '#7C3AED']}
                                style={styles.modalBtnGradient}
                            >
                                <Text style={styles.modalBtnText}>View My Orders</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
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
        marginBottom: 15,
        shadowColor: COLORS.BLACK,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: 18,
        fontFamily: FONT_FAMILY_EXTRABOLD,
        color: COLORS.BLACK,
        marginBottom: 15,
    },
    subSectionTitle: {
        fontSize: 12,
        fontFamily: FONT_FAMILY_SEMIBOLD,
        color: COLORS.GRAY_500,
        marginTop: 10,
        marginBottom: 10,
    },
    addressInputContainer: {
        marginBottom: 15,
    },
    labelRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 5,
    },
    inputLabel: {
        fontSize: 14,
        fontFamily: FONT_FAMILY_SEMIBOLD,
        color: COLORS.GRAY_700,
    },
    useCurrentBtn: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    useCurrentText: {
        fontSize: 12,
        fontFamily: FONT_FAMILY_EXTRABOLD,
        color: COLORS.PURPLE_600,
        marginLeft: 4,
    },
    addressInput: {
        backgroundColor: COLORS.GRAY_50,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: COLORS.GRAY_100,
        minHeight: 80,
    },
    timeSlotGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    timeSlotCard: {
        width: 100,
        padding: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: COLORS.GRAY_100,
        alignItems: 'center',
        backgroundColor: COLORS.WHITE,
    },
    activeTimeSlot: {
        borderColor: COLORS.PURPLE_600,
        backgroundColor: COLORS.PURPLE_50,
    },
    slotLabel: {
        fontSize: 13,
        fontFamily: FONT_FAMILY_EXTRABOLD,
        color: COLORS.BLACK,
    },
    slotTime: {
        fontSize: 11,
        fontFamily: FONT_FAMILY_MEDIUM,
        color: COLORS.GRAY_500,
        marginTop: 2,
    },
    activeText: {
        color: COLORS.PURPLE_600,
    },
    itemRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    itemName: {
        fontSize: 15,
        fontFamily: FONT_FAMILY_SEMIBOLD,
        color: COLORS.BLACK,
    },
    itemQtyDetail: {
        fontSize: 12,
        color: COLORS.GRAY_500,
        fontFamily: FONT_FAMILY_MEDIUM,
    },
    itemPrice: {
        fontSize: 15,
        fontFamily: FONT_FAMILY_EXTRABOLD,
        color: COLORS.BLACK,
    },
    priceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    priceLabel: {
        fontSize: 14,
        color: COLORS.GRAY_500,
        fontFamily: FONT_FAMILY_MEDIUM,
    },
    priceValue: {
        fontSize: 14,
        color: COLORS.BLACK,
        fontFamily: FONT_FAMILY_SEMIBOLD,
    },
    totalRow: {
        marginTop: 5,
    },
    totalLabel: {
        fontSize: 16,
        fontFamily: FONT_FAMILY_EXTRABOLD,
        color: COLORS.BLACK,
    },
    totalValue: {
        fontSize: 18,
        fontFamily: FONT_FAMILY_EXTRABOLD,
        color: COLORS.PURPLE_600,
    },
    trustBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        backgroundColor: COLORS.GREEN_50,
        paddingVertical: 10,
        borderRadius: 10,
    },
    trustText: {
        marginLeft: 8,
        fontSize: 12,
        color: COLORS.GREEN_700,
        fontFamily: FONT_FAMILY_SEMIBOLD,
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
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 20,
    },
    bottomInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    grandTotalLabel: {
        fontSize: 11,
        fontFamily: FONT_FAMILY_EXTRABOLD,
        color: COLORS.GRAY_400,
    },
    grandTotalValue: {
        fontSize: 22,
        fontFamily: FONT_FAMILY_EXTRABOLD,
        color: COLORS.BLACK,
    },
    payBtnWrapper: {
        width: '100%',
    },
    payBtn: {
        paddingVertical: 15,
        borderRadius: 15,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    payBtnText: {
        color: COLORS.WHITE,
        fontSize: 14,
        fontFamily: FONT_FAMILY_EXTRABOLD,
        marginRight: 8,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContent: {
        width: '100%',
        backgroundColor: COLORS.WHITE,
        borderRadius: 25,
        padding: 30,
        alignItems: 'center',
    },
    successIconWrapper: {
        width: 80,
        height: 80,
        marginBottom: 20,
    },
    successGradient: {
        width: '100%',
        height: '100%',
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 20,
        fontFamily: FONT_FAMILY_EXTRABOLD,
        color: COLORS.BLACK,
        textAlign: 'center',
        marginBottom: 10,
    },
    modalSubtitle: {
        fontSize: 14,
        fontFamily: FONT_FAMILY_MEDIUM,
        color: COLORS.GRAY_500,
        textAlign: 'center',
        marginBottom: 30,
        lineHeight: 20,
    },
    modalBtn: {
        width: '100%',
    },
    modalBtnGradient: {
        paddingVertical: 15,
        borderRadius: 15,
        alignItems: 'center',
    },
    modalBtnText: {
        color: COLORS.WHITE,
        fontSize: 16,
        fontFamily: FONT_FAMILY_EXTRABOLD,
    },
});

export default CheckoutScreen;
