import React, { useState, useEffect, useCallback } from "react";
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StatusBar,
    Text,
    View,
    TouchableOpacity
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useIsFocused } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Formik } from "formik";
import { RootStackParamList } from "../../../navigations/types";
import { authService } from "../../../services/authService";
import { SVG_ICON } from "../../../assets/Svg/svgIcon";
import COLORS from "../../../utils/constant";
import { getAddressFromCoordinates, requestAndFetchLocation, LocationResult } from "../../../utils/locationHelper";
import { registrationSchema } from "../../../utils/validationSchema";
import * as Yup from 'yup';

type RegistrationValues = Yup.InferType<typeof registrationSchema>;

import Header from "../../../components/Header";
import InputField from "../../../components/InputField";
import GradientButton from "../../../components/GradientButton";
import styles from "./styles";

type CustomerRegisterScreenProps = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'CustomerRegister'>;
};

const AutoFetchLocation = ({ onMount, setFieldValue }: { onMount: (setFieldValue: any) => void, setFieldValue: any }) => {
    useEffect(() => {
        onMount(setFieldValue);
    }, [onMount, setFieldValue]);
    return null;
};

const CustomerRegisterScreen = ({ navigation }: CustomerRegisterScreenProps) => {
    const insets = useSafeAreaInsets();
    const isFocused = useIsFocused();

    const [isRegistering, setIsRegistering] = useState(false);
    const [loadingLocation, setLoadingLocation] = useState(false);

    useEffect(() => {
        if (isFocused) {
            StatusBar.setBarStyle('dark-content');
            StatusBar.setBackgroundColor('transparent');
            StatusBar.setTranslucent(true);
        }
    }, [isFocused]);

    const handleRegister = async (values: RegistrationValues) => {
        try {
            setIsRegistering(true);

            const payload = {
                name: values.fullName,
                email: values.email,
                password: values.password,
                mobile: values.mobile,
                serviceAreas: values.address,
                location: {
                    coordinates: values.coordinates || [86.2029, 22.8046]
                },
                role: "user"
            };

            const response = await authService.register(payload);
            console.log("[CUSTOMER REGISTER] Response:", response);
            setIsRegistering(false);

            Alert.alert('Registration Successful', response.message || 'OTP sent for verification', [
                {
                    text: 'Verify OTP',
                    onPress: () => navigation.navigate('VerifyOTP', { email: values.email, fromRegister: true })
                }
            ]);
        } catch (error: any) {
            setIsRegistering(false);
            console.error('Registration error:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Registration failed';
            Alert.alert('Error', errorMessage);
        }
    };

    const handleFindAddress = useCallback(async (setFieldValue: (field: string, value: any) => void) => {
        try {
            setLoadingLocation(true);
            const result: LocationResult = await requestAndFetchLocation();
            if (result.error) {
                // Don't show alert on auto-fetch failure to avoid annoying the user on load
                // Alert.alert('Error', 'Location permission denied or unavailable');
                return;
            }
            if (result.coords) {
                const { latitude, longitude } = result.coords;
                const fetchedAddress = await getAddressFromCoordinates(latitude, longitude);
                setFieldValue('address', fetchedAddress);
                setFieldValue('coordinates', [longitude, latitude]);
            }
        } catch (error: unknown) {
            console.error("Location error:", error);
        } finally {
            setLoadingLocation(false);
        }
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <View style={{ height: insets.top, backgroundColor: '#f6f0fc' }} />
            <Header
                title="Create Account"
                subtitle="Join Smart Dhobi as a Customer"
                isLeftIcon
                leftIconSource={SVG_ICON.arrow_back(COLORS.BLACK)}
                onLeftPress={() => navigation.goBack()}
            />

            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
            >
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1, paddingBottom: 50 }}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <Formik
                        initialValues={{
                            fullName: '',
                            email: '',
                            mobile: '',
                            address: '',
                            password: '',
                            confirmPassword: '',
                            coordinates: [86.2029, 22.8046], // Default Jamshedpur coordinates
                        }}
                        validationSchema={registrationSchema}
                        onSubmit={handleRegister}
                    >
                        {({ handleChange, handleSubmit, values, errors, touched, setFieldValue }) => (
                            <View style={styles.inputContainer}>
                                <AutoFetchLocation setFieldValue={setFieldValue} onMount={handleFindAddress} />
                                <InputField
                                    label="Full Name"
                                    placeholder="Enter your full name"
                                    iconSource={SVG_ICON.PerSon_Add(COLORS.GRAY_400)}
                                    value={values.fullName}
                                    onChangeText={handleChange('fullName')}
                                />
                                {touched.fullName && errors.fullName && (
                                    <Text style={styles.error}>{errors.fullName}</Text>
                                )}

                                <InputField
                                    label="Email Address"
                                    placeholder="your.email@example.com"
                                    iconSource={SVG_ICON.mail_Icon(COLORS.GRAY_400)}
                                    value={values.email}
                                    onChangeText={handleChange('email')}
                                    keyboardType={'email-address'}
                                />
                                {touched.email && errors.email && (
                                    <Text style={styles.error}>{errors.email}</Text>
                                )}

                                <InputField
                                    label="Mobile Number"
                                    placeholder="10-digit mobile number"
                                    iconSource={SVG_ICON.Call_Icon(COLORS.GRAY_400)}
                                    value={values.mobile}
                                    onChangeText={handleChange('mobile')}
                                    keyboardType={'number-pad'}
                                    maxLength={10}
                                />
                                {touched.mobile && errors.mobile && (
                                    <Text style={styles.error}>{errors.mobile}</Text>
                                )}

                                <InputField
                                    label="Complete Address"
                                    placeholder={loadingLocation ? "Searching..." : "Home/Work/Other Address"}
                                    iconSource={SVG_ICON.Location_Icon(COLORS.GRAY_400)}
                                    value={values.address}
                                    onChangeText={handleChange('address')}
                                    onIconPress={() => handleFindAddress(setFieldValue)}
                                    loading={loadingLocation}
                                />
                                {touched.address && errors.address && (
                                    <Text style={styles.error}>{errors.address}</Text>
                                )}

                                <InputField
                                    label="Password"
                                    placeholder="••••••"
                                    isPassword
                                    iconSource={SVG_ICON.lock_Icon(COLORS.GRAY_400)}
                                    value={values.password}
                                    onChangeText={handleChange('password')}
                                />
                                {touched.password && errors.password && (
                                    <Text style={styles.error}>{errors.password}</Text>
                                )}

                                <InputField
                                    label="Confirm Password"
                                    placeholder="••••••"
                                    isPassword
                                    iconSource={SVG_ICON.lock_Icon(COLORS.GRAY_400)}
                                    value={values.confirmPassword}
                                    onChangeText={handleChange('confirmPassword')}
                                />
                                {touched.confirmPassword && errors.confirmPassword && (
                                    <Text style={styles.error}>{errors.confirmPassword}</Text>
                                )}

                                <GradientButton
                                    title="Sign Up as Customer"
                                    onPress={() => handleSubmit()}
                                    type="filled"
                                    containerStyle={{ marginTop: 20 }}
                                    loading={isRegistering}
                                    rightIcon={SVG_ICON.arrow_Right(COLORS.WHITE)}
                                />

                                <View style={styles.loginWrapper}>
                                    <Text style={styles.loginText}>Already have an account? </Text>
                                    <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                                        <Text style={styles.loginLink}>Login</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )}
                    </Formik>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default CustomerRegisterScreen;