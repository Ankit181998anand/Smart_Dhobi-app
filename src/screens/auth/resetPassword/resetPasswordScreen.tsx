import React, { useState } from 'react';
import {
    View,
    SafeAreaView,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Alert,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../navigations/types';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { authService } from '../../../services/authService';
import Header from '../../../components/Header';
import GradientButton from '../../../components/GradientButton';
import InputField from '../../../components/InputField';
import COLORS from '../../../utils/constant';
import { SVG_ICON } from '../../../assets/Svg/svgIcon';
import styles from '../register/styles';

type ResetPasswordScreenProps = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'ResetPassword'>;
    route: { params: { email: string; otp: string } };
};

const ResetPasswordScreen = ({ navigation, route }: ResetPasswordScreenProps) => {
    const { email, otp } = route.params;
    const insets = useSafeAreaInsets();
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleReset = async () => {
        if (!newPassword || newPassword.length < 6) {
            Alert.alert('Error', 'Password must be at least 6 characters');
            return;
        }
        if (newPassword !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match');
            return;
        }

        try {
            setIsLoading(true);
            const response = await authService.resetPassword({
                email,
                otp,
                newPassword
            });
            setIsLoading(false);
            
            Alert.alert('Success', response.message || 'Password reset successful', [
                {
                    text: 'OK',
                    onPress: () => navigation.navigate('Login')
                }
            ]);
        } catch (error: any) {
            setIsLoading(false);
            Alert.alert('Error', error.response?.data?.message || 'Failed to reset password');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={{ height: insets.top, backgroundColor: '#f6f0fc' }} />
            <View style={styles.rightSection}>
                <Header
                    title="Reset Password"
                    subtitle="Create a new secure password"
                    textStyle={{ textAlign: 'center' }}
                />

                <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                >
                    <ScrollView
                        style={{ flex: 1 }}
                        contentContainerStyle={{ paddingBottom: 50, paddingTop: 20 }}
                    >
                        <View style={styles.inputContainer}>
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
                                title="Reset Password"
                                onPress={handleReset}
                                type="filled"
                                loading={isLoading}
                                rightIcon={SVG_ICON.arrow_Right(COLORS.WHITE)}
                            />
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </View>
        </SafeAreaView>
    );
};

export default ResetPasswordScreen;
