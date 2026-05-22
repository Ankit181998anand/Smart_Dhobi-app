import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
    Alert,
    Modal,
    ActivityIndicator,
    TouchableWithoutFeedback,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../navigations/types';
import COLORS, { FONT_FAMILY_EXTRABOLD, FONT_FAMILY_MEDIUM, FONT_FAMILY_REGULAR } from '../../../utils/constant';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SvgXml } from 'react-native-svg';
import { SVG_ICON } from '../../../assets/Svg/svgIcon';
import Header from '../../../components/Header';
import InputField from '../../../components/InputField';
import LinearGradient from 'react-native-linear-gradient';
import { showMessage } from 'react-native-flash-message';
import { userService } from '../../../services/userService';
import { Address } from '../../../types';

type AddressListRouteProp = RouteProp<RootStackParamList, 'AddressList'>;

const AddressListScreen = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const route = useRoute<AddressListRouteProp>();
    const insets = useSafeAreaInsets();

    const fromCheckout = route.params?.fromCheckout;

    const [addresses, setAddresses] = useState<Address[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const [title, setTitle] = useState('');
    const [address, setAddress] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);

    const fetchAddresses = useCallback(async () => {
        try {
            setIsLoading(true);
            const response = await userService.getAddresses();
            setAddresses(response.addresses || []);
        } catch (error) {
            console.error("Fetch addresses error:", error);
            // Fallback to empty or dummy if backend fails for now, 
            // but requirement says remove dummy, so we'll show empty state
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAddresses();
    }, [fetchAddresses]);

    const handleSaveAddress = async () => {
        if (!title || !address) {
            showMessage({
                message: "Error",
                description: "Please fill all fields",
                type: "danger",
            });
            return;
        }

        try {
            setIsSaving(true);
            if (editingId) {
                await userService.updateAddress(editingId, { title, address });
                showMessage({ message: "Success", description: "Address updated", type: "success" });
            } else {
                await userService.addAddress({ title, address });
                showMessage({ message: "Success", description: "Address added", type: "success" });
            }
            setShowModal(false);
            setTitle('');
            setAddress('');
            setEditingId(null);
            fetchAddresses();
        } catch (error) {
            Alert.alert("Error", "Failed to save address");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = (id: string) => {
        Alert.alert("Delete Address", "Are you sure you want to remove this address?", [
            { text: "Cancel", style: "cancel" },
            {
                text: "Delete",
                style: "destructive",
                onPress: async () => {
                    try {
                        await userService.deleteAddress(id);
                        fetchAddresses();
                    } catch (error) {
                        Alert.alert("Error", "Failed to delete address");
                    }
                }
            }
        ]);
    };

    const openEditModal = (item: Address) => {
        setEditingId(item._id);
        setTitle(item.title);
        setAddress(item.address);
        setShowModal(true);
    };

    return (
        <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
            <StatusBar barStyle="dark-content" />
            <Header
                title="My Addresses"
                isLeftIcon
                leftIconSource={SVG_ICON.arrow_back(COLORS.BLACK)}
                onLeftPress={() => navigation.goBack()}
            />

            {isLoading ? (
                <View style={styles.loaderContainer}>
                    <ActivityIndicator size="large" color={COLORS.PURPLE_600} />
                </View>
            ) : (
                <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 100 }}>
                    {addresses.map((item) => (
                        <TouchableOpacity
                            key={item._id}
                            style={styles.addressCard}
                            onPress={() => {
                                if (fromCheckout) {
                                    navigation.navigate('Checkout', {
                                        providerId: '',
                                        items: [],
                                        selectedAddress: item.address
                                    });
                                }
                            }}
                            disabled={!fromCheckout}
                        >
                            <View style={styles.cardHeader}>
                                <View style={styles.titleRow}>
                                    <Text style={styles.addressTitle}>{item.title}</Text>
                                    {item.isDefault && (
                                        <View style={styles.defaultBadge}>
                                            <Text style={styles.defaultText}>DEFAULT</Text>
                                        </View>
                                    )}
                                </View>
                                <View style={styles.actionIcons}>
                                    <TouchableOpacity onPress={() => openEditModal(item)} style={{ marginRight: 15 }}>
                                        <SvgXml xml={SVG_ICON.Edit_Icon(COLORS.PURPLE_600)} width={18} height={18} />
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => handleDelete(item._id)}>
                                        <SvgXml xml={SVG_ICON.Check_Circle(COLORS.RED)} width={18} height={18} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <Text style={styles.addressFull}>{item.address}</Text>
                        </TouchableOpacity>
                    ))}

                    {addresses.length === 0 && (
                        <View style={styles.emptyState}>
                            <SvgXml xml={SVG_ICON.Location_Icon(COLORS.GRAY_200)} width={80} height={80} />
                            <Text style={styles.emptyText}>No saved addresses found.</Text>
                            <Text style={styles.emptySubText}>Add your home or office address for quicker checkout.</Text>
                        </View>
                    )}
                </ScrollView>
            )}

            <TouchableOpacity
                style={[styles.floatingBtn, { bottom: insets.bottom + 20 }]}
                onPress={() => {
                    setEditingId(null);
                    setTitle('');
                    setAddress('');
                    setShowModal(true);
                }}
            >
                <LinearGradient colors={['#4F46E5', '#7C3AED']} style={styles.btnGradient}>
                    <Text style={styles.btnText}>+ Add New Address</Text>
                </LinearGradient>
            </TouchableOpacity>

            <Modal
                visible={showModal}
                transparent
                animationType="slide"
                onRequestClose={() => setShowModal(false)}
            >
                <TouchableWithoutFeedback onPress={() => setShowModal(false)}>
                    <View style={styles.modalOverlay}>
                        <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
                            <View style={styles.modalContent}>
                                <View style={styles.modalHeader}>
                                    <Text style={styles.modalTitle}>{editingId ? 'Edit Address' : 'Add New Address'}</Text>
                                    <TouchableOpacity onPress={() => setShowModal(false)}>
                                        <SvgXml xml={SVG_ICON.Check_Circle(COLORS.GRAY_400)} width={24} height={24} />
                                    </TouchableOpacity>
                                </View>

                                <InputField
                                    label="Label (e.g. Home, Office, Gym)"
                                    placeholder="Home"
                                    value={title}
                                    onChangeText={setTitle}
                                />

                                <InputField
                                    label="Full Address"
                                    placeholder="Street name, Building No, Area, Landmark..."
                                    value={address}
                                    onChangeText={setAddress}
                                    multiline
                                    numberOfLines={4}
                                    containerStyle={{ height: 120 }}
                                />

                                <View style={styles.modalFooter}>
                                    <TouchableOpacity
                                        style={styles.saveBtn}
                                        onPress={handleSaveAddress}
                                        disabled={isSaving}
                                    >
                                        {isSaving ? (
                                            <ActivityIndicator color={COLORS.WHITE} />
                                        ) : (
                                            <Text style={styles.saveBtnText}>{editingId ? 'Update Address' : 'Save Address'}</Text>
                                        )}
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.WHITE,
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    addressCard: {
        backgroundColor: COLORS.WHITE,
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: COLORS.GRAY_100,
        elevation: 2,
        shadowColor: COLORS.BLACK,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    actionIcons: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    addressTitle: {
        fontSize: 16,
        fontFamily: FONT_FAMILY_EXTRABOLD,
        color: COLORS.BLACK,
    },
    defaultBadge: {
        backgroundColor: COLORS.GREEN_50,
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
        marginLeft: 10,
    },
    defaultText: {
        fontSize: 10,
        color: COLORS.GREEN_700,
        fontFamily: FONT_FAMILY_EXTRABOLD,
    },
    addressFull: {
        fontSize: 14,
        color: COLORS.GRAY_500,
        fontFamily: FONT_FAMILY_REGULAR,
        lineHeight: 22,
    },
    floatingBtn: {
        position: 'absolute',
        left: 20,
        right: 20,
    },
    btnGradient: {
        paddingVertical: 16,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 8,
        shadowColor: COLORS.PURPLE_600,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    btnText: {
        color: COLORS.WHITE,
        fontFamily: FONT_FAMILY_EXTRABOLD,
        fontSize: 16,
    },
    emptyState: {
        marginTop: 100,
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    emptyText: {
        fontSize: 18,
        color: COLORS.GRAY_600,
        fontFamily: FONT_FAMILY_EXTRABOLD,
        marginTop: 20,
    },
    emptySubText: {
        fontSize: 14,
        color: COLORS.GRAY_400,
        fontFamily: FONT_FAMILY_MEDIUM,
        textAlign: 'center',
        marginTop: 8,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: COLORS.WHITE,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        padding: 24,
        paddingBottom: 40,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 25,
    },
    modalTitle: {
        fontSize: 22,
        fontFamily: FONT_FAMILY_EXTRABOLD,
        color: COLORS.BLACK,
    },
    modalFooter: {
        marginTop: 10,
    },
    saveBtn: {
        backgroundColor: COLORS.PURPLE_600,
        paddingVertical: 16,
        borderRadius: 15,
        alignItems: 'center',
    },
    saveBtnText: {
        color: COLORS.WHITE,
        fontFamily: FONT_FAMILY_EXTRABOLD,
        fontSize: 16,
    },
});

export default AddressListScreen;
