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

type ForgotPasswordScreenProps = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'ForgotPassword'>;
};

const ForgotPasswordScreen = ({ navigation }: ForgotPasswordScreenProps) => {
    const insets = useSafeAreaInsets();
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSendOTP = async () => {
        if (!email || !email.includes('@')) {
            Alert.alert('Error', 'Please enter a valid email address');
            return;
        }

        try {
            setIsLoading(true);
            const response = await authService.forgotPassword(email);
            setIsLoading(false);

            Alert.alert('Success', response.message || 'OTP sent to email', [
                {
                    text: 'OK',
                    onPress: () => navigation.navigate('VerifyOTP', { email, fromRegister: false })
                }
            ]);
        } catch (error: any) {
            setIsLoading(false);
            Alert.alert('Error', error.response?.data?.message || 'Failed to send OTP');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={{ height: insets.top, backgroundColor: '#f6f0fc' }} />
            <View style={styles.rightSection}>
                <Header
                    title="Forgot Password"
                    subtitle="Enter your email to receive an OTP"
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
                                label="Email Address"
                                placeholder="your.email@example.com"
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                iconSource={SVG_ICON.mail_Icon(COLORS.DarkGray)}
                            />

                            <View style={{ height: 40 }} />

                            <GradientButton
                                title="Send Verification Code"
                                onPress={handleSendOTP}
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

export default ForgotPasswordScreen;
