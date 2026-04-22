import { StyleSheet } from "react-native";
import COLORS, { FONT_FAMILY_EXTRABOLD, FONT_FAMILY_MEDIUM, FONT_FAMILY_REGULAR, FONT_FAMILY_SEMIBOLD } from "../../../utils/constant";
import { SF, SH, SW } from "../../../utils/Dimensions";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9f9f9'
    },
    inputContainer: {
        padding: 20,
    },
    error: {
        color: COLORS.RED,
        fontSize: SF(11),
        marginBottom: SH(10),
        marginTop: SH(-8),
        fontFamily: FONT_FAMILY_REGULAR
    },
    btn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#8f00ff',
        padding: 15,
        borderRadius: 10,
        marginTop: 20,
    },
    btnText: {
        color: '#fff',
        marginLeft: 8,
        fontWeight: 'bold',
        fontSize: 16,
    },
    loginWrapper: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: SH(10),
    },
    loginText: {
        fontSize: SF(12),
        color: '#6B7280',
        fontFamily: FONT_FAMILY_MEDIUM,
    },
    loginLink: {
        fontSize: SF(13),
        // color: '#8B5CF6',
        color: '#8f00ff',
        fontFamily: FONT_FAMILY_SEMIBOLD,
    },
    sidebar: {
        flex: 0.5,
        borderTopLeftRadius: 20,
        borderBottomLeftRadius: 20,
        justifyContent: 'flex-start', // Align items to the top
        alignItems: 'center',
        paddingTop: SH(10),
    },
    rightSection: {
        flex: 2.5,
        backgroundColor: COLORS.WHITE,
        paddingTop: SH(30)
    },
    logo: {
        width: SW(100),
        aspectRatio: 1,
    },
    forgotBtn: {
        alignSelf: 'flex-start',
        marginTop: SH(4),
        marginBottom: SH(40),
    },
    forgotText: {
        color: '#8f00ff',
        fontSize: SF(12),
        fontFamily: FONT_FAMILY_MEDIUM
    },
    progressWrapper: {
        paddingHorizontal: SW(20),
        marginVertical: SH(15),
    },
    progressRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    progressstepContainer: {
        alignItems: 'center',
        // flex: 1,   
    },
    circle: {
        width: SW(30),
        height: SW(30),
        borderRadius: SW(15),
        backgroundColor: '#ccc',
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkIcon: {
        width: SW(18),
        height: SW(18),
        tintColor: COLORS.WHITE, // optional if your image is black and needs white tint
    },
    circleText: {
        color: COLORS.WHITE,
        fontFamily: FONT_FAMILY_SEMIBOLD,
        fontSize: SF(13)
    },
    stepLabel: {
        marginTop: SH(5),
        fontSize: SW(12),
        textAlign: 'center',
        fontFamily: FONT_FAMILY_MEDIUM
    },
    bottomBarContainer: {
        height: SH(5),
        backgroundColor: '#E5E7EB',
        borderRadius: SH(3),
        marginTop: SH(10),
        overflow: 'hidden',
    },
    bottomBarFill: {
        height: SH(6),
        borderRadius: SH(3),
    },
    stepContainer: {
        paddingHorizontal: SW(20),
        paddingTop: SH(10),
        paddingBottom: SH(30),
        backgroundColor: '#f9f9f9',
        borderRadius: SW(12),
        margin: SW(10),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,

    },
    stepTitle: {
        fontSize: SF(18),
        fontFamily: FONT_FAMILY_EXTRABOLD,
        color: COLORS.BLACK,
        marginBottom: SH(5),
        textAlign: 'center'
    },

    stepSubtitle: {
        fontSize: SF(13),
        color: COLORS.DarkGray,
        fontFamily: FONT_FAMILY_SEMIBOLD,
        marginBottom: SH(20),
        textAlign: 'center'
    },
    privacyBox: {
        flexDirection: 'row',
        alignItems: 'flex-start', // ✅ makes icon top-aligned
        backgroundColor: '#F5F8FF',
        padding: SW(16),
        borderRadius: SW(14),
        borderWidth: 1,
        borderColor: '#CCE0FF',
        marginTop: SH(20),
    },

    privcyIcon: {
        width: SW(18),
        height: SH(18),
        marginRight: SW(6),
        marginTop: SH(3), // optional: adjust icon slightly lower if needed
        tintColor: '#004EEB', // optional: matches the blue tone
    },

    privacyTextWrapper: {
        flex: 1,
    },

    privacyTitle: {
        fontSize: SF(15),
        fontFamily: FONT_FAMILY_SEMIBOLD,
        color: COLORS.BLACK,
        marginBottom: SH(4),
    },
    privacyText: {
        fontSize: SF(13),
        fontFamily: FONT_FAMILY_MEDIUM,
        color: '#004EEB',
        lineHeight: SH(18),
    },
    serviceRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    step3inputContainer: {
        flex: 1,
        marginRight: SW(8),
    },
    priceContainer: {
        width: SW(100), // or adjust as needed
        marginRight: SW(8),
    },
    deleteBtn: {
        backgroundColor: '#FF4D4D',
        borderRadius: SW(10),
        height: SH(48),
        paddingHorizontal: SW(10),
        justifyContent: 'center',
        alignItems: 'center',
        top: SH(3)
    },
    deleteIcon: {
        width: SW(16),
        height: SH(16),
        tintColor: COLORS.WHITE,
    },
    addBtn: {
        alignItems: 'center',
        backgroundColor: '#f2f2f2',
        paddingVertical: SH(10),
        borderRadius: SW(8),
        marginBottom: SH(15),
        width: SW(120)
    },
    addBtnText: {
        fontSize: SF(13),
        fontFamily: FONT_FAMILY_MEDIUM,
        color: COLORS.BLACK,
    },
    noteBox: {
        backgroundColor: '#fffbe5',
        padding: SW(10),
        marginTop: SH(15),
        borderRadius: SW(10),
    },
    noteTitle: {
        fontWeight: '600',
        marginBottom: SH(5),
    },
    noteText: {
        fontWeight: '600',
        marginBottom: SH(5),
    },
    buttonGroup: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: SW(20),
        marginBottom: SH(20),
        marginTop: SH(10),
    },

    backBtn: {
        paddingVertical: SH(10),
        paddingHorizontal: SW(40),
        backgroundColor: '#f0f0f0',
        borderRadius: SW(8),
        marginRight: SW(10),
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: SW(5)
    },
    backIcon: {
        width: SW(18),
        height: SH(18),
        tintColor: COLORS.BLACK
    },

    backText: {
        color: COLORS.PRIMARY,
        fontSize: SF(14),
        fontFamily: FONT_FAMILY_SEMIBOLD
    },
    step4Container: {
        paddingHorizontal: SW(20),
        paddingBottom: SH(30),
        backgroundColor: COLORS.WHITE,
        borderRadius: SW(12),
        paddingTop: SH(5),
    },
    reviewBox: {
        backgroundColor: '#f9f9f9',
        padding: SW(15),
        marginVertical: SH(10),
        borderRadius: SW(10),
    },
    reviewSectionTitle: {
        fontFamily: FONT_FAMILY_EXTRABOLD,
        fontSize: SW(16),
        color: COLORS.BLACK,
    },
    reviewRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: SH(6),
    },

    reviewLabel: {
        fontSize: SW(14),
        fontFamily: FONT_FAMILY_SEMIBOLD,
        color: COLORS.BLACK,
        flex: 1,
    },

    reviewValue: {
        fontSize: SW(14),
        fontFamily: FONT_FAMILY_MEDIUM,
        color: COLORS.DarkGray,
        flex: 1,
        textAlign: 'right',
    },

    reviewText: {
        fontSize: SW(14),
        marginBottom: SH(4),
        fontFamily: FONT_FAMILY_SEMIBOLD,
        color: COLORS.BLACK,
    },


    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SH(10),
    },
    badge: {
        width: SW(24),
        height: SW(24),
        borderRadius: SW(12),
        backgroundColor: '#3b82f6',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: SW(8),
    },

    badgeText: {
        color: COLORS.WHITE,
        fontFamily: FONT_FAMILY_SEMIBOLD,
        fontSize: SW(14),
    },

    submitBtn: {
        backgroundColor: '#22c55e',
        paddingVertical: SH(10),
        paddingHorizontal: SW(10),
        borderRadius: SW(8),
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: SH(10)
    },
    secureicon: {
        width: SW(18),
        height: SH(18),
        tintColor: COLORS.WHITE
    },

    submitBtnText: {
        color: COLORS.WHITE,
        fontFamily: FONT_FAMILY_SEMIBOLD,
        fontSize: SW(14),
    },


});

export default styles;