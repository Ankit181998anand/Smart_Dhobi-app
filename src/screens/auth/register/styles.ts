import { StyleSheet } from "react-native";
import COLORS, { FONT_FAMILY_EXTRABOLD, FONT_FAMILY_MEDIUM, FONT_FAMILY_REGULAR, FONT_FAMILY_SEMIBOLD } from "../../../utils/constant";

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
        fontSize: 11,
        marginBottom: 10,
        marginTop: -8,
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
        marginVertical: 10,
    },
    loginText: {
        fontSize: 12,
        color: '#6B7280',
        fontFamily: FONT_FAMILY_MEDIUM,
    },
    loginLink: {
        fontSize: 13,
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
        paddingTop: 10,
    },
    rightSection: {
        flex: 2.5,
        backgroundColor: COLORS.WHITE,
        paddingTop: 30
    },
    logo: {
        width: 100,
        aspectRatio: 1,
    },
    forgotBtn: {
        alignSelf: 'flex-start',
        marginTop: 4,
        marginBottom: 40,
    },
    forgotText: {
        color: '#8f00ff',
        fontSize: 12,
        fontFamily: FONT_FAMILY_MEDIUM
    },
    progressWrapper: {
        paddingHorizontal: 20,
        marginVertical: 15,
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
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: '#ccc',
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkIcon: {
        width: 18,
        height: 18,
        tintColor: COLORS.WHITE, // optional if your image is black and needs white tint
    },
    circleText: {
        color: COLORS.WHITE,
        fontFamily: FONT_FAMILY_SEMIBOLD,
        fontSize: 13
    },
    stepLabel: {
        marginTop: 5,
        fontSize: 12,
        textAlign: 'center',
        fontFamily: FONT_FAMILY_MEDIUM
    },
    bottomBarContainer: {
        height: 5,
        backgroundColor: '#E5E7EB',
        borderRadius: 3,
        marginTop: 10,
        overflow: 'hidden',
    },
    bottomBarFill: {
        height: 6,
        borderRadius: 3,
    },
    stepContainer: {
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 30,
        backgroundColor: '#f9f9f9',
        borderRadius: 12,
        margin: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,

    },
    stepTitle: {
        fontSize: 18,
        fontFamily: FONT_FAMILY_EXTRABOLD,
        color: COLORS.BLACK,
        marginBottom: 5,
        textAlign: 'center'
    },

    stepSubtitle: {
        fontSize: 13,
        color: COLORS.DarkGray,
        fontFamily: FONT_FAMILY_SEMIBOLD,
        marginBottom: 20,
        textAlign: 'center'
    },
    privacyBox: {
        flexDirection: 'row',
        alignItems: 'flex-start', // ✅ makes icon top-aligned
        backgroundColor: '#F5F8FF',
        padding: 16,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: '#CCE0FF',
        marginTop: 20,
    },

    privcyIcon: {
        width: 18,
        height: 18,
        marginRight: 6,
        marginTop: 3, // optional: adjust icon slightly lower if needed
        tintColor: '#004EEB', // optional: matches the blue tone
    },

    privacyTextWrapper: {
        flex: 1,
    },

    privacyTitle: {
        fontSize: 15,
        fontFamily: FONT_FAMILY_SEMIBOLD,
        color: COLORS.BLACK,
        marginBottom: 4,
    },
    privacyText: {
        fontSize: 13,
        fontFamily: FONT_FAMILY_MEDIUM,
        color: '#004EEB',
        lineHeight: 18,
    },
    serviceRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    step3inputContainer: {
        flex: 1,
        marginRight: 8,
    },
    priceContainer: {
        width: 100, // or adjust as needed
        marginRight: 8,
    },
    deleteBtn: {
        backgroundColor: '#FF4D4D',
        borderRadius: 10,
        height: 48,
        paddingHorizontal: 10,
        justifyContent: 'center',
        alignItems: 'center',
        top: 3
    },
    deleteIcon: {
        width: 16,
        height: 16,
        tintColor: COLORS.WHITE,
    },
    addBtn: {
        alignItems: 'center',
        backgroundColor: '#f2f2f2',
        paddingVertical: 10,
        borderRadius: 8,
        marginBottom: 15,
        width: 120
    },
    addBtnText: {
        fontSize: 13,
        fontFamily: FONT_FAMILY_MEDIUM,
        color: COLORS.BLACK,
    },
    noteBox: {
        backgroundColor: '#fffbe5',
        padding: 10,
        marginTop: 15,
        borderRadius: 10,
    },
    noteTitle: {
        fontWeight: '600',
        marginBottom: 5,
    },
    noteText: {
        fontWeight: '600',
        marginBottom: 5,
    },
    buttonGroup: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 20,
        marginTop: 10,
    },

    backBtn: {
        paddingVertical: 10,
        paddingHorizontal: 40,
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
        marginRight: 10,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 5
    },
    backIcon: {
        width: 18,
        height: 18,
        tintColor: COLORS.BLACK
    },

    backText: {
        color: COLORS.PRIMARY,
        fontSize: 14,
        fontFamily: FONT_FAMILY_SEMIBOLD
    },
    step4Container: {
        paddingHorizontal: 20,
        paddingBottom: 30,
        backgroundColor: COLORS.WHITE,
        borderRadius: 12,
        paddingTop: 5,
    },
    reviewBox: {
        backgroundColor: '#f9f9f9',
        padding: 15,
        marginVertical: 10,
        borderRadius: 10,
    },
    reviewSectionTitle: {
        fontFamily: FONT_FAMILY_EXTRABOLD,
        fontSize: 16,
        color: COLORS.BLACK,
    },
    reviewRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 6,
    },

    reviewLabel: {
        fontSize: 14,
        fontFamily: FONT_FAMILY_SEMIBOLD,
        color: COLORS.BLACK,
        flex: 1,
    },

    reviewValue: {
        fontSize: 14,
        fontFamily: FONT_FAMILY_MEDIUM,
        color: COLORS.DarkGray,
        flex: 1,
        textAlign: 'right',
    },

    reviewText: {
        fontSize: 14,
        marginBottom: 4,
        fontFamily: FONT_FAMILY_SEMIBOLD,
        color: COLORS.BLACK,
    },


    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    badge: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#3b82f6',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
    },

    badgeText: {
        color: COLORS.WHITE,
        fontFamily: FONT_FAMILY_SEMIBOLD,
        fontSize: 14,
    },

    submitBtn: {
        backgroundColor: '#22c55e',
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderRadius: 8,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10
    },
    secureicon: {
        width: 18,
        height: 18,
        tintColor: COLORS.WHITE
    },

    submitBtnText: {
        color: COLORS.WHITE,
        fontFamily: FONT_FAMILY_SEMIBOLD,
        fontSize: 14,
    },


});

export default styles;