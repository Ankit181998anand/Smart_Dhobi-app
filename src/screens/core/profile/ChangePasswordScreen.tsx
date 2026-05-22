import React, { useState } from 'react';
import {
    View,
    SafeAreaView,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { authService } from '../../../services/authService';
import Header from '../../../components/Header';
import GradientButton from '../../../components/GradientButton';
import InputField from '../../../components/InputField';
import COLORS from '../../../utils/constant';
import { SVG_ICON } from '../../../assets/Svg/svgIcon';
import styles from '../../auth/register/styles';

const ChangePasswordScreen = ({ navigation }: any) => {
    const insets = useSafeAreaInsets();
    const { user } = useSelector((state: RootState) => state.auth);
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [otpSent, setOtpSent] = useState(false);

    const handleSendOTP = async () => {
        if (!user?.email) return;

        try {
            setIsLoading(true);
            const response = await authService.forgotPassword(user.email);
            console.log("response", response)
            setIsLoading(false);
            setOtpSent(true);
            Alert.alert('Success', 'OTP has been sent to your email.');
        } catch (error: any) {
            setIsLoading(false);
            Alert.alert('Error', error.response?.data?.message || 'Failed to send OTP');
        }
    };

    const handleChangePassword = async () => {
        if (!otp || otp.length < 6) {
            Alert.alert('Error', 'Please enter a valid 6-digit OTP');
            return;
        }
        if (!newPassword || newPassword.length < 6) {
            Alert.alert('Error', 'New password must be at least 6 characters');
            return;
        }
        if (newPassword !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match');
            return;
        }

        try {
            setIsLoading(true);
            await authService.resetPassword({
                email: user?.email,
                otp,
                newPassword
            });
            setIsLoading(false);

            Alert.alert('Success', 'Your password has been changed successfully.', [
                {
                    text: 'OK',
                    onPress: () => navigation.goBack()
                }
            ]);
        } catch (error: any) {
            setIsLoading(false);
            Alert.alert('Error', error.response?.data?.message || 'Failed to change password');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={{ height: insets.top, backgroundColor: '#f6f0fc' }} />
            <View style={styles.rightSection}>
                <Header
                    title="Change Password"
                    subtitle="Secure your account with a new password"
                    textStyle={{ textAlign: 'center' }}
                    isLeftIcon
                    onLeftPress={() => navigation.goBack()}
                />

                <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                >
                    <ScrollView
                        style={{ flex: 1 }}
                        contentContainerStyle={{ paddingBottom: 50, paddingTop: 20 }}
                        showsVerticalScrollIndicator={false}
                    >
                        <View style={styles.inputContainer}>
                            <InputField
                                label="Registered Email"
                                value={user?.email || ''}
                                editable={false}
                                iconSource={SVG_ICON.mail_Icon(COLORS.GRAY_100)}
                            />

                            <View style={{ marginTop: 10 }}>
                                <GradientButton
                                    title={otpSent ? "Resend OTP" : "Send OTP to Email"}
                                    onPress={handleSendOTP}
                                    type="outlined"
                                    loading={isLoading && !otpSent}
                                    containerStyle={{ height: 45 }}
                                />
                            </View>

                            {otpSent && (
                                <View style={{ marginTop: 30 }}>
                                    <InputField
                                        label="Enter OTP"
                                        placeholder="123456"
                                        value={otp}
                                        onChangeText={setOtp}
                                        keyboardType="number-pad"
                                        iconSource={SVG_ICON.Check_Circle(COLORS.DarkGray)}
                                    />

                                    <InputField
                                        label="New Password"
                                        placeholder="••••••••"
                                        isPassword
                                        value={newPassword}
                                        onChangeText={setNewPassword}
                                        iconSource={SVG_ICON.lock_Icon(COLORS.DarkGray)}
                                    />

                                    <InputField
                                        label="Confirm New Password"
                                        placeholder="••••••••"
                                        isPassword
                                        value={confirmPassword}
                                        onChangeText={setConfirmPassword}
                                        iconSource={SVG_ICON.lock_Icon(COLORS.DarkGray)}
                                    />

                                    <View style={{ height: 40 }} />

                                    <GradientButton
                                        title="Update Password"
                                        onPress={handleChangePassword}
                                        type="filled"
                                        loading={isLoading && otpSent}
                                        rightIcon={SVG_ICON.arrow_Right(COLORS.WHITE)}
                                    />
                                </View>
                            )}
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </View>
        </SafeAreaView>
    );
};

export default ChangePasswordScreen;
