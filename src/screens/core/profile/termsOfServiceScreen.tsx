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

const TermsOfServiceScreen = ({ navigation }: any) => {
    const insets = useSafeAreaInsets();

    const sections = [
        {
            id: '1',
            title: 'Acceptance',
            content: 'By using SmartDhobi services, you agree to these Terms and our Privacy Policy.'
        },
        {
            id: '2',
            title: 'Services',
            content: 'We provide on-demand ironing and laundry services connecting you to local vendors ("Dhobis"). SmartDhobi solely facilitates the transaction and booking process.'
        },
        {
            id: '3',
            title: 'Booking & Payment',
            content: 'All service bookings, slots, pricing, and payments must be completed through the SmartDhobi platform.'
        },
        {
            id: '4',
            title: 'Cancellations & Refunds',
            content: 'Customers may cancel within X hours. Late cancellations or no-shows will incur a fee. Refunds processed as per SmartDhobi policy.'
        },
        {
            id: '5',
            title: 'User Responsibilities',
            content: 'Customers must ensure items are properly labeled and free from prohibited items (flammable, hazardous). SmartDhobi and Dhobis are not liable for damages due to prohibited items.'
        },
        {
            id: '6',
            title: 'Vendor Conduct',
            content: 'Dhobis must comply with service standards, respond timely to orders, and provide accurate pricing receipts.'
        },
        {
            id: '7',
            title: 'Liability',
            content: 'SmartDhobi acts as a facilitator. While we vet Dhobis, we are not liable for lost or damaged items except as required by law.'
        },
        {
            id: '8',
            title: 'Changes to Terms',
            content: 'We may update these terms. Any material changes will prompt a notice on the app/website.'
        },
        {
            id: '9',
            title: 'Governing Law',
            content: 'These terms are governed under the laws of India.'
        }
    ];

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#f6f0fc" />
            <View style={{ height: insets.top, backgroundColor: '#f6f0fc' }} />

            <Header
                title="Terms of Service"
                subtitle="Please read these terms carefully"
                isLeftIcon
                onLeftPress={() => navigation.goBack()}

            />

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.importantBox}>
                    <Text style={styles.importantTitle}>Important Information</Text>
                    <Text style={styles.importantText}>
                        By using SmartDhobi services, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service. These terms constitute a legally binding agreement between you and SmartDhobi.
                    </Text>
                </View>

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

                <View style={styles.contactSection}>
                    <Text style={styles.contactText}>
                        If you have any questions about these terms, please contact our support team before using our services. We're here to help ensure you have a clear understanding of your rights and responsibilities.
                    </Text>
                </View>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>Last Updated: May 12, 2026</Text>
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
    importantBox: {
        backgroundColor: '#FFF5F5',
        padding: 15,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#FED7D7',
        marginBottom: 30,
    },
    importantTitle: {
        fontSize: 16,
        fontFamily: FONT_FAMILY_SEMIBOLD,
        color: '#C53030',
        marginBottom: 8,
    },
    importantText: {
        fontSize: 14,
        fontFamily: FONT_FAMILY_REGULAR,
        color: '#742A2A',
        lineHeight: 20,
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
    contactSection: {
        marginTop: 10,
        backgroundColor: COLORS.GRAY_50,
        padding: 15,
        borderRadius: 12,
    },
    contactText: {
        fontSize: 14,
        fontFamily: FONT_FAMILY_REGULAR,
        color: COLORS.GRAY_600,
        lineHeight: 20,
        textAlign: 'center',
    },
    footer: {
        marginTop: 30,
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

export default TermsOfServiceScreen;
