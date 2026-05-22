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
    commissionRate: string;
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
                return 'Review';
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
        commissionRate: '',
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
                        commissionRate: parseInt(values.commissionRate) || 10,
                        services: values.services.filter(s => s.name && s.price),
                        pricing: pricing,
                        profilePicture: "https://example.com/default-profile.png",
                        joinDate: new Date().toISOString().split('T')[0],
                        images: [],
                        earnings: "0"
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

                                        <InputField
                                            label="Commission Rate (%)"
                                            placeholderTextColor={COLORS.DarkGray}
                                            placeholder="e.g. 15"
                                            value={values.commissionRate}
                                            // onChangeText={setCommissionRate}
                                            onChangeText={(text) => {
                                                setFieldValue('commissionRate', text);
                                                setFieldTouched('commissionRate', true, false);
                                            }}
                                            keyboardType="numeric"
                                        />

                                        {touched.commissionRate && errors.commissionRate && (
                                            <Text style={styles.error}>{errors.commissionRate}</Text>
                                        )}

                                        <View style={[styles.privacyBox, { backgroundColor: '#fffbe9' }]}>

                                            <SvgXml xml={SVG_ICON.Star_Icon('#004EEB')} width={22} height={22} style={{
                                                marginRight: 4,
                                                marginTop: 0,
                                            }} />
                                            <View style={styles.privacyTextWrapper}>
                                                <Text style={styles.privacyTitle}>Commission Information</Text>
                                                <Text style={[styles.privacyText, { color: COLORS.BLACK }]}>
                                                    This is the percentage we charge for each completed order. Standard rate is 15%,
                                                    but it may vary based on your location and services.
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                )}

                                {step === 4 && (
                                    <View style={styles.step4Container}>
                                        <Text style={styles.stepTitle}>Review Your Information</Text>
                                        <Text style={styles.stepSubtitle}>Please verify all details before submitting</Text>

                                        {/* Basic Info */}
                                        <View style={styles.reviewBox}>
                                            <View style={styles.sectionHeader}>
                                                <View style={[styles.badge, { backgroundColor: COLORS.PRIMARY_HOVER }]}>
                                                    <Text style={styles.badgeText}>1</Text>
                                                </View>
                                                <Text style={styles.reviewSectionTitle}>Basic Information</Text>
                                            </View>

                                            <View style={styles.reviewRow}>
                                                <Text style={styles.reviewLabel}>Business:</Text>
                                                <Text style={styles.reviewValue}>{values.businessName}</Text>
                                            </View>
                                            <View style={styles.reviewRow}>
                                                <Text style={styles.reviewLabel}>Owner:</Text>
                                                <Text style={styles.reviewValue}>{values.ownerName}</Text>
                                            </View>
                                            <View style={styles.reviewRow}>
                                                <Text style={styles.reviewLabel}>Email:</Text>
                                                <Text style={styles.reviewValue}>{values.email}</Text>
                                            </View>
                                            <View style={styles.reviewRow}>
                                                <Text style={styles.reviewLabel}>Mobile:</Text>
                                                <Text style={styles.reviewValue}>{values.mobile}</Text>
                                            </View>
                                            <View style={styles.reviewRow}>
                                                <Text style={styles.reviewLabel}>Address:</Text>
                                                <Text style={styles.reviewValue}>{values.address}</Text>
                                            </View>
                                        </View>


                                        {/* Location Details */}
                                        <View style={styles.reviewBox}>
                                            <View style={styles.sectionHeader}>
                                                <View style={styles.badge}><Text style={styles.badgeText}>2</Text></View>
                                                <Text style={styles.reviewSectionTitle}>Location Details</Text>
                                            </View>

                                            <View style={styles.reviewRow}>
                                                <Text style={styles.reviewLabel}>Service Areas:</Text>
                                                <Text style={styles.reviewValue}>{values.serviceArea}</Text>
                                            </View>
                                            <View style={styles.reviewRow}>
                                                <Text style={styles.reviewLabel}>Coordinates:</Text>
                                                <Text style={[styles.reviewValue, { color: values.latitude ? COLORS.SUCCESS : COLORS.RED }]}>
                                                    {values.latitude && values.longitude
                                                        ? `${values.latitude.toFixed(5)}, ${values.longitude.toFixed(5)}`
                                                        : 'Not captured'}
                                                </Text>
                                            </View>
                                        </View>


                                        {/* Services & Pricing */}
                                        <View style={styles.reviewBox}>
                                            <View style={styles.sectionHeader}>
                                                <View style={[styles.badge, { backgroundColor: COLORS.SUCCESS }]}>
                                                    <Text style={styles.badgeText}>3</Text>
                                                </View>
                                                <Text style={styles.reviewSectionTitle}>Services & Pricing</Text>
                                            </View>

                                            {values.services.map((s, i) => (
                                                <View key={i} style={styles.reviewRow}>
                                                    <Text style={styles.reviewLabel}>{s.name}:</Text>
                                                    <Text style={styles.reviewValue}>₹{s.price}</Text>
                                                </View>
                                            ))}

                                            <View style={styles.reviewRow}>
                                                <Text style={styles.reviewLabel}>Commission Rate:</Text>
                                                <Text style={styles.reviewValue}>{values.commissionRate}%</Text>
                                            </View>
                                        </View>

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
