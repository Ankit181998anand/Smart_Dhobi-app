import React, { useEffect, useState } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../navigations/types";
import { useIsFocused } from "@react-navigation/native";
import { Alert, Image, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StatusBar, Text, TouchableOpacity, View, ActivityIndicator } from "react-native";
import styles from "./styles";
import Header from "../../../components/Header";
import { Formik, FormikErrors, FormikHelpers } from "formik";
import { dhobiRegistrationSchema } from "../../../utils/validationSchema";
import InputField from "../../../components/InputField";
import GradientButton from "../../../components/GradientButton";
import COLORS, { FONT_FAMILY_SEMIBOLD } from "../../../utils/constant";
import { SvgXml } from "react-native-svg";
import { SVG_ICON } from "../../../assets/Svg/svgIcon";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Yup from 'yup';
import { getAddressFromCoordinates, requestAndFetchLocation, openSettings, LocationResult } from "../../../utils/locationHelper";
import { providerService } from "../../../services/providerService";

type Service = { name: string; price: string };

type FormValues = {
    businessName: string;
    ownerName: string;
    email: string;
    mobile: string;
    password: string;
    address: string;
    serviceArea: string;
    latitude?: number | null;
    longitude?: number | null;
    services: Service[];
    accountHolderName: string;
    accountNumber: string;
    confirmAccountNumber: string;
    ifscCode: string;
    bankName: string;
    accountType: string;
    branchName: string;
};

type DhobiRegistrationScreenProps = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'DhobiRegistration'>;
};

interface StepObserverProps {
    step: number;
    onEnterStep2: (setFieldValue: (field: string, value: string | number | null) => void) => void;
    setFieldValue: (field: string, value: string | number | null) => void;
}

const StepObserver = ({ step, onEnterStep2, setFieldValue }: StepObserverProps) => {
    useEffect(() => {
        if (step === 2) {
            onEnterStep2(setFieldValue);
        }
    }, [step, onEnterStep2, setFieldValue]);
    return null;
};
const DhobiRegistrationScreen = ({ navigation }: DhobiRegistrationScreenProps) => {
    const isFocused = useIsFocused();
    const insets = useSafeAreaInsets();

    useEffect(() => {
        if (isFocused) {
            StatusBar.setBarStyle('dark-content');
            StatusBar.setBackgroundColor('transparent');
            StatusBar.setTranslucent(true);
        }
    }, [isFocused]);

    const getStepLabel = (step: number) => {
        switch (step) {
            case 1:
                return 'Basic Info';
            case 2:
                return 'Location';
            case 3:
                return 'Services';
            case 4:
                return 'Bank Details';
            default:
                return '';
        }
    };


    const [step, setStep] = useState<number>(1);
    const [locLoading, setLocLoading] = useState(false);

    const initialValues: FormValues = {
        businessName: '',
        ownerName: '',
        email: '',
        mobile: '',
        password: '',
        address: '',
        serviceArea: '',
        latitude: null,
        longitude: null,
        services: [{ name: '', price: '' }],
        accountHolderName: '',
        accountNumber: '',
        confirmAccountNumber: '',
        ifscCode: '',
        bankName: '',
        accountType: 'savings',
        branchName: '',
    };

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleNext = async (
        values: FormValues,
        helpers: FormikHelpers<FormValues>
    ) => {
        const currentSchema = dhobiRegistrationSchema(step);

        try {
            await currentSchema.validate(values, { abortEarly: false });

            if (step === 4) {
                try {
                    setIsSubmitting(true);

                    const pricing: Record<string, number> = {};
                    values.services.forEach(s => {
                        if (s.name) pricing[s.name.toLowerCase()] = parseInt(s.price) || 0;
                    });

                    const payload = {
                        name: values.businessName,
                        owner: values.ownerName,
                        email: values.email,
                        mobile: values.mobile,
                        password: values.password,
                        address: values.address,
                        serviceAreas: values.serviceArea,
                        location: {
                            type: "Point",
                            coordinates: [values.longitude || 86.2029, values.latitude || 22.8046]
                        },
                        services: values.services.filter(s => s.name && s.price),
                        pricing: pricing,
                        profilePicture: "https://example.com/default-profile.png",
                        joinDate: new Date().toISOString().split('T')[0],
                        images: [],
                        earnings: "0",
                        commissionRate: 0,
                        // Bank Details - flat fields
                        accountHolderName: values.accountHolderName,
                        accountNumber: values.accountNumber,
                        ifscCode: values.ifscCode,
                        bankName: values.bankName,
                        accountType: values.accountType,
                        branchName: values.branchName,
                        // Bank Details - nested object
                        bankDetails: {
                            accountHolderName: values.accountHolderName,
                            accountNumber: values.accountNumber,
                            ifscCode: values.ifscCode,
                            bankName: values.bankName,
                            accountType: values.accountType,
                            branchName: values.branchName,
                        }
                    };

                    const response = await providerService.create(payload);
                    console.log("[DHOBI REGISTER] Response:", response);
                    setIsSubmitting(false);

                    Alert.alert('Registration Submitted', response.message || 'Your registration is pending approval.', [
                        {
                            text: 'Go to Login',
                            onPress: () => navigation.navigate('Login')
                        }
                    ]);
                } catch (apiErr: any) {
                    setIsSubmitting(false);
                    const errorMessage = apiErr.response?.data?.message || apiErr.message || 'Registration failed';
                    Alert.alert('Error', errorMessage);
                }
                return;
            }

            setStep(prev => prev + 1);
        } catch (err) {
            if (err instanceof Yup.ValidationError) {
                const formErrors: Partial<Record<keyof FormValues, string>> = {};

                err.inner.forEach((e) => {
                    if (e.path) {
                        const key = e.path as keyof FormValues;
                        if (!formErrors[key]) {
                            formErrors[key] = e.message;
                        }
                    }
                });

                helpers.setErrors(formErrors as FormikErrors<FormValues>);
            } else {
                console.error(err);
            }
        }
    };

    const handleBack = () => {
        if (step > 1) setStep(step - 1);
    };

    const handleFindServiceArea = async (
        setFieldValue: FormikHelpers<FormValues>['setFieldValue']
    ) => {
        try {
            setLocLoading(true);
            const result: LocationResult = await requestAndFetchLocation();

            if (result.error) {
                if (result.error === 'PERMISSION_DENIED') {
                    Alert.alert(
                        'Permission Required',
                        'Location access is needed to find your service area automatically. Please grant permission when prompted.',
                        [{ text: 'OK' }]
                    );
                } else if (result.error === 'PERMISSION_BLOCKED') {
                    Alert.alert(
                        'Permission Blocked',
                        'Location permission has been permanently denied. Please enable it in the app settings to use this feature.',
                        [
                            { text: 'Cancel', style: 'cancel' },
                            { text: 'Open Settings', onPress: () => openSettings() }
                        ]
                    );
                } else {
                    Alert.alert('Error', 'Unable to fetch your current location. Please enter it manually.');
                }
                return;
            }

            if (result.coords) {
                const { latitude, longitude } = result.coords;
                const fetchedAddress = await getAddressFromCoordinates(latitude, longitude);

                setFieldValue('serviceArea', fetchedAddress);
                setFieldValue('latitude', latitude);
                setFieldValue('longitude', longitude);
            }
        } catch (error) {
            console.error('Location error:', error);
            Alert.alert('Error', 'Something went wrong while fetching location.');
        } finally {
            setLocLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={{ height: insets.top, backgroundColor: '#f6f0fc', }} />

            <Header
                title="Dhobi Registration"
                subtitle=""
                isLeftIcon
                isRightIcon
                leftIconSource={require('../../../assets/icons/stars_.png')}
                rightIconSource={require('../../../assets/icons/stars_.png')}
                textStyle={{ color: '#8f00ff', paddingHorizontal: 5 }}
                viewStyle={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}
                isGradientText
            />

            <View style={styles.progressWrapper}>
                <View style={styles.progressRow}>
                    {[1, 2, 3, 4].map((item) => (
                        <View key={item} style={styles.progressstepContainer}>
                            <View
                                style={[
                                    styles.circle,
                                    step >= item
                                        ? { backgroundColor: COLORS.PRIMARY }
                                        : { backgroundColor: '#E5E7EB' },
                                ]}
                            >
                                {step > item ? (

                                    <SvgXml xml={SVG_ICON.Check_Circle(COLORS.WHITE)} width={20} height={20} />

                                ) : (
                                    <Text
                                        style={[
                                            styles.circleText,
                                            step >= item ? { color: COLORS.WHITE } : { color: '#6B7280' },
                                        ]}
                                    >
                                        {item}
                                    </Text>
                                )}
                            </View>
                            <Text
                                style={[
                                    styles.stepLabel,
                                    step === item
                                        ? { color: '#000', fontFamily: FONT_FAMILY_SEMIBOLD }
                                        : { color: '#6B7280' },
                                ]}
                            >
                                {getStepLabel(item)}
                            </Text>
                        </View>
                    ))}
                </View>

                {/* Bottom progress bar */}
                <View style={styles.bottomBarContainer}>
                    <View
                        style={[
                            styles.bottomBarFill,
                            { width: `${(step - 1) * 33.33}%`, backgroundColor: COLORS.PRIMARY },
                        ]}
                    />
                </View>
            </View>

            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
            >
                <ScrollView
                    style={{ flex: 1 }}
                    contentContainerStyle={{ paddingBottom: 50 }}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <Formik
                        initialValues={initialValues}
                        validationSchema={dhobiRegistrationSchema(step)}
                        onSubmit={handleNext}
                    >
                        {({ handleChange, values, handleSubmit, errors, touched, setFieldValue, setFieldTouched }) => (
                            <View>
                                <StepObserver
                                    step={step}
                                    setFieldValue={setFieldValue}
                                    onEnterStep2={() => {
                                        // Only auto-fetch if the field is empty to avoid overwriting manual edits
                                        if (!values.serviceArea) {
                                            handleFindServiceArea(setFieldValue);
                                        }
                                    }}
                                />
                                {step === 1 && (
                                    <View style={styles.stepContainer}>
                                        <Text style={styles.stepTitle}>Basic Information</Text>
                                        <Text style={styles.stepSubtitle}>Tell us about your laundry business</Text>

                                        <InputField
                                            label="Business Name"
                                            placeholder="e.g., Clean & Fresh Laundry"
                                            placeholderTextColor={COLORS.DarkGray}
                                            value={values.businessName}
                                            onChangeText={handleChange('businessName')}
                                            keyboardType={'name-phone-pad'}
                                        />
                                        {touched.businessName && errors.businessName && (
                                            <Text style={styles.error}>{errors.businessName}</Text>
                                        )}
                                        <InputField
                                            label="Owner Name"
                                            placeholder="Owner's full name"
                                            placeholderTextColor={COLORS.DarkGray}
                                            value={values.ownerName}
                                            onChangeText={handleChange('ownerName')}
                                            keyboardType={'name-phone-pad'}
                                        />
                                        {touched.ownerName && errors.ownerName && (
                                            <Text style={styles.error}>{errors.ownerName}</Text>
                                        )}
                                        <InputField
                                            label="Email Address"
                                            placeholder="your@email.com"
                                            placeholderTextColor={COLORS.DarkGray}
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
                                            placeholderTextColor={COLORS.DarkGray}
                                            value={values.mobile}
                                            maxLength={10}
                                            onChangeText={handleChange('mobile')}
                                            keyboardType={'number-pad'}
                                        />
                                        {touched.mobile && errors.mobile && (
                                            <Text style={styles.error}>{errors.mobile}</Text>
                                        )}
                                        <InputField
                                            label="Password"
                                            placeholderTextColor={COLORS.DarkGray}
                                            placeholder="******"
                                            value={values.password}
                                            isPassword
                                            onChangeText={handleChange('password')}
                                            keyboardType={'default'}
                                        />
                                        {touched.password && errors.password && (
                                            <Text style={styles.error}>{errors.password}</Text>
                                        )}
                                        <InputField
                                            label="Business Address"
                                            placeholderTextColor={COLORS.DarkGray}
                                            placeholder="Full address here"
                                            value={values.address}
                                            onChangeText={handleChange('address')}
                                            keyboardType={'default'}
                                        />
                                        {touched.address && errors.address && (
                                            <Text style={styles.error}>{errors.address}</Text>
                                        )}
                                    </View>
                                )}

                                {step === 2 && (
                                    <View style={styles.stepContainer}>
                                        <Text style={styles.stepTitle}>Location & Service Area</Text>
                                        <Text style={styles.stepSubtitle}>Define your service coverage area</Text>

                                        <InputField
                                            label="Service Areas"
                                            placeholderTextColor={COLORS.DarkGray}
                                            placeholder={locLoading ? 'Fetching address...' : 'Your service coverage area'}
                                            value={values.serviceArea}
                                            onChangeText={handleChange('serviceArea')}
                                            iconSource={SVG_ICON.Location_Icon(COLORS.DarkGray)}
                                            keyboardType={'default'}
                                            onIconPress={() => handleFindServiceArea(setFieldValue)}
                                            loading={locLoading}
                                        />

                                        <TouchableOpacity
                                            style={[styles.addBtn, { width: '100%', backgroundColor: COLORS.PURPLE_50, borderWidth: 1, borderColor: COLORS.PURPLE_200 }]}
                                            onPress={() => handleFindServiceArea(setFieldValue)}
                                            disabled={locLoading}
                                        >
                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                <SvgXml xml={SVG_ICON.Location_Icon(COLORS.PURPLE_600)} width={18} height={18} style={{ marginRight: 8 }} />
                                                <Text style={[styles.addBtnText, { color: COLORS.PURPLE_600, fontFamily: FONT_FAMILY_SEMIBOLD }]}>
                                                    {locLoading ? 'Detecting Location...' : 'Use My Current Location'}
                                                </Text>
                                            </View>
                                        </TouchableOpacity>
                                        {touched.serviceArea && errors.serviceArea && (
                                            <Text style={styles.error}>{errors.serviceArea}</Text>
                                        )}

                                        <View style={styles.privacyBox}>

                                            <SvgXml xml={SVG_ICON.secure_Icon('#004EEB')} width={20} height={20} style={{
                                                marginRight: 4,
                                                marginTop: 2,
                                            }} />

                                            <View style={styles.privacyTextWrapper}>
                                                <Text style={styles.privacyTitle}>Privacy & Security</Text>
                                                <Text style={styles.privacyText}>
                                                    We use your location to connect you with nearby customers. Your exact
                                                    location is kept private and only used for service matching.
                                                </Text>
                                            </View>
                                        </View>


                                    </View>
                                )}

                                {step === 3 && (
                                    <View style={styles.stepContainer}>
                                        <Text style={styles.stepTitle}>Services & Pricing</Text>
                                        <Text style={styles.stepSubtitle}>Set up your service offerings and rates</Text>

                                        {values.services.map((service, index) => (
                                            <View key={index} style={styles.serviceRow}>
                                                <View style={styles.step3inputContainer}>
                                                    <InputField
                                                        label={index === 0 ? 'Services Offered' : ''}
                                                        numberOfLines={1}
                                                        placeholderTextColor={COLORS.DarkGray}
                                                        placeholder="e.g. Wash & Fold"
                                                        value={service.name}
                                                        //  onChangeText={(text) => updateService(index, 'name', text)}
                                                        onChangeText={(text) => {
                                                            setFieldValue(`services[${index}].name`, text);
                                                            setFieldTouched(`services[${index}].name`, true, false);
                                                        }}
                                                        keyboardType={'default'}
                                                    />
                                                    {index === 0 && touched.services && errors.services && (
                                                        <Text style={styles.error}>
                                                            {typeof errors.services === 'string'
                                                                ? errors.services
                                                                : Array.isArray(errors.services) && (errors.services[index] as FormikErrors<Service>)?.name}
                                                        </Text>
                                                    )}
                                                </View>

                                                <View style={styles.priceContainer}>
                                                    <InputField
                                                        label=""
                                                        placeholderTextColor={COLORS.DarkGray}
                                                        placeholder="Price (e.g. ₹10)"
                                                        value={service.price}
                                                        // onChangeText={(text) => updateService(index, 'price', text)}
                                                        onChangeText={(text) => {
                                                            const cleaned = text.replace(/[^0-9.]/g, '');
                                                            setFieldValue(`services[${index}].price`, cleaned);
                                                            setFieldTouched(`services[${index}].price`, true, false);
                                                        }}
                                                        keyboardType="numeric"
                                                    />
                                                    {index === 0 && touched.services && errors.services && (
                                                        <Text style={styles.error}>
                                                            {typeof errors.services === 'string'
                                                                ? errors.services
                                                                : Array.isArray(errors.services) && (errors.services[index] as FormikErrors<Service>)?.price}
                                                        </Text>
                                                    )}
                                                </View>

                                                {index > 0 && (
                                                    <TouchableOpacity
                                                        // onPress={() => removeService(index)} 
                                                        onPress={() => {
                                                            const newServices = [...values.services];
                                                            newServices.splice(index, 1);
                                                            setFieldValue('services', newServices);
                                                        }}
                                                        style={styles.deleteBtn}
                                                    >
                                                        <Image
                                                            style={styles.deleteIcon}
                                                            source={require('../../../assets/icons/delete_icon.png')}
                                                        />
                                                    </TouchableOpacity>
                                                )}
                                            </View>
                                        ))}


                                        <TouchableOpacity
                                            // onPress={addService}
                                            onPress={() =>
                                                setFieldValue('services', [...values.services, { name: '', price: '' }])
                                            }
                                            style={styles.addBtn}>
                                            <Text style={styles.addBtnText}>+ Add Service</Text>
                                        </TouchableOpacity>
                                    </View>
                                )}

                                {step === 4 && (
                                    <View style={styles.stepContainer}>
                                        <Text style={styles.stepTitle}>Bank Details</Text>
                                        <Text style={styles.stepSubtitle}>Enter your bank account details for payments</Text>

                                        <InputField
                                            label="Account Holder Name *"
                                            placeholder="Name as on bank account"
                                            placeholderTextColor={COLORS.DarkGray}
                                            value={values.accountHolderName}
                                            onChangeText={handleChange('accountHolderName')}
                                        />
                                        {touched.accountHolderName && errors.accountHolderName && (
                                            <Text style={styles.error}>{errors.accountHolderName}</Text>
                                        )}

                                        <InputField
                                            label="Bank Name *"
                                            placeholder="e.g., State Bank of India"
                                            placeholderTextColor={COLORS.DarkGray}
                                            value={values.bankName}
                                            onChangeText={handleChange('bankName')}
                                        />
                                        {touched.bankName && errors.bankName && (
                                            <Text style={styles.error}>{errors.bankName}</Text>
                                        )}

                                        <InputField
                                            label="Account Number *"
                                            placeholder="Enter account number"
                                            placeholderTextColor={COLORS.DarkGray}
                                            value={values.accountNumber}
                                            onChangeText={handleChange('accountNumber')}
                                            keyboardType="numeric"
                                            isPassword
                                        />
                                        {touched.accountNumber && errors.accountNumber && (
                                            <Text style={styles.error}>{errors.accountNumber}</Text>
                                        )}

                                        <InputField
                                            label="Confirm Account Number *"
                                            placeholder="Re-enter account number"
                                            placeholderTextColor={COLORS.DarkGray}
                                            value={values.confirmAccountNumber}
                                            onChangeText={handleChange('confirmAccountNumber')}
                                            keyboardType="numeric"
                                            isPassword
                                        />
                                        {touched.confirmAccountNumber && errors.confirmAccountNumber && (
                                            <Text style={styles.error}>{errors.confirmAccountNumber}</Text>
                                        )}

                                        <InputField
                                            label="IFSC Code *"
                                            placeholder="e.g., SBIN0001234"
                                            placeholderTextColor={COLORS.DarkGray}
                                            value={values.ifscCode}
                                            onChangeText={(text) => setFieldValue('ifscCode', text.toUpperCase())}
                                            autoCapitalize="characters"
                                        />
                                        {touched.ifscCode && errors.ifscCode && (
                                            <Text style={styles.error}>{errors.ifscCode}</Text>
                                        )}

                                        <InputField
                                            label="Branch Name *"
                                            placeholder="e.g., Indore Main Branch"
                                            placeholderTextColor={COLORS.DarkGray}
                                            value={values.branchName}
                                            onChangeText={handleChange('branchName')}
                                        />
                                        {touched.branchName && errors.branchName && (
                                            <Text style={styles.error}>{errors.branchName}</Text>
                                        )}

                                        <Text style={styles.accountTypeLabel}>Account Type *</Text>
                                        <View style={styles.accountTypeContainer}>
                                            <TouchableOpacity
                                                style={[
                                                    styles.accountTypeButton,
                                                    values.accountType === 'savings'
                                                        ? styles.accountTypeButtonActive
                                                        : styles.accountTypeButtonInactive,
                                                ]}
                                                onPress={() => setFieldValue('accountType', 'savings')}
                                                activeOpacity={0.8}
                                            >
                                                <Text style={{ fontSize: 16 }}>🏦</Text>
                                                <Text
                                                    style={[
                                                        styles.accountTypeBtnText,
                                                        values.accountType === 'savings'
                                                            ? styles.accountTypeBtnTextActive
                                                            : styles.accountTypeBtnTextInactive,
                                                    ]}
                                                >
                                                    Savings
                                                </Text>
                                            </TouchableOpacity>

                                            <TouchableOpacity
                                                style={[
                                                    styles.accountTypeButton,
                                                    values.accountType === 'current'
                                                        ? styles.accountTypeButtonActive
                                                        : styles.accountTypeButtonInactive,
                                                ]}
                                                onPress={() => setFieldValue('accountType', 'current')}
                                                activeOpacity={0.8}
                                            >
                                                <Text style={{ fontSize: 16 }}>🏢</Text>
                                                <Text
                                                    style={[
                                                        styles.accountTypeBtnText,
                                                        values.accountType === 'current'
                                                            ? styles.accountTypeBtnTextActive
                                                            : styles.accountTypeBtnTextInactive,
                                                    ]}
                                                >
                                                    Current
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                        {touched.accountType && errors.accountType && (
                                            <Text style={styles.error}>{errors.accountType}</Text>
                                        )}
                                    </View>
                                )}


                                <View style={styles.buttonGroup}>
                                    {step > 1 ? (
                                        <TouchableOpacity onPress={handleBack} style={styles.backBtn}>

                                            <SvgXml xml={SVG_ICON.arrow_back(COLORS.BLACK)} width={20} height={20}
                                            />
                                            <Text style={styles.backText}> Back</Text>
                                        </TouchableOpacity>
                                    ) : (
                                        <View style={{ flex: 1 }} />
                                    )}

                                    {step === 4 ? (
                                        <TouchableOpacity
                                            onPress={() => handleSubmit()}
                                            style={styles.submitBtn}
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? (
                                                <ActivityIndicator color={COLORS.WHITE} />
                                            ) : (
                                                <>
                                                    <SvgXml xml={SVG_ICON.secure_Icon(COLORS.WHITE)} width={20} height={20} />
                                                    <Text style={styles.submitBtnText}>Submit Registration</Text>
                                                </>
                                            )}
                                        </TouchableOpacity>
                                    ) : (
                                        <GradientButton
                                            title="Next Step"
                                            onPress={() => handleSubmit()}
                                            type="filled"
                                            iconStyle={{ tintColor: COLORS.WHITE }}
                                            textStyle={{}}
                                            containerStyle={{}}
                                            rightIcon={SVG_ICON.arrow_Right(COLORS.WHITE)}
                                        />
                                    )}
                                </View>


                            </View>
                        )}
                    </Formik>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default DhobiRegistrationScreen;
