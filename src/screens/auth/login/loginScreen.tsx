import React, { useEffect, useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StatusBar,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../navigations/types';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import styles from '../register/styles';
import Header from '../../../components/Header';
import { Formik } from 'formik';
import { loginSchema } from '../../../utils/validationSchema';
import InputField from '../../../components/InputField';
import GradientButton from '../../../components/GradientButton';
import COLORS from '../../../utils/constant';
import { SH } from '../../../utils/Dimensions';
import { useIsFocused } from '@react-navigation/native';
import { SVG_ICON } from '../../../assets/Svg/svgIcon';
import { authService } from '../../../services/authService';
import { useDispatch } from 'react-redux';
import { loginFailure, loginStart, loginSuccess } from '../../../redux/slices/authSlice';

type LoginScreenProps = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'Login'>;
};

type LoginValues = {
    email: string;
    password: string;
};

const LoginScreen = ({ navigation }: LoginScreenProps) => {
    const insets = useSafeAreaInsets();
    const isFocused = useIsFocused();
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isFocused) {
            StatusBar.setBarStyle('dark-content');
            StatusBar.setBackgroundColor('transparent');
            StatusBar.setTranslucent(true);
        }
    }, [isFocused]);

    const handleLogin = async (values: LoginValues) => {
        try {
            setIsLoading(true);
            dispatch(loginStart());

            const response = await authService.login(values);

            // Logic from docs: mainUserId mapping
            const userData = response.user;
            const role = userData.role;
            const mainUserId = response.mainUserId;

            dispatch(loginSuccess({
                token: response.token,
                user: {
                    ...userData,
                    mainUserId
                }
            }));

            setIsLoading(false);

            // Navigation based on role
            const mappedRole = (role === 'user' ? 'customer' : role) as 'customer' | 'dhobi';
            navigation.replace("MainTabs", {
                type: mappedRole,
                screen: 'Dashboard',
                params: { type: mappedRole }
            });

        } catch (error: any) {
            console.error("Login error:", error);
            setIsLoading(false);
            const errorMsg = error.response?.data?.message;
            dispatch(loginFailure(errorMsg));
            Alert.alert("Login Failed", errorMsg);
        }
    };

    return (
        <SafeAreaView style={[styles.container,]}>
            <View style={{ height: insets.top, backgroundColor: '#f6f0fc', }} />

            <View style={styles.rightSection}>
                <Header
                    title="Welcome Back"
                    subtitle="Sign in to your Smart Dhobi account"
                    textStyle={{ textAlign: 'center' }}
                />
                <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
                >
                    <ScrollView
                        style={{ flex: 1 }}
                        contentContainerStyle={{ paddingBottom: SH(50) }}
                        keyboardShouldPersistTaps="handled"
                        showsVerticalScrollIndicator={false}
                    >
                        <Formik
                            initialValues={{
                                email: '',
                                password: '',
                            }}
                            validationSchema={loginSchema}
                            onSubmit={handleLogin}
                        >
                            {({ handleChange, handleSubmit, values, errors, touched }) => (
                                <View style={styles.inputContainer}>
                                    <InputField
                                        label="Email Address"
                                        placeholder="your.email@example.com"
                                        iconSource={SVG_ICON.mail_Icon(COLORS.DarkGray)}
                                        value={values.email}
                                        onChangeText={handleChange('email')}
                                        keyboardType={'email-address'}
                                    />
                                    {touched.email && errors.email && (
                                        <Text style={styles.error}>{errors.email}</Text>
                                    )}

                                    <InputField
                                        label="Password"
                                        placeholder="••••••"
                                        isPassword
                                        iconSource={SVG_ICON.lock_Icon(COLORS.DarkGray)}
                                        value={values.password}
                                        onChangeText={handleChange('password')}
                                        keyboardType={'default'}
                                    />
                                    {touched.password && errors.password && (
                                        <Text style={styles.error}>{errors.password}</Text>
                                    )}

                                    <TouchableOpacity
                                        style={styles.forgotBtn}
                                        onPress={() => navigation.navigate('ForgotPassword')}
                                    >
                                        <Text style={styles.forgotText}>Forgot password?</Text>
                                    </TouchableOpacity>

                                    <GradientButton
                                        title="Sign in to Dashboard"
                                        onPress={handleSubmit as any}
                                        type="filled"
                                        containerStyle={{ marginBottom: SH(10) }}
                                        rightIcon={SVG_ICON.arrow_Right(COLORS.WHITE)}
                                        loading={isLoading}
                                    />

                                    <View style={styles.loginWrapper}>
                                        <Text style={styles.loginText}>Don't have an account? </Text>
                                        <TouchableOpacity onPress={() => navigation.navigate('ChooseRole')}>
                                            <Text style={styles.loginLink}>Register</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            )}
                        </Formik>
                    </ScrollView>
                </KeyboardAvoidingView>
            </View>
        </SafeAreaView>
    );
};

export default LoginScreen;
