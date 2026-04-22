import { StyleSheet } from "react-native";
import COLORS, { FONT_FAMILY_EXTRABOLD, FONT_FAMILY_MEDIUM, FONT_FAMILY_SEMIBOLD } from "../../../utils/constant";
import { SF, SH, SW } from "../../../utils/Dimensions";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.WHITE,
        paddingHorizontal: SW(20)
    },
    title: {
        fontSize: SF(19),
        fontFamily: FONT_FAMILY_EXTRABOLD,
        marginBottom: SH(4),
        // marginTop: SH(16),
        color: COLORS.BLACK
    },
    subtitle: {
        fontSize: SF(13),
        color: COLORS.DarkGray,
        fontFamily: FONT_FAMILY_SEMIBOLD,
        marginBottom: SH(16),
    },
    rowCardContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: SH(12),
    },
    card: {
        width: '48%',
        padding: 12,
        borderRadius: 12,
        borderLeftWidth: 5, // for colored edge
        justifyContent: 'center',
    },

    cardContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    cardTitle: {
        fontSize: SF(12),
        fontFamily: FONT_FAMILY_SEMIBOLD,
        color: COLORS.BLACK,
    },
    ImgIcon: {
        width: SW(18),
        height: SH(18),
        tintColor: COLORS.DarkGray
    },
    cardValue: {
        fontSize: SF(18),
        fontFamily: FONT_FAMILY_EXTRABOLD,
        marginTop: SH(8),
        color: COLORS.BLACK,
    },
    sectionTitle: {
        fontSize: SF(15),
        fontFamily: FONT_FAMILY_EXTRABOLD,
        color: COLORS.BLACK
    },
    contact: {
        marginBottom: SH(4),
        fontSize: SF(13),
        fontFamily: FONT_FAMILY_SEMIBOLD,
        color: COLORS.DarkGrey
    },
    profileContainer: {
        marginTop: SH(0),
    },
    profileHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SH(15)
    },
    editProfile: {
        color: '#2563EB',
        fontSize: SF(13),
        fontFamily: FONT_FAMILY_SEMIBOLD,
    },

    profileCard: {
        padding: 15,
        backgroundColor: '#fff',
        borderRadius: 12,
        marginTop: SH(8),
        borderColor: '#ccc',
        borderWidth: 1,
    },

    avatar: {
        backgroundColor: '#F3E8FF',
        width: SW(48),
        height: SH(48),
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },

    avatarText: {
        fontSize: SF(20),
        fontFamily: FONT_FAMILY_EXTRABOLD,
        color: '#9333EA',
    },

    profileRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SH(12),
    },

    iconRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SH(8),
    },

    icon: {
        marginRight: SW(8),
        bottom: SH(1)
    },
    deleteIcon: {
        width: SW(18),
        height: SH(18),
        marginRight: SW(8),
        resizeMode: 'contain',
        tintColor: COLORS.DarkGray
    },

    profileName: {
        fontSize: SF(15),
        fontFamily: FONT_FAMILY_SEMIBOLD,
        color: COLORS.BLACK,
    },

    owner: {
        fontSize: SF(13),
        fontFamily: FONT_FAMILY_MEDIUM,
        color: '#6B7280',
    },

    location: {
        fontSize: SF(13),
        fontFamily: FONT_FAMILY_MEDIUM,
        color: COLORS.DarkGrey,
        flex: 1,
        flexWrap: 'wrap',
    },

    rating: {
        fontSize: SF(13),
        fontFamily: FONT_FAMILY_MEDIUM,
        color: COLORS.DarkGrey
    },

    divider: {
        height: 1,
        backgroundColor: '#E5E7EB',
        marginVertical: SH(12),
    },

    statusRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: SH(4),
    },

    statusLabel: {
        fontSize: SF(13),
        fontFamily: FONT_FAMILY_SEMIBOLD,
        color: '#6B7280',
    },

    activeStatus: {
        fontSize: SF(13),
        fontFamily: FONT_FAMILY_SEMIBOLD,
        color: 'green',
    },
    statusValue: {
        fontSize: SF(13),
        fontFamily: FONT_FAMILY_SEMIBOLD,
        color: COLORS.BLACK,
    },

    servicesContainer: {
        marginVertical: SH(12),
        paddingBottom: SH(16),
        padding: 15,
        backgroundColor: '#fff',
        borderRadius: 12,
        borderColor: '#ccc',
        borderWidth: 1,
    },

    servicesHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SH(7),
    },
    addButton: {
        backgroundColor: '#A000F1',
        paddingHorizontal: SW(14),
        paddingVertical: SH(8),
        borderRadius: 10,
    },

    addButtonText: {
        color: COLORS.WHITE,
        fontFamily: FONT_FAMILY_SEMIBOLD,
        fontSize: SF(13),
    },
    servicesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: SW(12),
    },

    serviceCard: {
        width: SW(144),
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 10,
        padding: 12,
        backgroundColor: '#fff',
    },

    serviceHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SH(8),
    },

    serviceName: {
        fontSize: SF(14),
        fontFamily: FONT_FAMILY_SEMIBOLD,
        color: COLORS.BLACK,
    },

    servicePrice: {
        fontSize: SF(15),
        fontFamily: FONT_FAMILY_EXTRABOLD,
        color: '#A000F1',
    },

    serviceIcons: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.WHITE,
    },
    headerSection: {
        marginBottom: SH(20),
    },
    categorySection: {
        marginTop: SH(10),
    },
    catCard: {
        marginRight: SW(15),
        width: SW(90),
        borderRadius: 15,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: COLORS.GRAY_100,
    },
    catGradient: {
        padding: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    catText: {
        fontSize: SF(11),
        fontFamily: FONT_FAMILY_SEMIBOLD,
        marginTop: SH(8),
        color: COLORS.BLACK,
        textAlign: 'center',
    },
    promoCard: {
        borderRadius: 20,
        overflow: 'hidden',
        elevation: 5,
        shadowColor: COLORS.BLACK,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
    },
    promoGradient: {
        padding: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    promoTitle: {
        fontSize: SF(24),
        fontFamily: FONT_FAMILY_EXTRABOLD,
        color: COLORS.WHITE,
    },
    promoSubtitle: {
        fontSize: SF(14),
        fontFamily: FONT_FAMILY_MEDIUM,
        color: COLORS.WHITE,
        opacity: 0.9,
    },
    promoButton: {
        backgroundColor: COLORS.WHITE,
        paddingHorizontal: SW(15),
        paddingVertical: SH(6),
        borderRadius: 10,
        marginTop: SH(10),
        alignSelf: 'flex-start',
    },
    promoButtonText: {
        color: COLORS.PURPLE_600,
        fontFamily: FONT_FAMILY_EXTRABOLD,
        fontSize: SF(12),
    },
    nearCard: {
        backgroundColor: COLORS.WHITE,
        borderRadius: 15,
        padding: 15,
        marginBottom: SH(12),
        borderWidth: 1,
        borderColor: COLORS.GRAY_100,
    },
    emptyText: {
        fontSize: SF(13),
        fontFamily: FONT_FAMILY_MEDIUM,
        color: COLORS.GRAY_400,
        textAlign: 'center',
        width: '100%',
        marginTop: SH(20),
    },
});

export default styles;