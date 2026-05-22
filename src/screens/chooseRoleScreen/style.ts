import { StyleSheet } from "react-native";
import COLORS, { FONT_FAMILY_EXTRABOLD, FONT_FAMILY_MEDIUM } from "../../utils/constant";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.WHITE,
    },
    subContainer: {
        flex: 1,
        paddingHorizontal: 30,
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 40,
    },
    logo: {
        width: 220,
        height: 220,
        marginBottom: 20,
    },
    title: {
        fontSize: 30,
        fontFamily: FONT_FAMILY_EXTRABOLD,
        color: COLORS.BLACK,
        textAlign: 'center',
    },
    subTitle: {
        fontSize: 16,
        fontFamily: FONT_FAMILY_MEDIUM,
        color: COLORS.GRAY_500,
        textAlign: 'center',
        marginTop: 8,
        lineHeight: 24,
    },
    buttonContainer: {
        width: '100%',
        marginTop: 50,
    },
    loginWrapper: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 30,
    },
    loginText: {
        fontSize: 15,
        color: COLORS.GRAY_400,
        fontFamily: FONT_FAMILY_MEDIUM,
    },
    loginLink: {
        fontSize: 15,
        color: COLORS.PURPLE_600,
        fontFamily: FONT_FAMILY_EXTRABOLD,
    },
});

export default styles;