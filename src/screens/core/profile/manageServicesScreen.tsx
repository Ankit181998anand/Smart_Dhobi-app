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
    Modal,
    TextInput,
    StatusBar,
    TouchableWithoutFeedback,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import COLORS, { FONT_FAMILY_EXTRABOLD, FONT_FAMILY_MEDIUM, FONT_FAMILY_SEMIBOLD } from '../../../utils/constant';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { providerService } from '../../../services/providerService';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { SvgXml } from 'react-native-svg';
import { SVG_ICON } from '../../../assets/Svg/svgIcon';
import Header from '../../../components/Header';
import LinearGradient from 'react-native-linear-gradient';

const ManageServicesScreen = () => {
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();
    const { user } = useSelector((state: RootState) => state.auth);

    const [isLoading, setIsLoading] = useState(true);
    const [services, setServices] = useState<any[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [editingService, setEditingService] = useState<any>(null);
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');

    const fetchServices = useCallback(async () => {
        try {
            setIsLoading(true);
            const providerId = user?.mainUserId || user?._id || '';
            const response = await providerService.getProfile(providerId);
            console.log("ManageServices - Provider Data:", response.data || response);
            const providerData = response.data || response.provider || response;
            setServices(providerData.services || []);
        } catch (error) {
            console.error("Fetch services error:", error);
            // Alert.alert("Error", "Failed to load services");
        } finally {
            setIsLoading(false);
        }
    }, [user?._id, user?.mainUserId]);

    useEffect(() => {
        fetchServices();
    }, [fetchServices]);

    const handleSave = async () => {
        if (!name || !price) {
            Alert.alert("Error", "Please fill all fields");
            return;
        }

        try {
            setIsLoading(true);
            if (editingService) {
                await providerService.updateService(user?.mainUserId || user?._id || '', editingService._id, { name, price });
            } else {
                await providerService.addService(user?.mainUserId || user?._id || '', { name, price });
            }
            setShowModal(false);
            setEditingService(null);
            setName('');
            setPrice('');
            fetchServices();
        } catch (error) {
            Alert.alert("Error", "Failed to save service");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = (serviceId: string) => {
        Alert.alert(
            "Delete Service",
            "Are you sure you want to remove this service?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            const providerId = user?.mainUserId || user?._id || '';
                            await providerService.deleteService(providerId, serviceId);
                            fetchServices();
                        } catch (error) {
                            Alert.alert("Error", "Failed to delete service");
                        }
                    }
                }
            ]
        );
    };

    const openEdit = (service: any) => {
        setEditingService(service);
        setName(service.name);
        setPrice(service.price.toString());
        setShowModal(true);
    };

    return (
        <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
            <StatusBar barStyle="dark-content" />
            <Header
                title="Manage Services"
                isLeftIcon
                leftIconSource={SVG_ICON.arrow_back(COLORS.BLACK)}
                onLeftPress={() => navigation.goBack()}
            />

            {isLoading && !showModal ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={COLORS.PURPLE_600} />
                </View>
            ) : (
                <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
                    <Text style={styles.subtitle}>Define the items and pricing you offer to customers.</Text>

                    {services.map((service) => (
                        <View key={service._id} style={styles.serviceCard}>
                            <View style={styles.serviceInfo}>
                                <Text style={styles.serviceName}>{service.name}</Text>
                                <Text style={styles.servicePrice}>₹{service.price}</Text>
                            </View>
                            <View style={styles.actions}>
                                <TouchableOpacity onPress={() => openEdit(service)} style={styles.actionBtn}>
                                    <SvgXml xml={SVG_ICON.Edit_Icon(COLORS.BLUE_600)} width={20} height={20} />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => handleDelete(service._id)} style={styles.actionBtn}>
                                    <SvgXml xml={SVG_ICON.Check_Circle(COLORS.RED)} width={20} height={20} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))}

                    {services.length === 0 && (
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>You haven't added any services yet.</Text>
                        </View>
                    )}
                </ScrollView>
            )}

            <TouchableOpacity
                style={[styles.fab, { bottom: insets.bottom + 20 }]}
                onPress={() => {
                    setEditingService(null);
                    setName('');
                    setPrice('');
                    setShowModal(true);
                }}
            >
                <LinearGradient colors={['#4F46E5', '#7C3AED']} style={styles.fabGradient}>
                    <Text style={styles.fabText}>+ Add Service</Text>
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
                                <Text style={styles.modalTitle}>{editingService ? 'Edit Service' : 'Add New Service'}</Text>

                                <Text style={styles.label}>Service Name</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="e.g., Wash & Fold (Shirt)"
                                    value={name}
                                    onChangeText={setName}
                                />

                                <Text style={styles.label}>Price (₹)</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="e.g., 20"
                                    keyboardType="numeric"
                                    value={price}
                                    onChangeText={setPrice}
                                />

                                <View style={styles.modalFooter}>
                                    <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowModal(false)}>
                                        <Text style={styles.cancelBtnText}>Cancel</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                                        <Text style={styles.saveBtnText}>Save Service</Text>
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
        backgroundColor: COLORS.GRAY_50,
    },
    subtitle: {
        fontSize: 14,
        color: COLORS.GRAY_400,
        fontFamily: FONT_FAMILY_MEDIUM,
        marginBottom: 20,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    serviceCard: {
        backgroundColor: COLORS.WHITE,
        borderRadius: 15,
        padding: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
        elevation: 2,
        shadowColor: COLORS.BLACK,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
    },
    serviceInfo: {
        flex: 1,
    },
    serviceName: {
        fontSize: 16,
        fontFamily: FONT_FAMILY_SEMIBOLD,
        color: COLORS.BLACK,
    },
    servicePrice: {
        fontSize: 14,
        fontFamily: FONT_FAMILY_EXTRABOLD,
        color: COLORS.PURPLE_600,
        marginTop: 4,
    },
    actions: {
        flexDirection: 'row',
    },
    actionBtn: {
        padding: 8,
        marginLeft: 10,
    },
    fab: {
        position: 'absolute',
        right: 16,
        left: 16,
    },
    fabGradient: {
        paddingVertical: 15,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 10,
    },
    fabText: {
        color: COLORS.WHITE,
        fontFamily: FONT_FAMILY_EXTRABOLD,
        fontSize: 16,
    },
    emptyContainer: {
        marginTop: 100,
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
        paddingBottom: 40,
    },
    modalTitle: {
        fontSize: 20,
        fontFamily: FONT_FAMILY_EXTRABOLD,
        color: COLORS.BLACK,
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontFamily: FONT_FAMILY_SEMIBOLD,
        color: COLORS.GRAY_600,
        marginBottom: 8,
    },
    input: {
        backgroundColor: COLORS.GRAY_50,
        borderRadius: 12,
        padding: 15,
        marginBottom: 20,
        fontFamily: FONT_FAMILY_MEDIUM,
        fontSize: 14,
        borderWidth: 1,
        borderColor: COLORS.GRAY_100,
    },
    modalFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    cancelBtn: {
        flex: 1,
        paddingVertical: 15,
        alignItems: 'center',
        marginRight: 10,
    },
    cancelBtnText: {
        fontFamily: FONT_FAMILY_SEMIBOLD,
        color: COLORS.GRAY_400,
    },
    saveBtn: {
        flex: 2,
        backgroundColor: COLORS.PURPLE_600,
        paddingVertical: 15,
        borderRadius: 12,
        alignItems: 'center',
    },
    saveBtnText: {
        color: COLORS.WHITE,
        fontFamily: FONT_FAMILY_EXTRABOLD,
    },
});

export default ManageServicesScreen;
