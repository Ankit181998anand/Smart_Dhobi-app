import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SH, SW, SF } from '../utils/Dimensions';
import COLORS, { FONT_FAMILY_MEDIUM, FONT_FAMILY_SEMIBOLD } from '../utils/constant';
import { SvgXml } from 'react-native-svg';
import { SVG_ICON } from '../assets/Svg/svgIcon';

interface Props {
    title: string;
    distance: string;
    duration: string;
    rating: string;
    onBookNow: () => void;
    onCall: () => void;
}

const NearbyDhobiCard: React.FC<Props> = ({
    title,
    distance,
    duration,
    rating,
    onBookNow,
    onCall,
}) => {
    return (
        <View style={styles.card}>
            <View style={styles.rowSpace}>
                <Text style={styles.title}>
                    <Text style={styles.titleBold}>
                        {title.split(' ')[0]}{' '}
                    </Text>
                    {title.split(' ').slice(1).join(' ')}
                </Text>
                <View style={styles.ratingContainer}>
                    <SvgXml xml={SVG_ICON.Star_Icon(COLORS.BLACK)} width={SW(18)} height={SH(18)}
                        style={styles.starIcon}
                    />

                    <Text style={styles.ratingText}>{rating}</Text>
                </View>
            </View>

            <View style={[styles.row, { marginTop: SH(10) }]}>
                <View style={styles.infoRow}>

                    <SvgXml xml={SVG_ICON.Location_Icon(COLORS.RED_600)} width={SW(18)} height={SH(18)}
                        style={styles.infoIcon}
                    />
                    <Text style={styles.infoText}>{distance}</Text>
                </View>
                <View style={styles.infoRow}>
                    <SvgXml xml={SVG_ICON.clock_Icon(COLORS.GREEN_700)} width={SW(18)} height={SH(18)}
                        style={styles.infoIcon}
                    />
                    <Text style={styles.infoText}>{duration}</Text>
                </View>
            </View>

            <View style={[styles.row, { marginTop: SH(14) }]}>
                <TouchableOpacity onPress={onBookNow} activeOpacity={0.8} style={styles.bookBtnWrapper}>
                    <LinearGradient
                        colors={['#8B5CF6', '#EC4899']}
                        style={styles.bookBtn}>
                        <Text style={styles.bookBtnText}>Book Now</Text>
                    </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity onPress={onCall} style={styles.callBtn}>
                     <SvgXml xml={SVG_ICON.Call_Icon(COLORS.BLACK)} width={SW(18)} height={SH(18)}
                    />
                </TouchableOpacity>
            </View>

        </View>
    );
};

export default NearbyDhobiCard;

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#FAFAFF',
        borderRadius: SW(14),
        padding: SH(16),
        borderWidth: 1,
        borderColor: '#F0EFFF',
        marginBottom: SH(16),
        width: '100%',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    rowSpace: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        fontSize: SF(15),
        color: '#111827',
        fontFamily: FONT_FAMILY_SEMIBOLD,
    },
    titleBold: {
        fontSize: SF(15),
        color: '#111827',
        fontFamily: FONT_FAMILY_SEMIBOLD,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FEF3C7',
        borderRadius: SW(20),
        paddingHorizontal: SW(8),
        paddingVertical: SH(4),
    },
    starIcon: {
        marginRight: SW(4),
        bottom: SH(1)
    },
    ratingText: {
        fontSize: SF(12),
        color: '#78350F',
        fontFamily: FONT_FAMILY_SEMIBOLD
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: SW(14),
    },
    infoIcon: {
        marginRight: SW(4),
    },
    infoText: {
        fontSize: SF(13),
        color: '#374151',
        fontFamily: FONT_FAMILY_MEDIUM,
    },
    bookBtnWrapper: {
        flex: 1,
        marginRight: SW(12),
    },
    bookBtn: {
        paddingVertical: SH(8),
        borderRadius: SW(10),
        alignItems: 'center',
        justifyContent: 'center',
    },
    bookBtnText: {
        color: '#fff',
        fontSize: SF(14),
        fontFamily: FONT_FAMILY_SEMIBOLD,
    },
    callBtn: {
        padding: SW(10),
        borderRadius: SW(10),
        borderWidth: 1,
        borderColor: '#E5E7EB',
        backgroundColor: '#fff',
    },
    callIcon: {
        width: SW(18),
        height: SW(18),
    },
});
