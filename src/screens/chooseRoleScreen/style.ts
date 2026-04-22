import { StyleSheet } from "react-native";
import COLORS, { FONT_FAMILY_EXTRABOLD, FONT_FAMILY_MEDIUM } from "../../utils/constant";
import { SF, SH, SW } from "../../utils/Dimensions";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.WHITE,
    },
    subContainer: {
        flex: 1,
        paddingHorizontal: SW(30),
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: SH(40),
    },
    logo: {
        width: SW(220),
        height: SH(220),
        marginBottom: SH(20),
    },
    title: {
        fontSize: SF(30),
        fontFamily: FONT_FAMILY_EXTRABOLD,
        color: COLORS.BLACK,
        textAlign: 'center',
    },
    subTitle: {
        fontSize: SF(16),
        fontFamily: FONT_FAMILY_MEDIUM,
        color: COLORS.GRAY_500,
        textAlign: 'center',
        marginTop: SH(8),
        lineHeight: SH(24),
    },
    buttonContainer: {
        width: '100%',
        marginTop: SH(50),
    },
    loginWrapper: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: SH(30),
    },
    loginText: {
        fontSize: SF(15),
        color: COLORS.GRAY_400,
        fontFamily: FONT_FAMILY_MEDIUM,
    },
    loginLink: {
        fontSize: SF(15),
        color: COLORS.PURPLE_600,
        fontFamily: FONT_FAMILY_EXTRABOLD,
    },
});

export default styles;