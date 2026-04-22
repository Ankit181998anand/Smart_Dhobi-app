import React, { useState } from 'react';
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
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../navigations/types';
import COLORS, { FONT_FAMILY_EXTRABOLD, FONT_FAMILY_MEDIUM, FONT_FAMILY_SEMIBOLD, FONT_FAMILY_REGULAR } from '../../../utils/constant';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SF, SH, SW } from '../../../utils/Dimensions';
import { SvgXml } from 'react-native-svg';
import { SVG_ICON } from '../../../assets/Svg/svgIcon';
import Header from '../../../components/Header';
import InputField from '../../../components/InputField';
import LinearGradient from 'react-native-linear-gradient';
import { showMessage } from 'react-native-flash-message';

type AddressListRouteProp = RouteProp<RootStackParamList, 'AddressList'>;

const AddressListScreen = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const route = useRoute<AddressListRouteProp>();
    const insets = useSafeAreaInsets();
    
    const fromCheckout = route.params?.fromCheckout;

    const [addresses, setAddresses] = useState([
        { id: '1', title: 'Home', address: '123 Park Avenue, Housing Society, Block B', isDefault: true },
        { id: '2', title: 'Work', address: 'Tech Park, Office 404, Building 7, Sector 62', isDefault: false },
    ]);

    const [showModal, setShowModal] = useState(false);
    const [title, setTitle] = useState('');
    const [address, setAddress] = useState('');

    const handleAddAddress = () => {
        if (!title || !address) {
            showMessage({
                message: "Error",
                description: "Please fill all fields",
                type: "danger",
            });
            return;
        }
        const newAddr = {
            id: Date.now().toString(),
            title,
            address,
            isDefault: false
        };
        setAddresses([...addresses, newAddr]);
        setShowModal(false);
        setTitle('');
        setAddress('');
    };

    const handleDelete = (id: string) => {
        Alert.alert("Delete Address", "Are you sure?", [
            { text: "Cancel" },
            { text: "Delete", style: "destructive", onPress: () => setAddresses(addresses.filter(a => a.id !== id)) }
        ]);
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

            <ScrollView contentContainerStyle={{ padding: SW(20), paddingBottom: SH(100) }}>
                {addresses.map((item) => (
                    <TouchableOpacity 
                        key={item.id} 
                        style={styles.addressCard}
                        onPress={() => {
                            if (fromCheckout) {
                                navigation.navigate('Checkout', { 
                                    providerId: '', // These will be merged or handled by navigation state
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
                            <TouchableOpacity onPress={() => handleDelete(item.id)}>
                                <SvgXml xml={SVG_ICON.Check_Circle(COLORS.RED)} width={SW(16)} height={SH(16)} />
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.addressFull}>{item.address}</Text>
                        <TouchableOpacity style={styles.editBtn}>
                            <Text style={styles.editBtnText}>Edit Address</Text>
                        </TouchableOpacity>
                    </TouchableOpacity>
                ))}

                {addresses.length === 0 && (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyText}>No saved addresses found.</Text>
                    </View>
                )}
            </ScrollView>

            <TouchableOpacity
                style={[styles.floatingBtn, { bottom: insets.bottom + SH(20) }]}
                onPress={() => setShowModal(true)}
            >
                <LinearGradient colors={['#4F46E5', '#7C3AED']} style={styles.btnGradient}>
                    <Text style={styles.btnText}>+ Add New Address</Text>
                </LinearGradient>
            </TouchableOpacity>

            <Modal visible={showModal} transparent animationType="slide">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Add Address</Text>

                        <InputField
                            label="Label (e.g. Home, Office)"
                            placeholder="Home"
                            value={title}
                            onChangeText={setTitle}
                        />

                        <InputField
                            label="Full Address"
                            placeholder="Street, Building, Landmark..."
                            value={address}
                            onChangeText={setAddress}
                            multiline
                            numberOfLines={3}
                            containerStyle={{ height: SH(100) }}
                        />

                        <View style={styles.modalFooter}>
                            <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowModal(false)}>
                                <Text style={styles.cancelBtnText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.saveBtn} onPress={handleAddAddress}>
                                <Text style={styles.saveBtnText}>Save Address</Text>
                            </TouchableOpacity>
                        </View>
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
    addressCard: {
        backgroundColor: COLORS.WHITE,
        borderRadius: 16,
        padding: 20,
        marginBottom: SH(16),
        borderWidth: 1,
        borderColor: COLORS.GRAY_100,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SH(10),
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    addressTitle: {
        fontSize: SF(16),
        fontFamily: FONT_FAMILY_EXTRABOLD,
        color: COLORS.BLACK,
    },
    defaultBadge: {
        backgroundColor: COLORS.GREEN_50,
        paddingHorizontal: SW(8),
        paddingVertical: SH(2),
        borderRadius: 4,
        marginLeft: SW(10),
    },
    defaultText: {
        fontSize: SF(10),
        color: COLORS.GREEN_700,
        fontFamily: FONT_FAMILY_EXTRABOLD,
    },
    addressFull: {
        fontSize: SF(14),
        color: COLORS.GRAY_500,
        fontFamily: FONT_FAMILY_REGULAR,
        lineHeight: SH(20),
    },
    editBtn: {
        marginTop: SH(15),
        alignSelf: 'flex-start',
    },
    editBtnText: {
        fontSize: SF(12),
        fontFamily: FONT_FAMILY_SEMIBOLD,
        color: COLORS.PURPLE_600,
    },
    floatingBtn: {
        position: 'absolute',
        left: SW(20),
        right: SW(20),
    },
    btnGradient: {
        paddingVertical: SH(16),
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 10,
    },
    btnText: {
        color: COLORS.WHITE,
        fontFamily: FONT_FAMILY_EXTRABOLD,
        fontSize: SF(16),
    },
    emptyState: {
        marginTop: SH(100),
        alignItems: 'center',
    },
    emptyText: {
        color: COLORS.GRAY_400,
        fontFamily: FONT_FAMILY_MEDIUM,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: COLORS.WHITE,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        padding: 24,
    },
    modalTitle: {
        fontSize: SF(20),
        fontFamily: FONT_FAMILY_EXTRABOLD,
        color: COLORS.BLACK,
        marginBottom: SH(20),
    },
    label: {
        fontSize: SF(14),
        fontFamily: FONT_FAMILY_SEMIBOLD,
        color: COLORS.GRAY_600,
        marginBottom: SH(8),
    },
    input: {
        backgroundColor: COLORS.GRAY_50,
        borderRadius: 12,
        padding: 15,
        marginBottom: SH(20),
        fontFamily: FONT_FAMILY_MEDIUM,
        fontSize: SF(14),
        borderWidth: 1,
        borderColor: COLORS.GRAY_100,
    },
    modalFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: SH(20),
    },
    cancelBtn: {
        flex: 1,
        paddingVertical: SH(15),
        alignItems: 'center',
    },
    cancelBtnText: {
        fontFamily: FONT_FAMILY_SEMIBOLD,
        color: COLORS.GRAY_400,
    },
    saveBtn: {
        flex: 2,
        backgroundColor: COLORS.PURPLE_600,
        paddingVertical: SH(15),
        borderRadius: 12,
        alignItems: 'center',
    },
    saveBtnText: {
        color: COLORS.WHITE,
        fontFamily: FONT_FAMILY_EXTRABOLD,
    },
});

export default AddressListScreen;
