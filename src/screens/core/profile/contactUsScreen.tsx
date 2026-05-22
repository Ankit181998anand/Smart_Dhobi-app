import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    StatusBar,
    TouchableOpacity,
    Linking,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Header from '../../../components/Header';
import COLORS, { FONT_FAMILY_EXTRABOLD, FONT_FAMILY_REGULAR, FONT_FAMILY_SEMIBOLD } from '../../../utils/constant';
import { SvgXml } from 'react-native-svg';
import { SVG_ICON } from '../../../assets/Svg/svgIcon';

const ContactUsScreen = ({ navigation }: any) => {
    const insets = useSafeAreaInsets();

    const handleCall = () => {
        Linking.openURL('tel:+917558618689');
    };

    const handleEmail = () => {
        Linking.openURL('mailto:info@smartdhobi.in');
    };

    const handleWhatsApp = () => {
        Linking.openURL('whatsapp://send?phone=+917558618689');
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#f6f0fc" />
            <View style={{ height: insets.top, backgroundColor: '#f6f0fc' }} />

            <Header
                title="Contact Us"
                subtitle="We're here to help you"
                isLeftIcon
                onLeftPress={() => navigation.goBack()}
            />

            <View style={styles.content}>
                <View style={styles.infoCard}>
                    <Text style={styles.infoTitle}>Get in Touch</Text>
                    <Text style={styles.infoSubtitle}>Have questions or need assistance? Reach out to us through any of the following channels.</Text>

                    <TouchableOpacity style={styles.contactItem} onPress={handleCall}>
                        <View style={[styles.iconBox, { backgroundColor: '#EBF8FF' }]}>
                            <SvgXml xml={SVG_ICON.Call_Icon(COLORS.BLUE_600)} width={24} height={24} />
                        </View>
                        <View style={styles.contactDetails}>
                            <Text style={styles.contactLabel}>Call Us</Text>
                            <Text style={styles.contactValue}>+91 7558618689</Text>
                        </View>
                        <SvgXml xml={SVG_ICON.arrow_Right(COLORS.GRAY_300)} width={16} height={16} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.contactItem} onPress={handleEmail}>
                        <View style={[styles.iconBox, { backgroundColor: '#F0FFF4' }]}>
                            <SvgXml xml={SVG_ICON.mail_Icon(COLORS.GREEN_600)} width={24} height={24} />
                        </View>
                        <View style={styles.contactDetails}>
                            <Text style={styles.contactLabel}>Email Us</Text>
                            <Text style={styles.contactValue}>info@smartdhobi.in</Text>
                        </View>
                        <SvgXml xml={SVG_ICON.arrow_Right(COLORS.GRAY_300)} width={16} height={16} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.contactItem} onPress={handleWhatsApp}>
                        <View style={[styles.iconBox, { backgroundColor: '#E6FFFA' }]}>
                            <SvgXml xml={SVG_ICON.Check_Circle(COLORS.GREEN_600)} width={24} height={24} />
                        </View>
                        <View style={styles.contactDetails}>
                            <Text style={styles.contactLabel}>WhatsApp</Text>
                            <Text style={styles.contactValue}>+91 7558618689</Text>
                        </View>
                        <SvgXml xml={SVG_ICON.arrow_Right(COLORS.GRAY_300)} width={16} height={16} />
                    </TouchableOpacity>
                </View>


            </View>

            <View style={styles.footer}>
                <Text style={styles.footerText}>SmartDhobi - Quality Service at Your Doorstep</Text>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.WHITE,
    },
    content: {
        flex: 1,
        padding: 20,
    },
    infoCard: {
        backgroundColor: COLORS.WHITE,
        borderRadius: 20,
        padding: 20,
        elevation: 4,
        shadowColor: COLORS.BLACK,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        marginBottom: 25,
    },
    infoTitle: {
        fontSize: 20,
        fontFamily: FONT_FAMILY_EXTRABOLD,
        color: COLORS.BLACK,
        marginBottom: 8,
    },
    infoSubtitle: {
        fontSize: 14,
        fontFamily: FONT_FAMILY_REGULAR,
        color: COLORS.GRAY_500,
        lineHeight: 20,
        marginBottom: 20,
    },
    contactItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.GRAY_50,
    },
    iconBox: {
        width: 48,
        height: 48,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    contactDetails: {
        flex: 1,
    },
    contactLabel: {
        fontSize: 13,
        fontFamily: FONT_FAMILY_SEMIBOLD,
        color: COLORS.GRAY_400,
        marginBottom: 2,
    },
    contactValue: {
        fontSize: 16,
        fontFamily: FONT_FAMILY_EXTRABOLD,
        color: COLORS.BLACK,
    },
    supportBox: {
        borderRadius: 20,
        overflow: 'hidden',
    },
    supportGradient: {
        padding: 20,
        alignItems: 'center',
    },
    supportTitle: {
        fontSize: 18,
        fontFamily: FONT_FAMILY_EXTRABOLD,
        color: COLORS.WHITE,
        marginBottom: 8,
    },
    supportText: {
        fontSize: 14,
        fontFamily: FONT_FAMILY_REGULAR,
        color: 'rgba(255, 255, 255, 0.9)',
        textAlign: 'center',
        lineHeight: 20,
    },
    footer: {
        padding: 20,
        alignItems: 'center',
    },
    footerText: {
        fontSize: 12,
        fontFamily: FONT_FAMILY_SEMIBOLD,
        color: COLORS.GRAY_300,
    },
});

export default ContactUsScreen;
