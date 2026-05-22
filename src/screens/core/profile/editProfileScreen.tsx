import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
    ActivityIndicator,
    StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../navigations/types';
import COLORS, { FONT_FAMILY_EXTRABOLD, FONT_FAMILY_MEDIUM, FONT_FAMILY_SEMIBOLD } from '../../../utils/constant';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../redux/store';
import { updateUser } from '../../../redux/slices/authSlice';
import { userService } from '../../../services/userService';
import InputField from '../../../components/InputField';
import { SvgXml } from 'react-native-svg';
import { SVG_ICON } from '../../../assets/Svg/svgIcon';
import Header from '../../../components/Header';
import LinearGradient from 'react-native-linear-gradient';
import { showMessage } from 'react-native-flash-message';

const EditProfileScreen = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const insets = useSafeAreaInsets();
    const dispatch = useDispatch();
    const { user } = useSelector((state: RootState) => state.auth);

    const [isLoading, setIsLoading] = useState(false);
    const [name, setName] = useState(user?.name || '');
    const [mobile, setMobile] = useState(user?.mobile || '');
    const [location, setLocation] = useState(user?.serviceAreas || '');

    const handleSave = async () => {
        if (!name || !mobile) {
            showMessage({
                message: "Error",
                description: "Name and Mobile are required",
                type: "danger",
            });
            return;
        }

        try {
            setIsLoading(true);
            const response = await userService.updateProfile({
                name,
                mobile,
                serviceAreas: location
            });
            
            // Update Redux state
            if (response && response.user) {
                dispatch(updateUser(response.user));
            }

            showMessage({
                message: "Success",
                description: "Profile updated successfully!",
                type: "success",
            });
            navigation.goBack();
        } catch (error) {
            console.error("Update profile error:", error);
            showMessage({
                message: "Error",
                description: "Failed to update profile",
                type: "danger",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
            <StatusBar barStyle="dark-content" />
            <Header
                title="Edit Profile"
                isLeftIcon
                leftIconSource={SVG_ICON.arrow_back(COLORS.BLACK)}
                onLeftPress={() => navigation.goBack()}
            />

            <ScrollView contentContainerStyle={{ padding: 20 }}>
                <View style={styles.avatarSection}>
                    <View style={styles.avatarLarge}>
                        <Text style={styles.avatarTextLarge}>{name.charAt(0).toUpperCase()}</Text>
                        <TouchableOpacity style={styles.editBadge}>
                            <SvgXml xml={SVG_ICON.Edit_Icon(COLORS.WHITE)} width={12} height={12} />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.infoText}>Update your personal and business details</Text>
                </View>

                <View style={styles.form}>
                    <InputField
                        label="Full Name"
                        placeholder="Enter your name"
                        value={name}
                        onChangeText={setName}
                        iconSource={SVG_ICON.PerSon_Add(COLORS.GRAY_400)}
                    />

                    <InputField
                        label="Mobile Number"
                        placeholder="Enter mobile number"
                        value={mobile}
                        onChangeText={setMobile}
                        keyboardType="phone-pad"
                        maxLength={10}
                        iconSource={SVG_ICON.Call_Icon(COLORS.GRAY_400)}
                    />

                    <InputField
                        label="Service Location / Area"
                        placeholder="Enter your service area"
                        value={location}
                        onChangeText={setLocation}
                        iconSource={SVG_ICON.Location_Icon(COLORS.GRAY_400)}
                    />

                    <InputField
                        label="Email Address (Protected)"
                        value={user?.email || ''}
                        editable={false}
                        iconSource={SVG_ICON.mail_Icon(COLORS.GRAY_400)}
                    />
                </View>
            </ScrollView>

            <View style={[styles.footer, { paddingBottom: insets.bottom + 10 }]}>
                <TouchableOpacity onPress={handleSave} disabled={isLoading}>
                    <LinearGradient
                        colors={['#4F46E5', '#7C3AED']}
                        style={styles.saveBtn}
                    >
                        {isLoading ? (
                            <ActivityIndicator color={COLORS.WHITE} />
                        ) : (
                            <Text style={styles.saveBtnText}>Save Changes</Text>
                        )}
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
    avatarSection: {
        alignItems: 'center',
        marginVertical: 20,
    },
    avatarLarge: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: COLORS.PURPLE_50,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.PURPLE_100,
    },
    avatarTextLarge: {
        fontSize: 40,
        fontFamily: FONT_FAMILY_EXTRABOLD,
        color: COLORS.PURPLE_600,
    },
    editBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: COLORS.PURPLE_600,
        padding: 8,
        borderRadius: 20,
        borderWidth: 3,
        borderColor: COLORS.WHITE,
    },
    infoText: {
        marginTop: 12,
        fontSize: 13,
        color: COLORS.GRAY_400,
        fontFamily: FONT_FAMILY_MEDIUM,
    },
    form: {
        marginTop: 10,
    },
    inputGroup: {
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
        fontSize: 15,
        fontFamily: FONT_FAMILY_MEDIUM,
        borderWidth: 1,
        borderColor: COLORS.GRAY_100,
    },
    disabledInput: {
        color: COLORS.GRAY_400,
        backgroundColor: COLORS.GRAY_50,
    },
    footer: {
        padding: 20,
    },
    saveBtn: {
        paddingVertical: 16,
        borderRadius: 15,
        alignItems: 'center',
    },
    saveBtnText: {
        color: COLORS.WHITE,
        fontSize: 16,
        fontFamily: FONT_FAMILY_EXTRABOLD,
    },
});

export default EditProfileScreen;
