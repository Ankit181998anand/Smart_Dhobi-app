import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    SafeAreaView,
    StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Header from '../../../components/Header';
import COLORS, { FONT_FAMILY_EXTRABOLD, FONT_FAMILY_REGULAR, FONT_FAMILY_SEMIBOLD } from '../../../utils/constant';

const PrivacyPolicyScreen = ({ navigation }: any) => {
    const insets = useSafeAreaInsets();

    const sections = [
        {
            id: '1',
            title: 'Introduction',
            content: 'SmartDhobi ("we," "us," "our") is committed to protecting your privacy and ensuring reliable data handling on smartdhobi.in and our mobile app.'
        },
        {
            id: '2',
            title: 'Data Collected',
            content: '● User info: Name, contact, address, delivery details\n● Order data: Service type, dates, payment method\n● Payment data: Transaction IDs via Paytm or cash receipts\n● Device data: App usage, device model, OS, IP address, and location'
        },
        {
            id: '3',
            title: 'Usage of Data',
            content: '● To process bookings, assign Dhobis, and track orders\n● For communication: notifications, reminders, and support\n● To improve our services, analytics, and marketing efforts'
        },
        {
            id: '4',
            title: 'Data Sharing',
            content: '● With Dhobis: Only delivery essentials\n● Third parties: Payment gateways (e.g. Paytm), cloud or analytics providers\n● Legal reasons: If required by law or to protect rights'
        },
        {
            id: '5',
            title: 'Security',
            content: 'We use industry-standard SSL encryption and secure storage practices. Access to personal data is restricted.'
        },
        {
            id: '6',
            title: 'Cookies & Tracking',
            content: 'Our website may use cookies and similar tools to personalize content and usage.'
        },
        {
            id: '7',
            title: 'Data Retention',
            content: 'We retain data as long as needed for business purposes or until legally required.'
        },
        {
            id: '8',
            title: 'Your Rights',
            content: 'You can request access, correction, deletion of personal data by contacting us.'
        },
        {
            id: '9',
            title: 'Privacy Updates',
            content: 'Policy updates will be posted here with a new effective date.'
        },
        {
            id: '10',
            title: 'Contact Us',
            content: 'For privacy questions, reach us at info@smartdhobi.in.'
        }
    ];

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#f6f0fc" />
            <View style={{ height: insets.top, backgroundColor: '#f6f0fc' }} />

            <Header
                title="Privacy Policy"
                subtitle="Our Commitment to Your Privacy"
                isLeftIcon
                onLeftPress={() => navigation.goBack()}
            />

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator={false}
            >
                <Text style={styles.introText}>
                    At SmartDhobi, we understand the importance of your personal information. We are committed to protecting your privacy and ensuring reliable data handling across smartdhobi.in and our mobile app. This policy outlines how we collect, use, share, and protect your data.
                </Text>

                {sections.map((section) => (
                    <View key={section.id} style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <View style={styles.numberBadge}>
                                <Text style={styles.numberText}>{section.id}</Text>
                            </View>
                            <Text style={styles.sectionTitle}>{section.title}</Text>
                        </View>
                        <Text style={styles.sectionContent}>{section.content}</Text>
                    </View>
                ))}

                <View style={styles.footer}>
                    <Text style={styles.footerText}>Effective Date: May 12, 2026</Text>
                </View>
            </ScrollView>
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
    contentContainer: {
        padding: 20,
        paddingBottom: 40,
    },
    introText: {
        fontSize: 15,
        fontFamily: FONT_FAMILY_REGULAR,
        color: COLORS.GRAY_600,
        lineHeight: 22,
        marginBottom: 30,
        backgroundColor: COLORS.GRAY_50,
        padding: 15,
        borderRadius: 12,
        borderLeftWidth: 4,
        borderLeftColor: COLORS.PURPLE_600,
    },
    section: {
        marginBottom: 25,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    numberBadge: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: COLORS.PURPLE_600,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    numberText: {
        color: COLORS.WHITE,
        fontSize: 14,
        fontFamily: FONT_FAMILY_SEMIBOLD,
    },
    sectionTitle: {
        fontSize: 18,
        fontFamily: FONT_FAMILY_EXTRABOLD,
        color: COLORS.BLACK,
    },
    sectionContent: {
        fontSize: 15,
        fontFamily: FONT_FAMILY_REGULAR,
        color: COLORS.GRAY_700,
        lineHeight: 22,
        marginLeft: 40,
    },
    footer: {
        marginTop: 20,
        paddingTop: 20,
        borderTopWidth: 1,
        borderTopColor: COLORS.GRAY_100,
        alignItems: 'center',
    },
    footerText: {
        fontSize: 13,
        fontFamily: FONT_FAMILY_SEMIBOLD,
        color: COLORS.GRAY_400,
    },
});

export default PrivacyPolicyScreen;
