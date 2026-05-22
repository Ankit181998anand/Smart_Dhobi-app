import { StyleSheet } from "react-native";
import COLORS, { FONT_FAMILY_EXTRABOLD, FONT_FAMILY_MEDIUM, FONT_FAMILY_SEMIBOLD } from "../../../utils/constant";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.WHITE,
        paddingHorizontal: 20
    },
    title: {
        fontSize: 19,
        fontFamily: FONT_FAMILY_EXTRABOLD,
        marginBottom: 4,
        color: COLORS.BLACK
    },
    subtitle: {
        fontSize: 13,
        color: COLORS.DarkGray,
        fontFamily: FONT_FAMILY_SEMIBOLD,
        marginBottom: 16,
    },
    rowCardContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
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
        fontSize: 12,
        fontFamily: FONT_FAMILY_SEMIBOLD,
        color: COLORS.BLACK,
    },
    ImgIcon: {
        width: 18,
        height: 18,
        tintColor: COLORS.DarkGray
    },
    cardValue: {
        fontSize: 18,
        fontFamily: FONT_FAMILY_EXTRABOLD,
        marginTop: 8,
        color: COLORS.BLACK,
    },
    sectionTitle: {
        fontSize: 15,
        fontFamily: FONT_FAMILY_EXTRABOLD,
        color: COLORS.BLACK
    },
    contact: {
        marginBottom: 4,
        fontSize: 13,
        fontFamily: FONT_FAMILY_SEMIBOLD,
        color: COLORS.DarkGrey
    },
    profileContainer: {
        marginTop: 0,
    },
    profileHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15
    },
    editProfile: {
        color: '#2563EB',
        fontSize: 13,
        fontFamily: FONT_FAMILY_SEMIBOLD,
    },

    profileCard: {
        padding: 15,
        backgroundColor: '#fff',
        borderRadius: 12,
        marginTop: 8,
        borderColor: '#ccc',
        borderWidth: 1,
    },

    avatar: {
        backgroundColor: '#F3E8FF',
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },

    avatarText: {
        fontSize: 20,
        fontFamily: FONT_FAMILY_EXTRABOLD,
        color: '#9333EA',
    },

    profileRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },

    iconRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },

    icon: {
        marginRight: 8,
        bottom: 1
    },
    deleteIcon: {
        width: 18,
        height: 18,
        marginRight: 8,
        resizeMode: 'contain',
        tintColor: COLORS.DarkGray
    },

    profileName: {
        fontSize: 15,
        fontFamily: FONT_FAMILY_SEMIBOLD,
        color: COLORS.BLACK,
    },

    owner: {
        fontSize: 13,
        fontFamily: FONT_FAMILY_MEDIUM,
        color: '#6B7280',
    },

    location: {
        fontSize: 13,
        fontFamily: FONT_FAMILY_MEDIUM,
        color: COLORS.DarkGrey,
        flex: 1,
        flexWrap: 'wrap',
    },

    rating: {
        fontSize: 13,
        fontFamily: FONT_FAMILY_MEDIUM,
        color: COLORS.DarkGrey
    },

    divider: {
        height: 1,
        backgroundColor: '#E5E7EB',
        marginVertical: 12,
    },

    statusRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
    },

    statusLabel: {
        fontSize: 13,
        fontFamily: FONT_FAMILY_SEMIBOLD,
        color: '#6B7280',
    },

    activeStatus: {
        fontSize: 13,
        fontFamily: FONT_FAMILY_SEMIBOLD,
        color: 'green',
    },
    statusValue: {
        fontSize: 13,
        fontFamily: FONT_FAMILY_SEMIBOLD,
        color: COLORS.BLACK,
    },

    servicesContainer: {
        paddingBottom: 16,
        paddingHorizontal: 10,
        backgroundColor: '#fff',
    },

    servicesHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 7,
    },
    addButton: {
        backgroundColor: '#A000F1',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 10,
    },

    addButtonText: {
        color: COLORS.WHITE,
        fontFamily: FONT_FAMILY_SEMIBOLD,
        fontSize: 13,
    },
    scrollMessage: {
        fontSize: 12,
        color: COLORS.GRAY_500,
        textAlign: 'center',
        marginTop: 5,
        fontStyle: 'italic',
    },
    servicesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },

    serviceCard: {
        width: 144,
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
        marginBottom: 8,
    },

    serviceName: {
        fontSize: 14,
        fontFamily: FONT_FAMILY_SEMIBOLD,
        color: COLORS.BLACK,
    },

    servicePrice: {
        fontSize: 15,
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
        marginBottom: 20,
    },
    categorySection: {
        marginTop: 10,
    },
    catCard: {
        marginRight: 15,
        width: 90,
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
        fontSize: 11,
        fontFamily: FONT_FAMILY_SEMIBOLD,
        marginTop: 8,
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
        fontSize: 24,
        fontFamily: FONT_FAMILY_EXTRABOLD,
        color: COLORS.WHITE,
    },
    promoSubtitle: {
        fontSize: 14,
        fontFamily: FONT_FAMILY_MEDIUM,
        color: COLORS.WHITE,
        opacity: 0.9,
    },
    promoButton: {
        backgroundColor: COLORS.WHITE,
        paddingHorizontal: 15,
        paddingVertical: 6,
        borderRadius: 10,
        marginTop: 10,
        alignSelf: 'flex-start',
    },
    promoButtonText: {
        color: COLORS.PURPLE_600,
        fontFamily: FONT_FAMILY_EXTRABOLD,
        fontSize: 12,
    },
    nearCard: {
        backgroundColor: COLORS.WHITE,
        borderRadius: 15,
        padding: 15,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: COLORS.GRAY_100,
    },
    emptyText: {
        fontSize: 13,
        fontFamily: FONT_FAMILY_MEDIUM,
        color: COLORS.GRAY_400,
        textAlign: 'center',
        width: '100%',
        marginTop: 20,
    },
    // Filter Styles
    filterContainer: {
        backgroundColor: '#F9FAFB',
        borderRadius: 15,
        padding: 15,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        zIndex: 1000,
        elevation: 5,
    },
    filterRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    toggleGroup: {
        flexDirection: 'row',
        backgroundColor: '#F3F4F6',
        borderRadius: 10,
        padding: 4,
    },
    toggleBtn: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    toggleBtnActive: {
        backgroundColor: COLORS.WHITE,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    toggleText: {
        fontSize: 12,
        fontFamily: FONT_FAMILY_SEMIBOLD,
        color: '#6B7280',
    },
    toggleTextActive: {
        color: COLORS.PURPLE_600,
    },
    dropdownWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    label: {
        fontSize: 12,
        fontFamily: FONT_FAMILY_MEDIUM,
        color: '#6B7280',
        marginRight: 8,
    },
    picker: {
        backgroundColor: COLORS.WHITE,
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 4,
        flexDirection: 'row',
        alignItems: 'center',
        minWidth: 80,
        justifyContent: 'space-between'
    },
    pickerText: {
        fontSize: 12,
        fontFamily: FONT_FAMILY_SEMIBOLD,
        color: COLORS.BLACK,
        marginRight: 4,
    },
    actionRow: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    locationBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 10,
        backgroundColor: '#F3F4F6',
        marginRight: 10,
    },
    locationBtnText: {
        fontSize: 12,
        fontFamily: FONT_FAMILY_SEMIBOLD,
        color: '#4B5563',
        marginLeft: 6,
    },
    findBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 10,
        backgroundColor: '#A000F1',
    },
    findBtnText: {
        fontSize: 14,
        fontFamily: FONT_FAMILY_EXTRABOLD,
        color: COLORS.WHITE,
        marginLeft: 6,
    },
    locationBadge: {
        backgroundColor: '#EFF6FF',
        padding: 12,
        borderRadius: 10,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#DBEAFE',
    },
    locationBadgeTitle: {
        fontSize: 13,
        fontFamily: FONT_FAMILY_SEMIBOLD,
        color: '#1E40AF',
        marginBottom: 4,
    },
    locationBadgeText: {
        fontSize: 12,
        fontFamily: FONT_FAMILY_MEDIUM,
        color: '#2563EB',
    },
    distanceText: {
        fontSize: 12,
        fontFamily: FONT_FAMILY_SEMIBOLD,
        color: '#9333EA',
        textAlign: 'right',
    },
    dropdownMenu: {
        position: 'absolute',
        top: 40,
        right: 0,
        backgroundColor: COLORS.WHITE,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        width: 120,
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        zIndex: 2000,
    },
    dropdownItem: {
        paddingVertical: 12,
        paddingHorizontal: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    dropdownItemText: {
        fontSize: 13,
        fontFamily: FONT_FAMILY_MEDIUM,
        color: '#4B5563',
    },
    bookBtn: {
        backgroundColor: '#D81B60', 
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 12,
    },
    bookBtnText: {
        color: COLORS.WHITE,
        fontSize: 15,
        fontFamily: FONT_FAMILY_SEMIBOLD,
    },
    serviceTagContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 8,
    },
    serviceTag: {
        backgroundColor: '#F3E8FF',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 20,
        marginRight: 8,
        marginBottom: 6,
        borderWidth: 1,
        borderColor: '#E9D5FF',
    },
    serviceTagText: {
        fontSize: 11,
        color: '#7E22CE',
        fontFamily: FONT_FAMILY_MEDIUM,
    },
    ownerName: {
        fontSize: 13,
        fontFamily: FONT_FAMILY_MEDIUM,
        color: '#4B5563',
        marginBottom: 8,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    infoText: {
        fontSize: 12,
        color: '#4B5563',
        fontFamily: FONT_FAMILY_MEDIUM,
        marginLeft: 8,
        flex: 1,
    },
    statText: {
        fontSize: 12,
        color: '#6B7280',
        fontFamily: FONT_FAMILY_MEDIUM,
        marginLeft: 6,
    },
});

export default styles;