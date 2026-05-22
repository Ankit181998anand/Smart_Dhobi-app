import React, { useState, useEffect, useCallback } from 'react';
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
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../redux/store';
import { logout, updateUser } from '../../../redux/slices/authSlice';
import COLORS, { FONT_FAMILY_EXTRABOLD, FONT_FAMILY_SEMIBOLD } from '../../../utils/constant';
import { SvgXml } from 'react-native-svg';
import { SVG_ICON } from '../../../assets/Svg/svgIcon';
import LinearGradient from 'react-native-linear-gradient';

import { CommonActions, useIsFocused } from '@react-navigation/native';
import { ProfileScreenProps } from '../../../navigations/types';
import { userService } from '../../../services/userService';
import { providerService } from '../../../services/providerService';

const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation, route }) => {
    const { type } = route.params;
    const insets = useSafeAreaInsets();
    const { user } = useSelector((state: RootState) => state.auth);
    const dispatch = useDispatch();
    const isFocused = useIsFocused();

    const [profileData, setProfileData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchProfile = useCallback(async () => {
        try {
            setIsLoading(true);
            if (type === 'dhobi') {
                const providerId = user?.mainUserId || user?._id || '';
                const response = await providerService.getProfile(providerId);
                const providerData = (response.data || response.provider || response) as any;
                setProfileData(providerData);
            } else {
                const response = await userService.getProfile();
                setProfileData(response.user);
                // Sync Redux
                if (response.user) {
                    dispatch(updateUser(response.user));
                }
            }
        } catch (error) {
            console.error("Profile fetch error:", error);
        } finally {
            setIsLoading(false);
        }
    }, [type, user?._id, user?.mainUserId, dispatch]);

    useEffect(() => {
        if (isFocused) {
            fetchProfile();
        }
    }, [isFocused, fetchProfile]);

    const handleLogout = () => {
        Alert.alert(
            "Logout",
            "Are you sure you want to logout?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Logout",
                    style: "destructive",
                    onPress: () => {
                        dispatch(logout());
                        navigation.dispatch(
                            CommonActions.reset({
                                index: 0,
                                routes: [{ name: 'ChooseRole' }],
                            })
                        );
                    }
                }
            ]
        );
    };

    interface ProfileItemProps {
        icon: string;
        title: string;
        onPress: () => void;
        color?: string;
    }

    const ProfileItem = ({ icon, title, onPress, color = COLORS.BLACK }: ProfileItemProps) => (
        <TouchableOpacity style={styles.profileItem} onPress={onPress}>
            <View style={styles.itemLeft}>
                <View style={[styles.iconBox, { backgroundColor: COLORS.GRAY_50 }]}>
                    <SvgXml xml={icon} width={20} height={20} />
                </View>
                <Text style={[styles.itemTitle, { color }]}>{title}</Text>
            </View>
            <SvgXml xml={SVG_ICON.arrow_Right(COLORS.GRAY_400)} width={16} height={16} />
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 40 }}
            >
                {/* Modern Fluid Header */}
                <View style={styles.headerWrapper}>
                    <LinearGradient
                        colors={[COLORS.PURPLE_600, COLORS.PINK_600]}
                        style={[styles.headerBackground, { paddingTop: insets.top + 10 }]}
                        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                    >
                        <Text style={styles.headerTitle}>My Profile</Text>
                    </LinearGradient>

                    <View style={styles.avatarContainer}>
                        <View style={styles.avatarLarge}>
                            <Text style={styles.avatarTextLarge}>{(profileData?.name || user?.name)?.charAt(0).toUpperCase()}</Text>
                        </View>
                    </View>
                </View>

                {/* User Info Section */}
                <View style={styles.userInfoSection}>
                    {isLoading && !profileData ? (
                        <ActivityIndicator size="small" color={COLORS.PURPLE_600} style={{ marginBottom: 10 }} />
                    ) : (
                        <>
                            <Text style={styles.userName}>{profileData?.name || user?.name}</Text>
                            <Text style={styles.userEmail}>{profileData?.email || user?.email}</Text>
                        </>
                    )}
                    <View style={styles.roleBadge}>
                        <LinearGradient
                            colors={[COLORS.PURPLE_600, COLORS.PINK_500]}
                            style={styles.roleBadgeGradient}
                            start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                        >
                            <Text style={styles.roleText}>{user?.role?.toUpperCase()}</Text>
                        </LinearGradient>
                    </View>
                </View>

                <View style={styles.menuSection}>
                    <Text style={styles.sectionTitle}>Account Settings</Text>
                    <ProfileItem
                        icon={SVG_ICON.PerSon_Add(COLORS.PURPLE_600)}
                        title="Edit Profile"
                        onPress={() => (navigation as any).navigate('EditProfile')}
                    />
                    {/* <ProfileItem
                        icon={SVG_ICON.Location_Icon(COLORS.PURPLE_600)}
                        title="My Addresses"
                        onPress={() => (navigation as any).navigate('AddressList', { fromCheckout: false })}
                    /> */}
                    <ProfileItem
                        icon={SVG_ICON.secure_Icon(COLORS.PURPLE_600)}
                        title="Change Password"
                        onPress={() => (navigation as any).navigate('ChangePassword')}
                    />
                </View>

                {type === 'dhobi' && (
                    <View style={styles.menuSection}>
                        <Text style={styles.sectionTitle}>Business Info</Text>
                        <ProfileItem
                            icon={SVG_ICON.Setting_Icon(COLORS.BLUE_600)}
                            title="Service Management"
                            onPress={() => (navigation as any).navigate('ManageServices')}
                        />
                        {/* <ProfileItem
                            icon={SVG_ICON.Star_Icon(COLORS.BLUE_600)}
                            title="Earnings & Analytics"
                            onPress={() => { }}
                        /> */}
                    </View>
                )}

                <View style={styles.menuSection}>
                    <Text style={styles.sectionTitle}>Support</Text>
                    <ProfileItem
                        icon={SVG_ICON.mail_Icon(COLORS.GREEN_600)}
                        title="Contact Us"
                        onPress={() => (navigation as any).navigate('ContactUs')}
                    />
                    <ProfileItem
                        icon={SVG_ICON.Check_Circle(COLORS.GREEN_600)}
                        title="Terms & Conditions"
                        onPress={() => (navigation as any).navigate('TermsOfService')}
                    />
                    <ProfileItem
                        icon={SVG_ICON.secure_Icon(COLORS.GREEN_600)}
                        title="Privacy Policy"
                        onPress={() => (navigation as any).navigate('PrivacyPolicy')}
                    />
                </View>

            </ScrollView>

            <View style={[styles.logoutContainer, { paddingBottom: insets.bottom + 20 }]}>
                <TouchableOpacity
                    style={styles.logoutBtn}
                    onPress={handleLogout}
                    activeOpacity={0.8}
                >
                    <LinearGradient
                        colors={[COLORS.PURPLE_600, COLORS.PINK_600]}
                        style={styles.logoutGradient}
                        start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                    >
                        <SvgXml xml={SVG_ICON.Check_Circle(COLORS.WHITE)} width={20} height={20} />
                        <Text style={styles.logoutBtnText}>Logout</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.WHITE,
    },
    scrollView: {
        flex: 1,
    },
    headerWrapper: {
        width: '100%',
        alignItems: 'center',
    },
    headerBackground: {
        width: '100%',
        height: 180,
        alignItems: 'center',
        borderBottomLeftRadius: 450,
        borderBottomRightRadius: 10,
    },
    headerTitle: {
        fontSize: 22,
        fontFamily: FONT_FAMILY_EXTRABOLD,
        color: COLORS.WHITE,
    },
    avatarContainer: {
        marginTop: -40,
        padding: 5,
        backgroundColor: COLORS.WHITE,
        borderRadius: 55,
        elevation: 10,
        shadowColor: COLORS.BLACK,
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
    },
    avatarLarge: {
        width: 50,
        height: 50,
        borderRadius: 50,
        backgroundColor: COLORS.PURPLE_50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarTextLarge: {
        fontSize: 40,
        fontFamily: FONT_FAMILY_EXTRABOLD,
        color: COLORS.PURPLE_600,
    },
    userInfoSection: {
        alignItems: 'center',
        marginTop: 15,
        marginBottom: 20,
    },
    userName: {
        fontSize: 24,
        fontFamily: FONT_FAMILY_EXTRABOLD,
        color: COLORS.BLACK,
    },
    userEmail: {
        fontSize: 16,
        color: COLORS.GRAY_500,
        marginTop: 4,
    },
    roleBadge: {
        marginTop: 12,
    },
    roleBadgeGradient: {
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 20,
    },
    roleText: {
        color: COLORS.WHITE,
        fontSize: 12,
        fontFamily: FONT_FAMILY_EXTRABOLD,
    },
    menuSection: {
        paddingHorizontal: 16,
        marginTop: 20,
    },
    sectionTitle: {
        fontSize: 14,
        fontFamily: FONT_FAMILY_EXTRABOLD,
        color: COLORS.GRAY_400,
        marginBottom: 10,
        marginLeft: 4,
    },
    profileItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 5,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.GRAY_50,
    },
    itemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconBox: {
        width: 40,
        height: 40,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    itemTitle: {
        fontSize: 15,
        fontFamily: FONT_FAMILY_SEMIBOLD,
    },
    logoutContainer: {
        paddingHorizontal: 20,
        backgroundColor: COLORS.WHITE,
        borderTopWidth: 1,
        borderTopColor: COLORS.GRAY_50,
        paddingTop: 15,
    },
    logoutBtn: {
        borderRadius: 15,
        overflow: 'hidden',
        elevation: 4,
        shadowColor: COLORS.RED,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
    },
    logoutGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 15,
    },
    logoutBtnText: {
        color: COLORS.WHITE,
        fontSize: 16,
        fontFamily: FONT_FAMILY_EXTRABOLD,
        marginLeft: 10,
    },
});

export default ProfileScreen;
